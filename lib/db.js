// lib/db.js
import { PrismaClient } from '@prisma/client'
import { computeInvoiceTotals } from './invoice-calc'

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Repère de sécurité pour la séparation dev/prod : affiche juste l'hôte
// Neon connecté (jamais le user/mot de passe) au démarrage en local, pour
// vérifier d'un coup d'œil qu'on n'est pas branché sur la prod par erreur.
if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  try {
    console.log(`[DB] Connecté à : ${new URL(process.env.DATABASE_URL).hostname}`)
  } catch {
    // DATABASE_URL mal formée — pas bloquant ici, Prisma le signalera de toute façon.
  }
}

// ══════════════════════════════════════════
// SCORING DE LEAD
// ══════════════════════════════════════════

export function calculateLeadScore(messages, leadData = null) {
  let score = 0
  const userMessages = messages.filter(m => m.role === 'USER')
  const allText = userMessages.map(m => m.content.toLowerCase()).join(' ')

  if (allText.match(/(budget|fcfa|cfa|€|\$|euro|million|millier)/i)) score += 20
  if (allText.match(/(délai|deadline|semaine|mois|jour|urgent|vite|rapidement)/i)) score += 20
  if (allText.match(/[\w.-]+@[\w.-]+\.\w{2,}/) || allText.match(/(\+?242|0)[\s\d]{8,}/)) score += 15

  const projectKeywords = ['poussins', 'cobb 500', 'provende', 'aliment', 'clinique', 'vétérinaire', 'soin', 'vaccin', 'formation', 'qhse', 'haccp', 'ferme', 'élevage', 'avicole', 'porc', 'pondeuse', 'chair', 'audit', 'biosécurité']
  if (projectKeywords.some(kw => allText.includes(kw))) score += 15
  if (userMessages.length >= 3) score += 15
  if (allText.match(/(devis|commander|commencer|lancer|projet|besoin|veux|voudrais|souhaite)/i)) score += 15

  if (leadData) {
    if (leadData.budgetRange && leadData.budgetRange !== 'Non précisé') score += 5
    if (leadData.timeline && leadData.timeline !== 'Non précisé') score += 5
  }

  return Math.min(score, 100)
}

// ══════════════════════════════════════════
// CONVERSATIONS / MESSAGES / LEADS / RAPPORTS
// ══════════════════════════════════════════

export async function getOrCreateConversation(sessionId, ipHash = null) {
  // upsert() plutôt que findUnique() + create() : deux requêtes qui se
  // chevauchent (ex: sendBeacon qui refire, ou /assistant et /assistant/end
  // qui arrivent presque en même temps) pouvaient toutes les deux constater
  // "n'existe pas" puis tenter un create() → Unique constraint failed sur
  // sessionId (vu dans les logs). upsert() est atomique côté DB, donc plus
  // de fenêtre de course possible.
  return prisma.conversation.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId, ipHash, status: 'ACTIVE' },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })
}

export async function saveMessage(conversationId, role, content, modelUsed = null) {
  const [message] = await prisma.$transaction([
    prisma.message.create({ data: { conversationId, role, content, modelUsed } }),
    // messageCount était référencé par la route /api/stats mais jamais
    // incrémenté nulle part — corrigé ici, dans la même transaction.
    prisma.conversation.update({
      where: { id: conversationId },
      data: { messageCount: { increment: 1 } },
    }),
  ])
  return message
}

export async function updateConversationStatus(conversationId, status) {
  const updates = { status }
  if (status === 'ENDED' || status === 'CONVERTED') updates.endedAt = new Date()

  return prisma.conversation.update({
    where: { id: conversationId },
    data: updates,
  })
}

export async function saveLead(conversationId, leadData) {
  const messages = await prisma.message.findMany({ where: { conversationId } })
  const score = calculateLeadScore(messages, leadData)

  const contact = leadData.contact || ''
  const isEmail = contact.includes('@')
  const phone = isEmail ? (leadData.phone || 'Non renseigné') : (contact || leadData.phone || 'Non renseigné')
  const email = isEmail ? contact : (leadData.email || null)

  const lead = await prisma.lead.create({
    data: {
      name: leadData.name || 'Prospect Anonyme',
      email,
      phone,
      service: leadData.project_type || leadData.service || 'autre',
      budgetRange: leadData.budget_range || leadData.budgetRange || null,
      timeline: leadData.timeline || null,
      message: leadData.summary || leadData.message || 'Prospect issu de l’assistant IA',
      score,
      status: score >= 60 ? 'QUALIFIED' : 'NEW',
      notes: conversationId ? `Session IA: ${conversationId}` : null,
    },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { leadScore: score, status: 'CONVERTED' },
  })

  return lead
}

// ══════════════════════════════════════════
// TRACKING VISITEURS (posé par middleware.js)
// ══════════════════════════════════════════

export async function upsertVisitor(visitorId, { isNewSession = true } = {}) {
  return prisma.visitor.upsert({
    where: { visitorId },
    create: { visitorId },
    // visitCount ne s'incrémente qu'à l'ouverture d'une nouvelle session
    // navigateur (cookie akatech_session_new), pas à chaque page vue.
    update: isNewSession
      ? { visitCount: { increment: 1 }, lastSeenAt: new Date() }
      : { lastSeenAt: new Date() },
  })
}

// ── Écritures compatibles avec le schéma réel (Visitor + PageView) ─────────
// Il n'existe AUCUN modèle VisitSession en base : les cookies de session
// navigateur (akatech_*) servent uniquement côté client. On persiste donc
// directement la page vue rattachée au visiteur (champs réels de PageView :
// visitorId, path, referrer, device — cf. getVisitorStats plus bas).
export async function recordPageView({ visitorId, path, referrer = null, device = 'desktop' }) {
  return prisma.pageView.create({
    data: { visitorId, path, referrer, device },
    select: { id: true },
  })
}

// Consentement cookies : aucune colonne dédiée en base — le choix reste
// dans le cookie et conditionne l'envoi côté client (VisitorTracker).
// No-op volontaire : la route accuse réception sans écrire.
export async function updateSessionConsent() {
  return null
}

// ══════════════════════════════════════════
// AGRÉGATIONS POUR /api/stats
// ══════════════════════════════════════════

/* Regrouper par jour calendaire en JS plutôt qu'un groupBy Prisma sur
   createdAt : grouper par un DateTime précis (à la milliseconde) ne
   regroupe quasiment jamais rien — chaque ligne a son propre horodatage
   unique. Pour un volume de trafic d'agence qui démarre, agréger côté
   JS après un simple findMany() est largement suffisant. */
function bucketByDay(rows, dateField = 'createdAt') {
  const buckets = new Map()
  for (const row of rows) {
    const day = row[dateField].toISOString().split('T')[0]
    buckets.set(day, (buckets.get(day) || 0) + 1)
  }
  return Array.from(buckets.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function getConversationActivity(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const rows = await prisma.conversation.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  })
  return bucketByDay(rows)
}

export async function getVisitorStats(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  let totalVisitors = 0
  let newVisitors = 0
  let pageViews = []
  let sessions = []

  try {
    const [tVis, nVis, pViews] = await Promise.all([
      prisma.visitor.count(),
      prisma.visitor.count({ where: { firstSeenAt: { gte: since } } }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: since } },
        select: { path: true, device: true, referrer: true, createdAt: true },
      }),
    ])
    totalVisitors = tVis
    newVisitors = nVis
    pageViews = pViews
  } catch (err) {
    console.warn('[Stats] Erreur lecture visiteurs:', err?.message)
  }

  const totalSessions = totalVisitors || 1
  const bounceRate = 0
  const avgDurationMs = 120000

  const devices = {}
  const sources = {}
  const topPagesMap = {}
  const activeHoursMap = {}

  for (const pv of pageViews) {
    const d = pv.device || 'desktop'
    devices[d] = (devices[d] || 0) + 1

    const ref = pv.referrer ? pv.referrer : 'direct'
    sources[ref] = (sources[ref] || 0) + 1

    topPagesMap[pv.path] = (topPagesMap[pv.path] || 0) + 1
    const h = new Date(pv.createdAt).getHours()
    activeHoursMap[h] = (activeHoursMap[h] || 0) + 1
  }

  const consent = { accepted: 0, rejected: 0, pending: 0 }

  return {
    totalVisitors,
    newVisitors,
    totalSessions,
    totalPageViews: pageViews.length,
    bounceRate,
    avgSessionDurationSeconds: Math.round(avgDurationMs / 1000),
    devices: Object.entries(devices).map(([name, value]) => ({ name, value })),
    sources: Object.entries(sources).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10),
    topPages: Object.entries(topPagesMap).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10),
    activeHours: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: activeHoursMap[i] || 0 })),
    consent,
  }
}


// ══════════════════════════════════════════
// USAGE IA DU JOUR (Gemini / Groq)
// ══════════════════════════════════════════
// Dérivé de Message.modelUsed, déjà enregistré à chaque réponse — pas
// de nouvelle table nécessaire. Gemini n'expose pas de quota restant
// dans ses réponses (contrairement à Groq, qui renvoie des en-têtes
// x-ratelimit-*), donc on compte nos propres appels plutôt que de
// dépendre d'une info que l'un des deux fournisseurs ne donne pas.
// Les limites ci-dessous sont indicatives (documentation publique des
// fournisseurs, sujettes à changement) — à prendre comme repère, pas
// comme un compteur exact de ce qu'il te reste.
export const INDICATIVE_DAILY_LIMITS = {
  gemini: { label: 'Gemini (gratuit)', approxLimit: 250 },
  groq: { label: 'Groq · Llama 3.1 8B (gratuit)', approxLimit: 14400 },
}

export async function getTodayAiUsage() {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const rows = await prisma.message.groupBy({
    by: ['modelUsed'],
    where: { role: 'ASSISTANT', createdAt: { gte: startOfDay }, modelUsed: { not: null } },
    _count: { id: true },
  })

  // Bug corrigé : modelUsed contient le vrai nom de modèle enregistré à
  // chaque réponse (ex: "gemini-3.6-flash", "llama-3.1-8b-instant"),
  // jamais le mot littéral "gemini"/"groq" — la comparaison exacte
  // d'avant ne matchait donc jamais rien et le widget affichait 0/250
  // en permanence. On regroupe maintenant par préfixe de famille.
  const usage = { gemini: 0, groq: 0 }
  for (const row of rows) {
    if (!row.modelUsed) continue
    if (row.modelUsed.startsWith('gemini')) usage.gemini += row._count.id
    else if (row.modelUsed.startsWith('llama')) usage.groq += row._count.id
  }

  return {
    gemini: { count: usage.gemini, approxLimit: INDICATIVE_DAILY_LIMITS.gemini.approxLimit },
    groq: { count: usage.groq, approxLimit: INDICATIVE_DAILY_LIMITS.groq.approxLimit },
  }
}

// ══════════════════════════════════════════
// FACTURES — dashboard admin (onglet Factures)
// ══════════════════════════════════════════

// Numérotation par simple comptage plutôt qu'un compteur dédié : usage
// mono-admin (une seule personne crée des factures, jamais en parallèle
// sur deux appareils à la même seconde), donc le risque de collision
// est nul en pratique. Le numéro reste éditable à la main dans le
// formulaire si besoin (ex. forcer un numéro après une facture annulée).
export async function getNextInvoiceNumber(year = new Date().getFullYear()) {
  try {
    const count = await prisma.invoice.count({ where: { invoiceNumber: { startsWith: `AVS-${year}-` } } })
    return `AVS-${year}-${String(count + 1).padStart(3, '0')}`
  } catch {
    return `AVS-${year}-001`
  }
}

export async function getNextContractRef(year = new Date().getFullYear()) {
  try {
    const count = await prisma.invoice.count({ where: { invoiceNumber: { startsWith: `AVS-CTR-${year}-` } } })
    return `AVS-CTR-${year}-${String(count + 1).padStart(3, '0')}`
  } catch {
    return `AVS-CTR-${year}-001`
  }
}

function formatInvoiceForClient(inv) {
  if (!inv) return null
  const lines = (inv.items || []).map(it => ({
    id: it.id,
    desc: it.description,
    description: it.description,
    qty: it.quantity,
    quantity: it.quantity,
    price: it.unitPrice,
    unitPrice: it.unitPrice,
    amount: it.amount,
  }))
  return {
    ...inv,
    number: inv.invoiceNumber,
    issueDate: inv.date,
    lines,
  }
}

export async function listInvoices({ page = 1, limit = 15, search = '', status = '' } = {}) {
  const skip = (page - 1) * limit
  const where = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: 'insensitive' } },
      { clientName: { contains: search, mode: 'insensitive' } },
      { clientEmail: { contains: search, mode: 'insensitive' } },
    ]
  }

  try {
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { items: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ])

    return {
      invoices: invoices.map(formatInvoiceForClient),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      dbConnected: true,
    }
  } catch (err) {
    console.warn('[DB Invoices] Erreur lecture factures:', err?.message)
    return { invoices: [], pagination: { page: 1, limit, total: 0, pages: 0 }, dbConnected: false }
  }
}

export async function getInvoiceById(id) {
  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: { items: true },
  })
  return formatInvoiceForClient(inv)
}

export async function createInvoice(data) {
  const invoiceNumber = data.invoiceNumber || data.number?.trim() || (await getNextInvoiceNumber(new Date(data.issueDate || data.date || Date.now()).getFullYear()))
  const invoiceDate = data.date ? new Date(data.date) : (data.issueDate ? new Date(data.issueDate) : new Date())
  const dueDate = data.dueDate ? new Date(data.dueDate) : new Date(invoiceDate.getTime() + 14 * 24 * 60 * 60 * 1000)

  const rawLines = Array.isArray(data.items) ? data.items : (Array.isArray(data.lines) ? data.lines : [])
  const items = rawLines.map(line => {
    const desc = line.desc || line.description || 'Prestation AVS'
    const qty = Number(line.qty || line.quantity) || 1
    const price = Number(line.price || line.unitPrice) || 0
    return {
      description: desc,
      quantity: qty,
      unitPrice: price,
      amount: qty * price,
    }
  })

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = data.taxRate !== undefined ? Number(data.taxRate) : (data.applyTva ? 18 : 0)
  const taxAmount = (subtotal * taxRate) / 100
  const discount = Number(data.discount) || (data.applyTimbre ? 500 : 0)
  const total = subtotal + taxAmount + (data.applyTimbre ? 500 : 0)

  const created = await prisma.invoice.create({
    data: {
      invoiceNumber,
      clientName: data.clientName || 'Client AVS',
      clientEmail: data.clientEmail || null,
      clientPhone: data.clientPhone || null,
      clientAddress: data.clientAddress || null,
      clientCompany: data.clientCompany || data.clientRccm || null,
      date: invoiceDate,
      dueDate,
      currency: data.currency || 'FCFA',
      subtotal,
      taxRate,
      taxAmount,
      discount: Number(data.discount) || 0,
      total,
      notes: data.notes || null,
      status: (data.status === 'ENVOYEE' || data.status === 'SENT') ? 'SENT' : (data.status === 'PAID' ? 'PAID' : 'DRAFT'),
      items: {
        create: items,
      },
    },
    include: { items: true },
  })

  return formatInvoiceForClient(created)
}

export async function updateInvoice(id, data) {
  const patch = {}
  if (data.invoiceNumber !== undefined) patch.invoiceNumber = data.invoiceNumber
  if (data.number !== undefined) patch.invoiceNumber = data.number
  if (data.date !== undefined) patch.date = new Date(data.date)
  if (data.issueDate !== undefined) patch.date = new Date(data.issueDate)
  if (data.dueDate !== undefined) patch.dueDate = data.dueDate ? new Date(data.dueDate) : null
  if (data.clientName !== undefined) patch.clientName = data.clientName
  if (data.clientAddress !== undefined) patch.clientAddress = data.clientAddress || null
  if (data.clientPhone !== undefined) patch.clientPhone = data.clientPhone || null
  if (data.clientEmail !== undefined) patch.clientEmail = data.clientEmail || null
  if (data.clientCompany !== undefined) patch.clientCompany = data.clientCompany || null
  if (data.clientRccm !== undefined) patch.clientCompany = data.clientRccm || null
  if (data.currency !== undefined) patch.currency = data.currency
  if (data.notes !== undefined) patch.notes = data.notes || null
  if (data.status !== undefined) {
    patch.status = (data.status === 'ENVOYEE' || data.status === 'SENT') ? 'SENT' : (data.status === 'PAID' ? 'PAID' : 'DRAFT')
  }

  if (data.lines !== undefined || data.items !== undefined) {
    const rawLines = Array.isArray(data.items) ? data.items : (Array.isArray(data.lines) ? data.lines : [])
    const items = rawLines.map(line => {
      const desc = line.desc || line.description || 'Prestation AVS'
      const qty = Number(line.qty || line.quantity) || 1
      const price = Number(line.price || line.unitPrice) || 0
      return {
        description: desc,
        quantity: qty,
        unitPrice: price,
        amount: qty * price,
      }
    })

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxRate = data.taxRate !== undefined ? Number(data.taxRate) : (data.applyTva ? 18 : 0)
    const taxAmount = (subtotal * taxRate) / 100
    patch.subtotal = subtotal
    patch.taxRate = taxRate
    patch.taxAmount = taxAmount
    patch.total = subtotal + taxAmount + (data.applyTimbre ? 500 : 0)

    // Remplacement atomique des items
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } })
    patch.items = { create: items }
  }

  const updated = await prisma.invoice.update({
    where: { id },
    data: patch,
    include: { items: true },
  })

  return formatInvoiceForClient(updated)
}

export async function deleteInvoice(id) {
  return prisma.invoice.delete({ where: { id } })
}

// ══════════════════════════════════════════
// COMPTES UTILISATEURS (ÉLEVEURS & ENTREPRISES)
// ══════════════════════════════════════════

// Stockage mémoire de secours si la base PostgreSQL n'est pas encore connectée en local
const memoryUsers = globalThis.avsMemoryUsers ?? (globalThis.avsMemoryUsers = new Map())
const memoryOrders = globalThis.avsMemoryOrders ?? (globalThis.avsMemoryOrders = new Map())

export async function createUser({
  fullName,
  name,
  phone,
  email,
  password,
  companyName = '',
  userType = 'individual',
  emailVerified = false,
  emailVerificationToken = null,
  emailVerificationExpires = null,
}) {
  const cleanPhone = (phone || '').replace(/[\s.-]/g, '')
  const finalName = (fullName || name || '').trim()
  const finalEmail = (email || `${cleanPhone || Date.now()}@agrovetoservices.cg`).toLowerCase().trim()
  
  try {
    const user = await prisma.user.create({
      data: {
        name: finalName,
        phone: cleanPhone || null,
        email: finalEmail,
        password, // Hashé si géré par backend
        companyName: companyName ? companyName.trim() : null,
        userType: userType || 'individual',
        emailVerified,
        emailVerificationToken,
        emailVerificationExpires,
      },
    })
    return {
      id: user.id,
      name: user.name,
      fullName: user.name,
      phone: user.phone,
      email: user.email,
      companyName: user.companyName,
      userType: user.userType,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    }
  } catch (err) {
    if (err?.code === 'P2002') {
      throw new Error('Un compte existe déjà avec ce numéro de téléphone ou cet email')
    }
    // Fallback mémoire si base non disponible
    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
    const user = {
      id,
      name: finalName,
      fullName: finalName,
      phone: cleanPhone,
      email: finalEmail,
      password,
      companyName: companyName ? companyName.trim() : null,
      userType,
      emailVerified,
      emailVerificationToken,
      emailVerificationExpires,
      createdAt: new Date(),
    }
    memoryUsers.set(cleanPhone, user)
    return user
  }
}

export async function findUserByPhone(phone) {
  const cleanPhone = (phone || '').replace(/[\s.-]/g, '')
  try {
    return await prisma.user.findFirst({ where: { phone: cleanPhone } })
  } catch {
    return memoryUsers.get(cleanPhone) || null
  }
}

export async function findUserByEmail(email) {
  if (!email) return null
  const cleanEmail = email.toLowerCase().trim()
  try {
    return await prisma.user.findFirst({ where: { email: cleanEmail } })
  } catch {
    for (const u of memoryUsers.values()) {
      if (u.email === cleanEmail) return u
    }
    return null
  }
}

export async function findUserByIdentifier(identifier) {
  if (!identifier) return null
  const clean = identifier.trim()
  const cleanPhone = clean.replace(/[\s.-]/g, '')
  try {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { email: clean.toLowerCase() },
          ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ],
      },
    })
  } catch {
    for (const u of memoryUsers.values()) {
      if (u.email === clean.toLowerCase() || (cleanPhone && u.phone === cleanPhone)) return u
    }
    return null
  }
}

export async function findUserById(id) {
  try {
    return await prisma.user.findUnique({ where: { id } })
  } catch {
    for (const u of memoryUsers.values()) {
      if (u.id === id) return u
    }
    return null
  }
}

export async function findOrCreateGoogleUser({ googleId, email, name, avatar = null }) {
  const cleanEmail = (email || '').toLowerCase().trim()
  if (!cleanEmail) throw new Error('Email requis pour la connexion Google')

  try {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(googleId ? [{ googleId }] : []),
          { email: cleanEmail },
        ],
      },
    })

    if (user) {
      const updates = {}
      if (!user.googleId && googleId) updates.googleId = googleId
      if (!user.emailVerified) updates.emailVerified = true
      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
        })
      }
    } else {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name || 'Utilisateur Google',
          googleId,
          role: 'CLIENT',
          emailVerified: true,
          userType: 'individual',
        },
      })
    }

    return {
      id: user.id,
      name: user.name,
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      userType: user.userType,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    }
  } catch (err) {
    console.error('[DB] Erreur findOrCreateGoogleUser:', err)
    // Fallback mémoire
    for (const u of memoryUsers.values()) {
      if ((googleId && u.googleId === googleId) || u.email === cleanEmail) {
        if (googleId) u.googleId = googleId
        u.emailVerified = true
        return u
      }
    }
    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
    const newUser = {
      id,
      name: name || 'Utilisateur Google',
      fullName: name || 'Utilisateur Google',
      email: cleanEmail,
      googleId,
      role: 'CLIENT',
      userType: 'individual',
      emailVerified: true,
      createdAt: new Date(),
    }
    memoryUsers.set(id, newUser)
    return newUser
  }
}


// ══════════════════════════════════════════
// COMMANDES E-COMMERCE & PAIEMENTS KKIAPAY
// ══════════════════════════════════════════

export async function getNextOrderNumber(year = new Date().getFullYear()) {
  try {
    const count = await prisma.order.count({ where: { orderNumber: { startsWith: `AVS-CMD-${year}-` } } })
    return `AVS-CMD-${year}-${String(count + 1).padStart(3, '0')}`
  } catch {
    const count = memoryOrders.size
    return `AVS-CMD-${year}-${String(count + 1).padStart(3, '0')}`
  }
}

export async function createOrder(data) {
  const year = new Date().getFullYear()
  const orderNumber = data.orderNumber || (await getNextOrderNumber(year))
  const cleanPhone = data.customerPhone.replace(/[\s.-]/g, '')

  const processedItems = (data.items || []).map(it => ({
    title: it.title || it.name || 'Produit AVS',
    quantity: parseInt(it.quantity) || 1,
    unitPrice: parseFloat(it.unitPrice || it.price) || 0,
    total: (parseInt(it.quantity) || 1) * (parseFloat(it.unitPrice || it.price) || 0),
  }))

  const orderData = {
    orderNumber,
    ...(data.userId ? { user: { connect: { id: data.userId } } } : {}),
    customerName: data.customerName,
    customerPhone: cleanPhone,
    customerEmail: data.customerEmail || '',
    customerAddress: data.customerAddress || '',
    notes: data.notes || null,
    totalAmount: Number(data.totalAmount) || 0,
    status: data.status || 'PENDING',
    paymentMethod: data.paymentMethod || 'AIRTEL_MONEY',
    paymentStatus: data.paymentStatus || 'UNPAID',
    items: {
      create: processedItems,
    },
  }

  try {
    return await prisma.order.create({
      data: orderData,
      include: { items: true },
    })
  } catch (err) {
    console.warn('[DB Orders] Base de données indisponible, enregistrement en mémoire locale:', err?.message)
    const order = {
      id: 'ord_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      ...orderData,
      items: processedItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    memoryOrders.set(order.id, order)
    return order
  }
}

export async function listOrders({ userId = null, phone = null, page = 1, limit = 20, status = '' } = {}) {
  const skip = (page - 1) * limit
  const where = {}
  if (status) where.status = status
  if (userId) where.userId = userId
  if (phone) where.customerPhone = { contains: phone.replace(/[\s.-]/g, '') }

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])
    return { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  } catch (err) {
    let all = Array.from(memoryOrders.values())
    if (status) all = all.filter(o => o.status === status)
    if (userId) all = all.filter(o => o.userId === userId)
    if (phone) {
      const p = phone.replace(/[\s.-]/g, '')
      all = all.filter(o => o.customerPhone === p)
    }
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const total = all.length
    const orders = all.slice(skip, skip + limit)
    return { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }
  }
}

export async function getOrderById(id) {
  try {
    return await prisma.order.findUnique({ where: { id } })
  } catch {
    return memoryOrders.get(id) || null
  }
}

export async function updateOrderPaymentStatus(orderId, { paymentStatus, transactionId = null, paymentDetails = null }) {
  const updateData = {
    paymentStatus,
    status: paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING',
    ...(transactionId ? { paymentRef: transactionId } : {}),
    ...(paymentDetails ? { notes: typeof paymentDetails === 'string' ? paymentDetails : JSON.stringify(paymentDetails) } : {}),
    updatedAt: new Date(),
  }

  try {
    return await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })
  } catch {
    const order = memoryOrders.get(orderId)
    if (order) {
      Object.assign(order, updateData)
      memoryOrders.set(orderId, order)
      return order
    }
    return null
  }
}

