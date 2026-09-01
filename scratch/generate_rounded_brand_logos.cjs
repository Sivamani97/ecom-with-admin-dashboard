const fs = require('fs');
const path = require('path');

const brandsDir = path.join(__dirname, '..', 'public', 'brands');
if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

// 60x60 Circular viewBox for perfect rounded logo badges as requested by user sample
const brandSVGs = {
  'lg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#C40030"/>
  <path d="M 30 11 A 19 19 0 1 0 49 30 L 37 30" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round"/>
  <path d="M 30 20 L 30 33 L 36 33" fill="none" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="23" cy="24" r="2.8" fill="#FFFFFF"/>
</svg>`,

  'samsung': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#034EA2"/>
  <g fill="#FFFFFF" text-anchor="middle">
    <text x="30" y="34" font-family="'Arial Black', sans-serif" font-size="9" font-weight="900" letter-spacing="0.5">SAMSUNG</text>
  </g>
</svg>`,

  'whirlpool': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <defs>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C158"/>
      <stop offset="100%" stop-color="#9A7B2C"/>
    </linearGradient>
  </defs>
  <circle cx="30" cy="30" r="30" fill="#00558F"/>
  <ellipse cx="30" cy="24" rx="20" ry="7" fill="none" stroke="url(#ringGrad)" stroke-width="2.5" transform="rotate(-15 30 24)"/>
  <text x="30" y="40" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="8.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">Whirlpool</text>
</svg>`,

  'voltas': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#006699"/>
  <text x="30" y="31" font-family="'Arial Black', sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">VOLTAS</text>
  <line x1="12" y1="36" x2="48" y2="36" stroke="#FFFFFF" stroke-width="0.8" opacity="0.6"/>
  <text x="30" y="43" font-family="'Arial', sans-serif" font-size="3.5" font-weight="700" fill="#FFFFFF" text-anchor="middle" opacity="0.9" letter-spacing="0.8">TATA ENTERPRISE</text>
</svg>`,

  'bluestar': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#004B87"/>
  <path d="M30 9 L33 19 L43 23 L33 27 L30 37 L27 27 L17 23 L27 19 Z" fill="#00A3E0"/>
  <path d="M30 13 L32 20 L39 23 L32 26 L30 33 L28 26 L21 23 L28 20 Z" fill="#FFFFFF"/>
  <text x="30" y="45" font-family="'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">BLUE STAR</text>
</svg>`,

  'daikin': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#0097E6"/>
  <polygon points="18,36 34,14 34,36" fill="#FFFFFF"/>
  <polygon points="26,36 34,25 34,36" fill="#005A9C"/>
  <text x="30" y="47" font-family="'Arial Black', sans-serif" font-size="7.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">DAIKIN</text>
</svg>`,

  'godrej': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#CB1517"/>
  <text x="30" y="37" font-family="'Brush Script MT', 'Lucida Handwriting', 'Segoe Script', cursive" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle" font-style="italic">Godrej</text>
</svg>`,

  'duroflex': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#C8102E"/>
  <circle cx="30" cy="22" r="9" fill="#FFFFFF"/>
  <path d="M23 22 Q30 16 37 22 Q30 28 23 22" fill="#C8102E"/>
  <text x="30" y="42" font-family="'Montserrat', 'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FFFFFF" text-anchor="middle">duroflex</text>
</svg>`,

  'crompton': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#E05A10"/>
  <circle cx="30" cy="21" r="9" fill="#FFFFFF"/>
  <circle cx="30" cy="21" r="4.5" fill="#E05A10"/>
  <text x="30" y="42" font-family="'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#FFFFFF" text-anchor="middle">Crompton</text>
</svg>`,

  'usha': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#D12421"/>
  <text x="30" y="36" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">USHA</text>
</svg>`,

  'preethi': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#C8102E"/>
  <path d="M30 13 L34 20 L40 16 L37 28 L23 28 L20 16 L26 20 Z" fill="#FFD700"/>
  <text x="30" y="43" font-family="'Arial Black', sans-serif" font-size="8" font-weight="900" fill="#FFFFFF" text-anchor="middle">Preethi</text>
</svg>`,

  'butterfly': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#0085CA"/>
  <path d="M28 16 C22 8, 14 14, 18 25 C14 30, 18 38, 28 32 Z" fill="#E31B23"/>
  <path d="M32 16 C38 8, 46 14, 42 25 C46 30, 42 38, 32 32 Z" fill="#FFFFFF"/>
  <ellipse cx="30" cy="25" rx="1.8" ry="10" fill="#1E293B"/>
  <text x="30" y="46" font-family="'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">Butterfly</text>
</svg>`,

  'prestige': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#D8232A"/>
  <text x="30" y="24" font-family="'Arial', sans-serif" font-size="5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">TTK</text>
  <text x="30" y="38" font-family="'Brush Script MT', cursive" font-size="13" font-weight="bold" fill="#FFFFFF" text-anchor="middle" font-style="italic">Prestige</text>
</svg>`,

  'vguard': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#FA4616"/>
  <path d="M20 20 L30 36 L40 20" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="30" y="47" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">V-GUARD</text>
</svg>`,

  'venus': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#005BAC"/>
  <path d="M30 14 C30 14, 20 25, 20 31 C20 37, 24 40, 30 40 C36 40, 40 37, 40 31 C40 25, 30 14, 30 14 Z" fill="#FFA500"/>
  <text x="30" y="48" font-family="'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">VENUS</text>
</svg>`,

  'havells': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#D0021B"/>
  <rect x="20" y="16" width="20" height="20" rx="3" fill="#FFFFFF"/>
  <text x="30" y="32" font-family="'Arial Black', sans-serif" font-size="15" font-weight="900" fill="#D0021B" text-anchor="middle">H</text>
  <text x="30" y="46" font-family="'Arial Black', sans-serif" font-size="6" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">HAVELLS</text>
</svg>`,

  'panasonic': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#004197"/>
  <text x="30" y="34" font-family="'Arial Black', sans-serif" font-size="7.5" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.3">Panasonic</text>
</svg>`,

  'tcl': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#E20613"/>
  <text x="30" y="37" font-family="'Arial Black', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">TCL</text>
</svg>`,

  'intex': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#0072CE"/>
  <text x="28" y="35" font-family="'Arial Black', sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">INTEX</text>
  <circle cx="44" cy="27" r="2.5" fill="#E31B23"/>
</svg>`,

  'milton': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
  <circle cx="30" cy="30" r="30" fill="#FF5E00"/>
  <text x="30" y="35" font-family="'Arial Black', sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">MILTON</text>
</svg>`
};

for (const [key, svg] of Object.entries(brandSVGs)) {
  const filePath = path.join(brandsDir, key + '.svg');
  fs.writeFileSync(filePath, svg.trim(), 'utf8');
}

console.log('Successfully generated rounded circular logo SVGs for all 20 brands matching user sample!');
