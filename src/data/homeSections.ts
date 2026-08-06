import type { Direction } from "./directions";

export const homeSections: Direction[] = [
  {
    slug: "notes",
    href: "/notes/",
    cta: "open notes",
    number: "01",
    title: "Field Notes",
    shortTitle: "Notes",
    deck: "Durable writing for design, process, product work, and AI-shaped practice.",
    vibe: "essays, process notes, public lab notebook, structured thinking",
    theme: "notebook",
    accent: "#7dd3fc",
    intro:
      "Longer MDX entries with enough structure to age well: title, subtitle, date, tags, and room for references once the format asks for them.",
    sections: [
      {
        label: "essay",
        title: "Design Process",
        body: "Writing about product decisions, systems, tradeoffs, and how ideas survive implementation.",
        meta: "mdx / durable / irregular"
      },
      {
        label: "note",
        title: "AI Workflows",
        body: "Field notes on agents, prompts, tools, and the new habits that form around them.",
        meta: "reflective / technical"
      },
      {
        label: "tutorial",
        title: "Useful Walkthroughs",
        body: "Occasional explainers when something becomes reusable enough to teach.",
        meta: "when earned"
      }
    ],
    notes: [
      "Readable center column.",
      "Metadata stays light at first.",
      "Good for things that deserve stable URLs.",
      "Can borrow the Research Notebook interior language."
    ]
  },
  {
    slug: "experiments",
    href: "/experiments/",
    cta: "open experiments",
    number: "02",
    title: "Experiments",
    shortTitle: "Experiments",
    deck: "Small tools, prototypes, plugins, themes, and other objects with their own rules.",
    vibe: "live sketches, repo links, demos, product seeds, finished or disposable",
    theme: "terminal",
    accent: "#3cff89",
    intro:
      "Show-first entries for things built to test an idea. Some stay rough, some become digital products, and some just leave useful residue.",
    sections: [
      {
        label: "demo",
        title: "Interactive Sketches",
        body: "Tiny browser-native experiments that can run in place or link to a canonical build.",
        meta: "demo / repo / embed"
      },
      {
        label: "plugin",
        title: "Tool Objects",
        body: "Figma plugins, VS Code themes, skills, scripts, and small workflow utilities.",
        meta: "released-ish"
      },
      {
        label: "study",
        title: "Learning Tests",
        body: "Disposable experiments that explain what was learned without pretending to be products.",
        meta: "rough allowed"
      }
    ],
    notes: [
      "Artifact first, explanation second.",
      "Use proof panels and links.",
      "Status can emerge later.",
      "Can borrow the Field Terminal interior language."
    ]
  },
  {
    slug: "artifacts",
    href: "/artifacts/",
    cta: "open artifacts",
    number: "03",
    title: "Artifacts",
    shortTitle: "Artifacts",
    deck: "Useful fragments, curated references, visual scraps, downloads, and small kept objects.",
    vibe: "junk drawer with labels, references, assets, links, specimens, useful scraps",
    theme: "atlas",
    accent: "#ffcc66",
    intro:
      "A home for the useful-but-hard-to-classify: annotated links, assets, reference sets, type samples, textures, and future digital goods.",
    sections: [
      {
        label: "reference",
        title: "Link Sets",
        body: "Curated references with enough context to be worth keeping outside the feed.",
        meta: "annotated"
      },
      {
        label: "asset",
        title: "Visual Scraps",
        body: "Patterns, desktop backgrounds, small graphics, type specimens, and design fragments.",
        meta: "downloadable maybe"
      },
      {
        label: "object",
        title: "Kept Things",
        body: "Small objects that might later become products, collections, or resource pages.",
        meta: "misc / useful"
      }
    ],
    notes: [
      "More organized than a feed.",
      "Less formal than a post.",
      "A place for useful fragments to accumulate.",
      "Can become collections or products later."
    ]
  }
];
