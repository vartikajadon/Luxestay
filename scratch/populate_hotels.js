
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAndPopulateHotels() {
    console.log("Checking hotels table...");
    try {
        const { data, error } = await supabase.from('hotels').select('*');
        if (error) {
            console.log("Table 'hotels' might not exist or there is an error:", error.message);
            return;
        }

        console.log(`Found ${data.length} hotels.`);
        if (data.length === 0) {
            console.log("Populating dummy hotels...");
            const dummyHotels = [
                { name: "LuxeStay Mumbai", city: "Mumbai", country: "India" },
                { name: "LuxeStay Delhi", city: "Delhi", country: "India" },
                { name: "LuxeStay Goa", city: "Goa", country: "India" }
            ];
            const { error: insError } = await supabase.from('hotels').insert(dummyHotels);
            if (insError) console.error("Error populating hotels:", insError);
            else console.log("Successfully populated hotels.");
        }
    } catch (e) {
        console.error("Critical error:", e);
    }
}

checkAndPopulateHotels();
