// app/api/orders/route.js
import { NextResponse } from 'next/server'
import { createOrder, listOrders } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const data = await request.json()

    if (!data.customerName?.trim() || !data.customerPhone?.trim() || !data.customerAddress?.trim()) {
      return NextResponse.json(
        { error: 'Le nom, le numéro de téléphone et l’adresse de livraison sont requis' },
        { status: 400 }
      )
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { error: 'Votre panier est vide' },
        { status: 400 }
      )
    }

    const order = await createOrder({
      userId: data.userId || null,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerEmail: data.customerEmail?.trim() || null,
      customerAddress: data.customerAddress.trim(),
      notes: data.notes?.trim() || null,
      items: data.items,
      totalAmount: data.totalAmount || 0,
      paymentMethod: data.paymentMethod || 'kkiapay',
      paymentStatus: data.paymentStatus || 'UNPAID',
      transactionId: data.transactionId || null,
      status: data.paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING',
    })

    return NextResponse.json({
      success: true,
      order,
    }, { status: 201 })
  } catch (err) {
    console.error('[Orders POST Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors de l’enregistrement de la commande' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const phone = searchParams.get('phone')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''

    const result = await listOrders({ userId, phone, page, limit, status })
    return NextResponse.json(result)
  } catch (err) {
    console.error('[Orders GET Error]', err)
    return NextResponse.json(
      { orders: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 }, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
