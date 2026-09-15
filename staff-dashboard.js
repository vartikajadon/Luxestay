
import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("DASHBOARD LOADED");
    
    // 🛡️ SESSION GUARDIAN: Robust Identity Check
    const staffID = localStorage.getItem('staffID') || localStorage.getItem('staffId');
    
    if (!staffID) {
        console.error("SESSION REJECTED: No valid staffID or staffId found.");
        console.log("Current LocalStorage Keys:", Object.keys(localStorage));
        window.location.replace('index.html');
        return;
    }
    
    // Ensure we are using the standardized key for the rest of the session
    if (!localStorage.getItem('staffID')) {
        localStorage.setItem('staffID', staffID);
    }
    
    console.log("SESSION VALIDATED:", staffID);
    
    let staffName = localStorage.getItem('staffName');
    let hotelID = localStorage.getItem('hotel_id'); // Actual UUID from DB

    // Parse the structured Staff ID fallback
    const idParts = staffID.split('-');
    const country = idParts[0] || 'UA';
    const city = idParts[1] || 'DUB';
    const hotelCode = idParts[2] || 'ADD'; // Hotel ID (Property)
    
    // Default parsing fallback
    const rawDept = (idParts[3] || idParts[0] || 'HK').toUpperCase();
    let deptCode = 'CN'; // Default fallback
    if (rawDept === 'KIT' || rawDept === 'KITCHEN') {
        deptCode = 'KIT';
    } else if (rawDept === 'HK' || rawDept === 'HOUSEKEEPING') {
        deptCode = 'HK';
    } else if (rawDept === 'MT' || rawDept === 'MAINTENANCE') {
        deptCode = 'MT';
    } else if (rawDept === 'SER' || rawDept === 'CN' || rawDept === 'CONCIERGE' || rawDept === 'EMP') {
        deptCode = 'CN';
    }

    const staffNum = idParts[idParts.length - 1] || '001';
    let staffUUID = localStorage.getItem('staffUUID');

    // Retrieve full real-time database staff record to ensure 100% accurate department and UUID
    try {
        const { data: staffData, error: staffError } = await supabase
            .from('staff')
            .select('*')
            .eq('staff_id', staffID)
            .single();

        if (staffData) {
            staffUUID = staffData.id;
            localStorage.setItem('staffUUID', staffUUID);
            
            if (staffData.name) {
                staffName = staffData.name;
                localStorage.setItem('staffName', staffName);
            }
            if (staffData.hotel_id) {
                hotelID = staffData.hotel_id;
                localStorage.setItem('hotel_id', hotelID);
            }

            // Map standard department codes based on precise database role column
            const dbRole = (staffData.role || '').toLowerCase().trim();
            if (dbRole === 'kitchen' || dbRole === 'kit') {
                deptCode = 'KIT';
            } else if (dbRole === 'housekeeping' || dbRole === 'house keeping' || dbRole === 'hk') {
                deptCode = 'HK';
            } else if (dbRole === 'maintenance' || dbRole === 'mt') {
                deptCode = 'MT';
            } else if (dbRole === 'service' || dbRole === 'ser' || dbRole === 'cn') {
                deptCode = 'CN';
            }
        }
    } catch (err) {
        console.error("Database role synchronization failed, falling back to ID parsing:", err);
    }

    // 2. Update Header UI
    document.getElementById('displayStaffID').textContent = `ID: ${staffID}`;
    document.getElementById('profileName').textContent = staffName || 'LuxeStay Staff';
    document.getElementById('profileRole').textContent = `${deptCode} - ${staffNum}`;
    
    const deptMap = {
        'KIT': 'KITCHEN OPERATIONS',
        'HK': 'HOUSEKEEPING & SANITIZATION',
        'MT': 'ENGINEERING & MAINTENANCE',
        'CN': 'GUEST CONCIERGE'
    };
    document.getElementById('displayDepartment').textContent = deptMap[deptCode] || 'OPERATIONS HUB';

    // 3. Load Dynamic Content Based on Department
    initializeDashboard(deptCode, hotelCode, hotelID, staffUUID);

    // 4. Global Navigation Bindings
    window.logoutStaff = () => {
        localStorage.removeItem('staffID');
        localStorage.removeItem('staffUUID');
        localStorage.removeItem('staffName');
        localStorage.removeItem('hotel_id');
        window.location.href = 'index.html';
    };
});

window.loadTab = (tabName, btn) => {
    // UI Update
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    const content = document.getElementById('dashboardContent');
    const sections = ['tasks-container', 'notifications-container', 'profile-container'];
    
    // Logic to show/hide specific tab sections if you had them in HTML
    // For now, let's just refresh the tasks if 'tasks' is clicked
    if (tabName === 'tasks') {
        location.reload(); 
    } else if (tabName === 'notifications') {
        content.innerHTML = '<div class="task-card"><h3 style="margin-bottom:15px;">System Notifications</h3><p style="color:#B0B7C3;">No new administrative alerts for your property.</p></div>';
    } else if (tabName === 'profile') {
        const staffID = localStorage.getItem('staffID');
        const staffName = localStorage.getItem('staffName');
        content.innerHTML = `<div class="task-card" style="max-width: 500px;">
            <div style="display:flex; align-items:center; gap:20px; margin-bottom:30px;">
                <div style="width:80px; height:80px; background:var(--luxe-gold-dim); border-radius:50%; display:flex; align-items:center; justify-content:center; border:1px solid var(--luxe-gold);">
                    <i class="ph ph-user-circle" style="font-size:3rem; color:var(--luxe-gold);"></i>
                </div>
                <div>
                    <h3 style="margin:0;">${staffName}</h3>
                    <p style="color:var(--luxe-gold); font-size:0.8rem;">${staffID}</p>
                </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:15px; font-size:0.9rem;">
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--luxe-border); padding-bottom:10px;">
                    <span style="color:var(--luxe-gray);">Department</span>
                    <span>${localStorage.getItem('staffDepartment') || 'Operations'}</span>
                </div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--luxe-border); padding-bottom:10px;">
                    <span style="color:var(--luxe-gray);">Security Status</span>
                    <span style="color:#2ECC71;">Authorized</span>
                </div>
            </div>
        </div>`;
    }
};

async function initializeDashboard(dept, hotelCode, hotelUUID, staffUUID) {
    // Hide all dashboards first
    const dashboards = ['kitDashboard', 'hkDashboard', 'mtDashboard', 'cnDashboard'];
    dashboards.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // Show relevant dashboard
    const activeDashboardId = dept.toLowerCase() + 'Dashboard';
    const activeContainer = document.getElementById(activeDashboardId);
    if (activeContainer) {
        activeContainer.style.display = 'block';
        loadDepartmentTasks(dept, hotelUUID, staffUUID);
    }
}

const alternativeHotelCodes = {
    "ce42ee9c-1084-4f3c-8124-ce830ba49547": ["IND-GOA-W", "W Goa"],
    "79095573-89d3-4a33-9af6-7a86767cb77c": ["FRA-PAR-PLA", "FRANCE-PARIS-HPA", "Hôtel Plaza Athénée"],
    "5cfe0e6b-835a-426d-850a-237c4d9ca1d0": ["UK-LON-SAV", "UK-LONDON-SAV", "The Savoy"],
    "4334cbc5-039d-4efe-a145-8f83d3652680": ["UAE-DUB-ADM", "Address Dubai Marina"],
    "898a97aa-2517-4c4e-8ee4-4e18dda8e983": ["UAE-DUBAI-ARM", "UAE-DUBAI-AHD", "Armani Hotel Dubai"],
    "bd1ef201-35d9-42c5-9fdf-c64d9e0697c7": ["UAE-DUBAI-ATL", "Atlantis The Royal"],
    "09a17ad6-055d-47ad-9a8f-17c3ce8c6339": ["IND-BHO-LEE", "INDIA-BHOPAL-TLP", "The Leela Palace"],
    "406e85f7-6270-4da9-99db-50d8508586d3": ["IND-DEL-ITC", "ITC Maurya"],
    "e0127af6-589a-4c4a-a418-0f3e729dfd5c": ["IND-MUM-OBE", "The Oberoi Mumbai"],
    "fb41c9d5-07a6-46ab-a429-f929c1ec78e6": ["IND-JAI-RAM", "Rambagh Palace"],
    "b653fed9-98a2-4933-9315-a89e20d64999": ["SGP-SGP-MBS", "Marina Bay Sands"],
    "cab8a952-a47f-4c68-bcf6-707fb133367d": ["IND-UDA-TAJ", "Taj Lake Palace"],
    "2c595da2-a260-4670-9bbc-2a889c7b566a": ["FRA-PAR-LPV", "LuxeStay Palace Vendôme"],
    "59f114ee-2ac5-49c4-a358-640c6b6e43a7": ["UK-LON-LHM", "LuxeStay Highland Manor"],
    "bb7edfc7-499f-4c6a-8d13-b9b7d3f90889": ["IND-GOA-LNS", "LuxeStay Azure Sands"],
    "49a0dcce-c1ae-4947-a35a-66ff539f4e3d": ["UK-DUB-BAAJ", "UAE-DUBAI-BAAJ", "UK-DUBAI-LBAA", "UAE-DUBAI-LBAA", "LuxeStay Burj AL Arab", "LuxeStay Burj Al Arab"]
};

async function loadDepartmentTasks(dept, hotelUUID, staffUUID) {
    const staffID = localStorage.getItem('staffID') || localStorage.getItem('staffId');
    const targetUUID = staffUUID || localStorage.getItem('staffUUID');
    const kitTasks = document.getElementById('kitTasks');
    const hkTasks = document.getElementById('hkTasks');
    const mtTasks = document.getElementById('mtTasks');
    const cnTasks = document.getElementById('cnTasks');

    // Get valid matches for legacy, alternative codes & name variations
    const validHotelIds = [hotelUUID];
    const alts = alternativeHotelCodes[hotelUUID] || [];
    alts.forEach(alt => validHotelIds.push(alt.toLowerCase()));

    if (dept === 'KIT') {
        const { data: allOrders, error } = await supabase
            .from('orders')
            .select('*')
            .neq('status', 'Delivered')
            .order('created_at', { ascending: true });

        if (error) return console.error(error);

        const orders = allOrders.filter(order => {
            const isAssigned = order.assigned_to === staffID || (targetUUID && order.assigned_to === targetUUID);
            if (isAssigned) return true;

            const hId = (order.hotel_id || '').toLowerCase();
            const isHotelMatch = validHotelIds.includes(order.hotel_id) || validHotelIds.includes(hId);
            return isHotelMatch;
        });

        renderKitchenOrders(orders, kitTasks);
    } 
    else if (dept === 'HK') {
        const { data: allServices, error } = await supabase
            .from('services')
            .select('*')
            .neq('status', 'Completed')
            .order('created_at', { ascending: false });

        if (error) return console.error(error);

        const cleanings = allServices.filter(task => {
            const isAssigned = task.assigned_to === staffID || (targetUUID && task.assigned_to === targetUUID);
            if (isAssigned) return true;

            const typeStr = (task.service_type || '').toLowerCase();
            const isHk = typeStr.includes('cleaning') || typeStr.includes('housekeeping') || typeStr.includes('sanitization') || typeStr.includes('laundry');
            if (!isHk) return false;

            const hId = (task.hotel_id || '').toLowerCase();
            const isHotelMatch = validHotelIds.includes(task.hotel_id) || validHotelIds.includes(hId);
            return isHotelMatch;
        });

        renderHousekeepingTasks(cleanings, hkTasks);
    }
    else if (dept === 'MT') {
        const { data: allServices, error } = await supabase
            .from('services')
            .select('*')
            .neq('status', 'Completed')
            .order('created_at', { ascending: false });

        if (error) return console.error(error);

        const repairs = allServices.filter(task => {
            const isAssigned = task.assigned_to === staffID || (targetUUID && task.assigned_to === targetUUID);
            if (isAssigned) return true;

            const typeStr = (task.service_type || '').toLowerCase();
            const isMt = typeStr.includes('repair') || typeStr.includes('maintenance') || typeStr.includes('engineering');
            if (!isMt) return false;

            const hId = (task.hotel_id || '').toLowerCase();
            const isHotelMatch = validHotelIds.includes(task.hotel_id) || validHotelIds.includes(hId);
            return isHotelMatch;
        });

        renderMaintenanceTasks(repairs, mtTasks);
    }
    else if (dept === 'CN') {
        const { data: allServices, error } = await supabase
            .from('services')
            .select('*')
            .neq('status', 'Completed')
            .order('created_at', { ascending: false });

        if (error) return console.error(error);

        const requests = allServices.filter(task => {
            const isAssigned = task.assigned_to === staffID || (targetUUID && task.assigned_to === targetUUID);
            if (isAssigned) return true;

            const typeStr = (task.service_type || '').toLowerCase();
            const isHk = typeStr.includes('cleaning') || typeStr.includes('housekeeping') || typeStr.includes('sanitization') || typeStr.includes('laundry');
            const isMt = typeStr.includes('repair') || typeStr.includes('maintenance') || typeStr.includes('engineering');
            if (isHk || isMt) return false;

            const hId = (task.hotel_id || '').toLowerCase();
            const isHotelMatch = validHotelIds.includes(task.hotel_id) || validHotelIds.includes(hId);
            return isHotelMatch;
        });

        renderConciergeTasks(requests, cnTasks);
    }
}

function renderKitchenOrders(orders, container) {
    if (!orders || orders.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:rgba(255,255,255,0.4);">No kitchen orders assigned.</div>`;
        return;
    }
    container.innerHTML = orders.map(order => `
        <div class="task-card kitchen-order">
            <div class="task-header">
                <span class="task-type">Order #${order.id.slice(0,5)}</span>
                <span class="priority-tag high">Priority</span>
            </div>
            <div class="task-content">
                <h3>Guest Order</h3>
                <div class="order-items">
                    <p style="color: #fff; font-weight: 600;">${order.items || 'Standard Meal'}</p>
                </div>
                <div class="special-instruction">
                    <i class="ph ph-warning-circle"></i>
                    <span>No Nuts - Customer Allergy</span>
                </div>
            </div>
            <div class="task-meta">
                <div><i class="ph ph-clock"></i> ${new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div><i class="ph ph-user"></i> Room ${order.room || 'TBD'}</div>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-primary" onclick="updateOrderStatus('${order.id}', 'Ready')">Mark as Ready</button>
            </div>
        </div>
    `).join('');
}

function renderHousekeepingTasks(tasks, container) {
    if (!tasks || tasks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:rgba(255,255,255,0.4);">No housekeeping tasks assigned.</div>`;
        return;
    }
    container.innerHTML = tasks.map(task => `
        <div class="task-card">
            <div class="task-header">
                <span class="task-type">Sanitization</span>
                <span class="priority-tag ${task.priority === 'High' ? 'high' : 'medium'}">${task.priority || 'Medium'}</span>
            </div>
            <div class="task-content">
                <h3>Room ${task.room || 'N/A'} Cleaning</h3>
                <p>Standard turnover service including linen refresh and mini-bar restock.</p>
            </div>
            <div class="task-meta">
                <div><i class="ph ph-bed"></i> ${task.service_type || 'Cleaning'}</div>
                <div><i class="ph ph-user"></i> Guest Checkout</div>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-secondary" onclick="updateTaskStatus('${task.id}', 'In Progress')">In Progress</button>
                <button class="btn-action btn-primary" onclick="updateTaskStatus('${task.id}', 'Completed')">Complete</button>
            </div>
        </div>
    `).join('');
}

function renderMaintenanceTasks(tasks, container) {
    if (!tasks || tasks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:rgba(255,255,255,0.4);">No maintenance tasks assigned.</div>`;
        return;
    }
    container.innerHTML = tasks.map(task => `
        <div class="task-card">
            <div class="task-header">
                <span class="task-type">Maintenance</span>
                <span class="priority-tag high">Urgent</span>
            </div>
            <div class="task-content">
                <h3>${task.service_type || 'Repair'}</h3>
                <p>${task.note || 'Issue reported by guest in Room ' + (task.room || 'N/A')}</p>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-primary" onclick="updateTaskStatus('${task.id}', 'Completed')">Fix Applied</button>
            </div>
        </div>
    `).join('');
}

function renderConciergeTasks(tasks, container) {
    if (!tasks || tasks.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:rgba(255,255,255,0.4);">No guest requests assigned.</div>`;
        return;
    }
    container.innerHTML = tasks.map(task => `
        <div class="task-card">
            <div class="task-header">
                <span class="task-type">Guest Request</span>
                <span class="status-badge">New</span>
            </div>
            <div class="task-content">
                <h3>${task.service_type || 'Service'}</h3>
                <p>Room ${task.room || 'N/A'}: ${task.note || 'General assistance requested.'}</p>
            </div>
            <div class="task-actions">
                <button class="btn-action btn-primary" onclick="updateTaskStatus('${task.id}', 'Completed')">Handled</button>
            </div>
        </div>
    `).join('');
}

// Action Handlers with Real-time Notifications
window.updateOrderStatus = async (id, status) => {
    try {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) throw error;
        
        showToast(`Order status updated to ${status}.`);
        setTimeout(() => location.reload(), 1000); // Allow toast to be seen
    } catch (err) {
        console.error("Order Update Error:", err);
        showToast("Failed to update order status.", "error");
    }
};

window.updateTaskStatus = async (id, status) => {
    try {
        const { error } = await supabase.from('services').update({ status }).eq('id', id);
        if (error) throw error;

        showToast(`Service request marked as ${status}.`);
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        console.error("Task Update Error:", err);
        showToast("Failed to update service status.", "error");
    }
};

// 🔔 LUXE NOTIFICATION SYSTEM
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; 
        background: ${type === 'error' ? 'rgba(255, 68, 68, 0.9)' : 'rgba(212, 175, 55, 0.95)'};
        color: ${type === 'error' ? '#fff' : '#07101E'};
        padding: 15px 30px; border-radius: 12px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700; font-size: 0.9rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        backdrop-filter: blur(10px); z-index: 10000;
        animation: toastIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex; align-items: center; gap: 12px;
    `;
    toast.innerHTML = `<i class="ph-fill ph-${type === 'error' ? 'warning-circle' : 'check-circle'}" style="font-size: 1.2rem;"></i> ${message}`;
    document.body.appendChild(toast);
    
    // Add Animations if not present
    if (!document.getElementById('luxe-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'luxe-toast-styles';
        style.textContent = `
            @keyframes toastIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes toastOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100px); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
