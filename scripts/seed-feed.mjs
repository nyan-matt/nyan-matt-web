import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env");
const feedPath = path.join(root, "src/data/feed.json");

async function loadLocalEnv() {
  try {
    const envFile = await fs.readFile(envPath, "utf8");
    for (const line of envFile.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // A local .env file is optional; deployed contexts should use Netlify env vars.
  }
}

function resolveEndpoint() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.FEED_ADMIN_URL) return process.env.FEED_ADMIN_URL;

  const siteURL = process.env.NETLIFY_SITE_URL ?? process.env.URL ?? "https://nyan-matt.netlify.app";
  return new URL("/.netlify/functions/feed-admin", siteURL).toString();
}

await loadLocalEnv();

const token = process.env.FEED_ADMIN_TOKEN;
if (!token) {
  console.error("Missing FEED_ADMIN_TOKEN. Add it to .env or export it before running this script.");
  process.exit(1);
}

const endpoint = resolveEndpoint();
const items = JSON.parse(await fs.readFile(feedPath, "utf8"));
const response = await fetch(endpoint, {
  body: JSON.stringify({ items }),
  headers: {
    authorization: `Bearer ${token}`,
    "content-type": "application/json"
  },
  method: "POST"
});

const text = await response.text();
let payload;
try {
  payload = JSON.parse(text);
} catch {
  payload = text;
}

if (!response.ok) {
  console.error(`Feed seed failed: ${response.status}`);
  console.error(payload);
  process.exit(1);
}

console.log(`Seeded ${payload.items?.length ?? items.length} feed items to ${endpoint}`);
console.log(`Source: ${payload.source}; modified: ${payload.modified}`);
