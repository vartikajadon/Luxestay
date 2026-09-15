const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testSingle() {
    const query = 'SELECT 1 as val;';
    
    console.log("Testing with sql_query parameter...");
    const res1 = await supabase.rpc('execute_sql', { sql_query: query });
    if (res1.error) {
        console.log("sql_query param failed:", res1.error.message);
    } else {
        console.log("🎉 sql_query param SUCCEEDED! Result:", res1.data);
        return;
    }

    console.log("Testing with query parameter...");
    const res2 = await supabase.rpc('execute_sql', { query: query });
    if (res2.error) {
        console.log("query param failed:", res2.error.message);
    } else {
        console.log("🎉 query param SUCCEEDED! Result:", res2.data);
        return;
    }
}

testSingle();
