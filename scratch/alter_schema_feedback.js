const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function alterSchema() {
    console.log("Adding columns feedback and rating to bookings and profiles tables...");

    const sql = `
        -- Alter bookings table
        ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS feedback TEXT;
        ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rating INTEGER;

        -- Alter profiles table
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS feedback TEXT;
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rating INTEGER;

        -- Ensure reviews table exists and is public
        CREATE TABLE IF NOT EXISTS public.reviews (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            hotel_name TEXT NOT NULL,
            user_name TEXT NOT NULL,
            rating DECIMAL(2,1) NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
    `;

    const { data, error } = await supabase.rpc('execute_sql', { sql_query: sql });

    if (error) {
        console.error("Error executing SQL via RPC:", error);
    } else {
        console.log("SQL schema updated successfully!", data);
    }
}

alterSchema();
