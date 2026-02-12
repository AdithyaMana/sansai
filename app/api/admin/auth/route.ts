import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const jwtSecret = process.env.SUPABASE_JWT_SECRET!

const supabase = createClient(supabaseUrl, supabaseKey)

// Login
export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json()

    if (!action || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (action === "login") {
      // Find admin user
      const { data: admin, error: findError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single()

      if (findError || !admin) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Compare password
      const passwordMatch = await bcrypt.compare(password, admin.password_hash)
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Generate simple JWT token
      const token = Buffer.from(JSON.stringify({ id: admin.id, email: admin.email })).toString("base64")

      return NextResponse.json({
        message: "Login successful",
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

// Verify token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())

    // Verify admin exists
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, name")
      .eq("id", decoded.id)
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ admin, valid: true })
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
