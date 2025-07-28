-- Create orders table for storing order information
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  delivery_address TEXT NOT NULL,
  preferred_delivery_date DATE,
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'delivered')),
  payment_id VARCHAR(255),
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own orders (as buyer)
CREATE POLICY "Users can view their own orders as buyer" ON orders
  FOR SELECT USING (auth.uid() = buyer_id);

-- Policy for users to view orders where they are the seller
CREATE POLICY "Users can view orders where they are seller" ON orders
  FOR SELECT USING (auth.uid() = seller_id);

-- Policy for authenticated users to create orders
CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Policy for users to update their own orders (as buyer)
CREATE POLICY "Users can update their own orders as buyer" ON orders
  FOR UPDATE USING (auth.uid() = buyer_id);

-- Policy for sellers to update orders where they are the seller
CREATE POLICY "Sellers can update their orders" ON orders
  FOR UPDATE USING (auth.uid() = seller_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_pet_id ON orders(pet_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON orders(razorpay_payment_id); 