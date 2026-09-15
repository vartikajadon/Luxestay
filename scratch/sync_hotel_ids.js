const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const hotelMappings = {
    'Armani Hotel Dubai': 'UAE-DUBAI-ARM',
    'Atlantis The Royal': 'UAE-DUBAI-ATL',
    'Address Dubai Marina': 'UAE-DUBAI-ADD',
    'Taj Lake Palace': 'IND-UDA-TAJ',
    'The Leela Palace': 'IND-BHO-LEE',
    'ITC Maurya': 'IND-DEL-ITC',
    'The Oberoi Mumbai': 'IND-MUM-OBE',
    'Rambagh Palace': 'IND-JAI-RAM',
    'W Goa': 'IND-GOA-W',
    'Hôtel Plaza Athénée': 'FRA-PAR-PLA',
    'The Savoy': 'UK-LON-SAV',
    'Marina Bay Sands': 'SGP-SGP-MBS'
};

async function syncHotelIds() {
    console.log("🚀 Starting Professional Identity Sync...");

    const { data: hotels, error: fetchError } = await supabase.from('hotels').select('id, hotel_name');

    if (fetchError) {
        console.error("❌ Error fetching hotels:", fetchError);
        return;
    }

    console.log(`🔍 Found ${hotels.length} hotels. Preparing injection...`);

    for (const hotel of hotels) {
        const professionalId = hotelMappings[hotel.hotel_name];
        if (professionalId) {
            console.log(`🛠️ Updating ${hotel.hotel_name}...`);
            const { error: updateError } = await supabase
                .from('hotels')
                .update({ hotel_id: professionalId })
                .eq('id', hotel.id);

            if (updateError) {
                console.error(`❌ Failed to update ${hotel.hotel_name}:`, updateError.message);
            } else {
                console.log(`✅ Success: ${professionalId}`);
            }
        } else {
            console.warn(`⚠️ No mapping found for: ${hotel.hotel_name}`);
        }
    }

    console.log("🏁 Sync Complete.");
}

syncHotelIds();
