const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Enhance Typography
  
  // 1. Headings font weight and tracking
  content = content.replace(/text-4xl font-black/g, 'text-4xl sm:text-5xl font-black tracking-tighter leading-tight');
  content = content.replace(/text-3xl font-bold/g, 'text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight');
  content = content.replace(/text-2xl font-bold/g, 'text-2xl font-extrabold tracking-tight');
  content = content.replace(/text-xl font-bold/g, 'text-xl font-bold tracking-tight');
  content = content.replace(/text-xl font-semibold/g, 'text-xl font-bold tracking-tight');
  content = content.replace(/text-lg font-bold/g, 'text-lg font-bold tracking-tight');
  content = content.replace(/text-lg font-semibold/g, 'text-lg font-semibold tracking-tight');

  // 2. Adjust text colors slightly for better contrast and a premium feel
  content = content.replace(/text-gray-900/g, 'text-slate-900');
  content = content.replace(/text-gray-800/g, 'text-slate-800');
  content = content.replace(/text-gray-700/g, 'text-slate-700');
  content = content.replace(/text-gray-600/g, 'text-slate-600');
  content = content.replace(/text-gray-500/g, 'text-slate-500 leading-relaxed'); // Better readability for secondary text
  
  // 3. Make small text punchier
  content = content.replace(/text-xs text-gray-500/g, 'text-[13px] font-medium text-slate-500');
  content = content.replace(/text-sm text-gray-500/g, 'text-sm font-medium text-slate-500');

  // 4. Enhance buttons for better typography
  content = content.replace(/font-bold rounded-xl/g, 'font-bold tracking-wide rounded-xl');

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir('e:\\acmeinventory\\src\\app');
walkDir('e:\\acmeinventory\\src\\components');

console.log('Typography enhancements applied globally.');
