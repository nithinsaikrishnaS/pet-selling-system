import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server-admin"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = createAdminClient()

    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload, supabase)
        break
      case "payment.failed":
        await handlePaymentFailed(event.payload, supabase)
        break
      case "order.paid":
        await handleOrderPaid(event.payload, supabase)
        break
      default:
        console.log(`Unhandled event: ${event.event}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentCaptured(payload: any, supabase: any) {
  const payment = payload.payment.entity
  
  // Update payment record
  await supabase
    .from("payments")
    .update({
      status: "captured",
      payment_method: payment.method,
      bank: payment.bank,
      wallet: payment.wallet,
      vpa: payment.vpa,
      email: payment.email,
      contact: payment.contact,
      fee: payment.fee,
      tax: payment.tax,
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_payment_id", payment.id)

  // Update order status
  await supabase
    .from("orders")
    .update({
      status: "paid",
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_payment_id", payment.id)
}

async function handlePaymentFailed(payload: any, supabase: any) {
  const payment = payload.payment.entity
  
  // Update payment record
  await supabase
    .from("payments")
    .update({
      status: "failed",
      error_code: payment.error_code,
      error_description: payment.error_description,
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_payment_id", payment.id)

  // Update order status
  await supabase
    .from("orders")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_payment_id", payment.id)
}

async function handleOrderPaid(payload: any, supabase: any) {
  const order = payload.order.entity
  
  // Update order status
  await supabase
    .from("orders")
    .update({
      status: "paid",
      updated_at: new Date().toISOString()
    })
    .eq("razorpay_order_id", order.id)
} 