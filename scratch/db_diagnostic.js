const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function diagnoseAndFix() {
    console.log("🔍 Diagnosing Services & Orders identity structure...");

    // 1. Fetch Hotels to build a dynamic map (UUID -> Name AND Code -> Name)
    const { data: hotels } = await supabase.from('hotels').select('id, hotel_id, hotel_name');
    const nameMap = {};
    hotels.forEach(h => {
        nameMap[h.id] = h.hotel_name; // Map UUID
        if (h.hotel_id) nameMap[h.hotel_id] = h.hotel_name; // Map Code
    });

    console.log(`🗺️ Built identity map with ${Object.keys(nameMap).length} entries.`);

    // 2. Check Services
    console.log("🛎️ Checking Services table...");
    const { data: sRows, error: sErr } = await supabase.from('services').select('*').limit(1);
    if (sErr) {
        console.error("❌ Services Error:", sErr.message);
    } else if (sRows && sRows.length > 0) {
        if (!('hotel_name' in sRows[0])) {
            console.error("⚠️ COLUMN MISSING: 'hotel_name' does not exist in 'services' table. PLEASE RUN THE SQL MIGRATION.");
        } else {
            console.log("✅ Column 'hotel_name' exists in 'services'. Updating rows...");
            const { data: allServices } = await supabase.from('services').select('id, hotel_id');
            for (const s of allServices || []) {
                const name = nameMap[s.hotel_id];
                if (name) {
                    await supabase.from('services').update({ hotel_name: name }).eq('id', s.id);
                    console.log(`Updated Service ${s.id} -> ${name}`);
                }
            }
        }
    }

    // 3. Check Orders
    console.log("🍔 Checking Orders table...");
    const { data: oRows, error: oErr } = await supabase.from('orders').select('*').limit(1);
    if (oErr) {
        console.error("❌ Orders Error:", oErr.message);
    } else if (oRows && oRows.length > 0) {
        if (!('hotel_name' in oRows[0])) {
            console.error("⚠️ COLUMN MISSING: 'hotel_name' does not exist in 'orders' table. PLEASE RUN THE SQL MIGRATION.");
        } else {
            console.log("✅ Column 'hotel_name' exists in 'orders'. Updating rows...");
            const { data: allOrders } = await supabase.from('orders').select('id, hotel_id');
            for (const o of allOrders || []) {
                const name = nameMap[o.hotel_id];
                if (name) {
                    await supabase.from('orders').update({ hotel_name: name }).eq('id', o.id);
                    console.log(`Updated Order ${o.id} -> ${name}`);
                }
            }
        }
    }

    console.log("🏁 Diagnostic complete.");
}

diagnoseAndFix();
