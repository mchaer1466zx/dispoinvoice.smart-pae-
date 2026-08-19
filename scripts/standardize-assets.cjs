/* eslint-disable */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function standardizeAssets() {
  console.log('🚀 Standardizing all assets to /images/ architecture...');

  const dirs = [
    'public/images/logo',
    'public/images/hero',
    'public/images/products',
    'public/images/facilities',
    'public/images/corporate',
    'public/logos',
    'public/sang-prabu',
    'public/wiridan',
    'public/assets/logo',
  ];
  dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

  // Master sources from src/assets/images
  const srcHero = 'src/assets/images/hero_wiridan_sangprabu_1786870797516.jpg';
  const srcWiridanLogo = 'src/assets/images/wiridan_logo_gold_1786791750372.jpg';
  const srcSangPrabuLogo = 'public/logos/logo-sang-prabu.png';
  const srcBaksoPrem = 'src/assets/images/wiridan_bakso_prem_1786791685462.jpg';
  const srcBaksoReg = 'src/assets/images/wiridan_bakso_reg_1786791698503.jpg';
  const srcOtakOtak = 'src/assets/images/otak_otak_clean_1786818509928.jpg';
  const srcDimsum = 'src/assets/images/wiridan_dimsum_1786791731336.jpg';
  const srcGroupHero = 'src/assets/images/wiridan_group_hero_1786818542859.jpg';
  const srcFourGrid = 'src/assets/images/wiridan_four_products_grid_1786870980578.jpg';
  const srcCleanroom = 'src/assets/images/pae_factory_cleanroom_1786869785749.jpg';
  const srcSangPrabuHero = 'src/assets/images/sang_prabu_hero_banner_1786869511947.jpg';

  // 1. LOGOS
  console.log('Processing Brand Logos...');
  await sharp(srcSangPrabuLogo).webp({ quality: 95 }).toFile('public/images/logo/logo-sang-prabu.webp');
  await sharp(srcSangPrabuLogo).png().toFile('public/images/logo/logo-sang-prabu.png');
  await sharp(srcSangPrabuLogo).png().toFile('public/images/logo/logo-sang-prabu-haki.png');
  await sharp(srcSangPrabuLogo).png().toFile('public/sang-prabu/sang-prabu-haki-logo.png');

  await sharp(srcWiridanLogo).webp({ quality: 95 }).toFile('public/images/logo/logo-wiridan-318-gold.webp');
  await sharp(srcWiridanLogo).png().toFile('public/images/logo/logo-wiridan-318-gold.png');
  await sharp(srcWiridanLogo).jpeg({ quality: 95 }).toFile('public/images/logo/logo-wiridan-318-gold.jpg');

  // Copy SVG logos if present in public/assets/logo
  const svgFiles = [
    'logo-sang-prabu-favicon.svg',
    'logo-sang-prabu-header.svg',
    'logo-sang-prabu-footer.svg',
    'logo-sang-prabu-full.svg',
  ];
  for (const svg of svgFiles) {
    const srcSvg = path.join('public/assets/logo', svg);
    if (fs.existsSync(srcSvg)) {
      fs.copyFileSync(srcSvg, path.join('public/images/logo', svg));
    }
  }
  if (fs.existsSync('public/assets/logo-ksp-gold.svg')) {
    fs.copyFileSync('public/assets/logo-ksp-gold.svg', 'public/images/logo/logo-ksp-gold.svg');
  }

  // Group Logos
  if (fs.existsSync('public/logos/logo-ksp.png')) {
    fs.copyFileSync('public/logos/logo-ksp.png', 'public/images/logo/logo-ksp.png');
  }
  if (fs.existsSync('public/logos/logo-pae.png')) {
    fs.copyFileSync('public/logos/logo-pae.png', 'public/images/logo/logo-pae.png');
  }
  if (fs.existsSync('public/logos/logo-pub.png')) {
    fs.copyFileSync('public/logos/logo-pub.png', 'public/images/logo/logo-pub.png');
  }

  // 2. HERO BANNERS
  console.log('Processing Hero Banners...');
  await sharp(srcHero).webp({ quality: 90 }).toFile('public/images/hero/hero-wiridan-master.webp');
  await sharp(srcHero).jpeg({ quality: 90 }).toFile('public/images/hero/hero-wiridan-master.jpg');

  await sharp(srcSangPrabuHero).webp({ quality: 90 }).toFile('public/images/hero/hero-sang-prabu.webp');
  await sharp(srcSangPrabuHero).jpeg({ quality: 90 }).toFile('public/images/hero/hero-sang-prabu.jpg');

  await sharp(srcGroupHero).webp({ quality: 90 }).toFile('public/images/hero/hero-group.webp');
  await sharp(srcGroupHero).jpeg({ quality: 90 }).toFile('public/images/hero/hero-group.jpg');

  // 3. 8 SKU PRODUCTS
  console.log('Processing 8 SKU Product Images...');
  const skus = [
    { source: srcBaksoPrem, slug: 'bakso-premium' },
    { source: srcBaksoReg, slug: 'bakso-urat' },
    { source: srcBaksoReg, slug: 'bakso-medium' },
    { source: srcBaksoReg, slug: 'bakso-ayam' },
    { source: srcBaksoPrem, slug: 'bakso-goreng' },
    { source: srcOtakOtak, slug: 'otak-otak' },
    { source: srcDimsum, slug: 'dimsum-ayam' },
    { source: srcDimsum, slug: 'dimsum-mix' },
  ];

  for (const item of skus) {
    await sharp(item.source).webp({ quality: 90 }).toFile(`public/images/products/${item.slug}.webp`);
    await sharp(item.source).jpeg({ quality: 90 }).toFile(`public/images/products/${item.slug}.jpg`);
  }

  // 4. FACILITIES & CORPORATE IMAGES
  console.log('Processing Facility & Operations Images...');
  const facilitySources = [
    { src: 'public/sang-prabu/dapur.jpg', slug: 'dapur' },
    { src: 'public/sang-prabu/daging-sapi.jpg', slug: 'daging-sapi' },
    { src: 'public/sang-prabu/daging-ayam.jpg', slug: 'daging-ayam' },
    { src: 'public/sang-prabu/ayam-proses.jpg', slug: 'ayam-proses' },
    { src: 'public/sang-prabu/butcher.jpg', slug: 'butcher' },
    { src: 'public/sang-prabu/karkas.jpg', slug: 'karkas' },
    { src: 'public/sang-prabu/kantor.jpg', slug: 'kantor' },
    { src: srcCleanroom, slug: 'cleanroom' },
  ];

  for (const fac of facilitySources) {
    if (fs.existsSync(fac.src)) {
      await sharp(fac.src).webp({ quality: 88 }).toFile(`public/images/facilities/${fac.slug}.webp`);
      await sharp(fac.src).jpeg({ quality: 88 }).toFile(`public/images/facilities/${fac.slug}.jpg`);
    }
  }

  // Alias chicken & meat shortcuts into facilities
  if (fs.existsSync('public/images/facilities/daging-ayam.jpg')) {
    fs.copyFileSync('public/images/facilities/daging-ayam.jpg', 'public/images/facilities/ayam.jpg');
    fs.copyFileSync('public/images/facilities/daging-ayam.webp', 'public/images/facilities/ayam.webp');
    fs.copyFileSync('public/images/facilities/daging-ayam.jpg', 'public/images/facilities/poultry.jpg');
    fs.copyFileSync('public/images/facilities/daging-ayam.webp', 'public/images/facilities/poultry.webp');
  }
  if (fs.existsSync('public/images/facilities/daging-sapi.jpg')) {
    fs.copyFileSync('public/images/facilities/daging-sapi.jpg', 'public/images/facilities/peternakan.jpg');
    fs.copyFileSync('public/images/facilities/daging-sapi.webp', 'public/images/facilities/peternakan.webp');
  }

  console.log('✅ Asset standardization in /public/images/ complete!');
}

standardizeAssets().catch(err => {
  console.error('Error standardizing assets:', err);
  process.exit(1);
});
