const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
    const { data: bookings, error: bErr } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_email', 'netseedvikrant@gmail.com');
    if (bErr) {
        console.error("Bookings error:", bErr);
    } else {
        console.log("Bookings count:", bookings.length);
        console.log("Bookings detail:", JSON.stringify(bookings, null, 2));
    }
}

checkData();
