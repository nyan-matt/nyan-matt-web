import type { FeedItem } from "../data/feed";

export type FeedResponse = {
  items: FeedItem[];
  source: "blob" | "fallback";
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isSafeHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://");
}

export function formatFeedDate(value: string): string {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit"
  }).format(date).replace(",", " -");
}

export function renderFeedMarkdown(value: string): string {
  const escaped = escapeHtml(value);

  return escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    if (!isSafeHref(href)) return label;

    return `<a href="${href}">${label}</a>`;
  });
}

export function sortFeedItems(items: FeedItem[]): FeedItem[] {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;

    return new Date(b.date).valueOf() - new Date(a.date).valueOf();
  });
}
