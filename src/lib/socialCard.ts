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

const wrapTitle = (title: string, maxChars: number) => {
  const words = title.trim().split(/\s+/);
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

  const compacted = [lines[0], lines[1], lines.slice(2).join(' ')];
  const last = compacted[2];
  compacted[2] = last.length > maxChars + 8 ? `${last.slice(0, maxChars + 5).trimEnd()}…` : last;
  return compacted;
};

export async function renderWorkSocialCard({ title, kicker }: SocialCardOptions) {
  const isProject = kicker.toLowerCase().startsWith('project');
  const sectionLabel = isProject ? 'SELECTED PROJECT' : 'SELECTED WRITING';
  const panelLabel = isProject ? 'APPLIED PUBLIC SERVICE' : 'POLICY & GOVERNANCE';

  const fontSize = title.length > 84 ? 42 : title.length > 62 ? 47 : title.length > 44 ? 52 : 58;
  const maxChars = title.length > 84 ? 31 : title.length > 62 ? 29 : 27;
  const lineHeight = Math.round(fontSize * 1.08);
  const lines = wrapTitle(title, maxChars);
  const titleStartY = lines.length === 1 ? 333 : lines.length === 2 ? 300 : 267;

  const titleMarkup = lines
    .map(
      (line, index) =>
        `<tspan x="108" y="${titleStartY + index * lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('');

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#eee4f5"/>
          <stop offset="1" stop-color="#ddd0e8"/>
        </linearGradient>
        <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
          <stop stop-color="#f8f6fa"/>
          <stop offset="1" stop-color="#f4eff7"/>
        </linearGradient>
      </defs>

      <rect width="1200" height="630" fill="url(#wash)"/>

      <path d="M824 0H1200V630H900C842 560 808 476 806 375C804 237 842 116 910 0Z" fill="url(#panel)"/>
      <path d="M867 0C815 104 786 225 791 356C796 477 836 568 902 630" fill="none" stroke="#8d63aa" stroke-width="7" opacity="0.72"/>
      <path d="M900 0C850 111 823 230 828 351C833 462 868 553 927 630" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.72"/>

      <circle cx="143" cy="116" r="52" fill="#4c2967"/>
      <circle cx="143" cy="116" r="45" fill="none" stroke="#d8cbe1" stroke-width="2"/>
      <text x="143" y="133" text-anchor="middle" fill="#f8f6fa" font-family="Georgia, 'Times New Roman', serif" font-size="41" font-weight="600" letter-spacing="-3">TR</text>

      <text x="219" y="107" fill="#201727" font-family="Georgia, 'Times New Roman', serif" font-size="35" font-weight="600">Tessa Rouse</text>
      <text x="221" y="140" fill="#665b6d" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" letter-spacing="3.3">PUBLIC ADMINISTRATION &amp; POLICY</text>

      <line x1="108" y1="199" x2="182" y2="199" stroke="#b7a8c0" stroke-width="3"/>
      <path d="M197 199l6-6 6 6-6 6z" fill="#704095"/>
      <text x="108" y="237" fill="#704095" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" letter-spacing="2.7">${escapeXml(kicker.toUpperCase())}</text>

      <text fill="#201727" font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="600" letter-spacing="-1.4">
        ${titleMarkup}
      </text>

      <line x1="108" y1="493" x2="716" y2="493" stroke="#d9d0de" stroke-width="2"/>
      <text x="108" y="535" fill="#4c2967" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" letter-spacing="3.2">${sectionLabel}</text>
      <text x="108" y="570" fill="#665b6d" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="600" letter-spacing="3.6">TESSAROUSE.ME</text>

      <g transform="translate(930 205)" fill="none" stroke="#704095" stroke-width="5" opacity="0.68">
        <path d="M0 162h168"/>
        <path d="M18 142h132"/>
        <path d="M38 120h92"/>
        <path d="M48 103c8-26 55-26 64 0"/>
        <path d="M62 78c0-16 10-29 18-39 8 10 18 23 18 39"/>
        <path d="M80 18v21"/>
        <path d="M30 162v88M60 162v88M90 162v88M120 162v88M150 162v88"/>
        <path d="M14 250h140"/>
        <path d="M0 272h168"/>
      </g>

      <text x="1014" y="521" text-anchor="middle" fill="#4c2967" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="800" letter-spacing="2.4">${escapeXml(panelLabel)}</text>
      <text x="1014" y="552" text-anchor="middle" fill="#665b6d" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" letter-spacing="1.8">POLICY · EQUITY · VETERAN · SERVICE</text>

      <rect x="0" y="0" width="1200" height="630" fill="none" stroke="#ddd5e1" stroke-width="2"/>
    </svg>
  `;

  return sharp(new TextEncoder().encode(svg))
    .png({ compressionLevel: 9 })
    .toBuffer();
}
