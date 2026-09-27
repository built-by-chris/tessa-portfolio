import sharp from 'sharp';

type SocialCardOptions = {
  title: string;
  kicker: string;
};

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const wrapTitle = (title: string, maxChars = 30) => {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) lines.push(current);

  if (lines.length <= 3) return lines;

  return [lines[0], lines[1], lines.slice(2).join(' ')];
};

export async function renderWorkSocialCard({ title, kicker }: SocialCardOptions) {
  const fontSize = title.length > 62 ? 48 : title.length > 44 ? 53 : 58;
  const lineHeight = Math.round(fontSize * 1.08);
  const lines = wrapTitle(title, title.length > 62 ? 31 : 29);
  const titleStartY = lines.length === 1 ? 337 : lines.length === 2 ? 305 : 273;

  const titleMarkup = lines
    .map(
      (line, index) =>
        `<tspan x="108" y="${titleStartY + index * lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('');

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wash" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1050 300) rotate(150) scale(690 540)">
          <stop stop-color="#eee4f5"/>
          <stop offset="1" stop-color="#f8f6fa" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="1200" height="630" fill="#f8f6fa"/>
      <rect width="1200" height="630" fill="url(#wash)"/>
      <circle cx="1055" cy="392" r="242" fill="#eee4f5" opacity="0.78"/>

      <g opacity="0.34" fill="none" stroke="#704095" stroke-width="5">
        <path d="M970 415h170"/>
        <path d="M987 398h136"/>
        <path d="M1012 375h87"/>
        <path d="M1026 356c10-30 50-30 62 0"/>
        <path d="M1042 327c0-16 9-29 15-37 7 8 16 21 16 37"/>
        <path d="M1057 269v21"/>
        <path d="M999 415v92M1029 415v92M1059 415v92M1089 415v92M1119 415v92"/>
        <path d="M976 507h160"/>
        <path d="M960 527h192"/>
      </g>

      <circle cx="143" cy="125" r="55" fill="#4c2967"/>
      <circle cx="143" cy="125" r="48" fill="none" stroke="#cfc2d8" stroke-width="2"/>
      <text x="143" y="143" text-anchor="middle" fill="#f8f6fa" font-family="Georgia, 'Times New Roman', serif" font-size="43" font-weight="600" letter-spacing="-3">TR</text>

      <text x="223" y="114" fill="#201727" font-family="Georgia, 'Times New Roman', serif" font-size="36" font-weight="600">Tessa Rouse</text>
      <text x="225" y="147" fill="#665b6d" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="3.5">PUBLIC ADMINISTRATION &amp; POLICY</text>

      <line x1="108" y1="216" x2="184" y2="216" stroke="#b7a8c0" stroke-width="3"/>
      <text x="108" y="249" fill="#704095" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" letter-spacing="3.2">${escapeXml(kicker.toUpperCase())}</text>

      <text fill="#201727" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="600" letter-spacing="-1.5">
        ${titleMarkup}
      </text>

      <line x1="108" y1="508" x2="668" y2="508" stroke="#dfd7e4" stroke-width="2"/>
      <text x="108" y="553" fill="#665b6d" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" letter-spacing="4">tessarouse.me</text>
      <text x="902" y="553" fill="#704095" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" letter-spacing="3">SELECTED WORK</text>

      <rect x="0" y="0" width="1200" height="630" fill="none" stroke="#dfd7e4" stroke-width="2"/>
    </svg>
  `;

  return sharp(new TextEncoder().encode(svg))
    .png({ compressionLevel: 9 })
    .toBuffer();
}
