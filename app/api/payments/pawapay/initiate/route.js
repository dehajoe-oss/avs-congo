// app/api/payments/pawapay/initiate/route.js
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { getOrderById, updateOrderPaymentStatus } from '@/lib/db'
import { initiateDeposit, formatCongolesePhone, detectCongoProvider } from '@/lib/pawapay'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderId, phone, provider: userProvider } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'Identifiant de commande requis' },
        { status: 400 }
      )
    }

    const order = await getOrderById(orderId)
    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      )
    }

    // Téléphone à débiter : priorité à celui transmis dans le paiement, sinon celui de la commande
    const rawPhone = phone || order.customerPhone
    if (!rawPhone) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis pour initier le paiement Mobile Money' },
        { status: 400 }
      )
    }

    const formattedPhone = formatCongolesePhone(rawPhone)
    const provider = userProvider || detectCongoProvider(formattedPhone)
    const depositId = randomUUID()

    // 1. Appel du service pawaPay (réel ou simulateur Sandbox)
    const result = await initiateDeposit({
      depositId,
      amount: order.totalAmount,
      currency: 'XAF',
      phoneNumber: formattedPhone,
      provider,
      clientReferenceId: order.orderNumber,
      metadata: [
        { fieldName: 'orderId', fieldValue: order.id },
        { fieldName: 'orderNumber', fieldValue: order.orderNumber },
        { fieldName: 'customerName', fieldValue: order.customerName || '' },
      ],
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Échec de l’initiation du paiement Mobile Money' },
        { status: 502 }
      )
    }

    // 2. Mise à jour de la commande avec la référence pawaPay
    const paymentMethodLabel = provider === 'MTN_MOMO_COG' ? 'MTN_MOMO' : 'AIRTEL_MONEY'
    await updateOrderPaymentStatus(order.id, {
      paymentStatus: 'PENDING',
      transactionId: depositId,
      paymentDetails: {
        gateway: 'pawapay',
        depositId,
        provider,
        phone: formattedPhone,
        environment: result.isMock ? 'sandbox-mock' : 'sandbox',
      },
    })

    return NextResponse.json({
      success: true,
      depositId,
      status: result.status || 'ACCEPTED',
      provider,
      phone: formattedPhone,
      isMock: Boolean(result.isMock),
      message: 'Demande de débit Mobile Money envoyée sur le mobile',
    })
  } catch (err) {
    console.error('[pawaPay Initiate API Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur interne du serveur lors de l’initiation du paiement' },
      { status: 500 }
    )
  }
}
