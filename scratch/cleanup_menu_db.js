const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runCleanup() {
    console.log("Starting menu database cleanup process...");

    // 1. Delete complete categories: Thai, Healthy, Kids Menu, Quick Bites, Mocktails
    const categoriesToDelete = ['Thai', 'Healthy', 'Kids Menu', 'Quick Bites', 'Mocktails'];
    for (const cat of categoriesToDelete) {
        console.log(`Deleting category: ${cat}`);
        const { error } = await supabase.from('menu_items').delete().eq('category', cat);
        if (error) console.error(`Error deleting category ${cat}:`, error);
    }

    // 2. In Indian section: delete Hyderabadi Lamb Biryani, Goan Fish Curry, Tandoori Prawns
    const indianDishesToDelete = [
        'Hyderabadi Lamb Biryani',
        'Hyderabadi Dum Biryani Royale',
        'Goan Fish Curry',
        'Tandoori Prawns'
    ];
    for (const dish of indianDishesToDelete) {
        console.log(`Deleting Indian dish: ${dish}`);
        const { error } = await supabase.from('menu_items').delete().eq('name', dish);
        if (error) console.error(`Error deleting ${dish}:`, error);
    }

    // 3. In Hot Drinks: delete Artisan Masala Chai, Ethiopian Cold Brew, Earl Grey Heritage, Turkish Coffee, Chamomile Honey Tea
    const hotDrinksToDelete = [
        'Artisan Masala Chai',
        'Ethiopian Cold Brew',
        'Earl Grey Heritage',
        'Turkish Coffee',
        'Chamomile Honey Tea'
    ];
    for (const drink of hotDrinksToDelete) {
        console.log(`Deleting Hot Drink: ${drink}`);
        const { error } = await supabase.from('menu_items').delete().eq('name', drink);
        if (error) console.error(`Error deleting ${drink}:`, error);
    }

    // 4. In Fresh Juices: keep only 4 high-quality options, delete the rest
    // Let's first delete all items in Fresh Juices category
    console.log("Resetting Fresh Juices category to exactly 4 premium options...");
    await supabase.from('menu_items').delete().eq('category', 'Fresh Juices');

    const freshJuicesToKeep = [
        {
            name: "Valencia Orange Juice Royale",
            category: "Fresh Juices",
            price: 1800,
            is_popular: true,
            image_url: "https://www.shutterstock.com/shutterstock/photos/2183577317/display_1500/stock-photo-2183577317.jpg",
            description: 'DATA:{"rating":4.9,"time":"5 min","type":"Veg","tag":"Pure"} | Cold-pressed organic Valencia oranges without added sugar.'
        },
        {
            name: "Watermelon Hydration Royale",
            category: "Fresh Juices",
            price: 1650,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1013711905/display_1500/stock-photo-1013711905.jpg",
            description: 'DATA:{"rating":4.9,"time":"5 min","type":"Veg","tag":"Fresh"} | 100% pure cold-pressed organic watermelon juice.'
        },
        {
            name: "Pomegranate Power Luxe",
            category: "Fresh Juices",
            price: 2800,
            is_popular: true,
            image_url: "https://www.shutterstock.com/shutterstock/photos/2223403273/display_1500/stock-photo-2223403273.jpg",
            description: 'DATA:{"rating":4.9,"time":"10 min","type":"Veg","tag":"Superfood"} | Freshly hand-pressed premium organic pomegranate seeds.'
        },
        {
            name: "Green Glow Detox Elixir",
            category: "Fresh Juices",
            price: 2200,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1482937943/display_1500/stock-photo-1482937943.jpg",
            description: 'DATA:{"rating":4.8,"time":"8 min","type":"Veg","tag":"Healthy"} | Organic cucumber, mint, spinach, and ginger cold-pressed juice.'
        }
    ];

    const { error: juiceError } = await supabase.from('menu_items').insert(freshJuicesToKeep);
    if (juiceError) console.error("Error inserting fresh juices:", juiceError);

    // 5. In Cakes & Pastries: keep only 5 high-quality options, delete the rest
    console.log("Resetting Cakes & Pastries category to exactly 5 premium options...");
    await supabase.from('menu_items').delete().eq('category', 'Cakes & Pastries');

    const cakesToKeep = [
        {
            name: "Opera Cake Royale",
            category: "Cakes & Pastries",
            price: 2800,
            is_popular: true,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1761614945/display_1500/stock-photo-1761614945.jpg",
            description: 'DATA:{"rating":4.9,"time":"15 min","type":"Veg","tag":"Signature"} | Layers of almond sponge, coffee cream, and 24k gold-dust chocolate.'
        },
        {
            name: "Red Velvet Signature Luxe",
            category: "Cakes & Pastries",
            price: 2400,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/2256950245/display_1500/stock-photo-2256950245.jpg",
            description: 'DATA:{"rating":4.8,"time":"10 min","type":"Veg","tag":"Popular"} | Velvety red cocoa cake with premium manuka cream cheese frosting.'
        },
        {
            name: "Blueberry Cheesecake Royale",
            category: "Cakes & Pastries",
            price: 3200,
            is_popular: true,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1913983273/display_1500/stock-photo-1913983273.jpg",
            description: 'DATA:{"rating":4.9,"time":"12 min","type":"Veg","tag":"Bestseller"} | New York style cheesecake with wild foraged blueberry compote.'
        },
        {
            name: "Tiramisu Classic Royale",
            category: "Cakes & Pastries",
            price: 2800,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/2186851211/display_1500/stock-photo-2186851211.jpg",
            description: 'DATA:{"rating":4.9,"time":"15 min","type":"Veg","tag":""} | Coffee-soaked ladyfingers with organic mascarpone and rare cocoa.'
        },
        {
            name: "Almond Croissant Royale",
            category: "Cakes & Pastries",
            price: 1950,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1852932403/display_1500/stock-photo-1852932403.jpg",
            description: 'DATA:{"rating":4.8,"time":"10 min","type":"Veg","tag":""} | Flaky French butter croissant filled and topped with toasted almond frangipane.'
        }
    ];

    const { error: cakeError } = await supabase.from('menu_items').insert(cakesToKeep);
    if (cakeError) console.error("Error inserting cakes:", cakeError);

    // 6. In Indian Sweets: keep only 5 sweets, delete the rest
    console.log("Resetting Indian Sweets category to exactly 5 premium options...");
    await supabase.from('menu_items').delete().eq('category', 'Indian Sweets');

    const sweetsToKeep = [
        {
            name: "Gulab Jamun with Rabri Royale",
            category: "Indian Sweets",
            price: 1850,
            is_popular: true,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1899124405/display_1500/stock-photo-1899124405.jpg",
            description: 'DATA:{"rating":4.9,"time":"10 min","type":"Veg","tag":"Heritage"} | Organic milk dumplings in rose syrup with thickened heritage milk.'
        },
        {
            name: "Kesari Rasmalai Royale",
            category: "Indian Sweets",
            price: 1950,
            is_popular: true,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1803403243/display_1500/stock-photo-1803403243.jpg",
            description: 'DATA:{"rating":4.9,"time":"10 min","type":"Veg","tag":"Bestseller"} | Saffron-infused artisan cottage cheese discs in sweetened milk.'
        },
        {
            name: "Gajar Ka Halwa Artisan",
            category: "Indian Sweets",
            price: 2100,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1899124402/display_1500/stock-photo-1899124402.jpg",
            description: 'DATA:{"rating":4.8,"time":"15 min","type":"Veg","tag":"Seasonal"} | Slow-cooked organic carrot pudding with rare nuts and pure desi ghee.'
        },
        {
            name: "Kaju Katli Gold",
            category: "Indian Sweets",
            price: 4500,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/1844910245/display_1500/stock-photo-1844910245.jpg",
            description: 'DATA:{"rating":4.7,"time":"5 min","type":"Veg","tag":"Gift"} | A premium curation of traditional cashew sweets layered with pure gold leaf.'
        },
        {
            name: "Jalebi with Rabri Royale",
            category: "Indian Sweets",
            price: 1950,
            is_popular: false,
            image_url: "https://www.shutterstock.com/shutterstock/photos/2186950243/display_1500/stock-photo-2186950243.jpg",
            description: 'DATA:{"rating":4.8,"time":"12 min","type":"Veg","tag":""} | Crispy hot saffron jalebis served with rich, condensed cardamom rabri.'
        }
    ];

    const { error: sweetsError } = await supabase.from('menu_items').insert(sweetsToKeep);
    if (sweetsError) console.error("Error inserting sweets:", sweetsError);

    console.log("Database cleanup completed successfully!");
}

runCleanup();
