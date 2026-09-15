const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const requestedUpdates = {
    "Green Glow Detox Elixir": "https://www.shutterstock.com/shutterstock/photos/1772375294/display_1500/stock-photo-1772375294.jpg",
    "Watermelon Hydration Royale": "https://www.shutterstock.com/shutterstock/photos/223789426/display_1500/stock-photo-223789426.jpg",
    "Pomegranate Power Luxe": "https://www.shutterstock.com/shutterstock/photos/648787447/display_1500/stock-photo-648787447.jpg",
    "Blueberry Cheesecake Royale": "https://www.shutterstock.com/shutterstock/photos/1197363475/display_1500/stock-photo-1197363475.jpg",
    "Kesari Rasmalai Royale": "https://www.shutterstock.com/shutterstock/photos/2684524025/display_1500/stock-photo-2684524025.jpg",
    "Gajar Ka Halwa Artisan": "https://www.shutterstock.com/shutterstock/photos/1525675358/display_1500/stock-photo-1525675358.jpg",
    "Gulab Jamun with Rabri Royale": "https://www.shutterstock.com/shutterstock/photos/1270917652/display_1500/stock-photo-1270917652.jpg",
    "Jalebi with Rabri Royale": "https://www.shutterstock.com/shutterstock/photos/2067901334/display_1500/stock-photo-2067901334.jpg",
    "Kaju Katli Gold": "https://www.shutterstock.com/shutterstock/photos/2034758729/display_1500/stock-photo-2034758729.jpg"
};

async function applyUpdates() {
    console.log("Applying requested Shutterstock direct display_1500 URLs to Supabase menu_items...");
    for (const [name, url] of Object.entries(requestedUpdates)) {
        const { error } = await supabase
            .from('menu_items')
            .update({ image_url: url })
            .eq('name', name);
        if (error) {
            console.error(`Error updating ${name}:`, error);
        } else {
            console.log(`Successfully updated ${name} image in database.`);
        }
    }
    console.log("All requested image updates applied to database!");
}

applyUpdates();
