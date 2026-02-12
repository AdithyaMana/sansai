import { SignJWT, jwtVerify } from "jose"
import { createClient } from "@supabase/supabase-js"
import { NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Get the JWT secret as a Uint8Array for jose.
 * Falls back to SUPABASE_JWT_SECRET if ADMIN_JWT_SECRET is not set.
 */
function getJwtSecret(): Uint8Array {
    const secret = process.env.ADMIN_JWT_SECRET || process.env.SUPABASE_JWT_SECRET
    if (!secret) {
        throw new Error("Missing ADMIN_JWT_SECRET or SUPABASE_JWT_SECRET environment variable")
    }
    return new TextEncoder().encode(secret)
}

/**
 * Token payload structure
 */
export interface AdminTokenPayload {
    id: string
    email: string
}

/**
 * Sign a JWT token for an admin user.
 * Token expires after 8 hours.
 */
export async function signAdminToken(payload: AdminTokenPayload): Promise<string> {
    const secret = getJwtSecret()

    return await new SignJWT({ id: payload.id, email: payload.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .setSubject(payload.id)
        .sign(secret)
}

/**
 * Verify a JWT token and return the admin user data.
 * Returns null if the token is invalid, expired, or the admin doesn't exist.
 */
export async function verifyAdminToken(
    request: NextRequest
): Promise<{ id: string; email: string; name: string | null } | null> {
    try {
        const authHeader = request.headers.get("authorization")
        if (!authHeader?.startsWith("Bearer ")) {
            return null
        }

        const token = authHeader.slice(7)
        const secret = getJwtSecret()

        // Verify JWT signature and expiration
        const { payload } = await jwtVerify(token, secret)

        if (!payload.id || typeof payload.id !== "string") {
            return null
        }

        // Verify admin still exists in database
        const { data: admin, error } = await supabase
            .from("admin_users")
            .select("id, email, name")
            .eq("id", payload.id)
            .single()

        if (error || !admin) {
            return null
        }

        return admin
    } catch {
        // Token invalid, expired, or malformed
        return null
    }
}
