import rawFeedItems from "./feed.json";

export type FeedItem = {
  body?: string;
  date: string;
  href?: string;
  id: string;
  pinned?: boolean;
  title: string;
};

export const feedItems = rawFeedItems as FeedItem[];
