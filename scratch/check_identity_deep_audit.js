const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkIdentity() {
    console.log("🔍 Starting Deep Audit of Services & Orders identity...");

    // 1. Fetch all hotels to see our "Reference Set"
    const { data: hotels } = await supabase.from('hotels').select('id, hotel_id, hotel_name');
    console.log("\n🏨 Reference Hotels (Registry):");
    hotels?.forEach(h => console.log(`- ${h.hotel_name}: UUID=[${h.id}] | Code=[${h.hotel_id}]`));

    // 2. Fetch Services to see what is ACTUALLY stored
    const { data: services } = await supabase.from('services').select('id, hotel_id, service_type').limit(10);
    console.log("\n🛎️ Raw Service Records (Database):");
    if (!services || services.length === 0) console.log("No services found.");
    services?.forEach(s => console.log(`- Request ${s.id}: hotel_id=[${s.hotel_id}] | Type: ${s.service_type}`));

    // 3. Fetch Orders to see what is ACTUALLY stored
    const { data: orders } = await supabase.from('orders').select('id, hotel_id, items').limit(10);
    console.log("\n🍔 Raw Order Records (Database):");
    if (!orders || orders.length === 0) console.log("No orders found.");
    orders?.forEach(o => console.log(`- Order ${o.id}: hotel_id=[${o.hotel_id}] | Items: ${o.items?.substring(0, 20)}`));

    console.log("\n🏁 Audit Complete.");
}

checkIdentity();
