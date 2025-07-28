-- Add additional columns to pets table for better functionality
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'status') THEN
        ALTER TABLE pets ADD COLUMN status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending'));
    END IF;
    
    -- Add contact_phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'contact_phone') THEN
        ALTER TABLE pets ADD COLUMN contact_phone VARCHAR(20);
    END IF;
    
    -- Add contact_email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'contact_email') THEN
        ALTER TABLE pets ADD COLUMN contact_email VARCHAR(255);
    END IF;
    
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'location') THEN
        ALTER TABLE pets ADD COLUMN location VARCHAR(255);
    END IF;
    
    -- Add seller_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'seller_name') THEN
        ALTER TABLE pets ADD COLUMN seller_name VARCHAR(100);
    END IF;
    
    -- Add gender column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'gender') THEN
        ALTER TABLE pets ADD COLUMN gender VARCHAR(10) CHECK (gender IN ('Male', 'Female'));
    END IF;
    
    -- Add vaccination_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'vaccination_status') THEN
        ALTER TABLE pets ADD COLUMN vaccination_status BOOLEAN DEFAULT false;
    END IF;
    
    -- Add neutered column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pets' AND column_name = 'neutered') THEN
        ALTER TABLE pets ADD COLUMN neutered BOOLEAN DEFAULT false;
    END IF;
    
    -- Update existing records to have available status
    UPDATE pets SET status = 'available' WHERE status IS NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_breed ON pets(breed);
CREATE INDEX IF NOT EXISTS idx_pets_price ON pets(price);
CREATE INDEX IF NOT EXISTS idx_pets_location ON pets(location);
CREATE INDEX IF NOT EXISTS idx_pets_status ON pets(status);
CREATE INDEX IF NOT EXISTS idx_pets_created_at ON pets(created_at);
CREATE INDEX IF NOT EXISTS idx_pets_gender ON pets(gender);
CREATE INDEX IF NOT EXISTS idx_pets_seller_id ON pets(seller_id);
