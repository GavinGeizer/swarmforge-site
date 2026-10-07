import { getCollection } from "astro:content";
/** Publication gate shared by routing, navigation and machine-readable output. */
export async function publishedGuides() {
  return (await getCollection("guides", entry => !entry.data.draft)).sort((a, b) => a.data.order - b.data.order);
}
