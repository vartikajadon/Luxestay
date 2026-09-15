
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const dishImages = {
    // Breakfast
    "Royal Truffle Omelette": "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    "Eggs Benedict Royale": "https://images.unsplash.com/photo-1600335895229-6e75511892c8?q=80&w=800",
    "Belgian Berry Waffles": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?q=80&w=800",
    "Artisan Avocado Toast": "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800",
    "Smoked Salmon Bagel": "https://images.unsplash.com/photo-1510621453793-18967980556c?q=80&w=800",
    
    // Italian
    "Truffle Mushroom Risotto": "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800",
    "Margherita Burrata Pizza": "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?q=80&w=800",
    "Lobster Linguine": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800",
    "Osso Buco alla Milanese": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
    
    // Asian
    "Dim Sum Platter": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800",
    "Kung Pao Chicken": "https://images.unsplash.com/photo-1525755662778-989d0524087e?q=80&w=800",
    "Thai Green Curry": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=800",
    "Peking Duck Rolls": "https://images.unsplash.com/photo-1512058560366-cd242d5f8fdf?q=80&w=800",
    
    // Indian
    "Old Delhi Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800",
    "Paneer Lababdar": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800",
    "Hyderabadi Lamb Biryani": "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800",
    "Dal Makhani Heritage": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800",
    
    // Japanese
    "Dragon Roll Sushi": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800",
    "Miso Ramen Heritage": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=800",
    "Wagyu Beef Tataki": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800",
    "Salmon Sashimi Selection": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800",
    
    // Healthy
    "Quinoa Buddha Bowl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    "Keto Grilled Salmon": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800",
    "Acai Power Bowl": "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800",
    
    // Quick Bites
    "Classic Club Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800",
    "Truffle Parmesan Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800",
    "Wagyu Sliders": "https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800",
    
    // Drinks
    "Signature Gold Latte": "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800",
    "Artisan Masala Chai": "https://images.unsplash.com/photo-1544787210-2213d242203b?q=80&w=800",
    "Ethiopian Cold Brew": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800",
    
    // Desserts
    "Valrhona Chocolate Melt": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800",
    "Saffron Milk Cake": "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800",
    "Classic Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800",
    "Kesar Rasmalai": "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=800",
    "Royal Gulab Jamun": "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800"
};

const categoryGenericImages = {
    "Breakfast": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800",
    "Lunch": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
    "Dinner": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    "Italian": "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800",
    "Asian": "https://images.unsplash.com/photo-1512058560366-cd242d5f8fdf?q=80&w=800",
    "Indian": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800",
    "Japanese": "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800",
    "Healthy": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800",
    "Quick Bites": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?q=80&w=800",
    "Hot Drinks": "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=800",
    "Desserts": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=800",
    "Combo Meals": "https://images.unsplash.com/photo-1513442542250-854d436a73f2?q=80&w=800",
    "Cakes & Pastries": "https://images.unsplash.com/photo-1578985543813-21b3b5893c9d?q=80&w=800",
    "Indian Sweets": "https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800",
    "Mocktails": "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=800"
};

async function updateRealPhotos() {
    console.log('--- FETCHING ALL MENU ITEMS ---');
    const { data: items, error } = await supabase.from('menu_items').select('*');
    if (error) return console.error(error);
    
    console.log(`--- UPDATING ${items.length} ITEMS WITH REAL PHOTOS ---`);
    
    for (const item of items) {
        let newPhoto = dishImages[item.name];
        
        // If no specific photo, use category generic
        if (!newPhoto) {
            newPhoto = categoryGenericImages[item.category] || categoryGenericImages["Dinner"];
        }
        
        // If it's a "Delight" or auto-generated, try to find a more specific category image
        if (item.name.includes('Delight') || item.name.includes('Selection')) {
            newPhoto = categoryGenericImages[item.category] || newPhoto;
        }

        await supabase.from('menu_items').update({ image_url: newPhoto }).eq('id', item.id);
    }
    
    console.log('All menu photos updated to match cuisine names/categories!');
}

updateRealPhotos();
