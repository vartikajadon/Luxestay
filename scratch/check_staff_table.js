import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkStaffTable() {
    console.log("Checking for 'staff' table existence...");
    const { data, error } = await supabase.from('staff').select('count', { count: 'exact', head: true });
    
    if (error) {
        if (error.code === 'PGRST116' || error.message.includes('schema cache')) {
            console.error("CRITICAL ERROR: The 'staff' table does not exist in the Supabase public schema.");
            console.log("ACTION REQUIRED: Run the following SQL in your Supabase SQL Editor:");
            console.log(`
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id TEXT UNIQUE,
  name TEXT,
  role TEXT,
  password TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all staff operations" ON staff FOR ALL USING (true) WITH CHECK (true);
            `);
        } else {
            console.error("Supabase Error:", error);
        }
    } else {
        console.log("SUCCESS: 'staff' table detected and accessible.");
    }
}

checkStaffTable();
