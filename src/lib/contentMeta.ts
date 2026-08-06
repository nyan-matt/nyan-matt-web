import type { CollectionEntry } from "astro:content";

export type CoreEntry =
  | CollectionEntry<"artifacts">
  | CollectionEntry<"experiments">
  | CollectionEntry<"notes">;

export function sortByDate<T extends CoreEntry>(entries: T[]): T[] {
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatEntryDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}
