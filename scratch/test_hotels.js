const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
    const { data, error } = await supabase.from('hotels').select('*').limit(1);
    if (error) {
        console.error('Error fetching hotels:', error);
    } else {
        console.log('Hotel columns:', data[0] ? Object.keys(data[0]) : 'No data');
        console.log('Hotel data:', data[0]);
    }
}
test();
