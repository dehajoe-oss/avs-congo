// app/api/auth/verify-email/route.js
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

async function handleVerification(token) {
  if (!token || String(token).trim().length < 10) {
    return NextResponse.json(
      { error: 'Jeton de validation manquant ou invalide.' },
      { status: 400 }
    )
  }

  const tokenHash = crypto.createHash('sha256').update(String(token).trim()).digest('hex')

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { gt: new Date() },
    },
  })

  if (!user) {
    return NextResponse.json(
      {
        error: 'Le lien de validation est invalide ou a expiré (durée de validité : 24 heures). Veuillez demander un nouvel email de confirmation.',
      },
      { status: 400 }
    )
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      emailVerified: true,
    },
  })

  return NextResponse.json({
    success: true,
    message: 'Votre adresse email a été validée avec succès ! Votre compte est désormais actif.',
    user: updatedUser,
  })
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = body?.token || new URL(request.url).searchParams.get('token')
    return await handleVerification(token)
  } catch (err) {
    console.error('[API Verify Email POST Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la validation de l’email' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    return await handleVerification(token)
  } catch (err) {
    console.error('[API Verify Email GET Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la validation de l’email' },
      { status: 500 }
    )
  }
}
