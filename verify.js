// verify.js - Modular Authentication
import { AuthService } from './auth-service.js';
import { Toast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
    const verifyBtn = document.getElementById('verify-btn');
    const resendLink = document.getElementById('resend-link');
    const authError = document.getElementById('auth-error');
    const verifyMsg = document.getElementById('verify-msg');

    const email = localStorage.getItem('pendingVerifyEmail');

    if (!email) {
        window.location.href = 'login.html';
        return;
    }

    verifyMsg.innerHTML = `Please enter the 6-digit code sent to <strong>${email}</strong>`;

    verifyBtn.onclick = async () => {
        const token = document.getElementById('otp-input').value.trim();

        if (!token || token.length !== 6) {
            authError.textContent = "Please enter the valid 6-digit verification code.";
            return;
        }

        try {
            verifyBtn.disabled = true;
            verifyBtn.querySelector('.btn-text').textContent = "Verifying Identity...";

            // Use the modernized AuthService method
            const data = await AuthService.verifyOtp(email, token);
            
            if (data) {
                // Success Redirection
                localStorage.removeItem('pendingVerifyEmail');
                
                // 🕵️ Check for active bookings to determine destination
                const { LuxeDB } = await import('./supabase-config.js');
                const bookings = await LuxeDB.getBookings();
                const hasActiveBooking = bookings && bookings.length > 0;

                Toast.show("Identity verified. Welcome to LuxeStay.", "success");
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                verifyBtn.disabled = false;
                verifyBtn.querySelector('.btn-text').textContent = "Verify Account";
            }

        } catch (err) {
            console.error("Verification Page Error:", err);
            verifyBtn.disabled = false;
            verifyBtn.querySelector('.btn-text').textContent = "Verify Account";
        }
    };

    resendLink.onclick = () => {
        Toast.show("Please check your inbox (including spam).", "info");
    };
});
