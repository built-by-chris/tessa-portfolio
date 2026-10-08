import { getCollection } from 'astro:content';

type WorkType = 'writing' | 'projects';

export interface RelatedEntry {
  href: string;
  title: string;
  summary: string;
  label: string;
  sharedTags: string[];
}

export async function getRelatedWork(
  currentType: WorkType,
  currentId: string,
  currentTags: string[],
): Promise<RelatedEntry[]> {
  const normalizedTags = new Set(currentTags.map((tag) => tag.toLocaleLowerCase('en-US')));
  if (normalizedTags.size === 0) return [];

  const [writing, projects] = await Promise.all([
    getCollection('writing', ({ data }) => data.public),
    getCollection('projects', ({ data }) => data.public),
  ]);

  const candidates = [
    ...writing.map((entry) => ({
      type: 'writing' as const,
      id: entry.id,
      href: `/writing/${entry.id}`,
      title: entry.data.title,
      summary: entry.data.summary,
      label: entry.data.category,
      tags: entry.data.tags,
      date: entry.data.date.valueOf(),
    })),
    ...projects.map((entry) => ({
      type: 'projects' as const,
      id: entry.id,
      href: `/projects/${entry.id}`,
      title: entry.data.title,
      summary: entry.data.summary,
      label: entry.data.format ?? 'Project',
      tags: entry.data.tags,
      date: entry.data.date?.valueOf() ?? 0,
    })),
  ];

  return candidates
    .filter((item) => !(item.type === currentType && item.id === currentId))
    .map((item) => ({
      ...item,
      sharedTags: item.tags.filter((tag) => normalizedTags.has(tag.toLocaleLowerCase('en-US'))),
    }))
    .filter((item) => item.sharedTags.length > 0)
    .sort((a, b) =>
      b.sharedTags.length - a.sharedTags.length || b.date - a.date || a.title.localeCompare(b.title),
    )
    .slice(0, 2)
    .map(({ href, title, summary, label, sharedTags }) => ({
      href,
      title,
      summary,
      label,
      sharedTags,
    }));
}
