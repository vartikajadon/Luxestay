const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function setupPartnerRestaurants() {
    console.log("Setting up Partner Restaurants DB...");

    // 1. Fetch all hotels from DB to map IDs
    const { data: hotels, error: hotelsError } = await supabase.from('hotels').select('*');
    if (hotelsError) {
        console.error("Error fetching hotels from Supabase:", hotelsError);
        console.log("\n❌ Please ensure you have created the tables by running the SQL in your Supabase SQL Editor first!");
        return;
    }

    console.log(`Found ${hotels.length} hotels. Creating partner restaurants...`);

    // Mapping of hotel name to restaurant name and address
    const restaurantMapping = {
        'Burj Al Arab Jumeirah': { name: 'Sky Emirate Dining', address: 'Floor 27, Burj Al Arab, Jumeirah, Dubai', cuisine: 'Fine Modern Arabic' },
        'Atlantis The Royal': { name: 'Arabian Pearl Kitchen', address: 'The Crescent, Palm Jumeirah, Dubai', cuisine: 'Authentic Seafood & Grill' },
        'Taj Lake Palace': { name: 'Royal Darbar Dining', address: 'Lake Pichola, Udaipur, Rajasthan, India', cuisine: 'Royal Mewari Heritage' },
        'Rambagh Palace': { name: 'Rajputana Shahi Dining', address: 'Bhawani Singh Road, Jaipur, Rajasthan, India', cuisine: 'Royal Rajasthani Thali' },
        'The Leela Palace': { name: 'Bhopal Lakeview Bistro', address: 'Lake View Road, Bhopal, Madhya Pradesh, India', cuisine: 'Nawabi & Continental' },
        'Armani Hotel Dubai': { name: 'Armani Lounge & Grill', address: 'Burj Khalifa, Downtown Dubai, UAE', cuisine: 'Luxury Italian-Japanese Fusion' },
        'Address Dubai Marina': { name: 'Marina Yacht Deck Grill', address: 'Dubai Marina Walk, Dubai, UAE', cuisine: 'Modern Seafood & Steaks' },
        'ITC Maurya': { name: 'Bukhara Legacy', address: 'Diplomatic Enclave, New Delhi, Delhi, India', cuisine: 'Traditional North-West Frontier' },
        'The Oberoi Mumbai': { name: 'Nariman Point Epicure', address: 'Marine Drive, Nariman Point, Mumbai, India', cuisine: 'Global Coastal & French' },
        'ITC Grand Chola': { name: 'Royal Madras Pavilion', address: 'Mount Road, Guindy, Chennai, India', cuisine: 'Traditional South Indian & Awadhi' },
        'W Goa': { name: 'Rockpool Club & Grill', address: 'Vagator Beach, Bardez, Goa, India', cuisine: 'Coastal Goa Fusion' },
        'Hôtel Plaza Athénée': { name: 'Plaza Courtyard Brasserie', address: 'Avenue Montaigne, Paris, France', cuisine: 'Michelin-starred French' },
        'The Savoy': { name: 'Savoy Grill Room', address: 'Strand, London, WC2R 0EU, UK', cuisine: 'Traditional British & French' },
        'Marina Bay Sands': { name: 'Sands Rooftop Bistro', address: 'Bayfront Avenue, Singapore', cuisine: 'Pan-Asian & Seafood' }
    };

    const insertedRestaurants = [];

    for (const hotel of hotels) {
        const mapping = restaurantMapping[hotel.hotel_name] || {
            name: `${hotel.hotel_name.split(' ')[0]} Golden Dining`,
            address: `${hotel.city}, ${hotel.country}`,
            cuisine: 'Global Epicurean'
        };

        // Check if partner restaurant already exists for this hotel
        const { data: existing, error: checkError } = await supabase
            .from('partner_restaurants')
            .select('*')
            .eq('hotel_id', hotel.id);

        if (checkError) {
            console.error(`Error querying partner_restaurants for ${hotel.hotel_name}:`, checkError.message);
            console.log("❌ Make sure you ran the SQL script in your Supabase SQL Editor!");
            return;
        }

        if (existing && existing.length > 0) {
            console.log(`Restaurant already exists for ${hotel.hotel_name}: ${existing[0].restaurant_name}`);
            insertedRestaurants.push(existing[0]);
        } else {
            console.log(`Inserting partner restaurant for ${hotel.hotel_name}: ${mapping.name}...`);
            const { data, error } = await supabase
                .from('partner_restaurants')
                .insert([{
                    hotel_id: hotel.id,
                    restaurant_name: mapping.name,
                    restaurant_address: mapping.address,
                    cuisine_type: mapping.cuisine
                }])
                .select();

            if (error) {
                console.error(`Error inserting for ${hotel.hotel_name}:`, error.message);
            } else if (data && data[0]) {
                insertedRestaurants.push(data[0]);
                console.log(`Successfully inserted: ${data[0].restaurant_name}`);
            }
        }
    }

    console.log("\nSeeding menu system. Each restaurant gets exactly 7 premium dishes.");
    console.log("Required 7 Famous Dishes:\n1. Butter Chicken\n2. Mutton Biryani\n3. Paneer Tikka\n4. Grilled Salmon\n5. Arabic Mixed Grill\n6. Pasta Alfredo\n7. Chocolate Lava Cake");

    // Dishes definitions
    const baseDishes = [
        {
            name: "Butter Chicken",
            price: 850,
            category: "Main Course",
            image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800",
            description: "DATA:{\"rating\":4.9,\"time\":\"20 min\",\"type\":\"Non-Veg\",\"tag\":\"Classic\"} | Tender boneless chicken in a velvety, rich tomato and butter cream sauce."
        },
        {
            name: "Mutton Biryani",
            price: 1200,
            category: "Signature",
            image_url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800",
            description: "DATA:{\"rating\":5.0,\"time\":\"25 min\",\"type\":\"Non-Veg\",\"tag\":\"Best Seller\"} | Fragrant long-grain basmati rice cooked with succulent lamb, saffron, and robust spices."
        },
        {
            name: "Paneer Tikka",
            price: 650,
            category: "Appetizer",
            image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800",
            description: "DATA:{\"rating\":4.8,\"time\":\"15 min\",\"type\":\"Veg\",\"tag\":\"Tandoor Classic\"} | Grilled cottage cheese skewers marinated in mustard oil, yogurt, and hot tandoori spices."
        },
        {
            name: "Grilled Salmon",
            price: 1550,
            category: "Main Course",
            image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800",
            description: "DATA:{\"rating\":4.9,\"time\":\"20 min\",\"type\":\"Non-Veg\",\"tag\":\"Healthy Luxury\"} | Fresh Atlantic salmon fillet grilled to perfection, served with asparagus and lemon-butter glaze."
        },
        {
            name: "Arabic Mixed Grill",
            price: 1800,
            category: "Signature",
            image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
            description: "DATA:{\"rating\":5.0,\"time\":\"25 min\",\"type\":\"Non-Veg\",\"tag\":\"Imperial Feast\"} | A royal selection of seekh kebab, shish taouk, and lamb chops with mint yogurt and garlic sauce."
        },
        {
            name: "Pasta Alfredo",
            price: 750,
            category: "Main Course",
            image_url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800",
            description: "DATA:{\"rating\":4.7,\"time\":\"15 min\",\"type\":\"Veg\",\"tag\":\"Italian Gourmet\"} | Creamy parmesan white sauce tossed with fettuccine pasta, fresh mushrooms, and garlic herbs."
        },
        {
            name: "Chocolate Lava Cake",
            price: 550,
            category: "Dessert",
            image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800",
            description: "DATA:{\"rating\":4.9,\"time\":\"10 min\",\"type\":\"Veg\",\"tag\":\"Warm Indulgence\"} | Rich Belgian chocolate cake with a warm, molten liquid gold center, served with vanilla bean gelato."
        }
    ];

    for (const restaurant of insertedRestaurants) {
        // Clear old specific menu items for this restaurant if any exist to prevent duplicates
        const { error: deleteError } = await supabase
            .from('menu_items')
            .delete()
            .eq('restaurant_id', restaurant.id);
        
        if (deleteError) {
            console.error(`Error clearing old menu for ${restaurant.restaurant_name}:`, deleteError.message);
        }

        const itemsToInsert = baseDishes.map(dish => ({
            name: dish.name,
            category: dish.category,
            price: dish.price,
            image_url: dish.image_url,
            description: dish.description,
            is_popular: dish.name === 'Mutton Biryani' || dish.name === 'Chocolate Lava Cake',
            restaurant_id: restaurant.id,
            hotel_id: restaurant.hotel_id
        }));

        const { data: menuData, error: menuInsertError } = await supabase
            .from('menu_items')
            .insert(itemsToInsert)
            .select();

        if (menuInsertError) {
            console.error(`Error inserting menu items for ${restaurant.restaurant_name}:`, menuInsertError.message);
        } else {
            console.log(`Seeded 7 famous dishes for: ${restaurant.restaurant_name}`);
        }
    }

    console.log("\n✨ Partner Restaurants Database Seeding Completed Successfully!");
}

setupPartnerRestaurants();
