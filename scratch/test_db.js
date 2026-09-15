const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testConnection() {
    console.log("Checking Supabase connection...");
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
        console.error("❌ Connection failed:", error.message);
    } else {
        console.log("✅ Successfully connected to Supabase!");
        console.log("Total profiles in database:", data === null ? 0 : data);
    }
}

testConnection();
