
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const categoryTemplates = {
    "Breakfast": [
        "Royal Truffle Omelette", "Eggs Benedict Royale", "Belgian Berry Waffles", "Artisan Avocado Toast",
        "Smoked Salmon Bagel", "Greek Yogurt Parfait", "Shakshuka Heritage", "French Brioche Toast",
        "English Breakfast Platter", "Matcha Chia Pudding"
    ],
    "Italian": [
        "Truffle Mushroom Risotto", "Margherita Burrata Pizza", "Lobster Linguine", "Osso Buco alla Milanese",
        "Cacio e Pepe", "Spinach Ricotta Ravioli", "Prosciutto Crudo Pizza", "Lasagna Bolognese Classic",
        "Gnocchi in Sage Butter", "Seafood Fra Diavolo"
    ],
    "Asian": [
        "Dim Sum Platter", "Kung Pao Chicken", "Thai Green Curry", "Szechuan Pepper Beef",
        "Peking Duck Rolls", "Pad Thai Signature", "Nasi Goreng Special", "Laksa Lemak Bowl",
        "Honey Glazed Pork Belly", "Crispy Lotus Stem"
    ],
    "Indian": [
        "Old Delhi Butter Chicken", "Paneer Lababdar", "Hyderabadi Lamb Biryani", "Dal Makhani Heritage",
        "Kashmiri Rogan Josh", "Malai Kofta Signature", "Goan Fish Curry", "Tandoori Prawns",
        "Lucknowi Galouti Kebab", "Baingan Bharta Artisan"
    ],
    "Japanese": [
        "Dragon Roll Sushi", "Miso Ramen Heritage", "Wagyu Beef Tataki", "Tempura Moriawase",
        "Salmon Sashimi Selection", "Unagi Donburi", "Chicken Yakitori", "Black Cod Miso",
        "Soft Shell Crab Roll", "Matcha Soba Noodles"
    ],
    "Healthy": [
        "Quinoa Buddha Bowl", "Keto Grilled Salmon", "Detox Green Salad", "Acai Power Bowl",
        "Roasted Cauliflower Steak", "Zucchini Noodles Pesto", "Lentil Soup Wellness", "Tofu Poke Bowl",
        "Grilled Chicken Caesar (Lite)", "Ginger Turmeric Detox"
    ],
    "Quick Bites": [
        "Classic Club Sandwich", "Truffle Parmesan Fries", "Wagyu Sliders", "Chicken Tikka Wrap",
        "Crispy Calamari Rings", "Falafel Mezze", "Loaded Nachos Luxe", "Fish and Chips",
        "Grilled Cheese Panini", "Hummus & Pita Plate"
    ],
    "Hot Drinks": [
        "Signature Gold Latte", "Artisan Masala Chai", "Ethiopian Cold Brew", "Belgian Hot Chocolate",
        "Japanese Matcha Latte", "Earl Grey Heritage", "Turkish Coffee", "Chamomile Honey Tea",
        "Flat White Signature", "Cortado Classic"
    ],
    "Cakes & Pastries": [
        "Valrhona Chocolate Melt", "Saffron Milk Cake", "Red Velvet Heritage", "New York Cheesecake",
        "Classic Tiramisu", "Opera Cake", "Lemon Meringue Tart", "Almond Croissant",
        "Macaron Selection", "Blueberry Muffin Luxe"
    ],
    "Indian Sweets": [
        "Royal Gulab Jamun", "Kesar Rasmalai", "Gajar Halwa Artisan", "Moong Dal Halwa",
        "Rasgulla Heritage", "Kaju Katli Gold", "Jalebi with Rabri", "Phirni Classic",
        "Mysore Pak Signature", "Motichoor Laddoo"
    ],
    "Combo Meals": [
        "Couple Dinner Package", "Family Feast Platter", "Business Lunch Combo", "Continental Breakfast Box",
        "Indian Thali Royal", "Asian Bento Box", "Healthy Meal Plan Day", "Kids Party Pack",
        "Movie Night Combo", "Celebration Cake & Bubbles"
    ]
};

const images = [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=800"
];

async function massivePopulate() {
    console.log('--- RESETTING MENU ---');
    await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    const finalItems = [];
    
    Object.keys(categoryTemplates).forEach(category => {
        categoryTemplates[category].forEach((name, index) => {
            const rating = (4.4 + Math.random() * 0.6).toFixed(1);
            const time = (15 + Math.floor(Math.random() * 30)) + " min";
            const isVeg = Math.random() > 0.4 ? "Veg" : "Non-Veg";
            const tag = index === 0 ? "Chef's Pick" : (index === 1 ? "Bestseller" : (Math.random() > 0.8 ? "Trending" : ""));
            
            finalItems.push({
                name,
                category,
                price: 400 + Math.floor(Math.random() * 2000),
                is_popular: index < 2 || Math.random() > 0.85,
                image_url: images[Math.floor(Math.random() * images.length)],
                description: `DATA:{"rating":${rating},"time":"${time}","type":"${isVeg}","tag":"${tag}"} | Experience the ultimate luxury of ${name}, crafted with fresh ingredients and master techniques.`
            });
        });
    });

    // Add extra variety for remaining categories
    const extraCategories = ["Lunch", "Dinner", "Continental", "Mocktails", "Fresh Juices", "Ice Cream", "Soft Drinks", "Kids Menu"];
    extraCategories.forEach(cat => {
        for(let i=1; i<=8; i++) {
            const name = `${cat} Selection #${i}`;
            const rating = (4.5 + Math.random() * 0.5).toFixed(1);
            finalItems.push({
                name,
                category: cat,
                price: 500 + Math.floor(Math.random() * 1500),
                is_popular: Math.random() > 0.8,
                image_url: images[Math.floor(Math.random() * images.length)],
                description: `DATA:{"rating":${rating},"time":"25 min","type":"Veg","tag":""} | A premium selection from our ${cat} range, perfect for any time of the day.`
            });
        }
    });

    console.log(`--- INSERTING ${finalItems.length} DIVERSE ITEMS ---`);
    
    // Split into chunks to avoid potential payload limits
    for (let i = 0; i < finalItems.length; i += 50) {
        const chunk = finalItems.slice(i, i + 50);
        const { error } = await supabase.from('menu_items').insert(chunk);
        if (error) console.error('Insert Error:', error);
    }
    
    console.log('Massive menu diversity achieved!');
}

massivePopulate();
