const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Clean up residual dark mode artifacts like `:bg-zinc-800`, `:text-white`, `:border-slate-800`
  content = content.replace(/\s:[a-z0-9\-]+/g, '');

  // 2. Fix Borders and Backgrounds
  content = content.replace(/border-gray-[0-9]{2,3}/g, 'border-slate-200');
  content = content.replace(/bg-gray-50/g, 'bg-slate-50');
  content = content.replace(/bg-gray-100/g, 'bg-slate-100');

  // 3. Form Inputs (Inputs, Selects) - Give them a soft glow focus and border
  // Replacing old input classes
  content = content.replace(/bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-black outline-none/g, 
    'bg-white border-slate-300 text-slate-900 focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 outline-none');
  content = content.replace(/focus:ring-black/g, 'focus:ring-blue-500/20 focus:border-blue-500');

  // 4. Badges (Logical colors for stock levels)
  // Currently they are like text-green-700 or text-red-700. Make them emerald and rose.
  content = content.replace(/bg-green-100 text-green-700/g, 'bg-emerald-100 text-emerald-800 border border-emerald-200');
  content = content.replace(/bg-green-100 text-green-800/g, 'bg-emerald-100 text-emerald-800 border border-emerald-200');
  content = content.replace(/bg-red-100 text-red-700/g, 'bg-rose-100 text-rose-800 border border-rose-200');
  content = content.replace(/bg-red-100 text-red-800/g, 'bg-rose-100 text-rose-800 border border-rose-200');

  // 5. Buttons
  // Primary (Blue)
  content = content.replace(/bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-700/g, 
    'bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-700 transition-all');
  
  // Destructive Action Buttons (Trash icons etc)
  content = content.replace(/text-red-600 hover:text-red-900/g, 'text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors');
  
  // Edit / Info Action Buttons
  content = content.replace(/text-blue-600 hover:text-blue-900/g, 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-lg transition-colors');

  // Secondary/Cancel Buttons
  content = content.replace(/text-slate-700 font-medium hover:bg-slate-100/g, 'text-slate-700 font-medium bg-white hover:bg-slate-50 border border-slate-300 shadow-sm');
  
  // Complete Sale / Success Button (currently might be blue, let's make it Emerald if it says "Complete Sale")
  content = content.replace(/<button[^>]*>[\s\S]*?(Complete Sale|Generate Report)[\s\S]*?<\/button>/g, (match) => {
    if (match.includes('Complete Sale')) {
      return match.replace(/bg-blue-600/g, 'bg-emerald-600').replace(/hover:bg-blue-700/g, 'hover:bg-emerald-700').replace(/border-blue-700/g, 'border-emerald-700');
    }
    if (match.includes('Generate Report')) {
      return match.replace(/bg-blue-600/g, 'bg-indigo-600').replace(/hover:bg-blue-700/g, 'hover:bg-indigo-700').replace(/border-blue-700/g, 'border-indigo-700');
    }
    return match;
  });

  // 6. Logical Text Colors
  // Money in (Revenue/Profit) -> Emerald
  content = content.replace(/text-green-600/g, 'text-emerald-600');
  content = content.replace(/text-blue-700/g, 'text-indigo-700'); // Better deep tone for stats
  
  // 7. Feature Icon Boxes
  content = content.replace(/bg-blue-50 text-blue-600/g, 'bg-indigo-50 text-indigo-600 border border-indigo-100');
  content = content.replace(/bg-green-50 text-green-600/g, 'bg-emerald-50 text-emerald-600 border border-emerald-100');
  content = content.replace(/bg-purple-50 text-purple-600/g, 'bg-violet-50 text-violet-600 border border-violet-100');

  // 8. Financial Table Values
  // If it's a profit column, make it emerald
  content = content.replace(/className="text-emerald-600/g, 'className="text-emerald-600 font-semibold');

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

console.log('Logical colors and UI revamp applied.');
