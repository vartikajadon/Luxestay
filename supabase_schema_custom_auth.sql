-- LuxeStay Custom Auth Schema (Nodemailer Based)
-- This schema removes dependencies on Supabase Auth (auth.users)

-- 1. Profiles Table (Keyed by Email)
CREATE TABLE IF NOT EXISTS public.profiles (
  email TEXT PRIMARY KEY,
  full_name TEXT,
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Silver',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT REFERENCES public.profiles(email) ON DELETE CASCADE NOT NULL,
  hotel_name TEXT NOT NULL,
  room_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders (Dining) Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT REFERENCES public.profiles(email) ON DELETE CASCADE NOT NULL,
  items TEXT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'preparing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT REFERENCES public.profiles(email) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for custom auth or set to allow all (since we handle security in backend/session)
-- In a real prod app, you would use a secret header or similar to secure these requests.
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- 5. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT REFERENCES public.profiles(email) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'general', 'spa', 'dining', 'experience'
  note TEXT,
  scheduled_time TIMESTAMPTZ,
  price DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- Breakfast, Lunch, Dinner, Beverages
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;

-- Sample Data
INSERT INTO public.menu_items (name, category, price, description, image_url, is_popular) VALUES
('Classic Eggs Benedict', 'Breakfast', 650, 'Poached eggs on toasted English muffin with hollandaise sauce.', 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?auto=format&fit=crop&q=80', true),
('Avocado Sourdough Toast', 'Breakfast', 550, 'Crushed avocado, radish, and feta on artisanal sourdough.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80', false),
('Gourmet Wagyu Burger', 'Lunch', 1250, 'Truffle aioli, aged cheddar, and caramelized onions.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80', true),
('Caesar Salad with Prawns', 'Lunch', 850, 'Crisp romaine, garlic croutons, and grilled tiger prawns.', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80', false),
('Pan-Seared Sea Bass', 'Dinner', 1850, 'Asparagus risotto, lemon caper butter, and micro greens.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80', true),
('Black Truffle Pasta', 'Dinner', 2100, 'Handmade fettuccine with fresh shavings of Italian black truffle.', 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80', false),
('Signature Gold Latte', 'Beverages', 450, 'Rich espresso with edible gold leaf and velvet foam.', 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80', true),
('Fresh Berries Mocktail', 'Beverages', 400, 'Muddled forest berries with sparkling soda and lime.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80', false);
