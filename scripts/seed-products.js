import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedProducts() {
  try {
    // Read products from JSON file
    const productsPath = path.join(process.cwd(), 'app/data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

    console.log(`[v0] Found ${productsData.length} products to seed`);

    // Transform products to match database schema
    const productsToInsert = productsData.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      image: product.image,
      description: product.description || '',
      in_stock: product.inStock !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // Insert products into database
    const { data, error } = await supabase
      .from('products')
      .upsert(productsToInsert, { onConflict: 'id' });

    if (error) {
      console.error('[v0] Error seeding products:', error);
      process.exit(1);
    }

    console.log(`[v0] Successfully seeded ${productsToInsert.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('[v0] Failed to seed products:', error);
    process.exit(1);
  }
}

seedProducts();
