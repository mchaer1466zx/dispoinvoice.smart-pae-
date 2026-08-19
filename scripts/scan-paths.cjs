/* eslint-disable */
const fs = require('fs');
const path = require('path');

function getFiles(dir, res = []) {
  if (!fs.existsSync(dir)) return res;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(item.name)) {
        getFiles(full, res);
      }
    } else if (/\.(tsx|ts|js|jsx|json|css|mjs)$/.test(item.name)) {
      res.push(full);
    }
  }
  return res;
}

const allFiles = getFiles('src').concat(getFiles('data'));
const nonStandard = [];

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/['"`](\/(assets|sang-prabu|wiridan|logos|products)\/[^'"`\s]+)['"`]/g) || [];
  if (matches.length > 0) {
    nonStandard.push({ file, matches });
  }
}

console.log('=== FILES WITH NON-STANDARD PATHS ===');
nonStandard.forEach(item => {
  console.log(item.file + ':');
  item.matches.forEach(m => console.log('  ', m));
});
