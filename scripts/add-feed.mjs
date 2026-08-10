import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawn } from "node:child_process";

const root = process.cwd();
const feedPath = path.join(root, "src/data/feed.json");

function printHelp() {
  console.log(`Add a feed item.

Usage:
  npm run feed:add

The script prompts for title, optional body, optional href, pinned state, and
whether to seed Netlify after writing src/data/feed.json.`);
}

function slugify(value) {
  const slug = value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "feed-item";
}

function createUniqueId(title, items) {
  const baseId = slugify(title);
  const existingIds = new Set(items.map((item) => item.id));
  if (!existingIds.has(baseId)) return baseId;

  let index = 2;
  while (existingIds.has(`${baseId}-${index}`)) index += 1;

  return `${baseId}-${index}`;
}

function isSafeHref(href) {
  return href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://");
}

function formatJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function readFeedItems() {
  const text = await fs.readFile(feedPath, "utf8");
  const items = JSON.parse(text);
  if (!Array.isArray(items)) {
    throw new Error("src/data/feed.json must contain a JSON array.");
  }

  return items;
}

async function promptRequired(rl, label) {
  while (true) {
    const value = (await rl.question(`${label}: `)).trim();
    if (value) return value;

    console.log(`${label} is required.`);
  }
}

async function promptOptional(rl, label) {
  const value = (await rl.question(`${label}: `)).trim();
  return value || undefined;
}

async function promptBoolean(rl, label, defaultValue = false) {
  const suffix = defaultValue ? "Y/n" : "y/N";
  const value = (await rl.question(`${label} (${suffix}): `)).trim().toLowerCase();
  if (!value) return defaultValue;

  return value === "y" || value === "yes";
}

function runSeedScript() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/seed-feed.mjs"], {
      cwd: root,
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Seed script exited with code ${code}`));
    });
  });
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  printHelp();
  process.exit(0);
}

const items = await readFeedItems();
const rl = readline.createInterface({ input, output });

let shouldSeed = false;
try {
  const title = await promptRequired(rl, "Title");
  const body = await promptOptional(rl, "Body markdown, optional");
  const href = await promptOptional(rl, "Title href, optional");
  const pinned = await promptBoolean(rl, "Pinned", false);

  if (href && !isSafeHref(href)) {
    throw new Error("Href must start with /, https://, or http://.");
  }

  const item = {
    date: new Date().toISOString(),
    id: createUniqueId(title, items),
    title
  };

  if (body) item.body = body;
  if (href) item.href = href;
  if (pinned) item.pinned = true;

  items.unshift(item);
  await fs.writeFile(feedPath, formatJson(items), "utf8");

  console.log(`Added "${item.title}" as ${item.id}.`);
  console.log(`Updated ${path.relative(root, feedPath)}.`);

  shouldSeed = await promptBoolean(rl, "Seed Netlify now", false);
} finally {
  rl.close();
}

if (shouldSeed) {
  await runSeedScript();
}
