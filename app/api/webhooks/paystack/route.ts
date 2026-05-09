import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')
    const secret = process.env.PAYSTACK_SECRET_KEY

    if (!secret || !signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify Paystack webhook signature
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')
    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.success') {
      const reference = event.data.reference
      const supabase = createAdminClient()

      // Update transaction status to 'held' (in escrow)
      await supabase
        .from('transactions')
        .update({
          status: 'held',
          paystack_transaction_id: event.data.id.toString(),
        })
        .eq('paystack_reference', reference)

      console.log(`Payment confirmed for reference: ${reference}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
