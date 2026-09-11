// app/api/users/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('[API Users GET Error]', error)
    return NextResponse.json({ success: false, users: [], error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { fullName, name, email, phone, password, role = 'CLIENT' } = body
    const userName = name || fullName

    if (!userName || !password) {
      return NextResponse.json(
        { error: 'Nom complet et mot de passe requis' },
        { status: 400 }
      )
    }

    const cleanPhone = phone ? phone.replace(/[\s.-]/g, '') : null

    const user = await prisma.user.create({
      data: {
        name: userName.trim(),
        email: email ? email.trim().toLowerCase() : null,
        phone: cleanPhone,
        password,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error('[API Users POST Error]', error)
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email ou ce numéro de téléphone' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message || 'Erreur création utilisateur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, role, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 })
    }

    const data = {}
    if (role) data.role = role
    if (isActive !== undefined) data.isActive = isActive

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('[API Users PATCH Error]', error)
    return NextResponse.json({ error: error.message || 'Erreur mise à jour utilisateur' }, { status: 500 })
  }
}
