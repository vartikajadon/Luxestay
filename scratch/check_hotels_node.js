
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkHotels() {
    console.log("--- Supabase Data Health Check ---");
    
    const { data: hotels, error: hError } = await supabase.from('hotels').select('*');
    if (hError) {
        console.error("❌ Hotels Table Error:", hError.message);
        console.log("Suggestion: Run the 'hotels' table creation SQL in Supabase Editor.");
    } else {
        console.log(`✅ Hotels Table: Found ${hotels.length} records.`);
        if (hotels.length === 0) {
            console.log("Suggestion: Populate the 'hotels' table with property data.");
        } else {
            console.log("Hotels Data:", JSON.stringify(hotels, null, 2));
        }
    }
}

checkHotels();
