import sharp from 'sharp';

export const prerender = true;

export async function GET() {
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wash" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1040 330) rotate(148) scale(660 520)">
          <stop stop-color="#eee4f5"/>
          <stop offset="1" stop-color="#f8f6fa" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1200" height="630" fill="#f8f6fa"/>
      <rect width="1200" height="630" fill="url(#wash)"/>

      <circle cx="1035" cy="430" r="248" fill="#eee4f5" opacity="0.78"/>

      <g opacity="0.42" fill="none" stroke="#704095" stroke-width="5">
        <path d="M948 430h176"/>
        <path d="M966 414h140"/>
        <path d="M990 390h92"/>
        <path d="M1004 371c10-31 52-31 64 0"/>
        <path d="M1020 341c0-17 9-30 16-39 7 9 16 22 16 39"/>
        <path d="M1036 280v22"/>
        <path d="M977 430v95M1008 430v95M1039 430v95M1070 430v95M1101 430v95"/>
        <path d="M954 525h164"/>
        <path d="M938 546h196"/>
      </g>

      <circle cx="142" cy="145" r="76" fill="#4c2967"/>
      <circle cx="142" cy="145" r="68" fill="none" stroke="#cfc2d8" stroke-width="2"/>
      <text x="142" y="168" text-anchor="middle" fill="#f8f6fa" font-family="Georgia, 'Times New Roman', serif" font-size="61" font-weight="600" letter-spacing="-4">TR</text>

      <text x="255" y="170" fill="#201727" font-family="Georgia, 'Times New Roman', serif" font-size="76" font-weight="600" letter-spacing="-3">Tessa Rouse</text>
      <text x="260" y="218" fill="#665b6d" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="600" letter-spacing="5">PUBLIC ADMINISTRATION &amp; POLICY</text>

      <line x1="108" y1="310" x2="188" y2="310" stroke="#b7a8c0" stroke-width="3"/>
      <text x="108" y="385" fill="#4c4053" font-family="Georgia, 'Times New Roman', serif" font-size="43" font-style="italic">Public problems deserve careful analysis.</text>

      <text x="108" y="503" fill="#665b6d" font-family="Arial, Helvetica, sans-serif" font-size="23" font-weight="600" letter-spacing="5">tessarouse.me</text>
      <path d="M360 495h44m-14-14 14 14-14 14" fill="none" stroke="#704095" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

      <rect x="0" y="0" width="1200" height="630" fill="none" stroke="#dfd7e4" stroke-width="2"/>
    </svg>
  `;

  const png = await sharp(new TextEncoder().encode(svg))
    .png({ compressionLevel: 9 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
