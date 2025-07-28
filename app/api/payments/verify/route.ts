import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 })
    }

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Get the order from our database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("buyer_id", user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order status to paid
    const { error: updateError } = await supabase
      .from("orders")
      .update({ 
        status: "paid",
        razorpay_payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString()
      })
      .eq("id", order.id)

    if (updateError) {
      console.error("Order update error:", updateError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          order_id: order.id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          amount: order.amount,
          status: "captured",
          created_at: new Date().toISOString()
        }
      ])

    if (paymentError) {
      console.error("Payment record creation error:", paymentError)
      // Don't fail the verification if payment record creation fails
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      order_id: order.id
    })

  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 