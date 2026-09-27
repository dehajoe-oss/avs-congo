// lib/pawapay.js
// Client d'intégration officiel et simulateur Sandbox pour pawaPay (Congo-Brazzaville)
// Supporte MTN Mobile Money (MTN_MOMO_COG) et Airtel Money (AIRTEL_COG)

const PAWAPAY_TOKEN = process.env.PAWAPAY_API_TOKEN || ''
const PAWAPAY_ENV = process.env.PAWAPAY_ENVIRONMENT || 'sandbox'
const BASE_URL = PAWAPAY_ENV === 'production'
  ? 'https://api.pawapay.io'
  : 'https://api.sandbox.pawapay.io'

// Détection du mode simulateur local (activé par défaut si aucun vrai token pawaPay n'est configuré)
export const isMockMode = (
  !PAWAPAY_TOKEN ||
  PAWAPAY_TOKEN.includes('mock') ||
  PAWAPAY_TOKEN.includes('sandbox_test_token') ||
  PAWAPAY_ENV === 'mock'
)

// Mémoire locale pour le simulateur Sandbox
const mockDeposits = new Map()

/**
 * Normalise un numéro congolais au format international requis par pawaPay (ex: 242069677567)
 * @param {string} phone
 * @returns {string}
 */
export function formatCongolesePhone(phone = '') {
  let cleaned = String(phone).replace(/[\s+.-]/g, '')
  // Si le numéro commence par 06 ou 05 ou 04 (numéros congolais à 9 chiffres)
  if (/^0[456]\d{7}$/.test(cleaned)) {
    return `242${cleaned}`
  }
  // Si déjà au format 2420...
  if (/^242\d{9}$/.test(cleaned)) {
    return cleaned
  }
  return cleaned
}

/**
 * Détermine l'opérateur congolais à partir du numéro si non spécifié
 * @param {string} phone 
 * @returns {'MTN_MOMO_COG' | 'AIRTEL_COG'}
 */
export function detectCongoProvider(phone = '') {
  const formatted = formatCongolesePhone(phone)
  // Préfixes MTN Congo : 06...
  // Préfixes Airtel Congo : 05... ou 04...
  if (formatted.startsWith('24206')) {
    return 'MTN_MOMO_COG'
  }
  return 'AIRTEL_COG'
}

/**
 * Initie un paiement Mobile Money (Push USSD) via pawaPay v2
 */
export async function initiateDeposit({
  depositId,
  amount,
  currency = 'XAF',
  phoneNumber,
  provider = 'MTN_MOMO_COG',
  clientReferenceId,
  metadata = [],
}) {
  const formattedPhone = formatCongolesePhone(phoneNumber)

  // ── 1. MODE SIMULATEUR SANDBOX LOCAL ──
  if (isMockMode) {
    console.log(`[pawaPay Sandbox Mock] Dépôt simulé initié : ${depositId} pour ${formattedPhone} (${provider}) - Montant: ${amount} ${currency}`)
    
    mockDeposits.set(depositId, {
      depositId,
      status: 'ACCEPTED',
      amount: String(Math.round(amount)),
      currency,
      payer: {
        type: 'MMO',
        accountDetails: {
          phoneNumber: formattedPhone,
          provider,
        },
      },
      clientReferenceId,
      metadata,
      createdAt: Date.now(),
    })

    return {
      success: true,
      depositId,
      status: 'ACCEPTED',
      provider,
      phoneNumber: formattedPhone,
      isMock: true,
      message: 'Demande de paiement envoyée au simulateur Sandbox pawaPay',
    }
  }

  // ── 2. APPEL RÉEL À L'API PAWAPAY V2 ──
  try {
    const payload = {
      depositId,
      payer: {
        type: 'MMO',
        accountDetails: {
          phoneNumber: formattedPhone,
          provider,
        },
      },
      amount: String(Math.round(amount)),
      currency,
      clientReferenceId: String(clientReferenceId || depositId),
      customerMessage: `AVS-${String(clientReferenceId || depositId).slice(0, 15)}`,
      metadata: Array.isArray(metadata) ? metadata : [],
    }

    const response = await fetch(`${BASE_URL}/v2/deposits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAWAPAY_TOKEN}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[pawaPay API Error]', data)
      return {
        success: false,
        error: data.errorMessage || data.message || 'Erreur lors de l’initiation pawaPay',
        details: data,
      }
    }

    return {
      success: true,
      depositId,
      status: data.status || 'ACCEPTED',
      provider,
      isMock: false,
      data,
    }
  } catch (err) {
    console.error('[pawaPay Request Exception]', err)
    return {
      success: false,
      error: err.message || 'Impossible de contacter les serveurs pawaPay',
    }
  }
}

/**
 * Vérifie le statut d'un dépôt (polling ou vérification directe)
 */
export async function getDepositStatus(depositId) {
  // ── 1. MODE SIMULATEUR SANDBOX LOCAL ──
  if (isMockMode) {
    const mock = mockDeposits.get(depositId)
    if (!mock) {
      return {
        depositId,
        status: 'NOT_FOUND',
        isMock: true,
      }
    }

    // Si plus de 5 secondes se sont écoulées en simulation et qu'aucun statut manuel n'a été forcé,
    // on simule la complétion avec succès de la transaction par l'utilisateur
    const elapsedSeconds = (Date.now() - mock.createdAt) / 1000
    if (mock.status === 'ACCEPTED' && elapsedSeconds > 4) {
      mock.status = 'COMPLETED'
      mockDeposits.set(depositId, mock)
    }

    return {
      depositId,
      status: mock.status,
      amount: mock.amount,
      currency: mock.currency,
      provider: mock.payer?.accountDetails?.provider,
      failureReason: mock.failureReason || null,
      isMock: true,
    }
  }

  // ── 2. APPEL RÉEL À L'API PAWAPAY ──
  try {
    const response = await fetch(`${BASE_URL}/v2/deposits/${depositId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAWAPAY_TOKEN}`,
      },
    })

    const data = await response.json()
    if (!response.ok) {
      return {
        depositId,
        status: 'ERROR',
        error: data.errorMessage || data.message || 'Erreur vérification statut',
      }
    }

    // Le format pawaPay v2 renvoie un objet ou un tableau [ { status: 'COMPLETED' } ]
    const record = Array.isArray(data) ? data[0] : data
    return {
      depositId,
      status: record?.status || 'UNKNOWN',
      amount: record?.amount,
      currency: record?.currency,
      failureReason: record?.failureReason || null,
      isMock: false,
      raw: record,
    }
  } catch (err) {
    console.error('[pawaPay Status Exception]', err)
    return {
      depositId,
      status: 'ERROR',
      error: err.message,
    }
  }
}

/**
 * Permet de forcer un statut dans le simulateur Sandbox (ex: tester un échec ou un succès immédiat)
 */
export function setMockDepositStatus(depositId, status, failureReason = null) {
  if (mockDeposits.has(depositId)) {
    const current = mockDeposits.get(depositId)
    current.status = status
    if (failureReason) current.failureReason = failureReason
    mockDeposits.set(depositId, current)
    return true
  }
  return false
}
