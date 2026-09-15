const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const prDishes = [
    {
        name: "Deluxe Thali",
        price: 450,
        category: "Main Course",
        image_url: "https://www.shutterstock.com/shutterstock/photos/1593739531/display_1500/stock-photo-1593739531.jpg",
        description: "DATA:{\"rating\":4.9,\"time\":\"20 min\",\"type\":\"Veg\",\"tag\":\"Royal Feast\"} | A rich curation of seasonal curries, dal, rice, breads, salad, and dessert.",
        is_popular: true
    },
    {
        name: "Chole Bhature",
        price: 220,
        category: "Main Course",
        image_url: "https://www.shutterstock.com/shutterstock/photos/2714165479/display_1500/stock-photo-2714165479.jpg",
        description: "DATA:{\"rating\":4.8,\"time\":\"15 min\",\"type\":\"Veg\",\"tag\":\"Signature\"} | Spiced chickpeas served with fluffy, golden-fried leavened bread.",
        is_popular: true
    },
    {
        name: "Rajma Chawal",
        price: 200,
        category: "Main Course",
        image_url: "https://www.shutterstock.com/shutterstock/photos/1997399471/display_1500/stock-photo-1997399471.jpg",
        description: "DATA:{\"rating\":4.8,\"time\":\"15 min\",\"type\":\"Veg\",\"tag\":\"Comfort Food\"} | Slow-cooked red kidney beans in a rich spiced gravy, served with fragrant basmati rice.",
        is_popular: false
    },
    {
        name: "Kheer",
        price: 150,
        category: "Dessert",
        image_url: "https://www.shutterstock.com/shutterstock/photos/2491100411/display_1500/stock-photo-2491100411.jpg",
        description: "DATA:{\"rating\":4.7,\"time\":\"10 min\",\"type\":\"Veg\",\"tag\":\"Sweet Delicacy\"} | Slow-cooked basmati rice pudding infused with cardamoms, saffron, and loaded with dry fruits.",
        is_popular: false
    },
    {
        name: "Masala Chach",
        price: 80,
        category: "Appetizer",
        image_url: "https://www.shutterstock.com/shutterstock/photos/426285277/display_1500/stock-photo-426285277.jpg",
        description: "DATA:{\"rating\":4.6,\"time\":\"5 min\",\"type\":\"Veg\",\"tag\":\"Refreshing\"} | Spiced buttermilk churned with fresh mint, coriander, roasted cumin, and black salt.",
        is_popular: false
    }
];

async function seedPRMenu() {
    console.log("Seeding PR_Menu table with 5 signature dishes...");

    // Clear old PR_Menu items first
    const { error: deleteError } = await supabase
        .from('PR_Menu')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything cleanly

    if (deleteError) {
        console.warn("Could not delete from PR_Menu (it might be empty or table not created yet):", deleteError.message);
    }

    const { data, error } = await supabase
        .from('PR_Menu')
        .insert(prDishes)
        .select();

    if (error) {
        console.error("❌ Error seeding PR_Menu:", error.message);
        console.log("Please ensure you created the PR_Menu table by running the SQL in your Supabase SQL Editor first!");
    } else {
        console.log("✨ Successfully seeded 5 dishes in PR_Menu table:", data.map(d => d.name));
    }
}

seedPRMenu();
