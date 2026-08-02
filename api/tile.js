export const config = { runtime: "edge" };
const SETS = { main: "map8", tree: "treemap8" };
export default async function handler(req){
const { searchParams } = new URL(req.url);
const set = SETS[searchParams.get("m") || "main"];
const z = searchParams.get("z"), x = searchParams.get("x"), y = searchParams.get("y");
if (!set || !/^\d{1,2}$/.test(z || "") || !/^\d{1,4}$/.test(x || "") || !/^\d{1,4}$/.test(y || "")) return new Response("bad request", { status: 400 });
const src = "https://cdn.paldb.cc/image/" + set + "/z" + z + "x" + x + "y" + y + ".webp";
let r;
try { r = await fetch(src, { headers: { "Referer": "https://paldb.cc/", "User-Agent": "Mozilla/5.0 (compatible; Pal-Lab/1.0)", "Accept": "image/webp,image/*" } }); }
catch (e) { return new Response("upstream error", { status: 502 }); }
if (!r.ok) return new Response("tile not found", { status: r.status === 404 ? 404 : 502 });
return new Response(r.body, { status: 200, headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable", "CDN-Cache-Control": "public, s-maxage=31536000", "Vercel-CDN-Cache-Control": "public, s-maxage=31536000" } });
}
