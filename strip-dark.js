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
      // Regex to remove dark:bg-zinc-900, dark:border-zinc-800, dark:text-white, etc.
      // Matches "dark:" followed by any combination of letters, numbers, hyphens, slashes, square brackets.
      const newContent = content.replace(/dark:[\w\-\/\[\]#]+/g, '').replace(/\s{2,}/g, ' ');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Stripped dark classes from:', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done stripping dark classes.');
