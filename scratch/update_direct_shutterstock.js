const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const directUpdates = {
    "Belgian Berry Waffles": "https://www.shutterstock.com/shutterstock/photos/2679360255/display_1500/stock-photo-2679360255.jpg",
    "Artisan Avocado Toast": "https://www.shutterstock.com/shutterstock/photos/2634386181/display_1500/stock-photo-2634386181.jpg",
    "Smoked Salmon Bagel": "https://www.shutterstock.com/shutterstock/photos/2724892653/display_1500/stock-photo-2724892653.jpg",
    "Greek Yogurt Parfait": "https://www.shutterstock.com/shutterstock/photos/2448010165/display_1500/stock-photo-2448010165.jpg",
    "French Brioche Toast": "https://www.shutterstock.com/shutterstock/photos/2549026663/display_1500/stock-photo-2549026663.jpg",
    "English Breakfast Platter": "https://www.shutterstock.com/shutterstock/photos/2305316733/display_1500/stock-photo-2305316733.jpg"
};

async function updateDbDirectImages() {
    console.log("Updating Supabase menu_items with raw direct image links...");
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

updateDbDirectImages();
