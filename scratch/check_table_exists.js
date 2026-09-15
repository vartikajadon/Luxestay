const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkTable() {
    console.log("Checking if partner_restaurants table exists...");
    const { data, error } = await supabase.from('partner_restaurants').select('*').limit(1);
    if (error) {
        console.log("partner_restaurants table error:", error.message);
    } else {
        console.log("🎉 partner_restaurants table EXISTS and is accessible! Sample:", data);
    }
}

checkTable();
