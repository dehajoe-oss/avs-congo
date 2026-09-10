// app/api/auth/register/route.js
import { NextResponse } from 'next/server'
import { createUser, findUserByPhone } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { fullName, phone, email, password, companyName, userType } = await request.json()

    if (!fullName?.trim() || !phone?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: 'Veuillez renseigner votre nom, téléphone et mot de passe' },
        { status: 400 }
      )
    }

    // Vérifier si un compte existe déjà
    const existing = await findUserByPhone(phone)
    if (existing) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec ce numéro de téléphone' },
        { status: 409 }
      )
    }

    const user = await createUser({
      fullName,
      phone,
      email: email || null,
      password,
      companyName: companyName || '',
      userType: userType || 'breeder',
    })

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      user,
    }, { status: 201 })
  } catch (err) {
    console.error('[Auth Register Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
