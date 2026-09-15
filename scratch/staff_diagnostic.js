import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testStaffInsert() {
    console.log("Testing Staff Insert...");
    const testStaff = {
        staff_id: "TEST-001",
        name: "Diagnostic Admin",
        role: "service",
        password: "admin123",
        status: "Active"
    };

    const { data, error } = await supabase.from('staff').insert([testStaff]).select();
    
    if (error) {
        console.error("CRITICAL: Staff Insert Failed!", error);
        console.log("HINT: Check if RLS is enabled on 'staff' table and if an 'INSERT' policy exists.");
    } else {
        console.log("SUCCESS: Staff Inserted Successfully!", data);
        
        // Clean up
        await supabase.from('staff').delete().eq('staff_id', "TEST-001");
        console.log("Cleanup: Test record removed.");
    }
}

testStaffInsert();
