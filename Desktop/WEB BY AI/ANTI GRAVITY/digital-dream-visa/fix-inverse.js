const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'components');

const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace border-inverse/XX -> border-black/XX dark:border-white/XX
  content = content.replace(/border-inverse\/([0-9]+)/g, 'border-black/$1 dark:border-white/$1');
  
  // Replace bg-inverse/XX -> bg-black/XX dark:bg-white/XX
  content = content.replace(/bg-inverse\/([0-9]+)/g, 'bg-black/$1 dark:bg-white/$1');

  fs.writeFileSync(filePath, content);
});

console.log('Reverted inverse back to native dark: modifier.');
