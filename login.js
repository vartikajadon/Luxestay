// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const authError = document.getElementById('auth-error');

    if (loginBtn) {
        loginBtn.onclick = async () => {
            const email = document.getElementById('email-input').value.trim();
            const password = document.getElementById('password-input').value;

            if (!email || !password) {
                authError.textContent = "Please enter your credentials.";
                return;
            }

            try {
                loginBtn.disabled = true;
                loginBtn.querySelector('.btn-text').textContent = "Authenticating...";

                const { data, error } = await LuxeDB.loginWithPassword(email, password);
                
                if (error) {
                    // Check if it's an unconfirmed email error
                    if (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verify')) {
                        localStorage.setItem('pendingVerifyEmail', email);
                        NotificationSystem.showToast("Account not verified. Redirecting to verification...", "info");
                        setTimeout(() => window.location.href = 'verify.html', 2000);
                        return;
                    }
                    throw error;
                }

                // Success Redirection based on role
                const user = await LuxeDB.getUser();
                const role = user?.role || 'guest';
                
                let target = 'dashboard.html';
                if (role === 'admin') target = 'admin-dashboard.html';
                else if (role === 'staff') target = 'staff-panel.html';

                window.location.href = target;

            } catch (err) {
                console.error("Login Error:", err);
                authError.textContent = err.message || "Invalid email or password.";
                loginBtn.disabled = false;
                loginBtn.querySelector('.btn-text').textContent = "Sign In";
            }
        };
    }
});
