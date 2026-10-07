import type { APIRoute } from "astro";
import { llmsNavigation } from "../lib/llms";
export const GET: APIRoute = async () => new Response(await llmsNavigation(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
