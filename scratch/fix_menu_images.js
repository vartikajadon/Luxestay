
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixDinnerImage() {
    console.log('Updating Filet Mignon image...');
    const { data, error } = await supabase
        .from('menu_items')
        .update({ image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800' })
        .eq('name', 'Filet Mignon');
    
    if (error) console.error('Error:', error);
    else console.log('Image updated successfully!');
}

fixDinnerImage();
