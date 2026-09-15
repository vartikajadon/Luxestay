const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const matches = [];
const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.toLowerCase().includes('footer') || line.toLowerCase().includes('partner') || line.toLowerCase().includes('copyright')) {
        matches.push(`${index + 1}: ${line}`);
    }
});

console.log("Matches found in index.html:");
console.log(matches.slice(0, 50).join('\n'));
