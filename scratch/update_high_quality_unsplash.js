const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const updates = {
    // Fresh Juices (4 items)
    "Valencia Orange Juice Royale": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800",
    "Green Glow Detox Elixir": "https://images.unsplash.com/photo-1610970881699-44a5587caa9a?q=80&w=800",
    "Watermelon Hydration Royale": "https://images.unsplash.com/photo-1543157145-f78b636d023d?q=80&w=800",
    "Pomegranate Power Luxe": "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=800",

    // Cakes & Pastries (5 items)
    "Opera Cake Royale": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800",
    "Red Velvet Signature Luxe": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=800",
    "Blueberry Cheesecake Royale": "https://images.unsplash.com/photo-1524350303359-994ca6fa3972?q=80&w=800",
    "Tiramisu Classic Royale": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800",
    "Almond Croissant Royale": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800",

    // Indian Sweets (5 items)
    "Gulab Jamun with Rabri Royale": "https://images.unsplash.com/photo-1589112182385-95f9f0a63506?q=80&w=800",
    "Kesari Rasmalai Royale": "https://images.unsplash.com/photo-1630175860333-5131bda75071?q=80&w=800",
    "Gajar Ka Halwa Artisan": "https://images.unsplash.com/photo-1589112182385-95f9f0a63506?q=80&w=800",
    "Kaju Katli Gold": "https://images.unsplash.com/photo-1605197561565-dfc402439d06?q=80&w=800",
    "Jalebi with Rabri Royale": "https://images.unsplash.com/photo-1589112182385-95f9f0a63506?q=80&w=800"
};

async function applyUpdates() {
    console.log("Applying high-quality, fast-loading Unsplash URLs to the Supabase database...");
    for (const [name, url] of Object.entries(updates)) {
        const { error } = await supabase
            .from('menu_items')
            .update({ image_url: url })
            .eq('name', name);
        if (error) {
            console.error(`Error updating ${name}:`, error);
        } else {
            console.log(`Successfully updated ${name} to premium Unsplash URL.`);
        }
    }
}

applyUpdates();
