// Safety-First Authentication Service
import { supabase, LuxeDB } from './supabase-config.js';
import { Toast } from './toast.js';

export const AuthService = {
    // 1. Validation Logic
    validate(email, password, name = null) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (name !== null && name.trim().length < 2) {
            Toast.show("Please enter your full name.", "warning");
            return false;
        }

        if (!emailRegex.test(email)) {
            Toast.show("Please enter a valid email address.", "warning");
            return false;
        }

        if (password.length < 8) {
            Toast.show("Password must be at least 8 characters long.", "warning");
            return false;
        }

        if (!symbolRegex.test(password)) {
            Toast.show("Password must contain at least one special character.", "warning");
            return false;
        }

        return true;
    },

    // 2. Custom Nodemailer Signup (Bridges to server.js)
    async signUp(email, password, name, role = 'guest') {
        if (!this.validate(email, password, name)) return null;

        try {
            // 🛡️ SESSION PURGE: Clear any stale cloud or local sessions
            await supabase.auth.signOut();
            localStorage.removeItem('guestEmail');
            localStorage.removeItem('guestName');
            localStorage.removeItem('userRole');

            // Step 1: Send OTP via your custom Nodemailer server
            const response = await fetch('http://localhost:5000/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, password })
            });

            const result = await response.json();

            if (!result.success) {
                Toast.show(result.message || "Failed to send verification code.", "error");
                return null;
            }

            // Step 2: Inform the user and proceed to verification
            Toast.show("A luxury access code has been sent to your email.", "success");
            
            // We store the pending credentials in sessionStorage to complete signup after OTP verification
            sessionStorage.setItem('pendingSignup', JSON.stringify({ email, password, name, role }));
            
            return { pending: true };

        } catch (err) {
            console.error("Custom Signup Error:", err);
            Toast.show("Nodemailer server is currently unreachable.", "error");
            return null;
        }
    },

    // 3. Traditional Password Login (Local Authority)
    async login(email, password) {
        if (!email || !password) {
            Toast.show("Please enter both email and password.", "warning");
            return null;
        }

        try {
            // Call our CUSTOM local server to bypass Supabase 422 error
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!result.success) {
                Toast.show(result.message || "Invalid credentials.", "error");
                return null;
            }

            // Sync identity for the navbar
            localStorage.setItem('guestEmail', email);
            localStorage.setItem('guestName', result.user.full_name || 'Guest');
            localStorage.setItem('userRole', result.user.role || 'guest');
            
            Toast.show("Welcome back to LuxeStay.", "success");
            return result;

        } catch (err) {
            console.error("Custom Login Error:", err);
            Toast.show("Auth server is momentarily unreachable.", "error");
            return null;
        }
    },

    // 4. Precision Error Handler
    handleAuthError(error) {
        console.warn("Supabase Auth Error:", error.status, error.message);
        
        // Map common Supabase errors to guest-friendly messages
        const errorMap = {
            'invalid_credentials': 'The email or password provided is incorrect.',
            'user_already_exists': 'This email is already registered with LuxeStay.',
            'signup_disabled': 'New registrations are temporarily paused.',
            'invalid_grant': 'Your session has expired. Please log in again.'
        };

        const message = errorMap[error.code] || error.message || "An unexpected error occurred.";
        Toast.show(message, "error");
    },

    // 5. Custom OTP Verification (Bridges to server.js)
    async verifyOtp(email, token) {
        try {
            // Step 1: Verify against your custom Nodemailer server
            const response = await fetch('http://localhost:5000/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: token })
            });

            const result = await response.json();

            if (!result.success) {
                Toast.show(result.message || "Invalid or expired access code.", "error");
                return null;
            }

            // Step 2: Handle Signup Completion if this was a new registration
            const pending = JSON.parse(sessionStorage.getItem('pendingSignup') || '{}');
            
            if (pending.email === email) {
                // If this was a signup, we now attempt to create the Supabase Auth user 
                // Note: Since email is verified by our custom flow, we can auto-login or upsert
                localStorage.setItem('guestEmail', email);
                localStorage.setItem('guestName', pending.name);
                localStorage.setItem('userRole', pending.role || 'guest');
                sessionStorage.removeItem('pendingSignup');
            } else {
                // Regular login verification
                localStorage.setItem('guestEmail', email);
                localStorage.setItem('guestName', result.user?.full_name || 'Guest');
                localStorage.setItem('userRole', result.user?.role || 'guest');
            }

            Toast.show("Access Granted. Welcome to LuxeStay.", "success");
            return result;

        } catch (err) {
            console.error("Verification Error:", err);
            Toast.show("Verification server is currently unreachable.", "error");
            return null;
        }
    },
    
    // 6. Password Recovery
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/update-password.html',
            });
            if (error) {
                this.handleAuthError(error);
                return false;
            }
            Toast.show("Recovery instructions sent to your email.", "success");
            return true;
        } catch (err) {
            console.error("Recovery System Error:", err);
            return false;
        }
    },

    async updatePassword(newPassword) {
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) {
                this.handleAuthError(error);
                return false;
            }
            Toast.show("Password updated successfully.", "success");
            return true;
        } catch (err) {
            console.error("Password Update Error:", err);
            return false;
        }
    }
};
