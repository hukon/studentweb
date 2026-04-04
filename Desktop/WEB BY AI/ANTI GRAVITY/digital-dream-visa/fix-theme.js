const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace background and border utilities with the inverse color token
  content = content.replace(/border-white\//g, 'border-inverse/');
  content = content.replace(/bg-white\//g, 'bg-inverse/');

  // Replace text-white utilities with text-text-primary, preserving opacities
  content = content.replace(/text-white\/([0-9]+)/g, 'text-text-primary/$1');
  
  // Replace standalone text-white -> text-text-primary
  content = content.replace(/text-white(?!(\/[0-9]+|-|space|space-x|space-y))/g, 'text-text-primary');

  fs.writeFileSync(filePath, content);
});

console.log('Migration to inverse theme logic complete.');
