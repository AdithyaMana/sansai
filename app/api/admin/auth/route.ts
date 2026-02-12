import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { signAdminToken, verifyAdminToken } from "@/lib/adminAuth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

// Login
export async function POST(request: NextRequest) {
  try {
    const { action, email, password } = await request.json()

    if (!action || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (action === "login") {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
      }

      // Find admin user
      const { data: admin, error: findError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .single()

      if (findError || !admin) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Compare password
      const passwordMatch = await bcrypt.compare(password, admin.password_hash)
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // Generate signed JWT token
      const token = await signAdminToken({ id: admin.id, email: admin.email })

      return NextResponse.json({
        message: "Login successful",
        token,
        admin: { id: admin.id, email: admin.email, name: admin.full_name },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

// Verify token
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ admin, valid: true })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
