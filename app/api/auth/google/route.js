// app/api/auth/google/route.js
import { NextResponse } from 'next/server'
import { findOrCreateGoogleUser } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { credential } = await request.json()
    if (!credential) {
      return NextResponse.json(
        { error: 'Jeton d’authentification Google manquant.' },
        { status: 400 }
      )
    }

    // Vérification du jeton auprès de l’API officielle Google OAuth2
    const googleRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    )

    if (!googleRes.ok) {
      return NextResponse.json(
        { error: 'Jeton Google invalide ou expiré.' },
        { status: 401 }
      )
    }

    const payload = await googleRes.json()
    const { sub: googleId, email, name, picture } = payload

    if (!email) {
      return NextResponse.json(
        { error: 'Impossible de récupérer l’adresse email associée à ce compte Google.' },
        { status: 400 }
      )
    }

    const user = await findOrCreateGoogleUser({
      googleId,
      email,
      name,
      avatar: picture || null,
    })

    const token = `avs_g_${user.id}_${Date.now()}`

    return NextResponse.json({
      success: true,
      message: 'Connexion avec Google réussie !',
      data: {
        token,
        user,
      },
      user,
      token,
    })
  } catch (err) {
    console.error('[Google Auth Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la connexion avec Google' },
      { status: 500 }
    )
  }
}
