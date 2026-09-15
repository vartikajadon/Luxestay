const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testReview() {
    console.log("Checking if reviews table is accessible...");
    const { data, error } = await supabase.from('reviews').select('*').limit(1);
    if (error) {
        console.error("Error accessing reviews table:", error);
    } else {
        console.log("Success! Reviews table is accessible. Sample data:", data);
        
        console.log("Testing insert into reviews table...");
        const { error: insError } = await supabase.from('reviews').insert([{
            hotel_name: 'Taj Lake Palace',
            user_name: 'Test Guest',
            rating: 5,
            comment: 'Superb and testing!'
        }]);
        if (insError) {
            console.error("Error inserting test review:", insError);
        } else {
            console.log("Success! Test review inserted successfully!");
            
            // Delete the test review afterwards
            await supabase.from('reviews').delete().eq('user_name', 'Test Guest');
        }
    }
}

testReview();
