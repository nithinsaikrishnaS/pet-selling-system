CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  species VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  age_years INT,
  age_months INT,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  image_url TEXT,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to view pets (public access)
CREATE POLICY "Anyone can view pets" ON pets
  FOR SELECT USING (true);

-- Policy for authenticated users to insert their own pets
CREATE POLICY "Authenticated users can insert their own pets" ON pets
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Policy for authenticated users to update their own pets
CREATE POLICY "Authenticated users can update their own pets" ON pets
  FOR UPDATE USING (auth.uid() = seller_id);

-- Policy for authenticated users to delete their own pets
CREATE POLICY "Authenticated users can delete their own pets" ON pets
  FOR DELETE USING (auth.uid() = seller_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_breed ON pets(breed);
CREATE INDEX IF NOT EXISTS idx_pets_price ON pets(price);
CREATE INDEX IF NOT EXISTS idx_pets_created_at ON pets(created_at);
