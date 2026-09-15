
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixBeverageImages() {
    console.log('Updating Beverage images...');
    
    // 1. Signature Gold Latte
    await supabase
        .from('menu_items')
        .update({ image_url: 'https://images.unsplash.com/photo-1570968015861-d55f4331f779?q=80&w=800' })
        .eq('name', 'Signature Gold Latte');

    // 2. Vintage Wine Selection
    await supabase
        .from('menu_items')
        .update({ image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b0ca7df?q=80&w=800' })
        .eq('name', 'Vintage Wine Selection');
    
    console.log('Beverage images updated successfully!');
}

fixBeverageImages();
