const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const directLunchUpdates = {
    "Lunch Selection #1": "https://www.shutterstock.com/shutterstock/photos/2714839347/display_1500/stock-photo-2714839347.jpg",
    "Lunch Selection #2": "https://www.shutterstock.com/shutterstock/photos/2544690611/display_1500/stock-photo-2544690611.jpg",
    "Lunch Selection #3": "https://www.shutterstock.com/shutterstock/photos/2749324561/display_1500/stock-photo-2749324561.jpg",
    "Lunch Selection #4": "https://www.shutterstock.com/shutterstock/photos/2437850239/display_1500/stock-photo-2437850239.jpg",
    "Lunch Selection #5": "https://www.shutterstock.com/shutterstock/photos/2676091837/display_1500/stock-photo-2676091837.jpg",
    "Lunch Selection #6": "https://www.shutterstock.com/shutterstock/photos/2714839353/display_1500/stock-photo-2714839353.jpg",
    "Lunch Selection #8": "https://www.shutterstock.com/shutterstock/photos/2652923019/display_1500/stock-photo-2652923019.jpg"
};

async function updateDbLunchImages() {
    console.log("Updating Lunch Selection images in Supabase...");
    for (const [name, url] of Object.entries(directLunchUpdates)) {
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

updateDbLunchImages();
