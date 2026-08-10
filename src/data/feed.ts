export type FeedItem = {
  body?: string;
  date: string;
  href?: string;
  id: string;
  pinned?: boolean;
  title: string;
};

export const feedItems: FeedItem[] = [
  {
    body: "The [VS Code theme](/experiments/vs-code-theme/) now has a local VSIX download and install notes.",
    date: "2026-08-09T09:04:00-05:00",
    href: "/experiments/vs-code-theme/",
    id: "vs-code-theme",
    title: "Create VS Code theme."
  },
  {
    body: "Contribution heatmap is now build-time fetched through the GitHub GraphQL API and rendered below the home panels.",
    date: "2026-08-09T10:22:00-05:00",
    id: "github-contribution-heatmap",
    title: "Get contribution heatmap."
  },
  {
    body: "The [Hypnotic Clock](/experiments/hypnotic-clock/) experiment is embedded as MDX so the interactive piece can sit exactly where the post wants it.",
    date: "2026-08-09T12:09:00-05:00",
    href: "/experiments/hypnotic-clock/",
    id: "hypnotic-clock",
    title: "Hypnotic clock."
  },
  {
    body: "Collecting notes around [Figma MCP resources](/artifacts/figma-mcp-resources/) and design-agent workflows.",
    date: "2026-08-09T13:45:00-05:00",
    href: "/artifacts/figma-mcp-resources/",
    id: "figma-mcp-resources",
    title: "Figma plugins and MCPs."
  },
  {
    body: "Revisiting the [Golden Age of Web Design](https://www.webdesignmuseum.org/golden-age-of-web-design) for the site's e-zine layer.",
    date: "2026-08-09T14:18:00-05:00",
    id: "golden-age-reference",
    title: "Good old web design references."
  }
];
