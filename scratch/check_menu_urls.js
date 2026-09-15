const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkUrls() {
    const categories = ['Fresh Juices', 'Cakes & Pastries', 'Indian Sweets'];
    for (const cat of categories) {
        console.log(`\nCategory: ${cat}`);
        const { data, error } = await supabase
            .from('menu_items')
            .select('id, name, image_url')
            .eq('category', cat);
        if (error) {
            console.error(error);
        } else {
            console.log(`Found ${data.length} items:`);
            data.forEach(item => {
                console.log(`- [${item.id}] ${item.name}: ${item.image_url}`);
            });
        }
    }
}

checkUrls();
