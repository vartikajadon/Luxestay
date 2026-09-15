// Premium Toast Notification System
export const Toast = {
    init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    },

    show(message, type = 'info', duration = 4000) {
        this.init();
        const container = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const colors = {
            success: 'rgba(76, 175, 80, 0.9)',
            error: 'rgba(244, 67, 54, 0.9)',
            info: 'rgba(33, 150, 243, 0.9)',
            warning: 'rgba(255, 152, 0, 0.9)'
        };

        const icon = {
            success: 'ph-check-circle',
            error: 'ph-x-circle',
            info: 'ph-info',
            warning: 'ph-warning'
        };

        toast.style.cssText = `
            background: rgba(7, 16, 30, 0.85);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-left: 5px solid ${colors[type]};
            color: #fff;
            padding: 15px 25px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
            min-width: 300px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            pointer-events: auto;
            animation: toastSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 0.9rem;
        `;

        toast.innerHTML = `
            <i class="ph ${icon[type]}" style="font-size: 1.4rem; color: ${colors[type]}"></i>
            <span style="flex-grow: 1">${message}</span>
            <i class="ph ph-x" style="cursor: pointer; opacity: 0.5" onclick="this.parentElement.remove()"></i>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.4s ease forwards';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }
};

// Add animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideIn {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(120%); opacity: 0; }
    }
`;
document.head.appendChild(style);
