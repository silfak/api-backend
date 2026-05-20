const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, '../src'));
let modifiedCount = 0;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    // Replace .js inside from '...' or from "..."
    const newContent = content.replace(/from\s+(['"])(.*?)\.js(['"])/g, 'from $1$2$3');
    // Also replace in dynamic imports: import('...')
    const newContent2 = newContent.replace(/import\s*\(\s*(['"])(.*?)\.js(['"])\s*\)/g, 'import($1$2$3)');
    
    if (content !== newContent2) {
        fs.writeFileSync(file, newContent2, 'utf8');
        console.log(`Updated ${file}`);
        modifiedCount++;
    }
}
console.log(`Updated ${modifiedCount} files.`);
