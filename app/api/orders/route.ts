import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { verifyAdminToken } from "@/lib/adminAuth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// GET orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders GET error:", error)
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

    // Validate phone number format
    const cleanPhone = String(phoneNumber).replace(/[^\d+]/g, "")
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json({ error: "Phone number must be between 10-15 digits" }, { status: 400 })
    }

    // Validate cart items
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart cannot be empty" }, { status: 400 })
    }

    for (const item of cartItems) {
      if (!item.productId || !item.name || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json({ error: "Invalid cart item data" }, { status: 400 })
      }
    }

    // Sanitize items to prevent stored XSS
    const sanitizedItems = cartItems.map((item: any) => ({
      productId: String(item.productId),
      name: String(item.name).slice(0, 200),
      quantity: Math.floor(Math.abs(Number(item.quantity))),
      price: Math.abs(Number(item.price) || 0),
      image: String(item.image || "").slice(0, 500),
      unit: String(item.unit || "").slice(0, 50),
    }))

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_phone: cleanPhone,
          order_items: sanitizedItems,
          order_total: Math.abs(Number(cartTotal) || 0),
          order_status: "pending",
          special_notes: "",
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    return NextResponse.json({
      message: "Order placed successfully! Our team will contact you shortly.",
      orderId: order.id,
    })
  } catch (error) {
    console.error("Orders POST error:", error)
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}

// PUT update order status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, status, notes } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate status value
    const validStatuses = ["pending", "confirmed", "processing", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({ order_status: status, special_notes: String(notes || "").slice(0, 1000) })
      .eq("id", orderId)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from("order_activity_log").insert([
      {
        order_id: orderId,
        admin_id: admin.id,
        action: `Status changed to ${status}`,
        notes: String(notes || "").slice(0, 1000),
      },
    ])

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Orders PUT error:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
