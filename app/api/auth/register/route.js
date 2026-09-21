// app/api/auth/register/route.js
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createUser, findUserByPhone, findUserByEmail } from '@/lib/db'
import { sendMail, verificationEmailMail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { fullName, phone, email, password, companyName, userType } = await request.json()

    if (!fullName?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Veuillez renseigner votre nom complet et un mot de passe' },
        { status: 400 }
      )
    }

    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Une adresse email valide est obligatoire pour confirmer votre inscription.' },
        { status: 400 }
      )
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères, incluant au moins une lettre et un chiffre.' },
        { status: 400 }
      )
    }

    // Vérifier si un compte existe déjà avec ce téléphone
    if (phone?.trim()) {
      const existingPhone = await findUserByPhone(phone)
      if (existingPhone) {
        return NextResponse.json(
          { error: 'Un compte existe déjà avec ce numéro de téléphone' },
          { status: 409 }
        )
      }
    }

    // Vérifier si un compte existe déjà avec cet email
    const existingEmail = await findUserByEmail(cleanEmail)
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse email' },
        { status: 409 }
      )
    }

    // Génération du jeton sécurisé de validation d'email (valable 24h)
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await createUser({
      fullName: fullName.trim(),
      phone: phone?.trim() || null,
      email: cleanEmail,
      password,
      companyName: companyName || '',
      userType: userType || 'breeder',
      emailVerified: false,
      emailVerificationToken: tokenHash,
      emailVerificationExpires: verificationExpires,
    })

    // URL de validation envoyée par email
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3003'
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
    const verifyUrl = `${proto}://${host}/verifier-email?token=${rawToken}`

    const mail = verificationEmailMail({ name: user.name || user.fullName, verifyUrl })

    try {
      await sendMail({ to: user.email, subject: mail.subject, html: mail.html })
    } catch (mailErr) {
      console.error('[Auth Register] Erreur lors de l’envoi de l’email de validation:', mailErr)
    }

    let devVerifyUrl = null
    if (!process.env.RESEND_API_KEY) {
      devVerifyUrl = verifyUrl
    }

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email: user.email,
      message: `Compte créé avec succès ! Un lien de confirmation a été envoyé à ${user.email}. Veuillez vérifier votre boîte de réception pour l'activer.`,
      ...(devVerifyUrl ? { devVerifyUrl } : {}),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: false,
      },
    }, { status: 201 })
  } catch (err) {
    console.error('[Auth Register Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
