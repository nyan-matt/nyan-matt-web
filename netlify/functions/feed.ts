import { connectLambda, getStore } from "@netlify/blobs";
import { feedItems } from "../../src/data/feed";
import { isFeedItem, sortFeedItems, type FeedResponse } from "../../src/lib/feed";

const headers = {
  "cache-control": "public, max-age=60, stale-while-revalidate=300",
  "content-type": "application/json; charset=utf-8"
} as const;

type FunctionResponse = {
  body: string;
  headers: typeof headers;
  statusCode: number;
};

function jsonResponse(payload: unknown, statusCode = 200): FunctionResponse {
  return {
    body: JSON.stringify(payload),
    headers,
    statusCode
  };
}

function fallbackResponse(): FunctionResponse {
  const payload: FeedResponse = {
    items: sortFeedItems(feedItems),
    source: "fallback"
  };

  return jsonResponse(payload);
}

export async function handler(event: { blobs?: string; headers: Record<string, string>; httpMethod: string }): Promise<FunctionResponse> {
  if (event.httpMethod !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    connectLambda(event as { blobs: string; headers: Record<string, string> });
    const store = getStore("site-feed");
    const blobItems = await store.get("items", { type: "json" });

    if (!Array.isArray(blobItems)) return fallbackResponse();

    const items = blobItems.filter(isFeedItem);
    if (items.length === 0) return fallbackResponse();

    const payload: FeedResponse = {
      items: sortFeedItems(items),
      source: "blob"
    };

    return jsonResponse(payload);
  } catch {
    return fallbackResponse();
  }
}
