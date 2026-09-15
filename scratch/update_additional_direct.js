const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const directUpdates = {
    "Family Feast Platter": "https://www.shutterstock.com/shutterstock/photos/2761661999/display_1500/stock-photo-2761661999.jpg",
    "Continental Breakfast Box": "https://www.shutterstock.com/shutterstock/photos/2400872761/display_1500/stock-photo-2400872761.jpg",
    "Celebration Cake & Bubbles": "https://www.shutterstock.com/shutterstock/photos/2747330853/display_1500/stock-photo-2747330853.jpg",
    "Couple Dinner Package": "https://www.shutterstock.com/shutterstock/photos/2695736983/display_1500/stock-photo-2695736983.jpg",
    "Indian Thali Royal": "https://www.shutterstock.com/shutterstock/photos/1327238381/display_1500/stock-photo-1327238381.jpg",
    "Asian Bento Box": "https://www.shutterstock.com/shutterstock/photos/2706715303/display_1500/stock-photo-2706715303.jpg",
    "Healthy Meal Plan Day": "https://www.shutterstock.com/shutterstock/photos/2671986435/display_1500/stock-photo-2671986435.jpg",
    "Kids Party Pack": "https://www.shutterstock.com/shutterstock/photos/2646665675/display_1500/stock-photo-2646665675.jpg",
    "Movie Night Combo": "https://www.shutterstock.com/shutterstock/photos/2341054889/display_1500/stock-photo-2341054889.jpg",
    "Lucknowi Galouti Kebab": "https://www.shutterstock.com/shutterstock/photos/1891098205/display_1500/stock-photo-1891098205.jpg",
    "Baingan Bharta Artisan": "https://www.shutterstock.com/shutterstock/photos/1298813041/display_1500/stock-photo-1298813041.jpg",
    "Malai Kofta Signature": "https://www.shutterstock.com/shutterstock/photos/2568746583/display_1500/stock-photo-2568746583.jpg",
    "Old Delhi Butter Chicken": "https://www.shutterstock.com/shutterstock/photos/2360173335/display_1500/stock-photo-2360173335.jpg",
    "Paneer Lababdar": "https://www.shutterstock.com/shutterstock/photos/2318335431/display_1500/stock-photo-2318335431.jpg",
    "Dal Makhani Heritage": "https://www.shutterstock.com/shutterstock/photos/1837738894/display_1500/stock-photo-1837738894.jpg",
    "Prosciutto Crudo Pizza": "https://www.shutterstock.com/shutterstock/photos/2762112385/display_1500/stock-photo-2762112385.jpg",
    "Lasagna Bolognese Classic": "https://www.shutterstock.com/shutterstock/photos/2258719293/display_1500/stock-photo-2258719293.jpg",
    "Osso Buco alla Milanese": "https://www.shutterstock.com/shutterstock/photos/2402027659/display_1500/stock-photo-2402027659.jpg",
    "Laksa Lemak Bowl": "https://www.shutterstock.com/shutterstock/photos/1194315946/display_1500/stock-photo-1194315946.jpg",
    "Signature Gold Latte": "https://www.shutterstock.com/shutterstock/photos/2157775619/display_1500/stock-photo-2157775619.jpg",
    "Flat White Signature": "https://www.shutterstock.com/shutterstock/photos/2354666261/display_1500/stock-photo-2354666261.jpg",
    "Belgian Hot Chocolate": "https://www.shutterstock.com/shutterstock/photos/2195822735/display_1500/stock-photo-2195822735.jpg",
    "Japanese Matcha Latte": "https://www.shutterstock.com/shutterstock/photos/2728551915/display_1500/stock-photo-2728551915.jpg",
    "Cortado Classic": "https://www.shutterstock.com/shutterstock/photos/2741142973/display_1500/stock-photo-2741142973.jpg"
};

async function updateDbAdditionalImages() {
    console.log("Updating Supabase menu_items with 24 direct raw image links...");
    for (const [name, url] of Object.entries(directUpdates)) {
        const { data, error } = await supabase
            .from('menu_items')
            .update({ image_url: url })
            .eq('name', name);
        if (error) {
            console.error(`Error updating ${name}:`, error);
        } else {
            console.log(`Successfully updated ${name} to raw direct image URL!`);
        }
    }
}

updateDbAdditionalImages();
