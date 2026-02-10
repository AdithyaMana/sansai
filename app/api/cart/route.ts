'use server';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';

    const { data: cart, error: cartError } = await supabase
      .from('shopping_carts')
      .select('*')
      .eq('session_id', userId)
      .single();

    if (cartError && cartError.code !== 'PGRST116') {
      throw cartError;
    }

    if (!cart) {
      return NextResponse.json({ items: [], total: 0, cartId: null });
    }

    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select('id, quantity, product_id, products(id, name, image, price, unit)')
      .eq('cart_id', cart.id);

    if (itemsError) throw itemsError;

    // Format items for client
    const formattedItems = (items || []).map((item: any) => ({
      cartItemId: item.id,
      id: item.product_id,
      productId: item.product_id,
      quantity: item.quantity,
      name: item.products?.name || 'Unknown',
      image: item.products?.image || '/placeholder.svg',
      price: item.products?.price || 0,
      unit: item.products?.unit || 'per kg',
    }));

    const total = formattedItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    return NextResponse.json({
      items: formattedItems,
      total,
      cartId: cart.id,
    });
  } catch (error) {
    console.error('[v0] Cart GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const { productId, quantity, price, name, image } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create cart
    let cart = await supabase
      .from('shopping_carts')
      .select('*')
      .eq('session_id', userId)
      .single();

    if (cart.error && cart.error.code === 'PGRST116') {
      // Cart doesn't exist, create one
      const newCart = await supabase
        .from('shopping_carts')
        .insert([{ session_id: userId }])
        .select()
        .single();

      if (newCart.error) throw newCart.error;
      cart = newCart;
    } else if (cart.error) {
      throw cart.error;
    }

    const cartId = cart.data!.id;

    // Check if item already exists in cart
    const existing = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .single();

    if (existing.data) {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.data.quantity + quantity })
        .eq('id', existing.data.id);

      if (error) throw error;
    } else {
      // Insert new item
      const { error } = await supabase
        .from('cart_items')
        .insert([
          {
            cart_id: cartId,
            product_id: productId,
            quantity,
          },
        ]);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Cart POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// Update cart item
export async function PUT(request: NextRequest) {
  try {
    const { itemId, quantity } = await request.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    } else {
      // Update quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Cart PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Missing itemId' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Cart DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart item' },
      { status: 500 }
    );
  }
}
