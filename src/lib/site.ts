export const site = {
  name: "SwarmForge",
  url: "https://getswarmforge.tech",
  repository: "https://github.com/GavinGeizer/swarmforge-oss",
  description: "SwarmForge is an orchestration platform for autonomous AI coding agents. It coordinates parallel OpenCode workers in isolated virtual machines, tracks tasks, and preserves deliverables.",
  image: "/assets/social-card.png",
  imageAlt: "SwarmForge — Multi-agent AI coding orchestration. Isolated workers. Durable handoffs.",
} as const;
export type Breadcrumb = { name: string; path: string };
export const canonicalUrl = (path: string) => new URL(path, site.url).href;
export const applicationSchema = {
  "@type": ["SoftwareApplication", "SoftwareSourceCode"],
  "@id": `${site.url}/#software`,
  name: site.name,
  description: site.description,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux x64 with glibc",
  programmingLanguage: "TypeScript",
  url: `${site.url}/`,
  codeRepository: site.repository,
  license: "https://polyformproject.org/licenses/small-business/1.0.0",
};
export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: `${site.url}/`,
  description: site.description,
  inLanguage: "en",
};
// Prevent markup termination if a future content string contains </script>.
export const serializeSchema = (value: unknown) => JSON.stringify(value).replaceAll("<", "\\u003c");
