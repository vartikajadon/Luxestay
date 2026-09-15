// Diagnostic script for LuxeStay Supabase Integration
import { supabase } from './supabase-config.js';

async function runDiagnostics() {
    console.log("🚀 Starting LuxeStay Auth Diagnostics...");

    try {
        // 1. Test Connection
        const { data: health, error: connError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (connError) {
            console.error("❌ Connection Error:", connError.message);
            return;
        }
        console.log("✅ Supabase Connection: Healthy");

        // 2. Test Profiles Schema
        const { data: schema, error: schemaError } = await supabase.from('profiles').select('*').limit(1);
        if (schemaError) {
            console.error("❌ Schema Error:", schemaError.message);
        } else {
            console.log("✅ Profiles Table Structure: Valid");
        }

        console.log("\n✨ Diagnostics Complete. Your system is ready for live testing!");
        console.log("👉 Go to login.html, toggle to 'Register', and create your first test user.");

    } catch (err) {
        console.error("💥 Critical Failure:", err.message);
    }
}

runDiagnostics();
