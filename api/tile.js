export const config = { runtime: "edge" };
const SETS = { main: "map8", tree: "treemap8" };
const ICON_OK = /^(Pal\/Texture\/UI\/InGame\/T_icon_[A-Za-z0-9_]+\.webp|Pal\/Texture\/PalIcon\/Normal\/[A-Za-z0-9_\/]+\.webp|Others\/InventoryItemIcon\/Texture\/T_itemicon_[A-Za-z0-9_]+\.webp|ui\/[a-z0-9-]+\.svg|[a-z0-9-]+\.svg)$/;
export default async function handler(req){
const { searchParams } = new URL(req.url);
const icon = searchParams.get("i");
let src;
if (icon){
if (!ICON_OK.test(icon)) return new Response("bad icon", { status: 400 });
src = "https://cdn.paldb.cc/image/" + icon;
} else {
const set = SETS[searchParams.get("m") || "main"];
const z = searchParams.get("z"), x = searchParams.get("x"), y = searchParams.get("y");
if (!set || !/^\d{1,2}$/.test(z || "") || !/^\d{1,4}$/.test(x || "") || !/^\d{1,4}$/.test(y || "")) return new Response("bad request", { status: 400 });
src = "https://cdn.paldb.cc/image/" + set + "/z" + z + "x" + x + "y" + y + ".webp";
}
let r;
try { r = await fetch(src, { headers: { "Referer": "https://paldb.cc/", "User-Agent": "Mozilla/5.0 (compatible; Pal-Lab/1.0)", "Accept": "image/webp,image/svg+xml,image/*" } }); }
catch (e) { return new Response("upstream error", { status: 502 }); }
if (!r.ok) return new Response("not found", { status: r.status === 404 ? 404 : 502 });
const type = /\.svg$/.test(src) ? "image/svg+xml" : "image/webp";
return new Response(r.body, { status: 200, headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable", "CDN-Cache-Control": "public, s-maxage=31536000", "Vercel-CDN-Cache-Control": "public, s-maxage=31536000" } });
}
