const fs = require('fs');
const content = fs.readFileSync('dining.html', 'utf8');

const matches = [];
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('chef') || line.toLowerCase().includes('special')) {
        matches.push(`${index + 1}: ${line}`);
    }
});

console.log("Matches found in dining.html:");
console.log(matches.slice(0, 50).join('\n'));
