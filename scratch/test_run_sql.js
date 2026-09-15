const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testRpcs() {
    const rpcs = ['execute_sql', 'exec_sql', 'run_sql', 'sql_query', 'sql', 'query'];
    const sql = 'SELECT 1;';
    
    for (const rpc of rpcs) {
        console.log(`Testing RPC: ${rpc}...`);
        const { data, error } = await supabase.rpc(rpc, { sql_query: sql, query: sql, sql: sql });
        if (error) {
            console.log(`RPC ${rpc} failed:`, error.message);
        } else {
            console.log(`🎉 RPC ${rpc} SUCCEEDED! Result:`, data);
            return;
        }
    }
    console.log("No common SQL RPCs succeeded.");
}

testRpcs();
