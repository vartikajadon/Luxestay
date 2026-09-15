import { supabase, LuxeDB } from './supabase-config.js';

// LuxeStay Notification System
export const NotificationSystem = {
    init() {
        this.createContainers();
        this.injectStyles();
        this.updateBadge();
    },

    createContainers() {
        // Toast Container
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        // Modal Container
        if (!document.getElementById('luxe-modal-container')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'luxe-modal-container';
            modalContainer.className = 'luxe-modal-overlay';
            document.body.appendChild(modalContainer);
        }
    },

    injectStyles() {
        if (document.getElementById('notif-styles')) return;
        const style = document.createElement('style');
        style.id = 'notif-styles';
        style.innerHTML = `
            .toast-container {
                position: fixed;
                top: 30px;
                right: 30px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 15px;
                pointer-events: none;
            }
            .toast {
                background: rgba(7, 16, 30, 0.95);
                backdrop-filter: blur(15px);
                border: 1px solid rgba(212, 175, 55, 0.3);
                padding: 16px 24px;
                border-radius: 12px;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                min-width: 300px;
                pointer-events: auto;
            }
            .toast.show { transform: translateX(0); opacity: 1; }
            .toast i { color: #D4AF37; font-size: 1.5rem; }
            .toast.error i { color: #ff4444; }

            .luxe-modal-overlay {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                z-index: 10001;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .luxe-modal {
                background: rgba(7, 16, 30, 0.98);
                border: 1px solid rgba(212, 175, 55, 0.3);
                padding: 40px;
                border-radius: 20px;
                max-width: 450px;
                width: 100%;
                text-align: center;
                box-shadow: 0 30px 60px rgba(0,0,0,0.8);
                animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            @keyframes modalPop {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .luxe-modal h3 { font-family: 'Cinzel', serif; color: #D4AF37; margin-bottom: 15px; font-size: 1.5rem; }
            .luxe-modal p { color: #B0B7C3; margin-bottom: 30px; line-height: 1.6; font-size: 0.95rem; }
            .luxe-modal-btns { display: flex; gap: 15px; justify-content: center; }
            .luxe-btn {
                padding: 12px 25px;
                border-radius: 8px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s;
                border: none;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-size: 0.8rem;
            }
            .luxe-btn-confirm { background: #D4AF37; color: #07101E; }
            .luxe-btn-cancel { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
            .luxe-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        `;
        document.head.appendChild(style);
    },

    async showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = type === 'error' ? 'ph-warning-circle' : 'ph-check-circle';
        if (type === 'info') icon = 'ph-info';

        toast.innerHTML = `<i class="ph-fill ${icon}"></i><span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    },

    confirm(message, title = "Please Confirm") {
        return new Promise((resolve) => {
            const overlay = document.getElementById('luxe-modal-container');
            overlay.style.display = 'flex';
            overlay.innerHTML = `
                <div class="luxe-modal">
                    <h3>${title}</h3>
                    <p>${message}</p>
                    <div class="luxe-modal-btns">
                        <button class="luxe-btn luxe-btn-cancel" id="luxe-cancel-btn">Cancel</button>
                        <button class="luxe-btn luxe-btn-confirm" id="luxe-confirm-btn">Confirm</button>
                    </div>
                </div>
            `;

            const finish = (result) => {
                overlay.style.display = 'none';
                resolve(result);
            };

            document.getElementById('luxe-confirm-btn').onclick = () => finish(true);
            document.getElementById('luxe-cancel-btn').onclick = () => finish(false);
            overlay.onclick = (e) => { if(e.target === overlay) finish(false); };
        });
    },

    async add(message, type = 'general') {
        const user = await LuxeDB.getUser();
        if (!user) return;

        // Prevent inserting mock UUID ('guest-...') which causes 400 Bad Request
        if (user.id && !user.id.startsWith('guest-')) {
            await supabase.from('notifications').insert([{
                user_id: user.id,
                message: message,
                type: type
            }]);
        }
        
        this.showToast(message);
        this.updateBadge();
        if (document.getElementById('notif-list')) this.renderPanel();
    },

    async updateBadge() {
        const user = await LuxeDB.getUser();
        if (!user) return;
        const { data } = await supabase.from('notifications').select('id').eq('is_read', false);
        const unreadCount = data ? data.length : 0;
        const badges = document.querySelectorAll('.notification-badge');
        badges.forEach(badge => {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        });
    },

    async renderPanel() {
        const list = document.getElementById('notif-list');
        if (!list) return;
        const notifications = await LuxeDB.getNotifications();
        if (notifications.length === 0) {
            list.innerHTML = '<div class="empty-notif"><p>No notifications yet</p></div>';
            return;
        }
        list.innerHTML = notifications.map(n => `
            <div class="notif-item ${!n.is_read ? 'unread' : ''}" onclick="NotificationSystem.markRead('${n.id}')">
                <div class="notif-icon"><i class="ph ph-${this.getIconForType(n.type)}"></i></div>
                <div class="notif-content">
                    <h4>${n.type.charAt(0).toUpperCase() + n.type.slice(1)}</h4>
                    <p>${n.message}</p>
                    <span class="notif-time">${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        `).join('');
    },

    getIconForType(type) {
        const icons = { booking: 'calendar-check', order: 'hamburger', service: 'bell-ringing', access: 'key' };
        return icons[type] || 'bell';
    }
};

// 🛡️ Execution Gate
if (document.readyState === 'loading') {
    window.addEventListener('load', () => NotificationSystem.init());
} else {
    NotificationSystem.init();
}

// Global Export for inline scripts
window.NotificationSystem = NotificationSystem;
