-- Create Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hotel_id TEXT UNIQUE, -- Professional Property Code
    hotel_name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    price_per_night NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 4.5,
    image_url TEXT,
    amenities TEXT[],
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Curated Data
INSERT INTO hotels (hotel_id, hotel_name, city, country, price_per_night, rating, image_url, amenities, latitude, longitude)
VALUES 
-- Dubai (Primary Focus)
('UAE-DUBAI-ARM', 'Armani Hotel Dubai', 'Dubai', 'UAE', 1200, 5.0, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400', ARRAY['Burj Khalifa View', 'Luxury Spa', 'Fine Dining'], 25.1972, 55.2744),
('UAE-DUBAI-ATL', 'Atlantis The Royal', 'Palm Jumeirah', 'UAE', 1800, 5.0, 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=1400', ARRAY['Waterpark Access', 'Private Beach', 'Michelin Chefs'], 25.1380, 55.1200),
('UAE-DUBAI-ADD', 'Address Dubai Marina', 'Dubai Marina', 'UAE', 950, 4.9, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400', ARRAY['Infinity Pool', 'Marina View', 'Direct Mall Access'], 25.0780, 55.1400),

-- India
('IND-UDA-TAJ', 'Taj Lake Palace', 'Udaipur', 'India', 850, 5.0, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1400', ARRAY['Royal Heritage', 'Island Living', 'Bespoke Service'], 24.5756, 73.6800),
('IND-BHO-LEE', 'The Leela Palace', 'Bhopal', 'India', 450, 4.8, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1400', ARRAY['Lake View', 'Modern Luxury', 'Spa'], 23.2300, 77.4300),
('IND-DEL-ITC', 'ITC Maurya', 'Delhi', 'India', 550, 4.7, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1400', ARRAY['Diplomatic Enclave', 'Award-winning Food', 'Eco-Luxury'], 28.5975, 77.1700),
('IND-MUM-OBE', 'The Oberoi Mumbai', 'Mumbai', 'India', 650, 4.9, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1400', ARRAY['Ocean View', '24/7 Butler', 'Piano Bar'], 18.9275, 72.8200),
('IND-JAI-RAM', 'Rambagh Palace', 'Jaipur', 'India', 1100, 5.0, 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1400', ARRAY['Historic Gardens', 'Royal Suites', 'Fine Dining'], 26.8970, 75.8080),
('IND-GOA-W', 'W Goa', 'Goa', 'India', 700, 4.8, 'https://images.unsplash.com/photo-1582653280603-eb5ad16f0039?q=80&w=1400', ARRAY['Beachfront', 'Nightlife', 'Wellness'], 15.5970, 73.7350),

-- International
('FRA-PAR-PLA', 'Hôtel Plaza Athénée', 'Paris', 'France', 1500, 4.9, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400', ARRAY['Eiffel Tower View', 'Haute Couture Style', 'Michelin Dining'], 48.8667, 2.3015),
('UK-LON-SAV', 'The Savoy', 'London', 'UK', 1300, 4.9, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1400', ARRAY['Thames View', 'Afternoon Tea', 'Butler Service'], 51.5100, -0.1200),
('SGP-SGP-MBS', 'Marina Bay Sands', 'Singapore', 'Singapore', 1200, 5.0, 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1400', ARRAY['Infinity Pool', 'SkyPark', 'Luxury Shopping'], 1.2830, 103.8600);
