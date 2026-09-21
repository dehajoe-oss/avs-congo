// app/api/auth/resend-verification/route.js
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma, findUserByIdentifier, findUserByPhone } from '@/lib/db'
import { sendMail, verificationEmailMail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const identifier = (body.identifier || body.email || body.phone || '').trim()

    if (!identifier) {
      return NextResponse.json(
        { error: 'Veuillez fournir votre adresse email ou votre numéro de téléphone.' },
        { status: 400 }
      )
    }

    let user = await findUserByIdentifier(identifier)
    if (!user) {
      user = await findUserByPhone(identifier)
    }

    const genericResponse = {
      success: true,
      message: 'Si un compte associé existe et n’a pas encore été validé, un nouveau lien vient de lui être envoyé par email.',
    }

    if (!user || !user.email) {
      return NextResponse.json(genericResponse)
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Ce compte est déjà activé. Vous pouvez vous connecter directement.',
      })
    }

    // Génération d'un nouveau jeton
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: tokenHash,
        emailVerificationExpires: verificationExpires,
      },
    })

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3003'
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
    const verifyUrl = `${proto}://${host}/verifier-email?token=${rawToken}`

    const mail = verificationEmailMail({ name: user.name || user.fullName, verifyUrl })

    try {
      await sendMail({ to: user.email, subject: mail.subject, html: mail.html })
    } catch (mailErr) {
      console.error('[Auth Resend Verification] Erreur envoi email:', mailErr)
    }

    return NextResponse.json({
      success: true,
      message: `Un nouveau lien de validation a été envoyé à ${user.email}.`,
    })
  } catch (err) {
    console.error('[API Resend Verification Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors du renvoi du lien de validation' },
      { status: 500 }
    )
  }
}
