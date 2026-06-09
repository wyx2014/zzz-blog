import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { remarkCodeMeta } from "./src/lib/remark-code-meta";

const posts = defineCollection({
    name: "posts",
    directory: "content",
    include: "**/*.{md,mdx}",
    schema: z.object({
        title: z.string(),
        publishedAt: z.string().optional(),
        pubDate: z.any().optional(), // Supports Astro's pubDate
        updatedAt: z.string().optional(),
        updatedDate: z.any().optional(), // Supports Astro's updatedDate
        author: z.string().optional(),
        summary: z.string().optional(),
        description: z.string().optional(), // Supports Astro's description
        image: z.string().optional(),
        heroImage: z.string().optional(), // Supports Astro's heroImage
        icon: z.string().optional(), // Custom icon name for timelines
        tags: z.array(z.string()).optional(), // Added tags field
        content: z.string(),
    }),
    transform: async (document, context) => {
        const mdx = await compileMDX(context, document, {
            remarkPlugins: [remarkGfm, remarkCodeMeta],
        });

        // Map Astro pubDate to publishedAt
        let publishedAt = document.publishedAt;
        if (!publishedAt && document.pubDate) {
            const dateObj = new Date(document.pubDate);
            publishedAt = isNaN(dateObj.getTime()) ? String(document.pubDate) : dateObj.toISOString().split("T")[0];
        }
        if (!publishedAt) {
            publishedAt = new Date().toISOString().split("T")[0];
        }

        // Map Astro description to summary
        const summary = document.summary || document.description || "";

        // Map Astro heroImage to image
        const image = document.image || document.heroImage || undefined;

        // Custom icon mapping
        const icon = document.icon || undefined;

        // Map tags (default to empty array if not defined)
        const tags = document.tags || [];

        return {
            ...document,
            publishedAt,
            summary,
            image,
            icon,
            tags,
            mdx,
        };
    },
});

export default defineConfig({
    collections: [posts],
});
