import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// GET orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[v0] Orders GET error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, cartItems, cartTotal } = await request.json()

    if (!phoneNumber || !cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_phone: phoneNumber,
          items: cartItems,
          total_amount: cartTotal,
          status: "pending",
          notes: "",
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    console.log("[v0] Order created:", order.id)

    return NextResponse.json({
      message: "Order placed successfully! Our team will contact you shortly.",
      orderId: order.id,
    })
  } catch (error) {
    console.error("[v0] Orders POST error:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

// PUT update order status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, status, notes } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status, notes: notes || "" })
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from("order_activity_log").insert([
      {
        order_id: orderId,
        action: `Status changed to ${status}`,
        notes: notes || "",
      },
    ])

    return NextResponse.json({ order })
  } catch (error) {
    console.error("[v0] Orders PUT error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
