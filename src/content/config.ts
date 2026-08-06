import { defineCollection, z } from "astro:content";

const sharedContentSchema = z.object({
  date: z.coerce.date(),
  subtitle: z.string().optional(),
  tags: z.array(z.string()).default([]),
  title: z.string()
});

export const collections = {
  artifacts: defineCollection({ schema: sharedContentSchema }),
  experiments: defineCollection({ schema: sharedContentSchema }),
  notes: defineCollection({ schema: sharedContentSchema })
};
