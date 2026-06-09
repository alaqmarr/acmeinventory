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
      
      // Remove all {" "} instances (and any variations like {"   "})
      const newContent = content.replace(/\{\s*"\s*"\s*\}/g, '');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Fixed whitespace in:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done fixing whitespace issues.');
