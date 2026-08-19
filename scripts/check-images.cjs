/* eslint-disable */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function getFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json'], res = []) {
  if (!fs.existsSync(dir)) return res;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(item.name)) {
        getFiles(full, exts, res);
      }
    } else if (exts.includes(path.extname(item.name))) {
      res.push(full);
    }
  }
  return res;
}

async function runHealthCheck() {
  console.log('==================================================');
  console.log('🔍 SYSTEM HEALTH CHECK: IMAGE ASSETS & REFS');
  console.log('==================================================\n');

  // 1. Audit public directory images
  const publicDir = path.resolve('public');
  const allPublic = [];
  function scanPublic(dir) {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        scanPublic(full);
      } else if (/\.(webp|png|jpg|jpeg|svg|gif|ico)$/i.test(item.name)) {
        allPublic.push(full);
      }
    }
  }
  scanPublic(publicDir);

  console.log(`Found ${allPublic.length} static image assets in /public.\nVerifying binary integrity...`);
  let corruptedCount = 0;

  for (const imgPath of allPublic) {
    const rel = path.relative(publicDir, imgPath);
    if (/\.(webp|png|jpg|jpeg)$/i.test(imgPath)) {
      try {
        const metadata = await sharp(imgPath).metadata();
        // Valid image
      } catch (err) {
        corruptedCount++;
        console.error(`❌ CORRUPTED IMAGE FILE: /${rel} - ${err.message}`);
      }
    } else if (/\.svg$/i.test(imgPath)) {
      const content = fs.readFileSync(imgPath, 'utf8');
      if (!content.includes('<svg')) {
        corruptedCount++;
        console.error(`❌ INVALID SVG FILE: /${rel}`);
      }
    }
  }

  if (corruptedCount === 0) {
    console.log(`✅ All ${allPublic.length} static image assets are 100% valid binary formats.\n`);
  }

  // 2. Scan all code references
  const allSrc = getFiles('src').concat(getFiles('data'));
  const imgRegex = /['"`](\/[^'"`\s]+\.(webp|png|jpg|jpeg|svg|gif|ico))['"`]/g;
  const urlRegex = /url\(['"`]?(\/[^'"`\)\s]+)['"`]?\)/g;

  const foundRefs = [];

  for (const file of allSrc) {
    const content = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = imgRegex.exec(content)) !== null) {
      foundRefs.push({ file, ref: m[1], type: 'string' });
    }
    while ((m = urlRegex.exec(content)) !== null) {
      foundRefs.push({ file, ref: m[1], type: 'css-url' });
    }
  }

  const statusMap = {};
  for (const item of foundRefs) {
    const local = path.join('public', item.ref);
    const exists = fs.existsSync(local);
    if (!statusMap[item.ref]) {
      statusMap[item.ref] = { exists, files: new Set() };
    }
    statusMap[item.ref].files.add(item.file);
  }

  console.log('=== REFERENCED ASSET CHECK IN CODEBASE ===');
  let missingCount = 0;
  for (const [ref, data] of Object.entries(statusMap)) {
    if (!data.exists) {
      missingCount++;
      console.log(`❌ MISSING ASSET: ${ref} (referenced in: ${Array.from(data.files).join(', ')})`);
    } else {
      console.log(`✅ OK: ${ref}`);
    }
  }

  // 3. Check Required Core Assets (Logos, Hero, 8 SKUs)
  console.log('\n=== CRITICAL ASSET INVENTORY VALIDATION ===');
  const requiredAssets = [
    { key: 'Logo Sang Prabu (WebP)', path: '/images/logo/logo-sang-prabu.webp' },
    { key: 'Logo Sang Prabu (PNG)', path: '/images/logo/logo-sang-prabu.png' },
    { key: 'Logo Sang Prabu (Fallback PNG)', path: '/logos/logo-sang-prabu.png' },
    { key: 'Logo Wiridan 318 Gold (WebP)', path: '/images/logo/logo-wiridan-318-gold.webp' },
    { key: 'Logo Wiridan 318 Gold (PNG)', path: '/images/logo/logo-wiridan-318-gold.png' },
    { key: 'Hero Master Wiridan 318 (WebP)', path: '/images/hero/hero-wiridan-master.webp' },
    { key: 'Hero Master Wiridan 318 (JPG)', path: '/images/hero/hero-wiridan-master.jpg' },
    { key: 'SKU B-01: Bakso Goreng Renyah', path: '/images/products/bakso-goreng.webp' },
    { key: 'SKU B-02: Bakso Ayam Kenyal', path: '/images/products/bakso-ayam.webp' },
    { key: 'SKU B-03: Bakso Sapi Medium', path: '/images/products/bakso-medium.webp' },
    { key: 'SKU B-04: Bakso Urat Sapi', path: '/images/products/bakso-urat.webp' },
    { key: 'SKU B-05: Bakso Sapi Premium', path: '/images/products/bakso-premium.webp' },
    { key: 'SKU C-01: Otak-Otak Ikan Tenggiri', path: '/images/products/otak-otak.webp' },
    { key: 'SKU D-01: Dimsum Siomay Ayam', path: '/images/products/dimsum-ayam.webp' },
    { key: 'SKU D-02: Dimsum Mix Platter', path: '/images/products/dimsum-mix.webp' },
  ];

  let missingReq = 0;
  for (const req of requiredAssets) {
    const full = path.join(publicDir, req.path);
    if (!fs.existsSync(full)) {
      missingReq++;
      console.log(`❌ CRITICAL MISSING: ${req.key} -> public${req.path}`);
    } else {
      console.log(`✅ CRITICAL FOUND: ${req.key} -> public${req.path}`);
    }
  }

  console.log('\n==================================================');
  if (missingCount === 0 && corruptedCount === 0 && missingReq === 0) {
    console.log('🎉 ALL IMAGES VALID, FORMATTED, AND AVAILABLE!');
    console.log('==================================================');
    process.exit(0);
  } else {
    console.error(`🚨 FAILED: Missing refs: ${missingCount}, Corrupted files: ${corruptedCount}, Missing required: ${missingReq}`);
    console.log('==================================================');
    process.exit(1);
  }
}

runHealthCheck().catch((err) => {
  console.error(err);
  process.exit(1);
});
