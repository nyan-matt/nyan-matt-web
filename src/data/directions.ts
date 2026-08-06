export type Direction = {
  cta?: string;
  href?: string;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  deck: string;
  vibe: string;
  theme: "terminal" | "notebook" | "atlas";
  accent: string;
  intro: string;
  sections: Array<{
    label: string;
    title: string;
    body: string;
    meta: string;
  }>;
  notes: string[];
};

export const directions: Direction[] = [
  {
    slug: "field-terminal",
    number: "01",
    title: "Field Terminal",
    shortTitle: "Terminal",
    deck: "The closest cousin to the Caveman reference: dense, forensic, and very online.",
    vibe: "black metal lab notes, prompt ledgers, tool output, measured weirdness",
    theme: "terminal",
    accent: "#3cff89",
    intro:
      "A personal command center for AI notes, work logs, experiments, and small proofs. It borrows the hard grid, tiny labels, and technical density from Caveman, but makes the author voice the signal.",
    sections: [
      {
        label: "post",
        title: "Prompt Ledgers",
        body: "Short entries about what changed, what failed, what got cheaper, and what became possible.",
        meta: "mdx / field-note / 07.26"
      },
      {
        label: "experiment",
        title: "Micro Tools",
        body: "Tiny browser-native utilities, agent workflows, and half-finished instruments.",
        meta: "react island / local state / messy ok"
      },
      {
        label: "work",
        title: "Umbrella Projects",
        body: "A low-drama way to point at consulting, products, prototypes, and research threads.",
        meta: "status: active / public enough"
      }
    ],
    notes: [
      "Use compact nav and numbered panels.",
      "Keep copy short, almost log-like.",
      "Make metadata feel useful instead of decorative.",
      "Best for an AI-centric site that feels like a working instrument."
    ]
  },
  {
    slug: "research-notebook",
    number: "02",
    title: "Research Notebook",
    shortTitle: "Notebook",
    deck: "Still dark and technical, but more editorial and readable for essays.",
    vibe: "lab notebook, margin annotations, private archive becoming public",
    theme: "notebook",
    accent: "#7dd3fc",
    intro:
      "A calmer writing-first system for posts, experiments, marginalia, and ongoing work. It keeps the Caveman compression ethos, then gives the essays more breathing room.",
    sections: [
      {
        label: "essay",
        title: "Notes On Working With Agents",
        body: "Longer pieces with margin callouts, citations, and small diagrams that can age well.",
        meta: "mdx / essay / 11 min"
      },
      {
        label: "thread",
        title: "Open Questions",
        body: "A public scratchpad for questions that are too interesting to wait for a polished answer.",
        meta: "drafts visible / changed weekly"
      },
      {
        label: "index",
        title: "Now Building",
        body: "Umbrella updates for tools, client work, experiments, talks, and odd ideas.",
        meta: "not a resume / not a feed"
      }
    ],
    notes: [
      "More type hierarchy and reading comfort.",
      "Use side notes instead of dense dashboard panels everywhere.",
      "The best candidate if the blog becomes the durable center.",
      "Can still include sharp terminal moments for experiments."
    ]
  },
  {
    slug: "artifact-atlas",
    number: "03",
    title: "Artifact Atlas",
    shortTitle: "Atlas",
    deck: "A stranger umbrella site: catalog, exhibit wall, and AI workbench in one.",
    vibe: "index cards, strange objects, release fragments, personal AI cabinet",
    theme: "atlas",
    accent: "#ffcc66",
    intro:
      "A more distinctive portfolio-adjacent direction where each project, post, and experiment becomes an artifact with provenance, status, and links outward.",
    sections: [
      {
        label: "artifact",
        title: "Agentic Interface Studies",
        body: "Screens, notes, prompts, and prototype links grouped as one evolving exhibit.",
        meta: "case-ish / open archive"
      },
      {
        label: "random",
        title: "Odd Pages",
        body: "Small pages with their own rules: visualizers, calculators, lists, fictions, jokes.",
        meta: "permission to wander"
      },
      {
        label: "signal",
        title: "Work In Public",
        body: "A way to talk about commercial work without flattening it into traditional case studies.",
        meta: "consulting / products / experiments"
      }
    ],
    notes: [
      "More visual rhythm than the terminal direction.",
      "Uses warmer accents so it does not become a monochrome clone.",
      "Good for random pages and experiments as first-class citizens.",
      "Can link back to the safer portfolio as the polished archive."
    ]
  }
];
