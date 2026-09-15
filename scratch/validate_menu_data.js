const fs = require('fs');

try {
    const content = fs.readFileSync('menu-data.js', 'utf8');
    // Replace export with a module.exports to make it importable in commonjs
    const commonjsContent = content.replace('export const LUXE_MENU =', 'module.exports =');
    fs.writeFileSync('scratch/temp_menu.js', commonjsContent);
    const menu = require('./temp_menu.js');
    console.log("SUCCESS! menu-data.js parsed correctly.");
    console.log(`Loaded ${menu.length} total fallback menu items.`);
    
    // Count items per category
    const countMap = {};
    menu.forEach(item => {
        countMap[item.category] = (countMap[item.category] || 0) + 1;
    });
    console.log("Categories and counts:", countMap);
} catch (e) {
    console.error("PARSING ERROR:", e);
}
