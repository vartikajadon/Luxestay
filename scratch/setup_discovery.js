const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function setupDiscoveryDB() {
    console.log("Setting up Discovery Tables...");

    // 1. Create Hotels Table
    const { error: hotelTableError } = await supabase.rpc('execute_sql', {
        sql_query: `
            CREATE TABLE IF NOT EXISTS public.hotels (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                hotel_name TEXT UNIQUE NOT NULL,
                city TEXT NOT NULL,
                country TEXT NOT NULL,
                rating DECIMAL(2,1) DEFAULT 4.5,
                image_url TEXT,
                amenities TEXT[] DEFAULT '{}',
                price_per_night DECIMAL(10,2),
                description TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            ALTER TABLE public.hotels ADD CONSTRAINT unique_hotel_name UNIQUE (hotel_name);
            ALTER TABLE public.hotels DISABLE ROW LEVEL SECURITY;
        `
    });

    if (hotelTableError) {
        console.log("Note: Table creation RPC might have failed (this is common if 'execute_sql' isn't set up). Proceeding to insertion...");
    }

    // 2. Insert Sample Luxury Hotels
    const hotels = [
        { hotel_name: 'Burj Al Arab Jumeirah', city: 'Dubai', country: 'UAE', price_per_night: 2500, rating: 5.0, image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1400', amenities: ['Ultra-Luxury', 'Private Beach', 'World-class Dining'] },
        { hotel_name: 'Armani Hotel Dubai', city: 'Dubai', country: 'UAE', price_per_night: 1200, rating: 5.0, image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1400', amenities: ['Burj Khalifa View', 'Luxury Spa', 'Fine Dining'] },
        { hotel_name: 'Atlantis The Royal', city: 'Palm Jumeirah', country: 'UAE', price_per_night: 1800, rating: 5.0, image_url: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?q=80&w=1400', amenities: ['Waterpark Access', 'Private Beach', 'Michelin Chefs'] },
        { hotel_name: 'Address Dubai Marina', city: 'Dubai Marina', country: 'UAE', price_per_night: 950, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400', amenities: ['Infinity Pool', 'Marina View', 'Direct Mall Access'] },
        { hotel_name: 'Taj Lake Palace', city: 'Udaipur', country: 'India', price_per_night: 850, rating: 5.0, image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1400', amenities: ['Royal Heritage', 'Island Living', 'Bespoke Service'] },
        { hotel_name: 'The Leela Palace', city: 'Bhopal', country: 'India', price_per_night: 450, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1400', amenities: ['Lake View', 'Modern Luxury', 'Spa'] },
        { hotel_name: 'ITC Maurya', city: 'Delhi', country: 'India', price_per_night: 550, rating: 4.7, image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1400', amenities: ['Diplomatic Enclave', 'Award-winning Food', 'Eco-Luxury'] },
        { hotel_name: 'The Oberoi Mumbai', city: 'Mumbai', country: 'India', price_per_night: 650, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1400', amenities: ['Ocean View', '24/7 Butler', 'Piano Bar'] },
        { hotel_name: 'ITC Grand Chola', city: 'Chennai', country: 'India', price_per_night: 400, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400', amenities: ['Royal Architecture', 'Luxury Spa', 'Multiple Fine Dining'] },
        { hotel_name: 'Rambagh Palace', city: 'Jaipur', country: 'India', price_per_night: 1100, rating: 5.0, image_url: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1400', amenities: ['Historic Gardens', 'Royal Suites', 'Fine Dining'] },
        { hotel_name: 'W Goa', city: 'Goa', country: 'India', price_per_night: 700, rating: 4.8, image_url: 'https://images.unsplash.com/photo-1582653280603-eb5ad16f0039?q=80&w=1400', amenities: ['Beachfront', 'Nightlife', 'Wellness'] },
        { hotel_name: 'Hôtel Plaza Athénée', city: 'Paris', country: 'France', price_per_night: 1500, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400', amenities: ['Eiffel Tower View', 'Haute Couture Style', 'Michelin Dining'] },
        { hotel_name: 'The Savoy', city: 'London', country: 'UK', price_per_night: 1300, rating: 4.9, image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1400', amenities: ['Thames View', 'Afternoon Tea', 'Butler Service'] },
        { hotel_name: 'Marina Bay Sands', city: 'Singapore', country: 'Singapore', price_per_night: 1200, rating: 5.0, image_url: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=80&w=1400', amenities: ['Infinity Pool', 'SkyPark', 'Luxury Shopping'] }
    ];

    console.log("Checking for existing hotels...");
    const { data: existingHotels, error: fetchError } = await supabase.from('hotels').select('hotel_name');
    
    if (fetchError) {
        console.error("Error fetching existing hotels:", fetchError);
        return;
    }

    const existingNames = new Set((existingHotels || []).map(h => h.hotel_name));
    const toInsert = hotels.filter(h => !existingNames.has(h.hotel_name));

    if (toInsert.length > 0) {
        console.log(`Inserting ${toInsert.length} new hotels...`);
        const { error: insertError } = await supabase.from('hotels').insert(toInsert);
        if (insertError) console.error("Error inserting hotels:", insertError);
        else console.log("New hotels populated successfully!");
    } else {
        console.log("All hotels already exist in the database.");
    }
}

setupDiscoveryDB();
