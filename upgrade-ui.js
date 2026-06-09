const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // 1. Upgrade primary buttons
      content = content.replace(/bg-gray-900 text-white hover:bg-gray-800/g, 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-700');
      content = content.replace(/bg-gray-900 text-white font-bold/g, 'bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-700');
      content = content.replace(/bg-gray-900 text-white/g, 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-700');
      
      // 2. Upgrade card lifts
      content = content.replace(/bg-white rounded-3xl border border-gray-100 shadow-sm/g, 'bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-lg transition-all');
      content = content.replace(/bg-white rounded-3xl border border-gray-100/g, 'bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-lg transition-all');
      content = content.replace(/bg-white border-r border-gray-200/g, 'bg-white border-r border-slate-200 shadow-lg z-10');
      
      // 3. Upgrade inner gray backgrounds to soft slate
      content = content.replace(/bg-gray-50/g, 'bg-slate-50 border-slate-200');
      
      // 4. Update the complete sale button in SalesClient to distinct green
      if (file === 'SalesClient.tsx') {
        content = content.replace(/bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all border border-blue-700/g, 'bg-green-600 text-white font-bold text-lg shadow-xl hover:bg-green-700 hover:shadow-2xl transition-all border border-green-700 hover:-translate-y-1');
      }

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done upgrading UI.');
