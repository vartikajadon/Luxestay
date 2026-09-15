
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const menuItems = [
    // --- BREAKFAST ---
    { 
        name: 'Royal Truffle Omelette', category: 'Breakfast', price: 850, is_popular: true,
        description: 'DATA:{"rating":4.9,"time":"15 min","type":"Veg","tag":"Chef\'s Pick"} | Cage-free eggs with black truffle shavings and aged parmesan.',
        image_url: 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Eggs Benedict Royale', category: 'Breakfast', price: 950, is_popular: true,
        description: 'DATA:{"rating":4.8,"time":"20 min","type":"Non-Veg","tag":"Bestseller"} | Poached eggs with smoked salmon and hollandaise sauce.',
        image_url: 'https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- ITALIAN ---
    { 
        name: 'Truffle Mushroom Risotto', category: 'Italian', price: 1250, is_popular: true,
        description: 'DATA:{"rating":4.7,"time":"30 min","type":"Veg","tag":"Signature"} | Creamy Arborio rice with wild porcini mushrooms and truffle oil.',
        image_url: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Margherita Burrata Pizza', category: 'Italian', price: 1100, is_popular: false,
        description: 'DATA:{"rating":4.6,"time":"25 min","type":"Veg","tag":""} | Hand-stretched dough with San Marzano tomatoes and fresh burrata.',
        image_url: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- ASIAN ---
    { 
        name: 'Dim Sum Platter', category: 'Asian', price: 950, is_popular: true,
        description: 'DATA:{"rating":4.8,"time":"20 min","type":"Non-Veg","tag":"Recommended"} | Assorted crystal dumplings with shrimp and water chestnuts.',
        image_url: 'https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Kung Pao Chicken', category: 'Asian', price: 850, is_popular: false,
        description: 'DATA:{"rating":4.5,"time":"25 min","type":"Non-Veg","tag":""} | Classic Sichuan style with peanuts and dry chilies.',
        image_url: 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- JAPANESE ---
    { 
        name: 'Dragon Roll Sushi', category: 'Japanese', price: 1450, is_popular: true,
        description: 'DATA:{"rating":4.9,"time":"35 min","type":"Non-Veg","tag":"Chef\'s Pick"} | Shrimp tempura, cucumber, topped with avocado and unagi sauce.',
        image_url: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Miso Ramen Heritage', category: 'Japanese', price: 980, is_popular: false,
        description: 'DATA:{"rating":4.7,"time":"30 min","type":"Non-Veg","tag":""} | 12-hour broth with chashu pork, soy-marinated egg and nori.',
        image_url: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- INDIAN ---
    { 
        name: 'Old Delhi Butter Chicken', category: 'Indian', price: 950, is_popular: true,
        description: 'DATA:{"rating":4.9,"time":"30 min","type":"Non-Veg","tag":"Legendary"} | Char-grilled chicken in a rich, creamy tomato gravy.',
        image_url: 'https://images.pexels.com/photos/2611917/pexels-photo-2611917.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Paneer Lababdar', category: 'Indian', price: 820, is_popular: false,
        description: 'DATA:{"rating":4.6,"time":"25 min","type":"Veg","tag":""} | Cottage cheese cubes in a tangy onion-tomato masala.',
        image_url: 'https://images.pexels.com/photos/3928854/pexels-photo-3928854.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- HEALTHY ---
    { 
        name: 'Quinoa Buddha Bowl', category: 'Healthy', price: 780, is_popular: true,
        description: 'DATA:{"rating":4.7,"time":"20 min","type":"Vegan","tag":"Healthy Choice"} | Organic quinoa, roasted chickpeas, kale and tahini dressing.',
        image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Keto Grilled Salmon', category: 'Healthy', price: 1650, is_popular: false,
        description: 'DATA:{"rating":4.8,"time":"30 min","type":"Non-Veg","tag":"Keto"} | Atlantic salmon with cauliflower mash and lemon asparagus.',
        image_url: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- QUICK BITES ---
    { 
        name: 'Classic Club Sandwich', category: 'Quick Bites', price: 650, is_popular: false,
        description: 'DATA:{"rating":4.4,"time":"15 min","type":"Non-Veg","tag":""} | Triple-decker with grilled chicken, bacon, lettuce and tomato.',
        image_url: 'https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Truffle Parmesan Fries', category: 'Quick Bites', price: 450, is_popular: true,
        description: 'DATA:{"rating":4.8,"time":"10 min","type":"Veg","tag":"Trending"} | Double-fried potatoes with truffle salt and aged parmesan.',
        image_url: 'https://images.pexels.com/photos/115740/pexels-photo-115740.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- KIDS MENU ---
    { 
        name: 'Mini Cheesy Pizza', category: 'Kids Menu', price: 480, is_popular: false,
        description: 'DATA:{"rating":4.9,"time":"20 min","type":"Veg","tag":"Kids Favorite"} | Thin crust pizza with extra mozzarella and zero spice.',
        image_url: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- DRINKS ---
    { 
        name: 'Signature Gold Latte', category: 'Hot Drinks', price: 450, is_popular: true,
        description: 'DATA:{"rating":4.9,"time":"10 min","type":"Veg","tag":"Must Try"} | Espresso with 24k gold leaf and velvet milk.',
        image_url: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Exotic Fruit Mocktail', category: 'Mocktails', price: 550, is_popular: false,
        description: 'DATA:{"rating":4.6,"time":"15 min","type":"Veg","tag":""} | Blend of passionfruit, orange and elderflower syrup.',
        image_url: 'https://images.pexels.com/photos/605408/pexels-photo-605408.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- DESSERTS ---
    { 
        name: 'Valrhona Chocolate Melt', category: 'Cakes & Pastries', price: 650, is_popular: true,
        description: 'DATA:{"rating":4.9,"time":"20 min","type":"Veg","tag":"Sinful"} | Warm lava cake with vanilla bean gelato.',
        image_url: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
        name: 'Royal Gulab Jamun', category: 'Indian Sweets', price: 420, is_popular: true,
        description: 'DATA:{"rating":4.8,"time":"10 min","type":"Veg","tag":"Traditional"} | Saffron infused milk dumplings in rose syrup.',
        image_url: 'https://images.pexels.com/photos/2092906/pexels-photo-2092906.jpeg?auto=compress&cs=tinysrgb&w=800'
    },

    // --- COMBOS ---
    { 
        name: 'Couple Dinner Package', category: 'Combo Meals', price: 4500, is_popular: true,
        description: 'DATA:{"rating":5.0,"time":"45 min","type":"Non-Veg","tag":"Limited Edition"} | 3-course meal for two with a bottle of sparkling wine.',
        image_url: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
];

// Add more items to reach 60+
const categories = ['Italian', 'Asian', 'Indian', 'Continental', 'Japanese', 'Chef\'s Specials', 'Signature Dishes', 'Healthy', 'Quick Bites', 'Kids Menu', 'Hot Drinks', 'Fresh Juices', 'Mocktails', 'Soft Drinks', 'Cakes & Pastries', 'Ice Cream', 'Indian Sweets', 'Combo Meals'];

categories.forEach(cat => {
    // Ensure each category has at least 3-4 items
    const existingCount = menuItems.filter(i => i.category === cat).length;
    for(let i=existingCount; i<4; i++) {
        menuItems.push({
            name: `${cat} Delight ${i+1}`,
            category: cat,
            price: 500 + (Math.random() * 1000),
            is_popular: Math.random() > 0.7,
            description: `DATA:{"rating":${(4 + Math.random()).toFixed(1)},"time":"25 min","type":"Veg","tag":""} | Experience the finest ${cat} flavors curated by our master chefs.`,
            image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
        });
    }
});

async function populate() {
    console.log('--- RESETTING MENU ---');
    await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log(`--- INSERTING ${menuItems.length} ITEMS ---`);
    const { data, error } = await supabase.from('menu_items').insert(menuItems).select();
    
    if (error) console.error('Error:', error);
    else console.log('Successfully populated massive premium menu!');
}

populate();
