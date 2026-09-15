const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function syncIdentities() {
    console.log("🚀 Starting Comprehensive Identity Synchronization...");

    // 1. Fetch Hotels for Mapping
    const { data: hotels } = await supabase.from('hotels').select('id, hotel_id, hotel_name');
    const uuidMap = {};
    hotels.forEach(h => {
        uuidMap[h.hotel_name.toLowerCase()] = h.id;
        if (h.hotel_id) uuidMap[h.hotel_id.toLowerCase()] = h.id;
        // Legacy support for Burj Al Arab variations
        if (h.hotel_name.includes("Burj")) {
            uuidMap["uae-dubai-lbaa"] = h.id;
            uuidMap["uk-dub-baaj"] = h.id;
            uuidMap["lbaa"] = h.id;
        }
    });

    console.log(`🗺️ Identity map built with ${Object.keys(uuidMap).length} variants.`);

    // 2. Sync Services
    console.log("🛎️ Syncing Services...");
    const { data: services } = await supabase.from('services').select('*');
    for (const s of services || []) {
        // Try to find correct UUID
        let targetId = uuidMap[s.hotel_id?.toLowerCase()] || uuidMap[s.hotel_name?.toLowerCase()];
        
        // If still null, try to find by ID prefix
        if (!targetId && s.id && s.id.includes("-")) {
            const prefix = s.id.split("-")[0].toLowerCase();
            targetId = uuidMap[prefix];
        }

        if (targetId && targetId !== s.hotel_id) {
            await supabase.from('services').update({ hotel_id: targetId }).eq('id', s.id);
            console.log(`Synced Service ${s.id} -> UUID [${targetId}]`);
        }
    }

    // 3. Sync Orders
    console.log("🍔 Syncing Orders...");
    const { data: orders } = await supabase.from('orders').select('*');
    for (const o of orders || []) {
        let targetId = uuidMap[o.hotel_id?.toLowerCase()] || uuidMap[o.hotel_name?.toLowerCase()];
        
        if (!targetId && o.id && o.id.includes("-")) {
            const prefix = o.id.split("-")[0].toLowerCase();
            targetId = uuidMap[prefix];
        }

        if (targetId && targetId !== o.hotel_id) {
            await supabase.from('orders').update({ hotel_id: targetId }).eq('id', o.id);
            console.log(`Synced Order ${o.id} -> UUID [${targetId}]`);
        }
    }

    console.log("🏁 Synchronization Complete.");
}

syncIdentities();
