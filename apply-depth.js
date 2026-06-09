const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Upgrade Shadows on all primary cards
  // Replacing simple shadows with deeper, tinted shadows that give it a floating effect
  content = content.replace(/shadow-md/g, 'shadow-xl shadow-slate-200/50');
  content = content.replace(/hover:shadow-lg/g, 'hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300');
  content = content.replace(/shadow-sm/g, 'shadow-md shadow-slate-200/40');
  
  // 2. Increase Corner Rounding for a more modern, friendly look
  // Changing rounded-xl or 2xl to 3xl/2xl where applicable, though most are already 3xl
  content = content.replace(/rounded-2xl/g, 'rounded-[1.5rem]');
  content = content.replace(/rounded-xl/g, 'rounded-[1rem]');

  // 3. Make the main card backgrounds slightly translucent with a blur if the user wants
  // content = content.replace(/bg-white/g, 'bg-white/95 backdrop-blur-sm');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir('e:\\acmeinventory\\src\\app\\(app)');
walkDir('e:\\acmeinventory\\src\\components');

console.log('Deep aesthetics applied.');
