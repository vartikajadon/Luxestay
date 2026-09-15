const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function check() {
    const { data, error } = await supabase.from('bookings').select('*').eq('user_email', 'netseedvikrant@gmail.com');
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Bookings count:", data.length);
        console.log("Bookings:", JSON.stringify(data, null, 2));
    }
}
check();
