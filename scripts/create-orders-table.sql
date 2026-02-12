-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(255),
  order_items JSONB NOT NULL,
  order_total NUMERIC(10, 2) NOT NULL,
  order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  special_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_phone ON orders(customer_phone);

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS order_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_order_id ON order_activity_log(order_id);

-- Enable RLS policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admin users can view all orders
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- RLS Policy: Admin users can insert orders
CREATE POLICY "Admins can insert orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- RLS Policy: Admin users can update orders
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- RLS Policy: Admins can view admin users
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- RLS Policy: Admins can insert activity logs
CREATE POLICY "Admins can insert activity logs" ON order_activity_log
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- RLS Policy: Admins can view activity logs
CREATE POLICY "Admins can view activity logs" ON order_activity_log
  FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));
