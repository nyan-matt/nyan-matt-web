import { getStore } from "@netlify/blobs";
import { isFeedItemArray, sortFeedItems, type FeedResponse } from "../../src/lib/feed";

const headers = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8"
} as const;

type FunctionEvent = {
  body: string | null;
  headers: Record<string, string | undefined>;
  httpMethod: string;
  isBase64Encoded?: boolean;
};

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

function getAuthorizationHeader(headers: FunctionEvent["headers"]): string {
  return headers.authorization ?? headers.Authorization ?? "";
}

function getRequestBody(event: FunctionEvent): string {
  if (!event.body) return "";
  if (!event.isBase64Encoded) return event.body;

  return Buffer.from(event.body, "base64").toString("utf8");
}

function getItemsPayload(value: unknown): unknown {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && "items" in value) {
    return (value as { items: unknown }).items;
  }

  return value;
}

export async function handler(event: FunctionEvent): Promise<FunctionResponse> {
  if (event.httpMethod !== "POST" && event.httpMethod !== "PUT") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const adminToken = process.env.FEED_ADMIN_TOKEN;
  if (!adminToken) {
    return jsonResponse({ error: "Feed admin token is not configured" }, 500);
  }

  if (getAuthorizationHeader(event.headers) !== `Bearer ${adminToken}`) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(getRequestBody(event));
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON" }, 400);
  }

  const items = getItemsPayload(parsedBody);
  if (!isFeedItemArray(items)) {
    return jsonResponse({ error: "Request body must be a feed item array or an object with an items array" }, 400);
  }

  const sortedItems = sortFeedItems(items);
  const store = getStore("site-feed");
  const writeResult = await store.setJSON("items", sortedItems);
  const payload: FeedResponse & { etag?: string; modified: boolean } = {
    etag: writeResult.etag,
    items: sortedItems,
    modified: writeResult.modified,
    source: "blob"
  };

  return jsonResponse(payload);
}
