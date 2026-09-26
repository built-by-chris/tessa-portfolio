import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const writing = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/writing',
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    featured: z.boolean().default(false),
    public: z.boolean().default(false),
    institution: z.string().optional(),
    course: z.string().optional(),
    format: z.string().optional(),
    sourceDocument: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/projects',
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    public: z.boolean().default(false),
    institution: z.string().optional(),
    course: z.string().optional(),
    format: z.string().optional(),
    sourceDocument: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { writing, projects };
