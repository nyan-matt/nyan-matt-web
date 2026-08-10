import type { CollectionEntry } from "astro:content";

export type CoreEntry =
  | CollectionEntry<"artifacts">
  | CollectionEntry<"experiments">
  | CollectionEntry<"notes">;

export function sortByDate<T extends CoreEntry>(entries: T[]): T[] {
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function selectFeaturedThenLatest<T extends CoreEntry>(entries: T[], limit: number): T[] {
  const sorted = sortByDate([...entries]);
  const featured = sorted.filter((entry) => entry.data.featured).slice(0, limit);
  const featuredIds = new Set(featured.map((entry) => entry.id));
  const latest = sorted.filter((entry) => !featuredIds.has(entry.id)).slice(0, limit - featured.length);

  return [...featured, ...latest];
}

export function formatEntryDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}
