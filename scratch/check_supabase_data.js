import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkData() {
    console.log("Checking Bookings...");
    const { data: bookings, error: bError } = await supabase.from('bookings').select('*');
    if (bError) console.error("Bookings Error:", bError);
    else console.log("Bookings Count:", bookings.length, bookings);

    console.log("Checking Staff...");
    const { data: staff, error: sError } = await supabase.from('staff').select('*');
    if (sError) console.error("Staff Error:", sError);
    else console.log("Staff Count:", staff.length, staff);
    
    console.log("Checking Services...");
    const { data: services, error: serError } = await supabase.from('services').select('*');
    if (serError) console.error("Services Error:", serError);
    else console.log("Services Count:", services.length, services);

    console.log("Checking Hotels...");
    const { data: hotels, error: hError } = await supabase.from('hotels').select('*');
    if (hError) console.error("Hotels Error (Table likely missing):", hError.message);
    else console.log("Hotels Count:", hotels.length, hotels);
}

checkData();
