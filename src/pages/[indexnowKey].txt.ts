import type { APIRoute } from "astro";
import { indexNowKey } from "../lib/indexnow";
export function getStaticPaths() {
  const key = indexNowKey(process.env.INDEXNOW_KEY);
  return key ? [{ params: { indexnowKey: key }, props: { key } }] : [];
}
export const GET: APIRoute = ({ props }) => new Response(`${props.key}\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
