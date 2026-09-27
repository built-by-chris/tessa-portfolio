import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { renderWorkSocialCard } from '../../../lib/socialCard';

export const prerender = true;

export const getStaticPaths = (async () => {
  const entries = await getCollection('writing', ({ data }) => data.public);
  return entries.map((entry) => ({
    params: { id: entry.id },
  }));
}) satisfies GetStaticPaths;

export const GET = (async ({ params }) => {
  const entries = await getCollection('writing', ({ data }) => data.public);
  const entry = entries.find((item) => item.id === params.id);

  if (!entry) {
    return new Response('Not found', { status: 404 });
  }

  const png = await renderWorkSocialCard({
    title: entry.data.title,
    kicker: `Writing · ${entry.data.category}`,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}) satisfies APIRoute;
