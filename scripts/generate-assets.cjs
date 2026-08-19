/* eslint-disable */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function buildAllAssets() {
  console.log('Generating valid, high-resolution WebP and PNG/JPG assets...');

  // Ensure directories exist
  const dirs = [
    'public/images/logo',
    'public/images/hero',
    'public/images/products',
    'public/products',
    'public/wiridan',
    'public/sang-prabu',
    'public/logos',
  ];
  dirs.forEach((d) => fs.mkdirSync(d, { recursive: true }));

  // Master sources
  const srcHero = 'src/assets/images/hero_wiridan_sangprabu_1786870797516.jpg';
  const srcWiridanLogo = 'src/assets/images/wiridan_logo_gold_1786791750372.jpg';
  const srcSangPrabuLogo = 'public/logos/logo-sang-prabu.png';
  const srcBaksoPrem = 'src/assets/images/wiridan_bakso_prem_1786791685462.jpg';
  const srcBaksoReg = 'src/assets/images/wiridan_bakso_reg_1786791698503.jpg';
  const srcOtakOtak = 'src/assets/images/otak_otak_clean_1786818509928.jpg';
  const srcDimsum = 'src/assets/images/wiridan_dimsum_1786791731336.jpg';
  const srcGroupHero = 'src/assets/images/wiridan_group_hero_1786818542859.jpg';
  const srcFourGrid = 'src/assets/images/wiridan_four_products_grid_1786870980578.jpg';

  // 1. HERO MASTER
  await sharp(srcHero).webp({ quality: 90 }).toFile('public/images/hero/hero-wiridan-master.webp');
  await sharp(srcHero).jpeg({ quality: 90 }).toFile('public/images/hero/hero-wiridan-master.jpg');
  await sharp(srcHero).webp({ quality: 90 }).toFile('public/hero-wiridan.webp');
  await sharp(srcHero).webp({ quality: 90 }).toFile('public/HEADLINE_WIRIDAN.webp');
  await sharp(srcHero).jpeg({ quality: 90 }).toFile('public/sang-prabu/hero-bakso.jpg');

  // 2. LOGO WIRIDAN 318 GOLD
  await sharp(srcWiridanLogo).webp({ quality: 92 }).toFile('public/images/logo/logo-wiridan-318-gold.webp');
  await sharp(srcWiridanLogo).png({ quality: 95 }).toFile('public/images/logo/logo-wiridan-318-gold.png');
  await sharp(srcWiridanLogo).jpeg({ quality: 92 }).toFile('public/images/logo/logo-wiridan-318-gold.jpg');
  await sharp(srcWiridanLogo).png({ quality: 95 }).toFile('public/wiridan/wiridan_logo_gold_1786791750372.png');
  await sharp(srcWiridanLogo).jpeg({ quality: 92 }).toFile('public/wiridan/wiridan_logo_gold_1786791750372.jpg');
  await sharp(srcWiridanLogo).jpeg({ quality: 92 }).toFile('public/wiridan/logo-wiridan.jpg');

  // 3. LOGO SANG PRABU
  await sharp(srcSangPrabuLogo).webp({ quality: 92 }).toFile('public/images/logo/logo-sang-prabu.webp');
  await sharp(srcSangPrabuLogo).png().toFile('public/images/logo/logo-sang-prabu.png');
  await sharp(srcSangPrabuLogo).png().toFile('public/sang-prabu/sang-prabu-haki-logo.png');
  await sharp(srcSangPrabuLogo).png().toFile('public/logos/sang-prabu-haki.png');

  // 4. 8 SKU PRODUCTS
  const productMappings = [
    {
      source: srcBaksoPrem,
      slug: 'bakso-premium',
      code: 'B-05.BAKSO.PREMIUM',
    },
    {
      source: srcBaksoReg,
      slug: 'bakso-urat',
      code: 'B-04.BAKSO.URAT',
    },
    {
      source: srcBaksoReg,
      slug: 'bakso-medium',
      code: 'B-03.BAKSO.MEDIUM',
    },
    {
      source: srcBaksoReg,
      slug: 'bakso-ayam',
      code: 'B-02.BAKSO.AYAM',
    },
    {
      source: srcBaksoPrem,
      slug: 'bakso-goreng',
      code: 'B-01.BAKSO.GORENG',
    },
    {
      source: srcOtakOtak,
      slug: 'otak-otak',
      code: 'C-01.OTAK.OTAK',
    },
    {
      source: srcDimsum,
      slug: 'dimsum-ayam',
      code: 'D-01.DIMSUM.AYAM',
    },
    {
      source: srcDimsum,
      slug: 'dimsum-mix',
      code: 'D-02.DIMSUM.MIX',
    },
  ];

  for (const item of productMappings) {
    // WebP in public/images/products/
    await sharp(item.source).webp({ quality: 88 }).toFile(`public/images/products/${item.slug}.webp`);
    await sharp(item.source).jpeg({ quality: 88 }).toFile(`public/images/products/${item.slug}.jpg`);
    await sharp(item.source).webp({ quality: 88 }).toFile(`public/images/products/${item.code}.webp`);

    // In public/products/
    await sharp(item.source).webp({ quality: 88 }).toFile(`public/products/${item.slug}.webp`);
    await sharp(item.source).jpeg({ quality: 88 }).toFile(`public/products/${item.slug}.jpg`);
    await sharp(item.source).webp({ quality: 88 }).toFile(`public/products/${item.code}.webp`);
  }

  // 5. WIRIDAN DIRECTORY LEGACY ASSETS
  await sharp(srcBaksoPrem).jpeg({ quality: 88 }).toFile('public/wiridan/bakso-premium.jpg');
  await sharp(srcBaksoPrem).jpeg({ quality: 88 }).toFile('public/wiridan/wiridan_bakso_prem_1786791685462.jpg');
  await sharp(srcBaksoReg).jpeg({ quality: 88 }).toFile('public/wiridan/bakso-reguler.jpg');
  await sharp(srcBaksoReg).jpeg({ quality: 88 }).toFile('public/wiridan/wiridan_bakso_reg_1786791698503.jpg');
  await sharp(srcOtakOtak).jpeg({ quality: 88 }).toFile('public/wiridan/otak-otak.jpg');
  await sharp(srcOtakOtak).jpeg({ quality: 88 }).toFile('public/wiridan/wiridan_otak_otak_1786791712290.jpg');
  await sharp(srcOtakOtak).jpeg({ quality: 88 }).toFile('public/wiridan/wiridan_otak_otak_clean.jpg');
  await sharp(srcDimsum).jpeg({ quality: 88 }).toFile('public/wiridan/dimsum.jpg');
  await sharp(srcDimsum).jpeg({ quality: 88 }).toFile('public/wiridan/wiridan_dimsum_1786791731336.jpg');
  await sharp(srcGroupHero).jpeg({ quality: 88 }).toFile('public/wiridan/wiridan-group.jpg');
  await sharp(srcFourGrid).jpeg({ quality: 88 }).toFile('public/wiridan/group-4-products.jpg');

  // 6. SANG PRABU RECOVERIES
  const srcAyam = 'public/sang-prabu/daging-ayam.jpg';
  const srcDaging = 'public/sang-prabu/daging-sapi.jpg';
  if (fs.existsSync(srcAyam)) {
    await sharp(srcAyam).jpeg({ quality: 85 }).toFile('public/sang-prabu/ayam.jpg');
    await sharp(srcAyam).jpeg({ quality: 85 }).toFile('public/sang-prabu/poultry.jpg');
  }
  if (fs.existsSync(srcDaging)) {
    await sharp(srcDaging).jpeg({ quality: 85 }).toFile('public/sang-prabu/peternakan.jpg');
  }

  console.log('✅ Successfully normalized all image assets across public/ directory!');
}

buildAllAssets().catch((err) => {
  console.error(err);
  process.exit(1);
});
