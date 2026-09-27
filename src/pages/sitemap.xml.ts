import { getCollection } from 'astro:content';

export const prerender = true;

const site = 'https://tessarouse.me';

const staticRoutes = [
  '/',
  '/about',
  '/writing',
  '/projects',
  '/resume',
  '/contact',
];

const xmlEscape = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET() {
  const writing = await getCollection('writing', ({ data }) => data.public);
  const projects = await getCollection('projects', ({ data }) => data.public);

  const urls = [
    ...staticRoutes.map((path) => ({ loc: new URL(path, site).href })),
    ...writing.map((entry) => ({
      loc: new URL(`/writing/${entry.id}`, site).href,
      lastmod: entry.data.date.toISOString().slice(0, 10),
    })),
    ...projects.map((entry) => ({
      loc: new URL(`/projects/${entry.id}`, site).href,
      lastmod: entry.data.date?.toISOString().slice(0, 10),
    })),
  ];

  const body = urls
    .map(({ loc, lastmod }) => {
      const modified = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
      return `  <url><loc>${xmlEscape(loc)}</loc>${modified}</url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
