import { defineCollection, z } from "astro:content";

const homePreviewSchema = z.object({
  accent: z.tuple([z.number(), z.number(), z.number()]).default([60, 255, 137]),
  enabled: z.boolean().default(false),
  kicker: z.string().optional(),
  label: z.string().optional(),
  mode: z.enum(["ascii-reveal", "color-cluster", "outline-repel"]).default("color-cluster"),
  shape: z.enum(["circle", "square"]).optional()
});

const sharedContentSchema = z.object({
  date: z.coerce.date(),
  featured: z.boolean().optional(),
  homePreview: homePreviewSchema.optional(),
  subtitle: z.string().optional(),
  tags: z.array(z.string()).default([]),
  title: z.string()
});

export const collections = {
  artifacts: defineCollection({ schema: sharedContentSchema }),
  experiments: defineCollection({ schema: sharedContentSchema }),
  notes: defineCollection({ schema: sharedContentSchema })
};
