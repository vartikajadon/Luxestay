const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const directDinnerUpdates = {
    "Dinner Selection #1": "https://www.shutterstock.com/shutterstock/photos/2602838311/display_1500/stock-photo-2602838311.jpg",
    "Dinner Selection #2": "https://www.shutterstock.com/shutterstock/photos/2472690419/display_1500/stock-photo-2472690419.jpg",
    "Dinner Selection #3": "https://www.shutterstock.com/shutterstock/photos/2691499495/display_1500/stock-photo-2691499495.jpg",
    "Dinner Selection #5": "https://www.shutterstock.com/shutterstock/photos/2369868923/display_1500/stock-photo-2369868923.jpg",
    "Dinner Selection #6": "https://www.shutterstock.com/shutterstock/photos/2699621257/display_1500/stock-photo-2699621257.jpg"
};

async function updateDbDinnerImages() {
    console.log("Updating Dinner Selection images in Supabase...");
    for (const [name, url] of Object.entries(directDinnerUpdates)) {
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

updateDbDinnerImages();
