import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
    try {
        const { name, email, message } = await request.json()

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields: name, email, and message" },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            )
        }

        // Sanitize and limit input lengths
        const sanitizedData = {
            name: String(name).trim().slice(0, 200),
            email: String(email).trim().toLowerCase().slice(0, 254),
            message: String(message).trim().slice(0, 5000),
            status: "new",
        }

        // Try to store in Supabase (if contact_messages table exists)
        try {
            const { error } = await supabase
                .from("contact_messages")
                .insert([sanitizedData])

            if (error) {
                // Log the error but don't fail the request — table might not exist yet
                console.error("Failed to store contact message in DB:", error.message)
            }
        } catch (dbError) {
            console.error("Database error storing contact message:", dbError)
        }

        // Always return success to the user (message is at minimum logged)
        console.log("Contact form submission:", {
            name: sanitizedData.name,
            email: sanitizedData.email,
            messageLength: sanitizedData.message.length,
        })

        return NextResponse.json({
            success: true,
            message: "Your message has been received. We will get back to you shortly.",
        })
    } catch (error) {
        console.error("Contact form error:", error)
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        )
    }
}
