const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const hotelMap = {
    'UAE-DUBAI-ARM': 'Armani Hotel Dubai',
    'UAE-DUBAI-ATL': 'Atlantis The Royal',
    'UAE-DUBAI-ADD': 'Address Dubai Marina',
    'IND-UDA-TAJ': 'Taj Lake Palace',
    'IND-BHO-LEE': 'The Leela Palace',
    'IND-DEL-ITC': 'ITC Maurya',
    'IND-MUM-OBE': 'The Oberoi Mumbai',
    'IND-JAI-RAM': 'Rambagh Palace',
    'IND-GOA-W': 'W Goa',
    'FRA-PAR-PLA': 'Hôtel Plaza Athénée',
    'UK-LON-SAV': 'The Savoy',
    'SGP-SGP-MBS': 'Marina Bay Sands'
};

async function migrate() {
    console.log("🚀 Starting Hotel Name Migration...");

    // 1. Process Services
    console.log("🛎️ Processing Services...");
    const { data: services } = await supabase.from('services').select('id, hotel_id');
    for (const s of services || []) {
        const name = hotelMap[s.hotel_id];
        if (name) {
            await supabase.from('services').update({ hotel_name: name }).eq('id', s.id);
            console.log(`Updated Service ${s.id} -> ${name}`);
        }
    }

    // 2. Process Orders
    console.log("🍔 Processing Orders...");
    const { data: orders } = await supabase.from('orders').select('id, hotel_id');
    for (const o of orders || []) {
        const name = hotelMap[o.hotel_id];
        if (name) {
            await supabase.from('orders').update({ hotel_name: name }).eq('id', o.id);
            console.log(`Updated Order ${o.id} -> ${name}`);
        }
    }

    console.log("🏁 Migration Complete.");
}

migrate();
