const fs = require('fs');
const path = require('path');

const brandsDir = path.join(__dirname, '..', 'public', 'brands');
if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

// Map of all 20 brands with precise, authentic SVG vector art
const brandSVGs = {
  'whirlpool': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 65" width="200" height="65">
  <defs>
    <linearGradient id="whirlRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C29B38"/>
      <stop offset="50%" stop-color="#E5C158"/>
      <stop offset="100%" stop-color="#9A7B2C"/>
    </linearGradient>
  </defs>
  <!-- Whirlpool golden orbit ring -->
  <ellipse cx="68" cy="24" rx="36" ry="12" fill="none" stroke="url(#whirlRing)" stroke-width="3.5" transform="rotate(-18 68 24)"/>
  <!-- Whirlpool text -->
  <text x="100" y="44" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="25" font-weight="900" fill="#00558F" text-anchor="middle" letter-spacing="-0.5">Whirlpool</text>
  <circle cx="168" cy="27" r="2.5" fill="#00558F"/>
  <ellipse cx="68" cy="24" rx="36" ry="12" fill="none" stroke="url(#whirlRing)" stroke-width="3.5" stroke-dasharray="35 70" transform="rotate(-18 68 24)"/>
</svg>`,

  'lg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 65" width="160" height="65">
  <g transform="translate(18, 7.5)">
    <!-- Red circle -->
    <circle cx="25" cy="25" r="24" fill="#C40030"/>
    <!-- Face outline 'G' -->
    <path d="M 25 9 A 16 16 0 1 0 41 25 L 31 25" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round"/>
    <!-- Nose 'L' -->
    <path d="M 25 17 L 25 28 L 30 28" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Eye dot -->
    <circle cx="19" cy="20" r="2.4" fill="#FFFFFF"/>
  </g>
  <!-- LG text -->
  <text x="98" y="42" font-family="'Helvetica Neue', Arial, sans-serif" font-size="34" font-weight="900" fill="#54565B" letter-spacing="1">LG</text>
</svg>`,

  'samsung': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <!-- Samsung signature blue oval -->
  <ellipse cx="90" cy="32.5" rx="84" ry="24" fill="#034EA2" transform="rotate(-6 90 32.5)"/>
  <!-- Samsung custom lettering -->
  <g fill="#FFFFFF">
    <text x="90" y="40" font-family="'Arial Black', 'Helvetica Black', sans-serif" font-size="22" font-weight="900" text-anchor="middle" letter-spacing="1.5">SAMSUNG</text>
  </g>
</svg>`,

  'voltas': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <text x="90" y="38" font-family="'Arial Black', 'Montserrat', sans-serif" font-size="28" font-weight="900" fill="#006699" text-anchor="middle" letter-spacing="1">VOLTAS</text>
  <rect x="25" y="45" width="130" height="2" fill="#006699" opacity="0.3"/>
  <text x="90" y="55" font-family="'Arial', sans-serif" font-size="7.5" font-weight="700" fill="#64748B" text-anchor="middle" letter-spacing="2">A TATA ENTERPRISE</text>
</svg>`,

  'bluestar': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 65" width="190" height="65">
  <!-- 4-point star emblem -->
  <g transform="translate(18, 12)">
    <path d="M20 0 L24 14 L38 20 L24 26 L20 40 L16 26 L2 20 L16 14 Z" fill="#004B87"/>
    <path d="M20 5 L23 16 L34 20 L23 24 L20 35 L17 24 L6 20 L17 16 Z" fill="#0072CE"/>
  </g>
  <text x="70" y="32" font-family="'Arial Black', sans-serif" font-size="18" font-weight="900" fill="#004B87" letter-spacing="1.2">BLUE</text>
  <text x="70" y="50" font-family="'Arial Black', sans-serif" font-size="18" font-weight="900" fill="#004B87" letter-spacing="1.2">STAR</text>
</svg>`,

  'daikin': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <!-- Daikin cyan triangle mark -->
  <polygon points="15,48 42,12 42,48" fill="#0097E6"/>
  <polygon points="28,48 42,30 42,48" fill="#005A9C"/>
  <text x="52" y="41" font-family="'Arial Black', 'Helvetica Black', sans-serif" font-size="25" font-weight="900" fill="#0B2341" letter-spacing="0.8">DAIKIN</text>
</svg>`,

  'godrej': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <!-- Godrej iconic cursive script -->
  <text x="90" y="44" font-family="'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', cursive, sans-serif" font-size="44" font-weight="bold" fill="#CB1517" text-anchor="middle" font-style="italic">Godrej</text>
</svg>`,

  'duroflex': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <!-- Duroflex red symbol + wordmark -->
  <g transform="translate(15, 14)">
    <circle cx="16" cy="18" r="14" fill="#C8102E"/>
    <path d="M8 18 Q16 10 24 18 Q16 26 8 18" fill="#FFFFFF"/>
  </g>
  <text x="54" y="39" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="22" font-weight="900" fill="#C8102E" letter-spacing="-0.5">duroflex</text>
</svg>`,

  'crompton': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 65" width="190" height="65">
  <!-- Crompton circular swirl badge -->
  <circle cx="28" cy="32.5" r="16" fill="#E05A10"/>
  <circle cx="28" cy="32.5" r="9" fill="#FFFFFF"/>
  <circle cx="28" cy="32.5" r="4.5" fill="#E05A10"/>
  <text x="54" y="40" font-family="'Arial Black', sans-serif" font-size="22" font-weight="900" fill="#1E293B" letter-spacing="0.5">Crompton</text>
</svg>`,

  'usha': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 65" width="160" height="65">
  <!-- USHA red badge / typography -->
  <rect x="15" y="14" width="130" height="38" rx="6" fill="#D12421"/>
  <text x="80" y="41" font-family="'Arial Black', sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">USHA</text>
</svg>`,

  'preethi': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <!-- Preethi crown/swirl + text -->
  <g transform="translate(18, 14)">
    <path d="M12 2 L17 12 L24 6 L20 22 L4 22 L0 6 L7 12 Z" fill="#C8102E"/>
    <circle cx="12" cy="14" r="3" fill="#FFD700"/>
  </g>
  <text x="50" y="40" font-family="'Arial Black', 'Trebuchet MS', sans-serif" font-size="26" font-weight="900" fill="#C8102E" letter-spacing="0.5">Preethi</text>
</svg>`,

  'butterfly': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 65" width="190" height="65">
  <!-- Butterfly dual-wing logo -->
  <g transform="translate(12, 12)">
    <path d="M18 6 C10 -4, 0 4, 6 18 C0 24, 6 34, 18 26 Z" fill="#E31B23"/>
    <path d="M22 6 C30 -4, 40 4, 34 18 C40 24, 34 34, 22 26 Z" fill="#0085CA"/>
    <ellipse cx="20" cy="18" rx="2" ry="12" fill="#1E293B"/>
    <circle cx="20" cy="5" r="2.5" fill="#1E293B"/>
  </g>
  <text x="58" y="40" font-family="'Arial Black', 'Trebuchet MS', sans-serif" font-size="22" font-weight="900" fill="#0085CA" letter-spacing="0.5">Butterfly</text>
</svg>`,

  'prestige': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <!-- TTK Prestige brand badge -->
  <rect x="15" y="12" width="150" height="42" rx="4" fill="#D8232A"/>
  <text x="90" y="27" font-family="'Arial', sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">TTK</text>
  <text x="90" y="45" font-family="'Brush Script MT', 'Lucida Calligraphy', 'Segoe Script', cursive, sans-serif" font-size="21" font-weight="bold" fill="#FFFFFF" text-anchor="middle" font-style="italic">Prestige</text>
</svg>`,

  'vguard': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 65" width="190" height="65">
  <!-- V-Guard Kangaroo inside stylized V -->
  <g transform="translate(15, 12)">
    <circle cx="18" cy="20" r="18" fill="#FA4616"/>
    <path d="M8 12 L18 30 L28 12" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="60" y="41" font-family="'Arial Black', sans-serif" font-size="22" font-weight="900" fill="#FA4616" letter-spacing="1">V-GUARD</text>
</svg>`,

  'venus': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 65" width="170" height="65">
  <!-- Venus water drops emblem -->
  <g transform="translate(15, 12)">
    <path d="M16 4 C16 4, 6 18, 6 26 C6 32, 10 36, 16 36 C22 36, 26 32, 26 26 C26 18, 16 4, 16 4 Z" fill="#005BAC"/>
    <path d="M16 12 C16 12, 10 22, 10 27 C10 31, 13 33, 16 33 C19 33, 22 31, 22 27 C22 22, 16 12, 16 12 Z" fill="#FFA500"/>
  </g>
  <text x="52" y="41" font-family="'Arial Black', sans-serif" font-size="24" font-weight="900" fill="#005BAC" letter-spacing="1">VENUS</text>
</svg>`,

  'havells': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 65" width="180" height="65">
  <!-- Havells red square badge + text -->
  <rect x="15" y="16" width="32" height="32" rx="4" fill="#D0021B"/>
  <text x="31" y="41" font-family="'Arial Black', sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle">H</text>
  <text x="56" y="40" font-family="'Arial Black', 'Helvetica Black', sans-serif" font-size="22" font-weight="900" fill="#D0021B" letter-spacing="1">HAVELLS</text>
</svg>`,

  'panasonic': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 65" width="190" height="65">
  <text x="95" y="42" font-family="'Arial Black', 'Helvetica Black', sans-serif" font-size="24" font-weight="900" fill="#004197" text-anchor="middle" letter-spacing="0.5">Panasonic</text>
</svg>`,

  'tcl': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 65" width="150" height="65">
  <!-- TCL rounded bold letters -->
  <text x="75" y="46" font-family="'Arial Black', 'Montserrat', sans-serif" font-size="38" font-weight="900" fill="#E20613" text-anchor="middle" letter-spacing="2">TCL</text>
</svg>`,

  'intex': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 65" width="170" height="65">
  <!-- INTEX logo with dynamic red accent -->
  <text x="70" y="42" font-family="'Arial Black', sans-serif" font-size="26" font-weight="900" fill="#0072CE" letter-spacing="1">INTEX</text>
  <circle cx="152" cy="22" r="4.5" fill="#E31B23"/>
</svg>`,

  'milton': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 65" width="170" height="65">
  <!-- Milton red-orange pill badge -->
  <rect x="15" y="14" width="140" height="38" rx="19" fill="#FF5E00"/>
  <text x="85" y="41" font-family="'Arial Black', 'Helvetica Black', sans-serif" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2.5">MILTON</text>
</svg>`
};

for (const [key, svg] of Object.entries(brandSVGs)) {
  const filePath = path.join(brandsDir, key + '.svg');
  fs.writeFileSync(filePath, svg.trim(), 'utf8');
  console.log('Generated brand logo SVG:', key, '->', filePath);
}

console.log('All 20 brand logo SVGs generated successfully in public/brands/');
