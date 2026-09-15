const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkSchema() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error("Error fetching bookings:", error);
    } else if (data && data.length > 0) {
        console.log("Booking columns:", Object.keys(data[0]));
    } else {
        console.log("No bookings found to check schema.");
    }
}

checkSchema();
