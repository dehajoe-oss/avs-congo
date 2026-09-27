// app/api/payments/pawapay/status/[depositId]/route.js
import { NextResponse } from 'next/server'
import { prisma, updateOrderPaymentStatus } from '@/lib/db'
import { getDepositStatus } from '@/lib/pawapay'
import { sendMail, orderReceiptEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

export async function GET(request, { params }) {
  try {
    const { depositId } = params

    if (!depositId) {
      return NextResponse.json(
        { error: 'Identifiant depositId requis' },
        { status: 400 }
      )
    }

    // 1. Interroger le statut auprès de pawaPay (réel ou mock sandbox)
    const statusResult = await getDepositStatus(depositId)

    // 2. Chercher la commande correspondante dans notre base
    let order = null
    try {
      order = await prisma.order.findFirst({
        where: { paymentRef: depositId },
        include: { items: true },
      })
    } catch (dbErr) {
      console.warn('[pawaPay Status] Erreur lookup commande DB:', dbErr.message)
    }

    // 3. Si le paiement est complété mais que la commande n'a pas encore été marquée PAID
    if (statusResult.status === 'COMPLETED' && order && order.paymentStatus !== 'PAID') {
      try {
        order = await updateOrderPaymentStatus(order.id, {
          paymentStatus: 'PAID',
          transactionId: depositId,
          paymentDetails: {
            depositId,
            status: 'COMPLETED',
            provider: statusResult.provider || order.paymentMethod,
            amount: statusResult.amount || order.totalAmount,
            validatedAt: new Date().toISOString(),
          },
        })

        // Envoi automatique de l'email de reçu si le client a fourni une adresse
        if (order?.customerEmail) {
          try {
            const mailContent = orderReceiptEmail({ order })
            await sendMail({
              to: order.customerEmail,
              subject: mailContent.subject,
              html: mailContent.html,
            })
          } catch (mailErr) {
            console.error('[pawaPay Status] Échec envoi email de reçu:', mailErr.message)
          }
        }
      } catch (updateErr) {
        console.error('[pawaPay Status] Erreur mise à jour commande:', updateErr.message)
      }
    }

    return NextResponse.json({
      success: true,
      depositId,
      status: statusResult.status,
      isPaid: statusResult.status === 'COMPLETED',
      failureReason: statusResult.failureReason || null,
      isMock: Boolean(statusResult.isMock),
      order: order ? {
        id: order.id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
      } : null,
    })
  } catch (err) {
    console.error('[pawaPay Status API Error]', err)
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la vérification du statut' },
      { status: 500 }
    )
  }
}
