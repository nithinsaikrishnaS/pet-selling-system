-- This script assumes you have some users in auth.users table.
-- For demonstration, we'll use a placeholder UUID for seller_id.
-- In a real application, you'd get the actual user ID.

-- You can get a user's UUID from the auth.users table in your Supabase dashboard
-- or by signing up a user through the application.
-- For now, let's use a dummy UUID. Replace 'YOUR_DUMMY_USER_UUID' with an actual user ID
-- from your Supabase auth.users table if you want to test RLS.

INSERT INTO pets (name, species, breed, age_years, age_months, price, description, image_url, seller_id) VALUES 
(
  'Buddy', 'Dog', 'Golden Retriever', 2, 6, 850.00,
  'Friendly and energetic Golden Retriever, great with kids and other pets.',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Whiskers', 'Cat', 'Siamese', 1, 8, 400.00,
  'Beautiful Siamese cat with striking blue eyes and playful personality.',
  'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Polly', 'Bird', 'Macaw', 3, 0, 1200.00,
  'Colorful and talkative Macaw parrot, knows several words and phrases.',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Luna', 'Cat', 'Persian', 2, 3, 600.00,
  'Fluffy Persian cat with long silky hair, very calm and affectionate.',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Max', 'Dog', 'Pomeranian', 1, 4, 680.00,
  'Small and adorable Pomeranian puppy, perfect for apartment living.',
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Coco', 'Rabbit', 'Holland Lop', 0, 8, 150.00,
  'Cute Holland Lop rabbit with floppy ears, very gentle and friendly.',
  'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Charlie', 'Dog', 'Beagle', 3, 2, 550.00,
  'Friendly Beagle with excellent temperament, loves walks and playing fetch.',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Bella', 'Cat', 'Maine Coon', 4, 1, 750.00,
  'Large and majestic Maine Coon cat, very social and loves attention.',
  'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Rocky', 'Dog', 'Rottweiler', 4, 0, 35000.00,
  'Strong and loyal Rottweiler, well-trained and great with family. Excellent guard dog.',
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Milo', 'Dog', 'Shih Tzu', 2, 0, 16000.00,
  'Gentle Shih Tzu with beautiful long coat. Very calm and perfect for apartments.',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Daisy', 'Dog', 'Cocker Spaniel', 3, 0, 24000.00,
  'Beautiful Cocker Spaniel with silky coat. Very gentle and great with kids.',
  'https://images.unsplash.com/photo-1551717743499-5800b1f65585?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Oscar', 'Dog', 'Bulldog', 2, 0, 28000.00,
  'Friendly English Bulldog with great personality. Loves attention and is very social.',
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Mittens', 'Cat', 'Maine Coon', 2, 0, 19000.00,
  'Large and fluffy Maine Coon cat. Very gentle giant, great with families.',
  'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
),
(
  'Shadow', 'Dog', 'Siberian Husky', 3, 0, 32000.00,
  'Beautiful Siberian Husky with striking blue eyes. Very active and loves outdoor activities.',
  'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', uuid_generate_v4()
);
