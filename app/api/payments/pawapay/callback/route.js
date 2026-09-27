// app/api/payments/pawapay/callback/route.js
// Webhook officiel pour les notifications asynchrones pawaPay (Sandbox & Production)
import { NextResponse } from 'next/server'
import { prisma, updateOrderPaymentStatus } from '@/lib/db'
import { sendMail, orderReceiptEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const payload = await request.json()
    console.log('[pawaPay Webhook Callback Received]', JSON.stringify(payload))

    const { depositId, status, failureReason, payer, amount, currency } = payload

    if (!depositId) {
      return NextResponse.json({ error: 'depositId manquant dans le payload' }, { status: 400 })
    }

    // 1. Retrouver la commande par la référence depositId
    const order = await prisma.order.findFirst({
      where: { paymentRef: depositId },
      include: { items: true },
    })

    if (!order) {
      console.warn(`[pawaPay Webhook] Aucune commande trouvée pour depositId: ${depositId}`)
      // On répond quand même 200 à pawaPay pour acquitter la réception
      return NextResponse.json({ received: true, note: 'Commande introuvable localement' })
    }

    // 2. Traitement selon le statut final renvoyé par pawaPay
    if (status === 'COMPLETED') {
      const updatedOrder = await updateOrderPaymentStatus(order.id, {
        paymentStatus: 'PAID',
        transactionId: depositId,
        paymentDetails: {
          depositId,
          status: 'COMPLETED',
          amount,
          currency,
          payer,
          validatedVia: 'webhook',
          validatedAt: new Date().toISOString(),
        },
      })

      // Envoi du reçu par email si disponible
      if (updatedOrder?.customerEmail || order.customerEmail) {
        try {
          const mailContent = orderReceiptEmail({ order: updatedOrder || order })
          await sendMail({
            to: updatedOrder?.customerEmail || order.customerEmail,
            subject: mailContent.subject,
            html: mailContent.html,
          })
        } catch (mailErr) {
          console.error('[pawaPay Webhook] Échec envoi email de reçu:', mailErr.message)
        }
      }

      console.log(`[pawaPay Webhook] Commande ${order.orderNumber} validée avec succès (PAID)`)
    } else if (status === 'FAILED') {
      await updateOrderPaymentStatus(order.id, {
        paymentStatus: 'FAILED',
        transactionId: depositId,
        paymentDetails: {
          depositId,
          status: 'FAILED',
          failureReason: failureReason || 'Paiement rejeté ou annulé',
          failedAt: new Date().toISOString(),
        },
      })
      console.warn(`[pawaPay Webhook] Commande ${order.orderNumber} marquée en ÉCHEC:`, failureReason)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[pawaPay Webhook Error]', err)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    )
  }
}
