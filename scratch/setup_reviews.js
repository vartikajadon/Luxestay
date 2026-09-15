const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function setupReviews() {
    console.log("Setting up Reviews Table...");

    // 1. Create Reviews Table
    const { error: tableError } = await supabase.rpc('execute_sql', {
        sql_query: `
            CREATE TABLE IF NOT EXISTS public.reviews (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                hotel_name TEXT NOT NULL,
                user_name TEXT NOT NULL,
                rating DECIMAL(2,1) NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
            ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
        `
    });

    if (tableError) {
        console.log("Note: Table creation RPC might have failed. Proceeding...");
    }

    // 2. Sample Reviews Data
    const reviews = [
        { hotel_name: 'Armani Hotel Dubai', user_name: 'James Wilson', rating: 5.0, comment: 'Absolute perfection. The views of the Burj Khalifa are unmatched.' },
        { hotel_name: 'Armani Hotel Dubai', user_name: 'Sarah Chen', rating: 4.8, comment: 'Minimalist luxury at its finest. The spa experience was incredible.' },
        { hotel_name: 'Atlantis The Royal', user_name: 'Michael Ross', rating: 5.0, comment: 'The most impressive hotel I have ever stayed in. The architecture is mind-blowing.' },
        { hotel_name: 'Taj Lake Palace', user_name: 'Anjali Sharma', rating: 5.0, comment: 'A magical experience. Staying in the middle of Lake Pichola felt like a dream.' },
        { hotel_name: 'The Savoy', user_name: 'Edward Knight', rating: 4.9, comment: 'Timeless elegance. The service was impeccable from the moment we arrived.' },
        { hotel_name: 'Marina Bay Sands', user_name: 'Elena Rodriguez', rating: 5.0, comment: 'That infinity pool is worth the trip alone. Spectacular city views.' },
        { hotel_name: 'The Leela Palace', user_name: 'Vikram Singh', rating: 4.8, comment: 'Stunning architecture and world-class hospitality in Bhopal.' },
        { hotel_name: 'Address Dubai Marina', user_name: 'Linda Gao', rating: 4.7, comment: 'Great location with direct mall access. The pool deck is fantastic.' }
    ];

    console.log("Checking for existing reviews...");
    const { data: existingReviews } = await supabase.from('reviews').select('hotel_name, user_name');
    const existingKeys = new Set((existingReviews || []).map(r => `${r.hotel_name}|${r.user_name}`));

    const toInsert = reviews.filter(r => !existingKeys.has(`${r.hotel_name}|${r.user_name}`));

    if (toInsert.length > 0) {
        console.log(`Inserting ${toInsert.length} new reviews...`);
        const { error: insertError } = await supabase.from('reviews').insert(toInsert);
        if (insertError) console.error("Error inserting reviews:", insertError);
        else console.log("Reviews populated successfully!");
    } else {
        console.log("All sample reviews already exist.");
    }
}

setupReviews();
