// app/api/payments/kkiapay/verify/route.js
import { NextResponse } from 'next/server'
import { updateOrderPaymentStatus, getOrderById } from '@/lib/db'
import { sendMail, orderReceiptEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { orderId, transactionId, paymentDetails } = await request.json()

    if (!orderId || !transactionId) {
      return NextResponse.json(
        { error: 'Identifiant de commande et référence de transaction requis' },
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

    const updated = await updateOrderPaymentStatus(orderId, {
      paymentStatus: 'PAID',
      transactionId,
      paymentDetails,
    })

    // Envoi automatique du reçu par email si une adresse est associée
    const recipientEmail = updated?.customerEmail || order?.customerEmail
    if (recipientEmail) {
      try {
        const mailContent = orderReceiptEmail({ order: updated || order })
        await sendMail({
          to: recipientEmail,
          subject: mailContent.subject,
          html: mailContent.html,
        })
      } catch (mailErr) {
        console.error('[KKiaPay Verify] Échec envoi email de reçu:', mailErr.message)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Paiement KKiaPay validé avec succès',
      order: updated,
    })
  } catch (err) {
    console.error('[KKiaPay Verify Error]', err)
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du paiement' },
      { status: 500 }
    )
  }
}
