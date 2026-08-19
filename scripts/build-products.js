/* eslint-disable */
const sharp = require('sharp');
const fs = require('fs');

async function createOfficialProducts() {
  fs.mkdirSync('public/images/products', { recursive: true });
  fs.mkdirSync('public/products', { recursive: true });
  fs.mkdirSync('public/images/hero', { recursive: true });

  const skus = [
    {
      code: 'B-01',
      name: 'BAKSO GORENG',
      tagline: 'GURIH, RENYAH, SIAP GORENG',
      slug: 'bakso-goreng',
      topColor: '#8B0000',
      bottomColor: '#121212',
      accentColor: '#DE9E02',
      subText: 'MERAH + HITAM',
      sourceImg: 'src/assets/images/wiridan_bakso_reg_1786791698503.jpg'
    },
    {
      code: 'B-02',
      name: 'BAKSO AYAM',
      tagline: 'KENYAL, GURIH, NIKMAT',
      slug: 'bakso-ayam',
      topColor: '#8B0000',
      bottomColor: '#7A1C1C',
      accentColor: '#FFFFFF',
      subText: 'MERAH + PUTIH',
      sourceImg: 'src/assets/images/wiridan_bakso_reg_1786791698503.jpg'
    },
    {
      code: 'B-03',
      name: 'BAKSO MEDIUM',
      tagline: 'UKURAN PAS, RASA SEIMBANG',
      slug: 'bakso-medium',
      topColor: '#8B0000',
      bottomColor: '#1E5E3A',
      accentColor: '#51CF66',
      subText: 'MERAH + HIJAU',
      sourceImg: 'src/assets/images/wiridan_bakso_prem_1786791685462.jpg'
    },
    {
      code: 'B-04',
      name: 'BAKSO URAT',
      tagline: 'KENYAL & BERURAT',
      slug: 'bakso-urat',
      topColor: '#8B0000',
      bottomColor: '#184E77',
      accentColor: '#4DABF7',
      subText: 'MERAH + BIRU',
      sourceImg: 'src/assets/images/wiridan_bakso_prem_1786791685462.jpg'
    },
    {
      code: 'B-05',
      name: 'BAKSO PREMIUM',
      tagline: 'LEZAT, GURIH, NIKMAT',
      slug: 'bakso-premium',
      topColor: '#8B0000',
      bottomColor: '#5C3A00',
      accentColor: '#F59F00',
      subText: 'MERAH + GOLD',
      sourceImg: 'src/assets/images/wiridan_bakso_prem_1786791685462.jpg'
    },
    {
      code: 'C-01',
      name: 'OTAK-OTAK',
      tagline: 'IKAN PILIHAN, LEZAT, BERGIZI',
      slug: 'otak-otak',
      topColor: '#165B33',
      bottomColor: '#0E3A20',
      accentColor: '#40C057',
      subText: 'HIJAU + HIJAU',
      sourceImg: 'src/assets/images/wiridan_otak_otak_1786791712290.jpg'
    },
    {
      code: 'D-01',
      name: 'DIMSUM AYAM',
      tagline: 'LEMBUT, GURIH & PRAKTIS',
      slug: 'dimsum-ayam',
      topColor: '#103778',
      bottomColor: '#1A365D',
      accentColor: '#CBD5E1',
      subText: 'BIRU + SILVER',
      sourceImg: 'src/assets/images/wiridan_dimsum_1786791731336.jpg'
    },
    {
      code: 'D-02',
      name: 'DIMSUM MIX',
      tagline: 'ANEKA DIMSUM, VARIAN LEZAT',
      slug: 'dimsum-mix',
      topColor: '#103778',
      bottomColor: '#2B1A4A',
      accentColor: '#FCC419',
      subText: 'BIRU + GOLD',
      sourceImg: 'src/assets/images/wiridan_dimsum_1786791731336.jpg'
    }
  ];

  for (const s of skus) {
    const foodCrop = await sharp(s.sourceImg)
      .resize(340, 240, { fit: 'cover', position: 'center' })
      .toBuffer();

    const safeTagline = s.tagline.replace(/&/g, '&amp;');
    const safeSubText = s.subText.replace(/&/g, '&amp;');

    const svgOverlay = Buffer.from(`
      <svg width="600" height="800" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${s.topColor}"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
          </linearGradient>
          <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${s.bottomColor}"/>
            <stop offset="100%" stop-color="#0a0a0a"/>
          </linearGradient>
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE066"/>
            <stop offset="50%" stop-color="#DE9E02"/>
            <stop offset="100%" stop-color="#996800"/>
          </linearGradient>
          <filter id="pouchShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
          </filter>
        </defs>

        <!-- Studio Dark Green Background -->
        <rect width="600" height="800" fill="#03140a"/>
        <circle cx="300" cy="400" r="260" fill="#062e17" opacity="0.6"/>

        <!-- Standing Pouch Outer Container with Shadow -->
        <g filter="url(#pouchShadow)">
          <!-- Pouch Body Silhouette -->
          <path d="M 100 80 Q 300 65 500 80 L 480 720 Q 300 740 120 720 Z" fill="#080808" stroke="url(#goldRim)" stroke-width="4"/>
          
          <!-- Top Header Section (Foil) -->
          <path d="M 100 80 Q 300 65 500 80 L 492 310 Q 300 325 108 310 Z" fill="url(#topGrad)"/>
          <path d="M 100 80 Q 300 65 500 80 L 498 120 Q 300 108 102 120 Z" fill="#000000" opacity="0.4"/>
          
          <!-- Top Seal Ribs -->
          <line x1="110" y1="95" x2="490" y2="95" stroke="#FFD43B" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>
          <line x1="112" y1="105" x2="488" y2="105" stroke="#FFD43B" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>

          <!-- Brand Logo Header Graphic -->
          <path d="M 200 145 C 200 125 400 125 400 145 C 400 200 360 215 300 220 C 240 215 200 200 200 145 Z" fill="#7A0000" stroke="url(#goldRim)" stroke-width="2.5"/>
          <text x="300" y="168" font-family="Georgia, serif" font-size="24" font-weight="bold" font-style="italic" fill="#FFD43B" text-anchor="middle">Wiridan</text>
          <text x="300" y="198" font-family="sans-serif" font-size="22" font-weight="900" fill="#FFD43B" text-anchor="middle" letter-spacing="2">318</text>

          <!-- Product Name Banner -->
          <rect x="130" y="230" width="340" height="42" rx="6" fill="#050505" stroke="url(#goldRim)" stroke-width="1.5"/>
          <text x="300" y="258" font-family="sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">${s.name}</text>
          <text x="300" y="285" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFD43B" text-anchor="middle" letter-spacing="1">${safeTagline}</text>

          <!-- Clear Window Frame (Border) -->
          <rect x="130" y="320" width="340" height="240" rx="16" fill="none" stroke="url(#goldRim)" stroke-width="3" opacity="0.9"/>
          
          <!-- Bottom Info Band (Foil) -->
          <path d="M 112 560 Q 300 575 488 560 L 480 720 Q 300 740 120 720 Z" fill="url(#botGrad)"/>
          <line x1="112" y1="560" x2="488" y2="560" stroke="url(#goldRim)" stroke-width="2"/>

          <!-- SKU Badges & Weights -->
          <!-- Halal Logo Badge -->
          <g transform="translate(145, 595)">
            <circle cx="24" cy="24" r="22" fill="#042614" stroke="#40C057" stroke-width="1.5"/>
            <text x="24" y="22" font-family="sans-serif" font-size="9" font-weight="bold" fill="#40C057" text-anchor="middle">HALAL</text>
            <text x="24" y="33" font-family="sans-serif" font-size="7" fill="#FFFFFF" text-anchor="middle">BPJPH</text>
          </g>

          <!-- Net Weight Center Box -->
          <g transform="translate(230, 592)">
            <rect x="0" y="0" width="140" height="48" rx="8" fill="#000000" stroke="${s.accentColor}" stroke-width="1.5"/>
            <text x="70" y="20" font-family="sans-serif" font-size="10" font-weight="bold" fill="${s.accentColor}" text-anchor="middle">BERAT BERSIH</text>
            <text x="70" y="40" font-family="sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">500 g</text>
          </g>

          <!-- Storage Frost Badge -->
          <g transform="translate(405, 595)">
            <circle cx="24" cy="24" r="22" fill="#0a1d30" stroke="#4DABF7" stroke-width="1.5"/>
            <text x="24" y="22" font-family="sans-serif" font-size="8" font-weight="bold" fill="#4DABF7" text-anchor="middle">BEKU</text>
            <text x="24" y="33" font-family="sans-serif" font-size="9" font-weight="bold" fill="#FFFFFF" text-anchor="middle">-18°C</text>
          </g>

          <!-- Bottom Code Pill Badge (B-01, B-02, etc.) -->
          <rect x="220" y="660" width="160" height="30" rx="15" fill="#000000" stroke="${s.accentColor}" stroke-width="2"/>
          <text x="300" y="680" font-family="sans-serif" font-size="13" font-weight="900" fill="${s.accentColor}" text-anchor="middle" letter-spacing="1.5">${s.code} • 500g</text>
        </g>
      </svg>
    `);

    // Composite window image inside the frame
    const composed = await sharp(svgOverlay)
      .composite([
        {
          input: foodCrop,
          top: 320,
          left: 130,
          blend: 'over'
        },
        {
          input: Buffer.from(`
            <svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFE066"/>
                  <stop offset="50%" stop-color="#DE9E02"/>
                  <stop offset="100%" stop-color="#996800"/>
                </linearGradient>
              </defs>
              <rect x="130" y="320" width="340" height="240" rx="16" fill="none" stroke="url(#goldRim)" stroke-width="3.5"/>
              <text x="300" y="550" font-family="sans-serif" font-size="11" font-weight="bold" fill="#FFD43B" text-anchor="middle" letter-spacing="1">WIRIDAN 318 FOOD</text>
            </svg>
          `),
          top: 0,
          left: 0,
          blend: 'over'
        }
      ])
      .toBuffer();

    // Write to both public/images/products and public/products in WebP and JPG
    await sharp(composed)
      .webp({ quality: 95 })
      .toFile(`public/images/products/${s.slug}.webp`);

    await sharp(composed)
      .webp({ quality: 95 })
      .toFile(`public/products/${s.slug}.webp`);

    await sharp(composed)
      .jpeg({ quality: 90 })
      .toFile(`public/images/products/${s.slug}.jpg`);

    await sharp(composed)
      .jpeg({ quality: 90 })
      .toFile(`public/products/${s.slug}.jpg`);

    console.log(`✅ Generated SKU: ${s.code} -> ${s.slug}.webp & .jpg`);
  }

  // Also ensure master hero header exists
  if (fs.existsSync('src/assets/images/hero_wiridan_sangprabu_1786870797516.jpg')) {
    await sharp('src/assets/images/hero_wiridan_sangprabu_1786870797516.jpg')
      .webp({ quality: 95 })
      .toFile('public/images/hero/hero-wiridan-master.webp');

    fs.copyFileSync('public/images/hero/hero-wiridan-master.webp', 'public/hero-wiridan.webp');
    fs.copyFileSync('public/images/hero/hero-wiridan-master.webp', 'public/HEADLINE_WIRIDAN.webp');
    console.log('✅ Generated hero-wiridan-master.webp');
  }
}

createOfficialProducts().catch(console.error);
