import type { APIRoute } from "astro";
import { llmsReference } from "../lib/llms";
export const GET: APIRoute = async () => new Response(await llmsReference(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
