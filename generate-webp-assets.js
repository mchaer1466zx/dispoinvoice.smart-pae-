/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');

fs.mkdirSync('public/images/logo', { recursive: true });
fs.mkdirSync('public/images/products', { recursive: true });

// 1. Generate Gold Logo WebP
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 500" width="600" height="500">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF8DC" />
      <stop offset="25%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <linearGradient id="rubyBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#650912" />
      <stop offset="50%" stop-color="#40040A" />
      <stop offset="100%" stop-color="#200104" />
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#F59E0B" flood-opacity="0.5" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.8" />
    </filter>
  </defs>

  <g filter="url(#goldGlow)" transform="translate(300, 240)">
    <!-- Tasbih Beads Ring Around Frame -->
    <path d="M -180 -10 Q -200 -70 -130 -120 Q 0 -170 130 -120 Q 200 -70 180 -10 Q 200 60 130 110 Q 0 160 -130 110 Q -200 60 -180 -10 Z" fill="none" stroke="url(#goldGrad)" stroke-width="4" />
    
    <!-- Tasbih Individual Gold Beads -->
    ${Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * Math.PI * 2;
      const rx = 185;
      const ry = 135;
      const bx = Math.cos(angle) * rx;
      const by = Math.sin(angle) * ry;
      return `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="6.5" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1" />`;
    }).join('\n')}

    <!-- Islamic Dome Frame Badge -->
    <path d="M -160 -10 C -180 -80 -110 -115 0 -140 C 110 -115 180 -80 160 -10 C 180 65 110 105 0 130 C -110 105 -180 65 -160 -10 Z" fill="url(#rubyBg)" stroke="url(#goldGrad)" stroke-width="8" />
    <path d="M -150 -10 C -170 -75 -100 -105 0 -128 C 100 -105 170 -75 150 -10 C 170 60 100 95 0 118 C -100 95 -170 60 -150 -10 Z" fill="none" stroke="#FDE68A" stroke-width="2" stroke-dasharray="6 4" opacity="0.8" />

    <!-- Left Hanging Tassel -->
    <g transform="translate(-165, 45) rotate(15)">
      <!-- Tassel Top Knot -->
      <circle cx="0" cy="0" r="10" fill="url(#goldGrad)" stroke="#78350F" stroke-width="1.5" />
      <!-- Tassel Skirt/Fringes -->
      <path d="M -8 8 L -14 55 Q 0 62 14 55 L 8 8 Z" fill="url(#goldGrad)" stroke="#92400E" stroke-width="1" />
      <line x1="-8" y1="20" x2="8" y2="20" stroke="#78350F" stroke-width="2" />
      <line x1="-10" y1="24" x2="10" y2="24" stroke="#78350F" stroke-width="2" />
    </g>

    <!-- Caligraphy "Wiridan" -->
    <text x="0" y="-12" font-family="'Brush Script MT', 'Great Vibes', 'Playfair Display', cursive, serif" font-weight="900" font-size="78" letter-spacing="0.02em" fill="url(#goldGrad)" text-anchor="middle">
      Wiridan
    </text>

    <!-- "318" Numerals in Bold Gold Emboss -->
    <text x="0" y="68" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="64" letter-spacing="0.08em" fill="url(#goldGrad)" text-anchor="middle">
      318
    </text>

    <!-- Subtitle FOOD QUALITY -->
    <text x="0" y="102" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="12" letter-spacing="0.3em" fill="#FDE68A" text-anchor="middle">
      FOOD QUALITY
    </text>
  </g>
</svg>
`;

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Product Template Generator
function createProductPouchSvg({
  themeGradient,
  headerColor,
  title,
  subtitle,
  pouchBorder,
  renderGraphic,
}) {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs>
    ${themeGradient}
    <linearGradient id="foilSheen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="25%" stop-color="#ffffff" stop-opacity="0.28" />
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="65%" stop-color="#ffffff" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="25%" stop-color="#FCD34D" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <filter id="pouchShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#000000" flood-opacity="0.75" />
    </filter>
    <clipPath id="pouchClip">
      <path d="M 60 50 Q 300 42 540 50 Q 560 180 550 790 Q 545 845 500 855 Q 300 868 100 855 Q 55 845 50 790 Q 40 180 60 50 Z" />
    </clipPath>
  </defs>

  <!-- Pouch Body -->
  <g filter="url(#pouchShadow)">
    <path d="M 60 50 Q 300 42 540 50 Q 560 180 550 790 Q 545 845 500 855 Q 300 868 100 855 Q 55 845 50 790 Q 40 180 60 50 Z" fill="url(#pouchBg)" stroke="${pouchBorder}" stroke-width="3" />

    <g clip-path="url(#pouchClip)">
      <rect x="40" y="40" width="520" height="830" fill="url(#foilSheen)" />

      <!-- Top Ziploc / Heat Seal Crimping -->
      <rect x="40" y="40" width="520" height="50" fill="#0b0b0f" opacity="0.85" />
      ${Array.from({ length: 6 }).map((_, i) => `<line x1="40" y1="${50 + i * 7}" x2="560" y2="${50 + i * 7}" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.35" />`).join('\n')}

      <!-- Tear Notches -->
      <path d="M 38 88 L 52 93 L 38 98 Z" fill="#000000" />
      <path d="M 562 88 L 548 93 L 562 98 Z" fill="#000000" />

      <!-- Golden Wiridan 318 Brand Emblem Header -->
      <g transform="translate(300, 195)">
        <path d="M -110 -5 C -125 -50 -75 -75 0 -92 C 75 -75 125 -50 110 -5 C 125 45 75 70 0 88 C -75 70 -125 45 -110 -5 Z" fill="#45070d" stroke="url(#goldGrad)" stroke-width="5" />
        
        <!-- Tassel -->
        <g transform="translate(-115, 30) rotate(12)">
          <circle cx="0" cy="0" r="7" fill="url(#goldGrad)" />
          <path d="M -5 5 L -10 38 Q 0 44 10 38 L 5 5 Z" fill="url(#goldGrad)" />
        </g>

        <!-- Script Wiridan -->
        <text x="0" y="-8" font-family="'Brush Script MT', cursive, serif" font-weight="900" font-size="52" fill="url(#goldGrad)" text-anchor="middle">
          Wiridan
        </text>
        <text x="0" y="46" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="44" letter-spacing="0.06em" fill="url(#goldGrad)" text-anchor="middle">
          318
        </text>
      </g>

      <!-- Main Product Name Title -->
      <g transform="translate(300, 310)">
        ${headerColor}
        <text x="0" y="28" font-family="'Plus Jakarta Sans', Georgia, serif" font-weight="900" font-size="38" letter-spacing="0.04em" fill="#FFFFFF" text-anchor="middle">
          ${safeTitle}
        </text>
        <text x="0" y="60" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="16" letter-spacing="0.14em" fill="#FDE68A" text-anchor="middle">
          ${safeSubtitle}
        </text>
      </g>

      <!-- Transparent Product Window with Real Food Renderings -->
      <g transform="translate(300, 525)">
        ${renderGraphic}
      </g>

      <!-- 4 Badges Bar (Halal, Higienis, Praktis, Simpan Beku -18°C) -->
      <g transform="translate(300, 695)">
        <rect x="-240" y="-22" width="480" height="44" rx="22" fill="#06120b" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.95" />
        
        <!-- Halal Badge -->
        <g transform="translate(-180, 0)">
          <circle cx="0" cy="0" r="14" fill="#042013" stroke="#22C55E" stroke-width="1.5" />
          <text x="0" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="9" fill="#86EFAC" text-anchor="middle">حلال</text>
          <text x="0" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8.5" fill="#E2E8F0" text-anchor="middle">HALAL</text>
        </g>

        <!-- Higienis Badge -->
        <g transform="translate(-60, 0)">
          <circle cx="0" cy="0" r="14" fill="#042013" stroke="#38BDF8" stroke-width="1.5" />
          <path d="M 0 -7 L 7 -2 L 7 4 Q 0 9 -7 4 L -7 -2 Z" fill="#38BDF8" />
          <text x="0" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8.5" fill="#E2E8F0" text-anchor="middle">HIGIENIS</text>
        </g>

        <!-- Praktis Badge -->
        <g transform="translate(60, 0)">
          <circle cx="0" cy="0" r="14" fill="#042013" stroke="#FBBF24" stroke-width="1.5" />
          <text x="0" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="11" fill="#FDE68A" text-anchor="middle">&#10003;</text>
          <text x="0" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8.5" fill="#E2E8F0" text-anchor="middle">PRAKTIS</text>
        </g>

        <!-- Simpan Beku Badge -->
        <g transform="translate(180, 0)">
          <circle cx="0" cy="0" r="14" fill="#042013" stroke="#818CF8" stroke-width="1.5" />
          <text x="0" y="4" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="11" fill="#C7D2FE" text-anchor="middle">&#10052;</text>
          <text x="0" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="8.5" fill="#E2E8F0" text-anchor="middle">-18°C BEKU</text>
        </g>
      </g>

      <!-- Bottom Weight Box: BERAT BERSIH 500 g -->
      <g transform="translate(300, 790)">
        <rect x="-120" y="-22" width="240" height="44" rx="8" fill="#000000" stroke="url(#goldGrad)" stroke-width="2" />
        <text x="0" y="-4" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10" letter-spacing="0.16em" fill="#CBD5E1" text-anchor="middle">
          BERAT BERSIH
        </text>
        <text x="0" y="15" font-family="'Plus Jakarta Sans', monospace, sans-serif" font-weight="900" font-size="20" fill="#FCD34D" text-anchor="middle">
          500 g
        </text>
      </g>
    </g>
  </g>
</svg>
`;
}

// 8 Product Configurations
const products = [
  {
    filename: 'otak-otak.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#042315" />
          <stop offset="30%" stop-color="#0B4B2E" />
          <stop offset="70%" stop-color="#07331F" />
          <stop offset="100%" stop-color="#02140C" />
        </linearGradient>
      `,
      headerColor: ``,
      title: 'OTAK OTAK',
      subtitle: 'IKAN PILIHAN, LEZAT, BERGIZI',
      pouchBorder: '#16A34A',
      renderGraphic: `
        <!-- Window Frame -->
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#051c11" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- Stacked Otak-Otak Fish Rolls -->
        ${[
          { x: -90, y: -45, r: -25 },
          { x: -30, y: -20, r: -25 },
          { x: 30, y: 5, r: -25 },
          { x: 90, y: 30, r: -25 },
          { x: 150, y: 55, r: -25 },
          { x: -140, y: -10, r: -25 },
          { x: -80, y: 15, r: -25 },
          { x: -20, y: 40, r: -25 },
          { x: 40, y: 65, r: -25 },
        ].map(s => `
          <g transform="translate(${s.x}, ${s.y}) rotate(${s.r})">
            <rect x="-85" y="-14" width="170" height="28" rx="14" fill="#E2C9A5" stroke="#B89468" stroke-width="1.5" />
            <!-- Char Marks and pepper flakes -->
            <line x1="-40" y1="-10" x2="-35" y2="10" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
            <line x1="0" y1="-10" x2="5" y2="10" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
            <line x1="40" y1="-10" x2="45" y2="10" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
            <circle cx="-20" cy="-2" r="1.5" fill="#16A34A" />
            <circle cx="20" cy="2" r="1.5" fill="#EF4444" />
          </g>
        `).join('\n')}
      `
    })
  },
  {
    filename: 'dimsum-ayam.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0B2B5C" />
          <stop offset="30%" stop-color="#154A96" />
          <stop offset="70%" stop-color="#0E336B" />
          <stop offset="100%" stop-color="#05142E" />
        </linearGradient>
      `,
      headerColor: ``,
      title: 'DIMSUM AYAM',
      subtitle: 'LEMBUT, GURIH & PRAKTIS',
      pouchBorder: '#2563EB',
      renderGraphic: `
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#071b38" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- 3x2 Dimsum Flower Shapes with Carrot Dot -->
        ${[
          { x: -130, y: -45 }, { x: 0, y: -45 }, { x: 130, y: -45 },
          { x: -130, y: 45 }, { x: 0, y: 45 }, { x: 130, y: 45 }
        ].map(d => `
          <g transform="translate(${d.x}, ${d.y})">
            <circle cx="0" cy="0" r="42" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2" />
            ${Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return `<ellipse cx="${(Math.cos(a)*28).toFixed(1)}" cy="${(Math.sin(a)*28).toFixed(1)}" rx="10" ry="8" fill="#FDE68A" stroke="#D97706" stroke-width="1" />`;
            }).join('\n')}
            <circle cx="0" cy="0" r="18" fill="#EA580C" stroke="#C2410C" stroke-width="1.5" />
            <circle cx="0" cy="0" r="8" fill="#F97316" />
          </g>
        `).join('\n')}
      `
    })
  },
  {
    filename: 'dimsum-mix.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0A254E" />
          <stop offset="30%" stop-color="#123F82" />
          <stop offset="70%" stop-color="#0A2247" />
          <stop offset="100%" stop-color="#040F21" />
        </linearGradient>
      `,
      headerColor: ``,
      title: 'DIMSUM MIX',
      subtitle: 'LEMBUT & GURIH',
      pouchBorder: '#3B82F6',
      renderGraphic: `
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#06152b" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- Varied Dimsum toppings: Nori, Cheese, Carrot, Mushroom -->
        ${[
          { x: -130, y: -45, top: '#EA580C' }, { x: 0, y: -45, top: '#FACC15' }, { x: 130, y: -45, top: '#16A34A' },
          { x: -130, y: 45, top: '#78350F' }, { x: 0, y: 45, top: '#EA580C' }, { x: 130, y: 45, top: '#FACC15' }
        ].map(d => `
          <g transform="translate(${d.x}, ${d.y})">
            <circle cx="0" cy="0" r="42" fill="#FEEBC8" stroke="#DD6B20" stroke-width="2" />
            ${Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return `<ellipse cx="${(Math.cos(a)*28).toFixed(1)}" cy="${(Math.sin(a)*28).toFixed(1)}" rx="10" ry="8" fill="#FDE68A" stroke="#D97706" stroke-width="1" />`;
            }).join('\n')}
            <circle cx="0" cy="0" r="18" fill="${d.top}" stroke="#000000" stroke-width="1" opacity="0.9" />
          </g>
        `).join('\n')}
      `
    })
  },
  {
    filename: 'bakso-ayam.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#540910" />
          <stop offset="30%" stop-color="#8A0E1A" />
          <stop offset="70%" stop-color="#5E0911" />
          <stop offset="100%" stop-color="#280306" />
        </linearGradient>
      `,
      headerColor: ``,
      title: 'BAKSO AYAM',
      subtitle: 'KENYAL, GURIH, NIKMAT',
      pouchBorder: '#E11D48',
      renderGraphic: `
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#200306" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- Tender Chicken Meatballs array -->
        ${[
          { x: -140, y: -45, r: 36 }, { x: -70, y: -45, r: 38 }, { x: 0, y: -45, r: 36 }, { x: 70, y: -45, r: 38 }, { x: 140, y: -45, r: 36 },
          { x: -140, y: 45, r: 38 }, { x: -70, y: 45, r: 36 }, { x: 0, y: 45, r: 38 }, { x: 70, y: 45, r: 36 }, { x: 140, y: 45, r: 38 },
          { x: -105, y: 0, r: 35 }, { x: -35, y: 0, r: 37 }, { x: 35, y: 0, r: 37 }, { x: 105, y: 0, r: 35 }
        ].map(m => `
          <g transform="translate(${m.x}, ${m.y})">
            <circle cx="0" cy="0" r="${m.r}" fill="#D4AF87" stroke="#A37E59" stroke-width="1.5" />
            <circle cx="-8" cy="-10" r="3" fill="#8C6642" opacity="0.6" />
            <circle cx="10" cy="-6" r="2.5" fill="#8C6642" opacity="0.6" />
            <circle cx="-2" cy="8" r="3.5" fill="#8C6642" opacity="0.6" />
            <circle cx="12" cy="10" r="2" fill="#8C6642" opacity="0.6" />
          </g>
        `).join('\n')}
      `
    })
  },
  {
    filename: 'bakso-goreng.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A050A" />
          <stop offset="25%" stop-color="#730C15" />
          <stop offset="60%" stop-color="#1F0205" />
          <stop offset="100%" stop-color="#0A0102" />
        </linearGradient>
      `,
      headerColor: `
        <rect x="-180" y="-10" width="360" height="50" rx="8" fill="#0B0B0E" stroke="url(#goldGrad)" stroke-width="1.5" />
      `,
      title: 'BAKSO GORENG',
      subtitle: 'GURIH, RENYAH, SIAP GORENG',
      pouchBorder: '#F59E0B',
      renderGraphic: `
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#180305" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- Golden Crispy Fried Meatballs with textured crust -->
        ${[
          { x: -140, y: -45, r: 38 }, { x: -70, y: -45, r: 40 }, { x: 0, y: -45, r: 38 }, { x: 70, y: -45, r: 40 }, { x: 140, y: -45, r: 38 },
          { x: -140, y: 45, r: 40 }, { x: -70, y: 45, r: 38 }, { x: 0, y: 45, r: 40 }, { x: 70, y: 45, r: 38 }, { x: 140, y: 45, r: 40 },
          { x: -105, y: 0, r: 38 }, { x: -35, y: 0, r: 39 }, { x: 35, y: 0, r: 39 }, { x: 105, y: 0, r: 38 }
        ].map(m => `
          <g transform="translate(${m.x}, ${m.y})">
            <circle cx="0" cy="0" r="${m.r}" fill="#A0522D" stroke="#5C2910" stroke-width="2" />
            <!-- Golden Crisp Pores -->
            ${Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return `<circle cx="${(Math.cos(a)*18).toFixed(1)}" cy="${(Math.sin(a)*18).toFixed(1)}" r="4" fill="#CD853F" stroke="#4A1E0A" stroke-width="1" />`;
            }).join('\n')}
            <circle cx="0" cy="0" r="8" fill="#8B4513" />
          </g>
        `).join('\n')}
      `
    })
  },
  {
    filename: 'bakso-medium.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#08331E" />
          <stop offset="35%" stop-color="#690913" />
          <stop offset="70%" stop-color="#45050C" />
          <stop offset="100%" stop-color="#04140B" />
        </linearGradient>
      `,
      headerColor: `
        <rect x="-180" y="-8" width="360" height="46" rx="6" fill="#0E4E2C" stroke="#22C55E" stroke-width="2" />
      `,
      title: 'BAKSO MEDIUM',
      subtitle: 'UKURAN PAS, RASA SEIMBANG',
      pouchBorder: '#22C55E',
      renderGraphic: `
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#140407" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- Medium Beef Meatballs -->
        ${[
          { x: -140, y: -45, r: 35 }, { x: -70, y: -45, r: 36 }, { x: 0, y: -45, r: 35 }, { x: 70, y: -45, r: 36 }, { x: 140, y: -45, r: 35 },
          { x: -140, y: 45, r: 36 }, { x: -70, y: 45, r: 35 }, { x: 0, y: 45, r: 36 }, { x: 70, y: 45, r: 35 }, { x: 140, y: 45, r: 36 },
          { x: -105, y: 0, r: 35 }, { x: -35, y: 0, r: 36 }, { x: 35, y: 0, r: 36 }, { x: 105, y: 0, r: 35 }
        ].map(m => `
          <g transform="translate(${m.x}, ${m.y})">
            <circle cx="0" cy="0" r="${m.r}" fill="#9E7250" stroke="#6E4A2E" stroke-width="1.5" />
            <circle cx="-6" cy="-8" r="3" fill="#50331E" opacity="0.6" />
            <circle cx="8" cy="-4" r="2.5" fill="#50331E" opacity="0.6" />
            <circle cx="0" cy="7" r="3" fill="#50331E" opacity="0.6" />
          </g>
        `).join('\n')}
      `
    })
  },
  {
    filename: 'bakso-premium.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#57050E" />
          <stop offset="30%" stop-color="#8F0D1B" />
          <stop offset="70%" stop-color="#5E0610" />
          <stop offset="100%" stop-color="#240105" />
        </linearGradient>
      `,
      headerColor: ``,
      title: 'BAKSO PREMIUM',
      subtitle: 'LEZAT, GURIH, NIKMAT',
      pouchBorder: '#F59E0B',
      renderGraphic: `
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#1C0307" stroke="url(#goldGrad)" stroke-width="3" />
        <!-- Big Premium Beef Meatballs with Rich Texture -->
        ${[
          { x: -130, y: -45, r: 44 }, { x: 0, y: -45, r: 45 }, { x: 130, y: -45, r: 44 },
          { x: -130, y: 45, r: 45 }, { x: 0, y: 45, r: 44 }, { x: 130, y: 45, r: 45 },
          { x: -65, y: 0, r: 43 }, { x: 65, y: 0, r: 43 }
        ].map(m => `
          <g transform="translate(${m.x}, ${m.y})">
            <circle cx="0" cy="0" r="${m.r}" fill="#875638" stroke="#52301A" stroke-width="2" />
            <circle cx="-10" cy="-12" r="4" fill="#3D200E" opacity="0.7" />
            <circle cx="12" cy="-8" r="3.5" fill="#3D200E" opacity="0.7" />
            <circle cx="-4" cy="10" r="4" fill="#3D200E" opacity="0.7" />
            <circle cx="14" cy="12" r="3" fill="#3D200E" opacity="0.7" />
            <!-- Juicy Glaze -->
            <ellipse cx="-12" cy="-16" rx="14" ry="6" fill="#B37C56" opacity="0.6" />
          </g>
        `).join('\n')}
      `
    })
  },
  {
    filename: 'bakso-urat.webp',
    svg: createProductPouchSvg({
      themeGradient: `
        <linearGradient id="pouchBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0E2F5E" />
          <stop offset="25%" stop-color="#730C15" />
          <stop offset="75%" stop-color="#54070E" />
          <stop offset="100%" stop-color="#071936" />
        </linearGradient>
      `,
      headerColor: `
        <rect x="-180" y="-8" width="360" height="46" rx="6" fill="#154480" stroke="url(#goldGrad)" stroke-width="1.5" />
      `,
      title: 'BAKSO URAT',
      subtitle: 'KENYAL & BERURAT',
      pouchBorder: '#3B82F6',
      renderGraphic: `
        <rect x="-210" y="-105" width="420" height="210" rx="16" fill="#180407" stroke="url(#goldGrad)" stroke-width="2.5" />
        <!-- Crunchy Tendon Beef Meatballs -->
        ${[
          { x: -140, y: -45, r: 38 }, { x: -70, y: -45, r: 40 }, { x: 0, y: -45, r: 38 }, { x: 70, y: -45, r: 40 }, { x: 140, y: -45, r: 38 },
          { x: -140, y: 45, r: 40 }, { x: -70, y: 45, r: 38 }, { x: 0, y: 45, r: 40 }, { x: 70, y: 45, r: 38 }, { x: 140, y: 45, r: 40 },
          { x: -105, y: 0, r: 39 }, { x: -35, y: 0, r: 39 }, { x: 35, y: 0, r: 39 }, { x: 105, y: 0, r: 39 }
        ].map(m => `
          <g transform="translate(${m.x}, ${m.y})">
            <circle cx="0" cy="0" r="${m.r}" fill="#825237" stroke="#4F2D19" stroke-width="2" />
            <!-- Crunchy Tendon Webbing Patterns -->
            ${Array.from({ length: 6 }).map((_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return `<circle cx="${(Math.cos(a)*16).toFixed(1)}" cy="${(Math.sin(a)*16).toFixed(1)}" r="7" fill="#9E6948" stroke="#3D200E" stroke-width="1.5" />`;
            }).join('\n')}
            <circle cx="0" cy="0" r="9" fill="#522D16" />
          </g>
        `).join('\n')}
      `
    })
  }
];

async function run() {
  console.log('Generating WebP Logo...');
  await sharp(Buffer.from(logoSvg))
    .webp({ quality: 95 })
    .toFile('public/images/logo/logo-wiridan-318-gold.webp');
  console.log('Logo generated: public/images/logo/logo-wiridan-318-gold.webp');

  for (const prod of products) {
    console.log(`Generating WebP for ${prod.filename}...`);
    await sharp(Buffer.from(prod.svg))
      .webp({ quality: 92 })
      .toFile(`public/images/products/${prod.filename}`);
  }

  // Also create aliases with prefix C-01, D-01, etc.
  fs.copyFileSync('public/images/products/otak-otak.webp', 'public/images/products/C-01.OTAK.OTAK.webp');
  fs.copyFileSync('public/images/products/dimsum-ayam.webp', 'public/images/products/D-01.DIMSUM.AYAM.webp');
  fs.copyFileSync('public/images/products/dimsum-mix.webp', 'public/images/products/D-02.DIMSUM.MIX.webp');
  fs.copyFileSync('public/images/products/bakso-ayam.webp', 'public/images/products/B-02.BAKSO.AYAM.webp');
  fs.copyFileSync('public/images/products/bakso-goreng.webp', 'public/images/products/B-01.BAKSO.GORENG.webp');
  fs.copyFileSync('public/images/products/bakso-medium.webp', 'public/images/products/B-03.BAKSO.MEDIUM.webp');
  fs.copyFileSync('public/images/products/bakso-premium.webp', 'public/images/products/B-05.BAKSO.PREMIUM.webp');
  fs.copyFileSync('public/images/products/bakso-urat.webp', 'public/images/products/B-04.BAKSO.URAT.webp');

  console.log('All 8 product WebP images & aliases generated successfully!');
}

run().catch(console.error);
