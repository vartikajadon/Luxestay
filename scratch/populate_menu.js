
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const menuItems = [
    // Breakfast
    { name: 'Royal Truffle Omelette', category: 'Breakfast', price: 850, description: 'Cage-free eggs with black truffle shavings and aged parmesan.', image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800', is_popular: true },
    { name: 'Artisan Avocado Toast', category: 'Breakfast', price: 650, description: 'Sourdough bread with heirloom tomatoes and toasted seeds.', image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800', is_popular: false },
    { name: 'Belgian Berry Waffles', category: 'Breakfast', price: 750, description: 'Fluffy waffles with maple syrup and seasonal forest berries.', image_url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=800', is_popular: false },
    { name: 'Eggs Benedict Royale', category: 'Breakfast', price: 950, description: 'Poached eggs with smoked salmon and hollandaise sauce.', image_url: 'https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=800', is_popular: true },

    // Lunch
    { name: 'Pan-Seared Sea Bass', category: 'Lunch', price: 1850, description: 'Fresh catch with lemon butter sauce and seasonal greens.', image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800', is_popular: true },
    { name: 'Wagyu Beef Burger', category: 'Lunch', price: 1250, description: 'Premium Wagyu beef with caramelized onions and truffle mayo.', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800', is_popular: false },
    { name: 'Heirloom Tomato Salad', category: 'Lunch', price: 850, description: 'Fresh tomatoes with burrata cheese and basil pesto.', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800', is_popular: false },
    { name: 'Saffron Risotto', category: 'Lunch', price: 1150, description: 'Creamy Arborio rice with saffron threads and roasted asparagus.', image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800', is_popular: true },

    // Dinner
    { name: 'Butter-Poached Lobster', category: 'Dinner', price: 2450, description: 'Maine lobster tail with garlic herb butter and baby potatoes.', image_url: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?q=80&w=800', is_popular: true },
    { name: 'Filet Mignon', category: 'Dinner', price: 2150, description: 'Prime beef tenderloin with red wine reduction and mash.', image_url: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=800', is_popular: true },
    { name: 'Roasted Lamb Chops', category: 'Dinner', price: 1950, description: 'Herb-crusted lamb with mint jus and glazed carrots.', image_url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?q=80&w=800', is_popular: false },
    { name: 'Wild Mushroom Pasta', category: 'Dinner', price: 1350, description: 'Homemade tagliatelle with porcini mushrooms and cream.', image_url: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800', is_popular: false },

    // Beverages
    { name: 'Signature Gold Latte', category: 'Beverages', price: 450, description: 'Espresso with 24k gold leaf and velvet milk.', image_url: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800', is_popular: true },
    { name: 'Freshly Pressed Juice', category: 'Beverages', price: 350, description: 'Daily selection of fresh seasonal fruits.', image_url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b4?q=80&w=800', is_popular: false },
    { name: 'Vintage Wine Selection', category: 'Beverages', price: 1250, description: 'Curated premium wine by the glass.', image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800', is_popular: false },
    { name: 'Iced Artisan Tea', category: 'Beverages', price: 380, description: 'Hand-picked tea leaves brewed with honey and mint.', image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800', is_popular: false },

    // Desserts
    { name: 'Valrhona Chocolate Melt', category: 'Desserts', price: 650, description: 'Warm lava cake with vanilla bean gelato.', image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800', is_popular: true },
    { name: 'Saffron Milk Cake', category: 'Desserts', price: 550, description: 'Soft sponge soaked in saffron-infused cream.', image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800', is_popular: false },
    { name: 'Tiramisu Heritage', category: 'Desserts', price: 620, description: 'Classic Italian dessert with espresso and mascarpone.', image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800', is_popular: false },
    { name: 'Seasonal Fruit Tart', category: 'Desserts', price: 580, description: 'Crisp pastry with crème pâtissière and glazed fruits.', image_url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=800', is_popular: true }
];

async function populateMenu() {
    console.log('Clearing old menu...');
    await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('Inserting new premium menu...');
    const { data, error } = await supabase.from('menu_items').insert(menuItems);
    
    if (error) console.error('Error:', error);
    else console.log('Menu populated successfully with 20 premium items!');
}

populateMenu();
