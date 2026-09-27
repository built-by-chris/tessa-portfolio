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
    ...staticRoutes.map((path) => new URL(path, site).href),
    ...writing.map((entry) => new URL(`/writing/${entry.id}`, site).href),
    ...projects.map((entry) => new URL(`/projects/${entry.id}`, site).href),
  ];

  const body = urls
    .map((loc) => `  <url><loc>${xmlEscape(loc)}</loc></url>`)
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
