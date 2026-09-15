const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkOrdersServices() {
    const { data: orders, error: oErr } = await supabase.from('orders').select('*').limit(3);
    if (oErr) {
        console.error("Orders error:", oErr);
    } else {
        console.log("Orders keys:", orders && orders[0] ? Object.keys(orders[0]) : "No orders");
        console.log("Orders sample:", orders);
    }

    const { data: services, error: sErr } = await supabase.from('services').select('*').limit(3);
    if (sErr) {
        console.error("Services error:", sErr);
    } else {
        console.log("Services keys:", services && services[0] ? Object.keys(services[0]) : "No services");
        console.log("Services sample:", services);
    }
}

checkOrdersServices();
