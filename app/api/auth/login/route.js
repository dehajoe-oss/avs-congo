// app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import { findUserByIdentifier, findUserByPhone } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { identifier, phone, email, password } = await request.json()
    const loginId = (identifier || phone || email || '').trim()

    if (!loginId || !password?.trim()) {
      return NextResponse.json(
        { error: 'Identifiant (email ou téléphone) et mot de passe requis' },
        { status: 400 }
      )
    }

    let user = await findUserByIdentifier(loginId)
    if (!user) {
      user = await findUserByPhone(loginId)
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Aucun compte associé à cet identifiant' },
        { status: 404 }
      )
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Blocage si l'adresse email n'a pas encore été vérifiée
    if (user.emailVerified === false) {
      return NextResponse.json(
        {
          error: 'Veuillez valider votre adresse email avant d’accéder à votre compte. Un lien d’activation vous a été envoyé par email.',
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      )
    }

    const safeUser = {
      id: user.id,
      fullName: user.name || user.fullName,
      name: user.name || user.fullName,
      phone: user.phone,
      email: user.email,
      companyName: user.companyName,
      userType: user.userType,
      role: user.role,
      emailVerified: true,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: safeUser,
    })
  } catch (err) {
    console.error('[Auth Login Error]', err)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
