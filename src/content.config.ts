import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			category: z.array(z.string()).default([]),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().optional().default(false),
			heroImage: z
				.object({
					src: z.string(),
					alt: z.string().optional(),
				})
				.optional(),
			seo: z
				.object({
					canonical: z.string().url().optional(),
					ogTitle: z.string().optional(),
					ogDescription: z.string().optional(),
				})
				.optional(),
		}),
});

export const collections = { blog };
