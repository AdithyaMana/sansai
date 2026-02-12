import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, cartItems, cartTotal } = await request.json();

    if (!phoneNumber || !cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber and cartItems' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const cleanPhone = String(phoneNumber).replace(/[^\d+]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return NextResponse.json(
        { error: 'Phone number must be between 10-15 digits' },
        { status: 400 }
      );
    }

    // Validate cart items
    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart cannot be empty' },
        { status: 400 }
      );
    }

    // Create enquiry record
    const { data: enquiry, error } = await supabase
      .from('enquiries')
      .insert([
        {
          phone_number: cleanPhone,
          cart_items: cartItems,
          cart_total: Math.abs(Number(cartTotal) || 0),
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Enquiry creation error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: 'Your enquiry has been received. We will contact you shortly.',
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
