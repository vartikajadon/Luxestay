import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSystemSettingsTable() {
    console.log("Checking for 'system_settings' table existence...");
    const { data, error } = await supabase.from('system_settings').select('count', { count: 'exact', head: true });
    
    if (error) {
        if (error.code === 'PGRST116' || error.message.includes('schema cache')) {
            console.error("CRITICAL ERROR: The 'system_settings' table does not exist in the Supabase public schema.");
            console.log("ACTION REQUIRED: Run the following SQL in your Supabase SQL Editor:");
            console.log(`
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name TEXT,
  contact_number TEXT,
  email TEXT,
  address TEXT,
  currency TEXT,
  tax_percent NUMERIC,
  checkin_time TEXT,
  checkout_time TEXT,
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all settings operations" ON system_settings FOR ALL USING (true) WITH CHECK (true);
            `);
        } else {
            console.error("Supabase Error:", error);
        }
    } else {
        console.log("SUCCESS: 'system_settings' table detected and accessible.");
    }
}

checkSystemSettingsTable();
