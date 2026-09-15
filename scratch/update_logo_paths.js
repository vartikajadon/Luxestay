const fs = require('fs');
const path = require('path');

const files = [
    'services.html',
    'room-access.html',
    'my-orders.html',
    'login.html',
    'index.html',
    'experiences.html',
    'dining.html',
    'dashboard.html',
    'bookings.html',
    'billing.html'
];

const rootDir = 'c:\\Users\\varti\\OneDrive\\Desktop\\PRD_app';

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace assets/luxestay_logo.png with public/logo.png
        const updatedContent = content.replace(/assets\/luxestay_logo\.png/g, 'public/logo.png');
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent);
            console.log(`Updated logo in ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
