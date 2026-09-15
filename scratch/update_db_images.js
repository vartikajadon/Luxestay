const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const updates = {
    "Belgian Berry Waffles": "https://www.shutterstock.com/image-photo/tasty-belgian-waffles-fresh-berries-ice-2679360255?trackingId=16a44d9c-476d-4f98-9d45-7e3c5fb6f469&listId=searchResults",
    "Artisan Avocado Toast": "https://www.shutterstock.com/image-photo/artisanal-avocado-toast-poached-eggs-on-2634386181?trackingId=817a98aa-7c25-433a-80e5-0e5bed48a526&listId=searchResults",
    "Smoked Salmon Bagel": "https://www.shutterstock.com/image-photo/lox-smoked-salmon-bagel-cream-cheese-2724892653?trackingId=7236b188-69f1-4218-90f5-270effa198ec&listId=searchResults",
    "Greek Yogurt Parfait": "https://www.shutterstock.com/image-photo/summer-berries-granola-breakfast-layered-dessert-2448010165?trackingId=e5abb509-37e6-483d-ac7f-458f0557b0f7&listId=searchResults",
    "French Brioche Toast": "https://www.shutterstock.com/image-photo/homemade-french-toast-brioche-bread-topped-2549026663?trackingId=c4d205d4-6db9-459d-81bc-fbf0d5a61778&listId=searchResults",
    "English Breakfast Platter": "https://www.shutterstock.com/image-photo/english-breakfast-cooking-pan-fried-eggs-2305316733"
};

async function updateDbImages() {
    for (const [name, url] of Object.entries(updates)) {
        console.log(`Updating ${name} image in DB...`);
        const { data, error } = await supabase
            .from('menu_items')
            .update({ image_url: url })
            .eq('name', name);
        if (error) {
            console.error(`Error updating ${name}:`, error);
        } else {
            console.log(`Successfully updated ${name}!`);
        }
    }
}

updateDbImages();
