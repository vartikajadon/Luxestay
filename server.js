const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(__dirname));

// Specifically serve index.html for the root route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Supabase Setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// In-memory OTP store (email -> { otp, name, expires })
const otpStore = new Map();

// Configure Nodemailer with Gmail SMTP
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("\n⚠️ Gmail SMTP connection failed! Please check your .env file credentials.");
    } else {
        console.log("\n📧 Gmail SMTP is successfully connected! Ready to send real emails.");
    }
});

app.post('/send-otp', async (req, res) => {
    const { email, name, password } = req.body;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStore.set(email, {
        otp,
        name: name || 'Guest',
        password: password, // Cache password for saving later
        expires: Date.now() + 5 * 60 * 1000
    });

    try {
        const emailHTML = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f2f5; padding: 40px 20px;">
                <div style="background-color: #0A192F; padding: 40px 30px; border-radius: 16px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <h1 style="color: #D4AF37; margin: 0 0 20px 0; font-size: 32px; letter-spacing: 2px;">LuxeStay</h1>
                    <p style="color: #ffffff; font-size: 16px; margin: 0 0 30px 0; opacity: 0.9;">Your secure access code</p>
                    <div style="background-color: rgba(212, 175, 55, 0.1); border: 2px dashed #D4AF37; border-radius: 12px; padding: 20px 30px; display: inline-block; margin-bottom: 25px;">
                        <span style="font-size: 42px; font-weight: 700; color: #D4AF37; letter-spacing: 8px; display: block;">${otp}</span>
                    </div>
                    <p style="color: #a0aabf; font-size: 14px; margin: 0;">OTP valid for 5 minutes</p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: '"LuxeStay" <noreply@luxestay.com>',
            to: email,
            subject: 'Your LuxeStay Login OTP',
            html: emailHTML
        });
        
        console.log(`✉️ Custom OTP sent to ${email}`);
        res.json({ success: true, message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData) return res.status(400).json({ success: false, message: 'OTP expired or not requested.' });
    if (Date.now() > storedData.expires) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'OTP expired.' });
    }
    if (storedData.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });

    // Success! Update Supabase Profile
    try {
        console.log(`✅ OTP Verified for ${email}. Synchronizing profile...`);
        const pending = JSON.parse(req.body.pendingData || '{}'); // We'll pass this from verify.js
        
        const { data, error } = await supabase
            .from('profiles')
            .upsert({ 
                id: require('crypto').randomUUID(),
                email: email, 
                full_name: storedData.name,
                password: storedData.password, // Store password for future logins
                updated_at: new Date()
            }, { onConflict: 'email' })
            .select();

        if (error) {
            console.error('❌ Supabase Upsert Error:', error.message, error.details);
            throw error;
        }

        otpStore.delete(email);
        console.log(`👤 Profile synchronized for ${email}`);
        
        res.json({ 
            success: true, 
            message: 'Login successful.', 
            user: {
                email: email,
                full_name: storedData.name,
                role: (data && data[0]) ? data[0].role : 'guest'
            }
        });
    } catch (err) {
        console.error('🔥 Critical Server Error during OTP Verification:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Database synchronization failed.',
            error: err.message || 'Unknown database error'
        });
    }
});

// Custom Login Endpoint (Bypasses Supabase 422 Error)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error || !data) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        res.json({ 
            success: true, 
            user: {
                email: data.email,
                full_name: data.full_name,
                role: data.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Login server error.' });
    }
});
app.get('/api/hotels/search', async (req, res) => {
    try {
        const { city } = req.query;
        console.log(`🔍 Searching curated registry for: ${city}`);

        // Query Supabase for hotels matching the city or hotel name
        const { data, error } = await supabase
            .from('hotels')
            .select('*')
            .or(`city.ilike.%${city}%,hotel_name.ilike.%${city}%`);

        if (error) throw error;

        // Format for UI
        const results = data.map(h => ({
            id: h.id,
            name: h.hotel_name,
            city: h.city,
            country: h.country,
            rating: h.rating,
            price: h.price_per_night,
            img: h.image_url,
            amenities: h.amenities || []
        }));

        res.json(results);
    } catch (error) {
        console.error('🏨 Discovery Registry Error:', error.message);
        res.status(500).json({ error: 'Curated Registry currently unavailable' });
    }
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 LuxeStay Backend API is running!`);
        console.log(`👉 Click here to test: http://localhost:${PORT}`);
    });
}

module.exports = app;
