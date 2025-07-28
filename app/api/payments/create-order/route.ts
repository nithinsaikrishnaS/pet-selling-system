import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Razorpay from "razorpay"

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { petId, amount, orderData } = body

    if (!petId || !amount || !orderData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get pet details
    const { data: pet, error: petError } = await supabase
      .from("pets")
      .select("*")
      .eq("id", petId)
      .single()

    if (petError || !pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    // Create order in our database first
    const { data: dbOrder, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          buyer_id: user.id,
          pet_id: petId,
          seller_id: pet.seller_id,
          full_name: orderData.fullName,
          email: orderData.email,
          contact_number: orderData.contactNumber,
          delivery_address: orderData.deliveryAddress,
          preferred_delivery_date: orderData.preferredDeliveryDate,
          amount: amount,
          status: "pending"
        }
      ])
      .select()
      .single()

    if (orderError) {
      console.error("Database order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${dbOrder.id}`,
      notes: {
        order_id: dbOrder.id,
        pet_id: petId,
        pet_name: pet.name
      }
    })

    // Update our order with Razorpay order ID
    await supabase
      .from("orders")
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", dbOrder.id)

    return NextResponse.json({
      order_id: dbOrder.id,
      razorpay_order_id: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    })

  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 