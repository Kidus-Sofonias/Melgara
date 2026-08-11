/**
 * fetch-hero-photos.mjs — download a few free-license mining photos for
 * the hero backdrop.
 *
 * Sources: Unsplash + Pexels (both license downloads for free commercial
 * use, no attribution required). Uses the public search pages (no API
 * key needed) and downloads the top-relevance results into
 * public/images/ as self-hosted jpegs.
 *
 * Usage:  node scripts/fetch-hero-photos.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public", "images");

const QUERIES = ["mining excavator", "open pit mine aerial", "mine site night"];
const MAX_PER_QUERY = 2;

async function unsplashPhotos(query, count) {
  const html = await (
    await fetch(`https://unsplash.com/s/photos/${encodeURIComponent(query)}`, {
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36" },
    })
  ).text();
  const urls = [
    ...new Set(
      [...html.matchAll(/https:\/\/images\.unsplash\.com\/photo-[0-9a-f-]+\?[^"\\ ]+/g)].map(
        (m) => m[0]
      )
    ),
  ];
  // Normalize: fixed width/quality, keep the signed query params.
  return urls.slice(0, count).map((u) => {
    const base = u.split("?")[0];
    const params = new URLSearchParams(u.split("?")[1]);
    params.set("w", "1920");
    params.set("q", "75");
    params.set("fm", "jpg");
    params.set("fit", "crop");
    params.set("auto", "format");
    return `${base}?${params.toString()}`;
  });
}

async function pexelsPhotos(query, count) {
  try {
    const html = await (
      await fetch(`https://www.pexels.com/search/${encodeURIComponent(query)}/`, {
        headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124 Safari/537.36" },
      })
    ).text();
    const ids = [
      ...new Set(
        [...html.matchAll(/https:\/\/images\.pexels\.com\/photos\/(\d+)\//g)].map((m) => m[1])
      ),
    ];
    return ids.slice(0, count).map(
      (id) =>
        `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop`
    );
  } catch {
    return [];
  }
}

async function download(url, file) {
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url.slice(0, 90)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(file, buf);
  return buf.length;
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const all = [];
  for (const q of QUERIES) {
    all.push(
      ...(await unsplashPhotos(q, MAX_PER_QUERY)).map((u, i) => ({ u, q, src: "unsplash", i }))
    );
    all.push(
      ...(await pexelsPhotos(q, MAX_PER_QUERY)).map((u, i) => ({ u, q, src: "pexels", i }))
    );
  }

  let ok = 0;
  for (const { u, q, src, i } of all) {
    const slug = q.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24);
    const file = join(OUT, `hero-${slug}-${src}-${i + 1}.jpg`);
    try {
      const bytes = await download(u, file);
      console.log(`  ✓ ${file.split(/[\\/]/).pop()}  (${(bytes / 1024).toFixed(0)} KB)`);
      ok++;
    } catch (e) {
      console.log(`  ✗ ${e.message}`);
    }
  }
  console.log(`Done — ${ok} photos in public/images/`);
}

main().catch((err) => {
  console.error("Photo fetch failed:", err.message);
  process.exit(1);
});
