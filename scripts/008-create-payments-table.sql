-- Create payments table for storing payment transaction information
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  razorpay_payment_id VARCHAR(255) UNIQUE NOT NULL,
  razorpay_order_id VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  bank VARCHAR(100),
  wallet VARCHAR(100),
  vpa VARCHAR(100),
  email VARCHAR(255),
  contact VARCHAR(20),
  fee NUMERIC(10, 2),
  tax NUMERIC(10, 2),
  error_code VARCHAR(50),
  error_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy for users to view payments for their orders
CREATE POLICY "Users can view payments for their orders" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- Policy for service role to manage payments (needed for webhooks)
CREATE POLICY "Service role can manage payments" ON payments
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at); 