// Admin Dashboard - Full Supabase Operational Integration
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Role Check
    const role = localStorage.getItem('userRole');
    if (role !== 'admin' && role !== 'staff') {
        window.location.href = 'index.html';
        return;
    }

    // 2. Set Admin/Staff Identity
    const userEmail = localStorage.getItem('adminEmail') || localStorage.getItem('userEmail') || 'staff@luxestay.com';
    document.getElementById('admin-name').textContent = userEmail.split('@')[0].toUpperCase();
    
    // 3. Real-time Clock
    const updateTime = () => {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    };
    setInterval(updateTime, 1000);
    updateTime();

    // 4. Initial Global Load
    await initializeGlobalHotelSelect();
    await refreshDashboard();

    // 5. Navigation Listeners
    let currentTab = 'overview';
    
    document.getElementById('overviewBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'overview'; switchTab('overview'); refreshDashboard(); });
    document.getElementById('bookingsBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'bookings'; switchTab('bookings'); loadBookings(); });
    document.getElementById('guestProfilesBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'guests'; switchTab('guests'); loadGuestProfiles(); });
    document.getElementById('serviceRequestsBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'services'; switchTab('services'); loadServiceRequestsFull(); });
    document.getElementById('menuManagementBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'menu'; switchTab('menu'); loadMenuItems(); });
    document.getElementById('staffManagementBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'staff'; switchTab('staff'); loadStaff(); });
    document.getElementById('financeManagementBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'finance'; switchTab('finance'); fetchFinanceData(); });
    document.getElementById('systemSettingsBtn')?.addEventListener('click', (e) => { e.preventDefault(); currentTab = 'settings'; switchTab('settings'); loadSettings(); });
    
    // 6. Action Listeners
    document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);
    document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
        filterMenuByCategory(e.target.value);
    });
    document.getElementById('dateFilter')?.addEventListener('change', (e) => {
        filterFinanceByDate(e.target.value);
    });
    
    document.getElementById('globalHotelSelect')?.addEventListener('change', async () => {
        console.log("LuxeStay: Global Property Filter updated. Refreshing [", currentTab, "]");
        if (currentTab === 'overview') await refreshDashboard();
        else if (currentTab === 'bookings') await loadBookings();
        else if (currentTab === 'guests') await loadGuestProfiles();
        else if (currentTab === 'services') await loadServiceRequestsFull();
        else if (currentTab === 'menu') await loadMenuItems();
        else if (currentTab === 'staff') await loadStaff();
        else if (currentTab === 'finance') await fetchFinanceData();
        else if (currentTab === 'settings') await loadSettings();
    });
});

// 🔔 LUXE NOTIFICATION SYSTEM
function showMessage(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `luxe-toast ${type}`;
    toast.innerHTML = `<i class="ph ${type === 'error' ? 'ph-x-circle' : type === 'warning' ? 'ph-warning' : 'ph-check-circle'}"></i><span>${message}</span>`;
    Object.assign(toast.style, { position: 'fixed', top: '30px', right: '30px', padding: '16px 25px', borderRadius: '12px', background: type === 'error' ? 'rgba(255,68,68,0.95)' : type === 'warning' ? 'rgba(243,156,18,0.95)' : 'rgba(46,204,113,0.95)', color: '#fff', zIndex: '10000', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', animation: 'slideIn 0.3s ease-out', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.9rem', fontWeight: '600' });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut 0.3s ease-in forwards'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// 🏛️ LUXE MODAL SYSTEM (PROMISE-BASED)
const LuxeModal = {
    confirm: (message) => {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '10001' });
            overlay.innerHTML = `<div class="modal-card" style="background:#07101E; border:1px solid rgba(212,175,55,0.3); padding:40px; border-radius:20px; width:400px; text-align:center; animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);"><i class="ph ph-warning-circle" style="font-size:3rem; color:#D4AF37; margin-bottom:20px; display:block;"></i><h3 style="color:#fff; margin-bottom:15px; font-family:'Cinzel', serif;">Confirm Action</h3><p style="color:#B0B7C3; margin-bottom:30px; font-size:0.95rem;">${message}</p><div style="display:flex; gap:15px; justify-content:center;"><button id="modalCancel" style="padding:10px 25px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:none; color:#fff; cursor:pointer;">Cancel</button><button id="modalConfirm" style="padding:10px 25px; border-radius:8px; border:none; background:#D4AF37; color:#000; font-weight:700; cursor:pointer;">Proceed</button></div></div>`;
            document.body.appendChild(overlay);
            overlay.querySelector('#modalConfirm').onclick = () => { overlay.remove(); resolve(true); };
            overlay.querySelector('#modalCancel').onclick = () => { overlay.remove(); resolve(false); };
        });
    },
    prompt: (message, defaultValue = "") => {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            Object.assign(overlay.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '10001' });
            overlay.innerHTML = `<div class="modal-card" style="background:#07101E; border:1px solid rgba(212,175,55,0.3); padding:40px; border-radius:20px; width:450px; text-align:center; animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);"><h3 style="color:#fff; margin-bottom:15px; font-family:'Cinzel', serif;">Administrative Input</h3><p style="color:#B0B7C3; margin-bottom:20px; font-size:0.9rem;">${message}</p><input type="text" id="modalInput" value="${defaultValue}" style="width:100%; padding:12px; background:rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.2); border-radius:8px; color:#fff; margin-bottom:25px; outline:none; text-align:center;"><div style="display:flex; gap:15px; justify-content:center;"><button id="modalCancel" style="padding:10px 25px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:none; color:#fff; cursor:pointer;">Cancel</button><button id="modalConfirm" style="padding:10px 25px; border-radius:8px; border:none; background:#D4AF37; color:#000; font-weight:700; cursor:pointer;">Submit</button></div></div>`;
            document.body.appendChild(overlay);
            const input = overlay.querySelector('#modalInput'); input.focus();
            overlay.querySelector('#modalConfirm').onclick = () => { const val = input.value; overlay.remove(); resolve(val); };
            overlay.querySelector('#modalCancel').onclick = () => { overlay.remove(); resolve(null); };
        });
    }
};

// 🏨 MULTI-HOTEL CORE LOGIC
const getHotelContext = () => {
    const role = localStorage.getItem('userRole');
    const hotelId = localStorage.getItem('hotel_id');
    return { isGlobal: role === 'admin', hotelId: hotelId };
};

const applyHotelFilter = (query) => {
    const { isGlobal, hotelId } = getHotelContext();
    
    // For Property Staff: Securely lock to their assigned hotel_id
    if (!isGlobal && hotelId) {
        return query.eq('hotel_id', hotelId);
    }
    
    // For Global Admins: Apply dynamic filter from the globalHotelSelect dropdown if a property is selected
    if (isGlobal) {
        const hotelSelect = document.getElementById('globalHotelSelect');
        if (hotelSelect && hotelSelect.value) {
            console.log(`LuxeStay: Global Filtering for Property UUID [${hotelSelect.value}]`);
            return query.eq('hotel_id', hotelSelect.value);
        }
    }
    
    return query;
};

async function refreshDashboard() {
    console.log("LuxeStay: Initiating Global Operational Sweep...");
    const [b, o, s, e] = await Promise.all([getBookings(), getOrders(), getServices(), getExpenses()]);
    
    console.log("LuxeStay: Data Sweep Results:", {
        bookings: b.length,
        orders: o.length,
        services: s.length,
        expenses: e.length
    });

    // 📊 Update HUD Cards (First Row)
    calculateRevenue(b, o, s); // Enhanced to show total gross revenue
    calculateActiveResidences(b);
    updatePendingServicesCounter(s);
    
    // 💰 Update Finance Cards (Second/Third Rows)
    calculateFinance(b, o, s, e);
    
    // 📋 Update Tables & Activity
    renderRecentBookings(b);
    renderServiceRequestsMini(s);
}

function updatePendingServicesCounter(services) {
    const pendingCount = services.filter(s => (s.status || 'Pending').toLowerCase() === 'pending').length;
    const highPriority = services.filter(s => (s.status || 'Pending').toLowerCase() === 'pending' && (s.priority === 'high' || s.service_type?.toLowerCase().includes('emergency'))).length;
    
    const countEl = document.getElementById('pending-services');
    if (countEl) countEl.innerText = pendingCount;
    
    // Update the trend/badge if it exists
    const trendEl = countEl?.parentElement?.querySelector('.trend');
    if (trendEl) {
        trendEl.innerHTML = `<i class="ph ph-warning"></i> ${highPriority} High Priority`;
        trendEl.className = highPriority > 0 ? 'trend alert' : 'trend';
    }
}

// 🔌 SUPABASE CORE OPERATIONS
async function getBookings() { let q = window.supabase.from('bookings').select('*').order('created_at', { ascending: false }); q = applyHotelFilter(q); const { data, error } = await q; if(error) console.error("Bookings Fetch Error:", error); return data || []; }
async function getServices() { let q = window.supabase.from('services').select('*').order('created_at', { ascending: false }); q = applyHotelFilter(q); const { data, error } = await q; if(error) console.error("Services Fetch Error:", error); return data || []; }
async function getOrders() { let q = window.supabase.from('orders').select('*').order('created_at', { ascending: false }); q = applyHotelFilter(q); const { data, error } = await q; if(error) console.error("Orders Fetch Error:", error); return data || []; }
async function getStaff() { let q = window.supabase.from('staff').select('*').order('created_at', { ascending: true }); q = applyHotelFilter(q); const { data, error } = await q; if(error) console.error("Staff Fetch Error:", error); return data || []; }
async function getGuests() { let q = window.supabase.from('profiles').select('*').eq('role', 'guest'); q = applyHotelFilter(q); const { data, error } = await q; if(error) console.error("Profiles Fetch Error:", error); return data || []; }
async function getMenuItems() { let q = window.supabase.from('menu_items').select('*').order('category'); q = applyHotelFilter(q); const { data, error } = await q; if(error) console.error("Menu Fetch Error:", error); return data || []; }
async function getExpenses() { let q = window.supabase.from('expenses').select('*').order('created_at', { ascending: false }); q = applyHotelFilter(q); const { data, error } = await q; if(error) console.error("Expenses Fetch Error:", error); return data || []; }
async function getHotels() { 
    console.log("LuxeStay: Fetching hotels from Supabase...");
    try {
        const { data, error } = await window.supabase.from('hotels').select('*').order('hotel_name'); 
        if(error) {
            console.error("LuxeStay: Hotels Fetch Error:", error);
            return [];
        }
        console.log(`LuxeStay: Successfully retrieved ${data ? data.length : 0} properties.`);
        return data || []; 
    } catch (err) {
        console.error("LuxeStay: Critical error in getHotels:", err);
        return [];
    }
}

// 💰 FINANCE MANAGEMENT logic
let globalFinanceData = { bookings: [], orders: [], services: [], expenses: [] };
let charts = { revenue: null, category: null, profit: null, growth: null };

async function fetchFinanceData() {
    const [b, o, s, e] = await Promise.all([getBookings(), getOrders(), getServices(), getExpenses()]);
    globalFinanceData = { bookings: b, orders: o, services: s, expenses: e };
    calculateFinance(b, o, s, e);
    loadBillingRecords(b, o, s);
    loadCharts(b, o, s, e);
    renderGrowthChart(b, o, s);
}

function filterFinanceByDate(type) {
    const now = new Date();
    const isToday = (date) => new Date(date).toDateString() === now.toDateString();
    const isThisMonth = (date) => { const d = new Date(date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); };
    let fb = globalFinanceData.bookings, fo = globalFinanceData.orders, fs = globalFinanceData.services, fe = globalFinanceData.expenses;
    if (type === "today") { fb = fb.filter(b => isToday(b.created_at || b.checkin)); fo = fo.filter(o => isToday(o.created_at)); fs = fs.filter(s => isToday(s.created_at)); fe = fe.filter(e => isToday(e.created_at)); }
    else if (type === "month") { fb = fb.filter(b => isThisMonth(b.created_at || b.checkin)); fo = fo.filter(o => isThisMonth(o.created_at)); fs = fs.filter(s => isThisMonth(s.created_at)); fe = fe.filter(e => isThisMonth(e.created_at)); }
    calculateFinance(fb, fo, fs, fe); loadBillingRecords(fb, fo, fs); loadCharts(fb, fo, fs, fe);
}

function calculateFinance(b, o, s, e) {
    let room = 0, food = 0, service = 0, expense = 0;
    
    // Status-agnostic accumulation (handles case sensitivity and multiple success states)
    const isSuccess = (status) => ['confirmed', 'delivered', 'completed', 'paid', 'active'].includes(String(status || '').toLowerCase());

    b.forEach(x => { if (isSuccess(x.status)) room += Number(x.price || x.total_price || x.amount || 0); });
    o.forEach(x => { if (isSuccess(x.status)) food += Number(x.total_price || x.price || x.amount || 0); });
    s.forEach(x => { if (isSuccess(x.status)) service += Number(x.price || x.amount || 0); });
    e.forEach(x => { expense += Number(x.amount || x.price || 0); });

    const total = room + food + service, profit = total - expense;

    // Update Overview HUD (Card 1)
    if (document.getElementById("totalRevenue")) {
        document.getElementById("totalRevenue").innerText = "₹" + total.toLocaleString();
    }

    // Update Finance Specific Cards
    if (document.getElementById("roomRevenue")) document.getElementById("roomRevenue").innerText = "₹" + room.toLocaleString(); 
    if (document.getElementById("foodRevenue")) document.getElementById("foodRevenue").innerText = "₹" + food.toLocaleString(); 
    if (document.getElementById("serviceRevenue")) document.getElementById("serviceRevenue").innerText = "₹" + service.toLocaleString(); 
    if (document.getElementById("financeTotalRevenue")) document.getElementById("financeTotalRevenue").innerText = "₹" + total.toLocaleString(); 
    if (document.getElementById("totalExpenses")) document.getElementById("totalExpenses").innerText = "₹" + expense.toLocaleString(); 
    if (document.getElementById("profit")) document.getElementById("profit").innerText = "₹" + profit.toLocaleString();
}

function loadBillingRecords(b, o, s) {
    const table = document.getElementById("billingTable"); if (!table) return; table.innerHTML = "";
    const records = [];
    b.forEach(x => records.push({ user: x.user_email || 'Guest', stream: 'Residency', detail: x.room_type || x.hotel_name, amount: x.price || x.total_price, status: x.status, date: x.created_at }));
    o.forEach(x => records.push({ user: x.user_email || 'Guest', stream: 'Epicurean', detail: x.items || 'Food Order', amount: x.total_price, status: x.status, date: x.created_at }));
    s.forEach(x => records.push({ user: x.user_email || 'Guest', stream: 'Service', detail: x.service_type || x.type, amount: x.price || 0, status: x.status, date: x.created_at }));
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (!records.length) { table.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px;">No billing records found.</td></tr>'; return; }
    records.forEach(r => { table.innerHTML += `<tr><td>${r.user}</td><td><span class="status-badge" style="background:rgba(212,175,55,0.1); color:#D4AF37;">${r.stream.toUpperCase()}</span></td><td style="font-size:0.8rem;">${r.detail}</td><td style="font-weight:600;">₹${Number(r.amount).toLocaleString()}</td><td><span class="status-badge ${['Confirmed', 'Delivered', 'Completed'].includes(r.status) ? 'confirmed' : 'pending'}">${(r.status || 'PENDING').toUpperCase()}</span></td></tr>`; });
}

function loadCharts(b, o, s, e) {
    const ctxR = document.getElementById('revenueChart')?.getContext('2d'), ctxC = document.getElementById('categoryChart')?.getContext('2d'), ctxP = document.getElementById('profitChart')?.getContext('2d');
    if (!ctxR || !ctxC || !ctxP) return;
    Object.values(charts).forEach(c => { if (c && c.canvas.id !== 'growthChart') c.destroy(); });
    let room = 0, food = 0, service = 0, expense = 0;
    b.forEach(x => { if (x.status === "Confirmed") room += Number(x.price || x.total_price || 0); });
    o.forEach(x => { if (x.status === "Delivered") food += Number(x.total_price || 0); });
    s.forEach(x => { if (x.status === "Completed") service += Number(x.price || 0); });
    e.forEach(x => { expense += Number(x.amount || 0); });
    const total = room + food + service, profit = total - expense;
    Chart.defaults.color = '#B0B7C3'; Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
    charts.revenue = new Chart(ctxR, { type: 'bar', data: { labels: ['Room', 'Food', 'Service'], datasets: [{ label: 'Revenue (₹)', data: [room, food, service], backgroundColor: ['rgba(212, 175, 55, 0.6)', 'rgba(76, 175, 80, 0.6)', 'rgba(33, 150, 243, 0.6)'], borderColor: ['#D4AF37', '#4CAF50', '#2196F3'], borderWidth: 1 }] }, options: { responsive: true, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } } });
    charts.category = new Chart(ctxC, { type: 'doughnut', data: { labels: ['Room', 'Food', 'Service'], datasets: [{ data: [room, food, service], backgroundColor: ['#D4AF37', '#4CAF50', '#2196F3'], borderWidth: 0, hoverOffset: 10 }] }, options: { responsive: true, plugins: { legend: { position: 'bottom' } } } });
    charts.profit = new Chart(ctxP, { type: 'line', data: { labels: ['Revenue', 'Expense', 'Profit'], datasets: [{ label: 'Financial Outlook', data: [total, expense, profit], borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.1)', fill: true, tension: 0.4, pointBackgroundColor: ['#D4AF37', '#ff4444', '#4CAF50'], pointRadius: 6 }] }, options: { responsive: true, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } } } });
}

function renderGrowthChart(b, o, s) {
    const ctx = document.getElementById('growthChart')?.getContext('2d'); if (!ctx) return;
    if (charts.growth) charts.growth.destroy();
    const dailyMap = {};
    b.forEach(x => { if (x.status === "Confirmed") { const d = (x.created_at || x.checkin).split("T")[0]; dailyMap[d] = (dailyMap[d] || 0) + Number(x.price || x.total_price || 0); } });
    o.forEach(x => { if (x.status === "Delivered") { const d = x.created_at.split("T")[0]; dailyMap[d] = (dailyMap[d] || 0) + Number(x.total_price || 0); } });
    s.forEach(x => { if (x.status === "Completed") { const d = x.created_at.split("T")[0]; dailyMap[d] = (dailyMap[d] || 0) + Number(x.price || 0); } });
    const labels = Object.keys(dailyMap).sort(), values = labels.map(d => dailyMap[d]);
    charts.growth = new Chart(ctx, { type: 'line', data: { labels, datasets: [{ label: 'Daily Gross Revenue (₹)', data: values, borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)', fill: true, tension: 0.3, pointBackgroundColor: '#4CAF50' }] }, options: { responsive: true, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { color: 'rgba(255,255,255,0.05)' } } } } });
}

window.exportFinanceCSV = () => {
    let csv = "User,Stream,Detail,Amount,Status,Date\n";
    globalFinanceData.bookings.forEach(x => csv += `${x.user_email || 'Guest'},Residency,${x.room_type || x.hotel_name},${x.price || x.total_price},${x.status},${x.created_at}\n`);
    globalFinanceData.orders.forEach(x => csv += `${x.user_email || 'Guest'},Epicurean,${x.items || 'Food'},${x.total_price},${x.status},${x.created_at}\n`);
    globalFinanceData.services.forEach(x => csv += `${x.user_email || 'Guest'},Service,${x.service_type || x.type},${x.price},${x.status},${x.created_at}\n`);
    const blob = new Blob([csv], { type: "text/csv" }), url = window.URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = `LuxeStay_Finance_Report_${new Date().toISOString().split('T')[0]}.csv`; a.click();
};

window.openAddExpenseModal = async () => {
    const title = await LuxeModal.prompt("Expense Title:");
    const amount = await LuxeModal.prompt("Expense Amount (INR):");
    const { hotelId } = getHotelContext();
    if (title && amount) {
        const { error } = await window.supabase.from('expenses').insert([{ title, amount: parseFloat(amount), hotel_id: hotelId }]);
        if (error) showMessage("Error: " + error.message, "error");
        else { showMessage("Expense recorded successfully."); fetchFinanceData(); }
    }
};

// ⚙️ SYSTEM SETTINGS logic
async function loadSettings() {
    let q = window.supabase.from('system_settings').select('*').limit(1);
    q = applyHotelFilter(q);
    const { data, error } = await q.single();
    if (error && error.code !== 'PGRST116') { console.error("Fetch Settings Error:", error); return; }
    if (data) {
        document.getElementById("hotelName").value = data.hotel_name || ""; document.getElementById("contactNumber").value = data.contact_number || ""; document.getElementById("email").value = data.email || ""; document.getElementById("address").value = data.address || ""; document.getElementById("currency").value = data.currency || "INR"; document.getElementById("tax").value = data.tax_percent || "18"; document.getElementById("checkin").value = data.checkin_time || "02:00 PM"; document.getElementById("checkout").value = data.checkout_time || "12:00 PM";
    }
}

async function saveSettings() {
    const { hotelId } = getHotelContext();
    const settings = { hotel_name: document.getElementById("hotelName").value, contact_number: document.getElementById("contactNumber").value, email: document.getElementById("email").value, address: document.getElementById("address").value, currency: document.getElementById("currency").value, tax_percent: parseFloat(document.getElementById("tax").value) || 0, checkin_time: document.getElementById("checkin").value, checkout_time: document.getElementById("checkout").value, hotel_id: hotelId };
    let q = window.supabase.from('system_settings').select('id').limit(1);
    q = applyHotelFilter(q);
    const { data: existing } = await q;
    let result; if (existing && existing.length > 0) { result = await window.supabase.from('system_settings').update(settings).eq('id', existing[0].id); } else { result = await window.supabase.from('system_settings').insert([settings]); }
    if (result.error) { showMessage("Error saving settings: " + result.error.message, "error"); } else { showMessage("Settings saved successfully. System identity synchronized."); }
}

// 📊 HUD & OVERVIEW BINDING
// 📊 HUD & OVERVIEW BINDING
function calculateRevenue(bookings, orders = [], services = []) { 
    // This is now redundant as calculateFinance updates the totalRevenue HUD, 
    // but kept for backward compatibility and to ensure overview updates correctly.
    let total = 0;
    const isSuccess = (status) => ['confirmed', 'delivered', 'completed', 'paid', 'active'].includes(String(status || '').toLowerCase());
    
    bookings.forEach(b => { if (isSuccess(b.status)) total += Number(b.price || b.total_price || 0); });
    orders.forEach(o => { if (isSuccess(o.status)) total += Number(o.total_price || 0); });
    services.forEach(s => { if (isSuccess(s.status)) total += Number(s.price || 0); });

    if (document.getElementById("totalRevenue")) {
        document.getElementById("totalRevenue").innerText = "₹" + total.toLocaleString();
    }
}

function calculateActiveResidences(bookings) { 
    const active = bookings.filter(b => ['confirmed', 'active', 'paid'].includes(String(b.status || '').toLowerCase())); 
    if (document.getElementById("activeResidences")) {
        document.getElementById("activeResidences").innerText = active.length; 
    }
}
function renderRecentBookings(bookings) {
    const container = document.getElementById("recentBookings"); if (!container) return; container.innerHTML = ""; if (!bookings.length) { container.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No active residences.</td></tr>'; return; }
    bookings.slice(0, 5).forEach(b => { container.innerHTML += `<tr><td><div style="font-weight:600;">${(b.user_email || 'Guest').split('@')[0].toUpperCase()}</div><div style="font-size:0.75rem; color:#B0B7C3;">${b.user_email || 'N/A'}</div></td><td>${b.hotel_name || 'N/A'}</td><td>${b.room_type || b.room_name || 'N/A'}</td><td>${b.checkin || b.check_in || 'N/A'}</td><td><span class="status-badge ${b.status?.toLowerCase() === 'confirmed' ? 'confirmed' : 'pending'}">${(b.status || 'PENDING').toUpperCase()}</span></td></tr>`; });
}
function renderServiceRequestsMini(services) {
    const container = document.getElementById("serviceRequests"); if (!container) return; container.innerHTML = ""; if (!services.length) { container.innerHTML = '<p style="text-align:center; padding:20px; color:#B0B7C3;">No pending requests.</p>'; return; }
    services.slice(0, 5).forEach(s => { const displayType = s.service_type || s.type || 'General Request'; container.innerHTML += `<div class="request-item"><div class="request-info"><h5>${displayType}</h5><p>Room: ${s.room || 'N/A'} | Status: ${(s.status || 'Pending').toUpperCase()}</p>${s.note ? `<p style="font-size:0.75rem; color:#D4AF37; margin-top:4px;">"${s.note}"</p>` : ''}</div><div class="request-action"><i class="ph ph-circle-dashed" style="color: #D4AF37;"></i></div></div>`; });
}

// 👥 STAFF MANAGEMENT logic
const menuGroups = [
    { title: "Core Dining", categories: [{ name: "Breakfast", icon: "ph-coffee" }, { name: "Lunch", icon: "ph-sun" }, { name: "Dinner", icon: "ph-moon" }, { name: "Combo Meals", icon: "ph-package" }] },
    { title: "Global Flavors", categories: [{ name: "Indian", icon: "ph-fire" }, { name: "Italian", icon: "ph-pizza" }, { name: "Thai", icon: "ph-bowl-food" }, { name: "Asian", icon: "ph-bowl-food" }] },
    { title: "Wellness & Lifestyle", categories: [{ name: "Healthy", icon: "ph-leaf" }, { name: "Kids Menu", icon: "ph-baby" }, { name: "Quick Bites", icon: "ph-clock" }] },
    { title: "Patisserie & Bar", categories: [{ name: "Hot Drinks", icon: "ph-cup" }, { name: "Mocktails", icon: "ph-wine" }, { name: "Fresh Juices", icon: "ph-drop" }, { name: "Cakes & Pastries", icon: "ph-cake" }, { name: "Indian Sweets", icon: "ph-cookie" }] }
];

let allMenuCache = [];
async function loadMenuItems() { renderMenuSidebar(); const items = await getMenuItems(); allMenuCache = items; renderMenu(items); }
function renderMenuSidebar() {
    const sidebar = document.getElementById('menuAdminNav'); if (!sidebar) return; sidebar.innerHTML = `<button class="side-tab-btn active" onclick="filterMenuByCategory('all', this)" style="margin-bottom:20px; width:100%; justify-content:start;"><i class="ph ph-squares-four"></i> <span>All Items</span></button>` + menuGroups.map(group => `<div style="margin-bottom:20px;"><div style="font-size:0.7rem; color:#D4AF37; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">${group.title}</div>${group.categories.map(cat => `<button class="side-tab-btn" onclick="filterMenuByCategory('${cat.name}', this)" style="width:100%; justify-content:start; margin-bottom:5px; gap:10px; display:flex; align-items:center; background:none; border:none; color:#B0B7C3; cursor:pointer; padding:8px 10px; border-radius:8px; font-size:0.9rem;"><i class="ph ${cat.icon}"></i> <span>${cat.name}</span></button>`).join('')}</div>`).join('');
}
function filterMenuByCategory(category, btn) {
    if (btn) { document.querySelectorAll('.side-tab-btn').forEach(b => { b.classList.remove('active'); b.style.color = '#B0B7C3'; b.style.background = 'none'; }); btn.classList.add('active'); btn.style.color = '#D4AF37'; btn.style.background = 'rgba(212,175,55,0.1)'; }
    if (category === "all") { renderMenu(allMenuCache); } else { const filtered = allMenuCache.filter(item => item.category === category); renderMenu(filtered); }
}
function renderMenu(items) {
    const container = document.getElementById("menuContainer"); if (!container) return; container.innerHTML = ""; if (!items.length) { container.innerHTML = "<p style='color:#B0B7C3; grid-column: 1/-1; text-align:center; padding:40px;'>No menu items found for this selection.</p>"; return; }
    items.forEach(item => { container.innerHTML += `<div class="stat-card" style="margin:0; border:1px solid rgba(212,175,55,0.1); display:flex; flex-direction:column;"><img src="${item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}" style="width:100%; height:150px; object-fit:cover; margin-bottom:15px; border:1px solid rgba(212,175,55,0.2);"><div class="stat-info" style="flex-grow:1;"><span class="label">${item.category}</span><h3 style="font-size:1.1rem; margin:10px 0;">${item.name}</h3><p style="font-size:0.85rem; color:#B0B7C3; margin-bottom:10px; height:40px; overflow:hidden;">${item.description || 'No description provided.'}</p><div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;"><span style="font-weight:700; color:#fff;">₹${item.price}</span><div style="display:flex; gap:10px;"><button onclick="handleEditMenu('${item.id}')" style="color:#D4AF37; background:none; border:none; cursor:pointer;"><i class="ph ph-pencil"></i></button><button onclick="handleDeleteMenu('${item.id}')" style="color:#ff4444; background:none; border:none; cursor:pointer;"><i class="ph ph-trash"></i></button></div></div></div></div>`; });
}

window.openAddMenuModal = async () => {
    const { hotelId } = getHotelContext();
    const name = await LuxeModal.prompt("Item Name:"), category = await LuxeModal.prompt("Category (Breakfast/Indian/Chinese/Continental):"), description = await LuxeModal.prompt("Description:"), price = await LuxeModal.prompt("Price (INR):"), image_url = await LuxeModal.prompt("Image URL (Unsplash recommended):");
    if (name && category && price) { const { error } = await window.supabase.from('menu_items').insert([{ name, category, description, price: parseFloat(price), image_url, is_available: true, hotel_id: hotelId }]); if (error) showMessage("Error saving item: " + error.message, "error"); else { showMessage("Dish added to Epicurean Directory."); loadMenuItems(); } }
};
window.handleEditMenu = async (id) => {
    const { data: item } = await window.supabase.from('menu_items').select('*').eq('id', id).single(); if (!item) return;
    const newPrice = await LuxeModal.prompt("Update Price:", item.price), newAvailability = await LuxeModal.confirm(`Set availability for ${item.name}? Currently: ${item.is_available ? 'Available' : 'Sold Out'}`);
    if (newPrice !== null) { const { error } = await window.supabase.from('menu_items').update({ price: parseFloat(newPrice), is_available: newAvailability }).eq('id', id); if (error) showMessage("Error updating: " + error.message, "error"); else { showMessage("Menu item synchronized."); loadMenuItems(); } }
};
window.handleDeleteMenu = async (id) => { if (await LuxeModal.confirm("Permanently remove this item from the menu?")) { const { error } = await window.supabase.from('menu_items').delete().eq('id', id); if (error) showMessage("Error deleting: " + error.message, "error"); else { showMessage("Item removed from directory."); loadMenuItems(); } } };

// 🛎️ SERVICE REQUESTS (FULL LIST)
async function loadServiceRequestsFull() {
    const services = await getServices();
    const container = document.getElementById("serviceRequestsContainer");
    if (!container) return;
    container.innerHTML = "";
    
    if (!services.length) {
        container.innerHTML = "<p style='color:#B0B7C3; grid-column: 1/-1; text-align:center; padding:40px;'>No operational service requests found.</p>";
        return;
    }
    
    // Fetch staff for assignment dropdowns
    const staffList = await getStaff();

    services.forEach(s => {
        const displayType = s.service_type || s.type || 'General Service';
        const staffOptions = staffList.map(st => `<option value="${st.staff_id}" ${s.assigned_to === st.staff_id ? 'selected' : ''}>${st.name} (${st.role})</option>`).join('');
        
        container.innerHTML += `
            <div class="stat-card" style="margin:0; border:1px solid rgba(212,175,55,0.1); display:flex; flex-direction:column; gap:15px;">
                <div style="display:flex; justify-content:space-between; align-items:start;">
                    <div class="stat-icon services"><i class="ph-fill ph-bell-ringing"></i></div>
                    <span class="status-badge ${s.status?.toLowerCase() === 'pending' ? 'pending' : s.status?.toLowerCase() === 'in progress' ? 'warning' : 'confirmed'}">
                        ${(s.status || 'PENDING').toUpperCase()}
                    </span>
                </div>
                <div class="stat-info">
                    <span class="label">${displayType}</span>
                    <h3 style="font-size:1.1rem; margin:10px 0;">Room: ${s.room || 'N/A'}</h3>
                    ${s.note ? `<p style="font-size:0.85rem; color: #fff; margin:10px 0; font-style:italic; background:rgba(212,175,55,0.05); padding:8px; border-radius:4px;">"${s.note}"</p>` : ''}
                    <p style="font-size:0.8rem; color:#B0B7C3; margin:5px 0;">Guest: ${s.user_email || 'Anonymous'}</p>
                </div>
                
                <div style="margin-top:auto; padding-top:15px; border-top:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:10px;">
                    <select onchange="assignStaff('${s.id}', this.value)" style="width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(212,175,55,0.2); border-radius:8px; padding:8px; color:#fff; font-size:0.8rem; outline:none;">
                        <option value="">Assign Personnel...</option>
                        ${staffOptions}
                    </select>
                    <div style="display:flex; gap:10px;">
                        <button onclick="updateRequestStatus('${s.id}', 'Completed')" style="flex:1; padding:8px; background:rgba(76,175,80,0.1); color:#4CAF50; border:1px solid rgba(76,175,80,0.2); border-radius:8px; cursor:pointer; font-size:0.75rem; font-weight:600;">Mark Completed</button>
                        <button onclick="updateRequestStatus('${s.id}', 'Pending')" style="padding:8px; background:none; border:1px solid rgba(255,255,255,0.1); color:#B0B7C3; border-radius:8px; cursor:pointer;"><i class="ph ph-arrow-counter-clockwise"></i></button>
                    </div>
                </div>
            </div>`;
    });
}

window.assignStaff = async (requestId, staffId) => {
    if (!staffId) return;
    const { error } = await window.supabase.from('services').update({ assigned_to: staffId, status: 'In Progress' }).eq('id', requestId);
    if (error) showMessage("Assignment Error: " + error.message, "error");
    else { showMessage("Task assigned and synchronized."); loadServiceRequestsFull(); refreshDashboard(); }
};

window.updateRequestStatus = async (id, status) => {
    const { error } = await window.supabase.from('services').update({ status }).eq('id', id);
    if (error) showMessage("Status Error: " + error.message, "error");
    else { showMessage(`Service request marked as ${status}.`); loadServiceRequestsFull(); refreshDashboard(); }
};

// 👥 GUEST PROFILES
async function loadGuestProfiles() {
    const guests = await getGuests(); const table = document.getElementById("guestTable"); if (!table) return; table.innerHTML = ""; if (!guests.length) { table.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:40px;">No guest profiles found.</td></tr>'; return; }
    guests.forEach(g => { table.innerHTML += `<tr><td>${g.full_name || g.name || 'Elite Guest'}</td><td>${g.email}</td><td>${g.phone || 'Not Provided'}</td><td>${new Date(g.created_at).toLocaleDateString()}</td></tr>`; });
}

// 🏢 STAFF MANAGEMENT logic
async function loadStaff() {
    const staffList = await getStaff(); const tableBody = document.getElementById("staff-table-body"); if (!tableBody) return; tableBody.innerHTML = ""; if (!staffList.length) { tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px;">No operational staff found.</td></tr>'; return; }
    staffList.forEach(staff => { tableBody.innerHTML += `<tr><td>${staff.staff_id}</td><td>${staff.name}</td><td><span class="status-badge" style="background:rgba(212,175,55,0.1); color:#D4AF37;">${staff.role.toUpperCase()}</span></td><td><span class="status-badge confirmed">${(staff.status || 'Active').toUpperCase()}</span></td><td><button onclick="handleEditStaff('${staff.id}')" style="color:#D4AF37; background:none; border:none; cursor:pointer; margin-right:10px;"><i class="ph ph-pencil"></i></button><button onclick="handleDeleteStaff('${staff.id}')" style="color:#ff4444; background:none; border:none; cursor:pointer;"><i class="ph ph-trash"></i></button></td></tr>`; });
}
const roleMap = {
    kitchen: "KIT",
    housekeeping: "HK",
    service: "SER",
    manager: "MGR"
};

async function generateStaffId(role, hotel) {
    const roleCode = roleMap[role] || "EMP";
    const country = (hotel.country || "IN").slice(0, 2).toUpperCase();
    const city = (hotel.city || "BPL").slice(0, 3).toUpperCase();
    // Use code if available, otherwise first 3 chars of hotel name
    const hotelCode = (hotel.code || hotel.hotel_name.replace("LuxeStay ", "").slice(0, 3)).toUpperCase();

    // Check global staff list for role-specific count to ensure global uniqueness
    const { data } = await window.supabase
        .from("staff")
        .select("staff_id")
        .ilike("staff_id", `%${roleCode}%`);

    const count = (data || []).length + 1;
    const number = String(count).padStart(3, "0");

    return `${country}-${city}-${hotelCode}-${roleCode}-${number}`;
}
window.openAddStaffModal = async () => {
    const { isGlobal, hotelId } = getHotelContext();
    let selectedHotelId = hotelId;

    if (isGlobal) {
        selectedHotelId = document.getElementById("hotelSelect").value;
        if (!selectedHotelId) {
            showMessage("Please select a property first.", "warning");
            return;
        }
    }

    // 🏨 Fetch full hotel details for ID generation
    const { data: hotel, error: hotelError } = await window.supabase
        .from('hotels')
        .select('*')
        .eq('id', selectedHotelId)
        .single();

    if (hotelError) {
        console.error("Hotel Context Error:", hotelError);
        showMessage("Critical Error: Unable to verify property context.", "error");
        return;
    }

    const name = await LuxeModal.prompt("Enter Staff Name:");
    const roleInput = await LuxeModal.prompt("Enter Role (kitchen/housekeeping/service/manager):");
    const role = roleInput?.toLowerCase();
    
    if (name && role) {
        const staff_id = await generateStaffId(role, hotel);
        
        console.log(`LuxeStay: Onboarding Staff [${staff_id}] to Property [${hotel.hotel_name}]`);

        const { data, error } = await window.supabase.from('staff').insert([{
            staff_id,
            name,
            role,
            password: "admin123",
            status: "Active",
            hotel_id: selectedHotelId
        }]).select();

        if (error) {
            console.error("Staff Onboarding Error:", error);
            showMessage("Error saving staff: " + error.message, "error");
        } else {
            showMessage(`Staff member [${staff_id}] onboarded successfully.`);
            loadStaff();
        }
    }
};
window.handleEditStaff = async (id) => {
    const { data: staff } = await window.supabase.from('staff').select('*').eq('id', id).single(); if (!staff) return;
    const newName = await LuxeModal.prompt("Update Name:", staff.name), newStatus = await LuxeModal.prompt("Update Status (Active/On Break/Leave):", staff.status);
    if (newName || newStatus) { const { error } = await window.supabase.from('staff').update({ name: newName || staff.name, status: newStatus || staff.status }).eq('id', id); if (error) showMessage("Error updating: " + error.message, "error"); else { showMessage("Staff profile synchronized."); loadStaff(); } }
};
window.handleDeleteStaff = async (id) => { if (await LuxeModal.confirm("Permanently remove this staff member?")) { const { error } = await window.supabase.from('staff').delete().eq('id', id); if (error) showMessage("Error deleting: " + error.message, "error"); else { showMessage("Staff member removed from register."); loadStaff(); } } };

// 🏢 RESIDENCY DIRECTORY
async function loadBookings() {
    const bookings = await getBookings(); const tableBody = document.getElementById("bookingsTable"); if (!tableBody) return; tableBody.innerHTML = ""; if (!bookings.length) { tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:40px;">No records found.</td></tr>'; return; }
    bookings.forEach((b, index) => { 
        tableBody.innerHTML += `
        <tr>
            <td>${b.user_email || 'N/A'}</td>
            <td>${b.hotel_name || 'N/A'}</td>
            <td>${b.room_type || b.room_name || 'N/A'}</td>
            <td>${b.checkin || b.check_in || 'N/A'} → ${b.checkout || b.check_out || 'N/A'}</td>
            <td>₹${Number(b.price || b.total_price || 0).toLocaleString()}</td>
            <td><span class="status-badge ${b.status?.toLowerCase() === 'confirmed' ? 'confirmed' : b.status?.toLowerCase() === 'cancelled' ? 'cancelled' : 'pending'}">${(b.status || 'PENDING').toUpperCase()}</span></td>
            <td>
                <div style="display:flex; gap:10px;">
                    ${b.status !== 'Cancelled' ? `
                        <button onclick="editBooking('${b.id}', '${b.checkout || b.check_out}')" style="color:#D4AF37; background:none; border:none; cursor:pointer;" title="Modify"><i class="ph ph-pencil-simple"></i></button>
                        <button onclick="cancelBooking('${b.id}')" style="color:#ff4444; background:none; border:none; cursor:pointer;" title="Rescind"><i class="ph ph-x-circle"></i></button>
                    ` : '<span style="color:#B0B7C3; font-size:0.75rem;">RESCINDED</span>'}
                </div>
            </td>
        </tr>`; 
    });
}

window.cancelBooking = async (id) => { if (await LuxeModal.confirm("Are you sure you want to rescind this residency?")) { const { error } = await window.supabase.from('bookings').update({ status: 'Cancelled' }).eq('id', id); if(error) showMessage("Error: " + error.message, "error"); else { showMessage("Residency rescinded successfully."); loadBookings(); refreshDashboard(); } } };

window.editBooking = async (id, currentCheckout) => {
    const newDate = await LuxeModal.prompt("Enter new check-out date (YYYY-MM-DD):", currentCheckout);
    if (newDate && newDate !== currentCheckout) {
        const { error } = await window.supabase.from('bookings').update({ checkout: newDate }).eq('id', id);
        if (error) showMessage("Modification Error: " + error.message, "error");
        else { showMessage("Residency parameters updated."); loadBookings(); refreshDashboard(); }
    }
};

// 🔄 UI UTILITIES
async function switchTab(tabName) {
    console.log(`LuxeStay: Switching to tab [${tabName}]`);
    const hubs = { overview: document.querySelector('.activity-hub'), bookings: document.getElementById('residency-management'), staff: document.getElementById('staff-management'), guests: document.getElementById('guest-profiles-management'), services: document.getElementById('service-requests-management'), menu: document.getElementById('menu-management'), finance: document.getElementById('finance-management'), settings: document.getElementById('system-settings') };
    const btns = { overview: document.getElementById('overviewBtn'), bookings: document.getElementById('bookingsBtn'), guests: document.getElementById('guestProfilesBtn'), services: document.getElementById('serviceRequestsBtn'), menu: document.getElementById('menuManagementBtn'), staff: document.getElementById('staffManagementBtn'), finance: document.getElementById('financeManagementBtn'), settings: document.getElementById('systemSettingsBtn') };
    Object.values(hubs).forEach(h => { if(h) h.style.display = 'none'; }); Object.values(btns).forEach(b => { if(b) b.classList.remove('active'); });
    if (hubs[tabName]) hubs[tabName].style.display = (tabName === 'overview' ? 'flex' : 'block'); if (btns[tabName]) btns[tabName].classList.add('active');

    // Multi-hotel tab logic
    if (tabName === 'staff') {
        await initializeHotelSelect();
    }
}

async function initializeGlobalHotelSelect() {
    const { isGlobal } = getHotelContext();
    const hotelSelect = document.getElementById('globalHotelSelect');
    if (isGlobal && hotelSelect) {
        console.log("LuxeStay: Populating Global Property Selector...");
        const hotels = await getHotels();
        
        if (hotels.length === 0) {
            console.warn("LuxeStay: No properties found in registry.");
            return;
        }

        // Keep the placeholder and populate others
        hotelSelect.innerHTML = '<option value="">All Elite Properties</option>';
        hotels.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h.id; // Use UUID for backend stability
            opt.textContent = `${h.hotel_name} (${h.city})`;
            hotelSelect.appendChild(opt);
            console.log(`LuxeStay: Registered Global Property [${h.hotel_name}]`);
        });
    }
}
