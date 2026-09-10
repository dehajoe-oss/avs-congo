// app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import { findUserByPhone } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { phone, password } = await request.json()

    if (!phone?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Numéro de téléphone et mot de passe requis' },
        { status: 400 }
      )
    }

    const user = await findUserByPhone(phone)
    if (!user) {
      return NextResponse.json(
        { error: 'Aucun compte associé à ce numéro de téléphone' },
        { status: 404 }
      )
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      companyName: user.companyName,
      userType: user.userType,
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
