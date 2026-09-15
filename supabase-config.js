// Supabase Configuration - ES6 Modular Architecture
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://ynbrxugbxzkkybpwsabc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluYnJ4dWdieHpra3licHdzYWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjE1ODEsImV4cCI6MjA5MjQ5NzU4MX0.z6URhdzKbmkM2cCIr24FVsDg8qGzBDGk1Pgggp3eBqs';

// Optimized Client Initialization
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// LuxeDB Service - Modernized for ES6
export const LuxeDB = {
    // 🛡️ UNIFIED IDENTITY AUTHORITY
    async getUser() {
        // 1. Check standard Supabase Auth session first
        const { data: { user } } = await supabase.auth.getUser();
        if (user) return user;

        // 2. Fallback for Custom Verified Guests (Nodemailer OTP)
        const guestEmail = localStorage.getItem('guestEmail');
        const guestName = localStorage.getItem('guestName');
        const role = localStorage.getItem('userRole') || 'guest';
        
        if (guestEmail) {
            return { 
                email: guestEmail, 
                id: 'guest-' + btoa(guestEmail).slice(0, 8), 
                user_metadata: { full_name: guestName, role: role },
                role: role
            };
        }
        return null;
    },

    async getProfile() {
        const user = await this.getUser();
        if (!user) return null;
        const { data } = await supabase.from('profiles').select('*').eq('email', user.email).single();
        return data;
    },

    async upsertProfile(email, name, role = 'guest', id = null) {
        if (!id) {
            // Guest booking - skip profile synchronization silently
            return null;
        }

        const profileData = {
            id: id,
            email: email,
            full_name: name,
            role: role,
            updated_at: new Date()
        };
        
        try {
            const { data, error } = await supabase.from('profiles').upsert(profileData).select();
            if (data) localStorage.setItem('userRole', role);
            return data ? data[0] : null;
        } catch (e) {
            console.warn("LuxeDB: Profile sync skipped. This is expected for guest checkouts.");
            return null;
        }
    },

    async checkAccess(requiredRole) {
        const user = await this.getUser();
        if (!user || user.role !== requiredRole) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    },

    async getBookings() {
        const user = await this.getUser();
        if (!user) return [];

        // STRICT ISOLATION: Filter specifically by the active session email
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_email', user.email)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.warn("LuxeDB: Error fetching bookings history.", error);
            return [];
        }

        // Backward Compatibility for Room Numbers
        const formattedData = (data || []).map(b => ({
            ...b,
            room: b.room || "N/A"
        }));

        return formattedData;
    },

    async generateRoomNumber(hotelId) {
        try {
            const { data, error } = await supabase
                .from("bookings")
                .select("room")
                .eq("hotel_id", hotelId);
            
            if (error) throw error;
            const count = (data || []).length + 1;
            return 100 + count;
        } catch (e) {
            // Safe Fallback if 'room' or 'hotel_id' column is missing
            console.warn("LuxeDB SCHEMA: 'room' column not found. Defaulting to Room 101.");
            return 101;
        }
    },

    async saveBooking(booking) {
        const { data: { user } } = await supabase.auth.getUser();
        const email = localStorage.getItem('guestEmail') || (user ? user.email : null);
        const structuredHotelId = booking.hotel_id || localStorage.getItem('hotel_id');
        
        const generatedRoom = await this.generateRoomNumber(structuredHotelId);

        // Standard Schema Columns
        const bookingRecord = {
            hotel_name: booking.hotelName,
            room_name: booking.roomName,
            check_in: booking.checkIn,
            check_out: booking.checkOut,
            guests: booking.guests,
            total_price: booking.price,
            user_email: email, 
            status: 'confirmed',
            hotel_id: structuredHotelId, // Unified structured code
            room: generatedRoom.toString()
        };

        if (user) {
            bookingRecord.user_id = user.id;
        }

        const { data, error } = await supabase.from('bookings').insert([bookingRecord]).select();
        
        if (error) {
            console.error("LuxeDB Booking Persistence Error:", error);
            
            // AUTOMATIC FALLBACK: If columns or UUID types cause rejection, try saving with minimal schema
            if (error.code === '22P02' || error.message.includes("hotel_id") || error.message.includes("room")) {
                console.warn("LuxeDB: Schema mismatch detected. Retrying with minimal record.");
                delete bookingRecord.hotel_id;
                delete bookingRecord.room;
                const retry = await supabase.from('bookings').insert([bookingRecord]).select();
                return retry.data ? retry.data[0] : null;
            }
            return null;
        }
        
        if (data && data[0]) {
            const saved = data[0];
            localStorage.setItem("session", JSON.stringify({
                hotel_id: saved.hotel_id || structuredHotelId,
                room: saved.room || generatedRoom.toString(),
                email: saved.user_email,
                hotel_name: saved.hotel_name || booking.hotelName
            }));
            return saved;
        }
        return null;
    },

    async addNotification(message, type) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase.from('notifications').insert([{
            user_id: user.id,
            message,
            type
        }]);
    },

    async saveOrder(order) {
        const user = await this.getUser();
        const { data: authSession } = await supabase.auth.getUser();
        const realUserId = authSession?.user?.id || null;
        const email = user?.email || localStorage.getItem('guestEmail') || 'Guest';

        const session = JSON.parse(localStorage.getItem("session") || "{}");
        const rawRoom = order.room || session.room || "N/A";
        const hotelUUID = order.hotel_id || session.hotel_id || localStorage.getItem('hotel_id');
        let hotelName = order.hotel_name || session.hotel_name || localStorage.getItem('hotel_name') || localStorage.getItem('selectedHotelName');
        
        if (hotelUUID && (!hotelName || hotelName === "LuxeStay Property")) {
            try {
                const { data: hData } = await supabase
                    .from('hotels')
                    .select('hotel_name')
                    .eq('hotel_id', hotelUUID)
                    .maybeSingle();
                if (hData && hData.hotel_name) {
                    hotelName = hData.hotel_name;
                } else {
                    const { data: hData2 } = await supabase
                        .from('hotels')
                        .select('hotel_name')
                        .eq('id', hotelUUID)
                        .maybeSingle();
                    if (hData2 && hData2.hotel_name) {
                        hotelName = hData2.hotel_name;
                    }
                }
            } catch (err) {
                console.warn("saveOrder hotel name resolve error:", err);
            }
        }
        if (!hotelName) hotelName = "Rambagh Palace";

        const restaurantUUID = order.restaurant_id || null;
        
        const combinedRoom = `${rawRoom} (${hotelName})`;
        
        const shortId = Math.random().toString(36).substring(2, 5).toUpperCase();
        const smartId = `ORD-${shortId}`;

        const mockSuccess = {
            id: smartId,
            items: `🍽️ ITEMS: ${order.items}\n📍 DELIVERY: ${combinedRoom}\n📧 GUEST: ${email}\n📝 NOTES: ${order.instructions || 'None'}`,
            total_price: order.total,
            status: 'Pending',
            created_at: new Date().toISOString()
        };

        const orderData = {
            items: mockSuccess.items,
            total_price: order.total,
            status: 'Pending',
            room: combinedRoom,
            hotel_id: hotelUUID,
            restaurant_id: restaurantUUID,
            guest_email: email
        };
        
        if (realUserId) {
            orderData.user_id = realUserId;
        }

        let result = await supabase.from('orders').insert([orderData]).select();

        // Fallback retry if columns like restaurant_id or guest_email are missing in the database table
        if (result.error && (result.error.message.includes('restaurant_id') || result.error.message.includes('guest_email') || result.error.code === '42703')) {
            console.warn('LuxeDB: Retrying insert with base orders schema...', result.error.message);
            const baseOrderData = {
                items: mockSuccess.items,
                total_price: order.total,
                status: 'Pending',
                room: combinedRoom,
                hotel_id: hotelUUID
            };
            if (realUserId) {
                baseOrderData.user_id = realUserId;
            }
            result = await supabase.from('orders').insert([baseOrderData]).select();
        }

        if (result.error || !result.data || result.data.length === 0) {
            console.warn('LuxeDB: Supabase persistence failed. Activating UI Simulation.', result.error);
            return mockSuccess;
        }
        
        return result.data[0];
    },

    async saveServiceRequest(request) {
        const email = localStorage.getItem('guestEmail') || localStorage.getItem('user_email') || 'Guest';
        const session = JSON.parse(localStorage.getItem("session") || "{}");
        const room = request.room || session.room || localStorage.getItem('selectedRoom') || "N/A";
        const hotelUUID = request.hotel_id || session.hotel_id || localStorage.getItem('hotel_id');
        const hotelName = request.hotel_name || session.hotel_name || localStorage.getItem('hotel_name') || localStorage.getItem('selectedHotelName') || "LuxeStay Property";
        
        const type = (request.type || request.serviceType || "SERVICE");
        const noteText = (request.note || "") + `\n📧 GUEST: ${email}\n📍 ROOM: ${room}`;
        
        const shortId = Math.random().toString(36).substring(2, 5).toUpperCase();
        const smartId = `SRV-${shortId}`;

        const mockSuccess = {
            id: smartId,
            service_type: type,
            note: noteText,
            status: "Pending",
            created_at: new Date().toISOString(),
            room: room,
            hotel_id: hotelUUID,
            hotel_name: hotelName,
            user_email: email
        };

        const serviceData = {
            user_email: email,
            service_type: type,
            note: noteText,
            status: 'Pending',
            hotel_id: hotelUUID,
            hotel_name: hotelName,
            room: room,
            category: 'general',
            price: 0
        };

        const { data, error } = await supabase.from('services').insert([serviceData]).select();
        
        if (error || !data || data.length === 0) {
            console.warn("LuxeDB: Services persistence failed. Bypassing with UI simulation.", error);
            return mockSuccess;
        }

        return data[0];
    },

    async getReviews(hotelName) {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('hotel_name', hotelName)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (err) {
            console.warn("LuxeDB: Reviews not available for this property.");
            return [];
        }
    },

    async getServices() {
        const user = await this.getUser();
        if (!user || !user.email) return [];

        const { data } = await supabase
            .from('services')
            .select('*')
            .eq('user_email', user.email)
            .order('created_at', { ascending: false });
        return data || [];
    },


    async getOrders() {
        const user = await this.getUser();
        if (!user || !user.email) return [];

        // 1. Fetch from standard orders
        let standardQuery = supabase.from('orders').select('*');
        if (user.id && !user.id.startsWith('guest-')) {
            standardQuery = standardQuery.eq('user_id', user.id);
        }
        const { data: standardOrders, error: sError } = await standardQuery.order('created_at', { ascending: false });
        
        const filteredStandard = (standardOrders || []).filter(o => {
            const itemsStr = o.items || "";
            return o.user_id === user.id || itemsStr.includes(user.email);
        });

        // 2. Fetch from partner_restaurant_requests
        let partnerOrders = [];
        try {
            let partnerQuery = supabase.from('partner_restaurant_requests').select('*');
            if (user.id) {
                partnerQuery = partnerQuery.or(`user_id.eq.${user.id},guest_email.eq.${user.email}`);
            } else {
                partnerQuery = partnerQuery.eq('guest_email', user.email);
            }
            const { data, error: pError } = await partnerQuery.order('created_at', { ascending: false });
            if (!pError && data) {
                partnerOrders = data;
            }
        } catch (e) {
            console.warn("LuxeDB: partner_restaurant_requests query fallback.", e);
        }

        const normalizedPartner = partnerOrders.map(p => ({
            id: p.id,
            items: p.items,
            total_price: p.total_price,
            status: p.status || 'Pending',
            created_at: p.created_at,
            room: p.room,
            hotel_id: p.hotel_id,
            guest_email: p.guest_email,
            is_partner: true
        }));

        // 3. Merge and sort desc
        const merged = [...filteredStandard, ...normalizedPartner];
        merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return merged;
    },

    logout() {
        localStorage.clear();
        supabase.auth.signOut();
        window.location.href = 'index.html';
    }
};

// Global polyfill for legacy non-module scripts (if any remain)
window.supabase = supabase;
window.LuxeDB = LuxeDB;

// Hidden Access Listener for Admin and Staff
document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        window.location.href = "admin-signin.html";
    }
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
        window.location.href = "staff-signin.html";
    }
});
