// app/api/payments/pawapay/simulate/route.js
// Permet de forcer manuellement le résultat d'un paiement en mode Sandbox de test
import { NextResponse } from 'next/server'
import { setMockDepositStatus } from '@/lib/pawapay'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { depositId, action } = await request.json()

    if (!depositId) {
      return NextResponse.json({ error: 'depositId requis' }, { status: 400 })
    }

    if (action === 'fail') {
      setMockDepositStatus(depositId, 'FAILED', {
        failureCode: 'PAYMENT_NOT_APPROVED',
        failureMessage: 'Paiement annulé ou rejeté par le client sur son mobile',
      })
      return NextResponse.json({ success: true, status: 'FAILED' })
    }

    // Par défaut, forcer le succès
    setMockDepositStatus(depositId, 'COMPLETED')
    return NextResponse.json({ success: true, status: 'COMPLETED' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
