import { publishedGuides } from "./guides";
import { site, canonicalUrl } from "./site";
import { faqs } from "./faq";
export async function llmsNavigation() {
  const entries = await publishedGuides();
  return `# ${site.name}\n\n> ${site.description}\n\nSource is public; no license has been published yet. Current workers use OpenCode in Freestyle VMs. MCP clients manage tasks; native Codex/Claude Code workers and local VM workers are not implemented. Model and repository settings are per deployment.\n\n## Official documentation\n\n- [Installation and setup](${canonicalUrl("/docs/")}): Requirements, CLI onboarding, MCP connection and first task.\n` + entries.map(entry => `- [${entry.data.title}](${canonicalUrl(`/${entry.id}/`)}): ${entry.data.description}`).join("\n") + `\n- [FAQ](${canonicalUrl("/faq/")}): Compatibility, infrastructure, costs and license status.\n\n## Source and reference\n\n- [Application source](${site.repository})\n- [MCP API](${site.repository}/blob/master/docs/MCP-API.md)\n- [Configuration reference](${site.repository}/blob/master/docs/CONFIGURATION.md)\n- [Complete technical reference](${canonicalUrl("/llms-full.txt")}): Generated from the same published concept pages and FAQ.\n\n## Evidence limits\n\nNo original orchestration benchmark results are published. The benchmark page is a methodology, not measurements. Capacity settings are not throughput guarantees. Agent-reported tests require review. Cost estimates are not invoices or spending limits.\n`;
}
export async function llmsReference() {
  const entries = await publishedGuides();
  return `${await llmsNavigation()}\n---\n\n# Technical reference\n\n` + entries.map(entry => `## ${entry.data.title}\n\nCanonical page: ${canonicalUrl(`/${entry.id}/`)}\nReviewed: ${entry.data.reviewed}\n\n${entry.body}\n\nImplementation references:\n${entry.data.sources.map(url => `- ${url}`).join("\n")}`).join("\n\n---\n\n") + `\n\n# FAQ\n\nCanonical page: ${canonicalUrl("/faq/")}\n\n` + faqs.map(item => `## ${item.question}\n\n${item.answer}`).join("\n\n") + "\n";
}
