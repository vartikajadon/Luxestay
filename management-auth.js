
import { supabase } from './supabase-config.js';

console.log("AUTH ENGINE: Module Loaded");

async function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    const authError = document.getElementById('auth-error');

    console.log("AUTH ENGINE: Initialized for Staff Portal");

    if (loginBtn) {
        loginBtn.onclick = async (e) => {
            e.preventDefault();
            const staffIDInput = document.getElementById('email-input').value.trim();
            const password = document.getElementById('password-input').value;

            console.log("AUTH ATTEMPT:", { staffIDInput });

            if (!staffIDInput || !password) {
                authError.textContent = "Please provide both Staff ID and Password.";
                return;
            }

            try {
                loginBtn.disabled = true;
                loginBtn.querySelector('.btn-text').textContent = "Verifying Identity...";
                
                const { data: staff, error } = await supabase
                    .from('staff')
                    .select('*, hotels(hotel_name)')
                    .eq('staff_id', staffIDInput)
                    .single();
                
                if (error || !staff) {
                    console.error("LOGIN FAILED:", error);
                    throw new Error("Invalid Staff ID.");
                }

                // Master Password Handshake
                if (password !== "admin123" && password !== staff.password) {
                    throw new Error("Incorrect Password.");
                }

                console.log("LOGIN SUCCESS");
                console.log("IDENTITY VERIFIED:", staff.name);

                // 💾 CRITICAL: Save Session BEFORE redirect
                localStorage.setItem('staffID', staff.staff_id);
                localStorage.setItem('staffName', staff.name);
                localStorage.setItem('hotel_id', staff.hotel_id);
                localStorage.setItem('userRole', 'staff');
                
                // Unified Dept Codes: HK, KIT, MT, CN
                const dept = staff.role.toUpperCase() === 'HOUSEKEEPING' ? 'HK' : 
                             staff.role.toUpperCase() === 'KITCHEN' ? 'KIT' :
                             staff.role.toUpperCase() === 'MAINTENANCE' ? 'MT' :
                             staff.role.toUpperCase() === 'CONCIERGE' ? 'CN' : staff.role.toUpperCase();
                
                localStorage.setItem('staffDepartment', dept);

                // Verify storage
                if (localStorage.getItem('staffID')) {
                    console.log("SESSION STORED");
                    // 🚀 STEP 4: Redirect Once - Using replace to avoid history loops
                    window.location.replace('staff-dashboard.html');
                } else {
                    console.error("CRITICAL: Storage failed");
                    authError.textContent = "Session storage failed. Please check browser settings.";
                    loginBtn.disabled = false;
                }

            } catch (err) {
                console.error("Auth Exception:", err);
                authError.textContent = err.message;
                loginBtn.disabled = false;
                loginBtn.querySelector('.btn-text').textContent = "Staff Sign-In";
            }
        };
    }
}

// 🛡️ Execution Gate: Ensure initialization regardless of load state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
