const fs = require('fs');
const content = fs.readFileSync('dining.html', 'utf8');

const matches = [];
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('supabase') || line.toLowerCase().includes('db') || line.toLowerCase().includes('insert') || line.toLowerCase().includes('order')) {
        matches.push(`${index + 1}: ${line}`);
    }
});

console.log("Database/Order references in dining.html:");
console.log(matches.slice(0, 100).join('\n'));
