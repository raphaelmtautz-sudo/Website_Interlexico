#!/usr/bin/env node
// Meldet alle URLs aus der Live-Sitemap per IndexNow an Bing, Yandex, Seznam u. a.
// (Bing speist u. a. die Websuche von ChatGPT und Copilot). Nach jedem Deploy mit
// inhaltlichen Änderungen ausführen:  node scripts/indexnow.mjs
// Der Schlüssel liegt als public/<KEY>.txt im Wurzelverzeichnis der Website.
const HOST = "interlexico.com";
const KEY = "7137db0cfdcc73c1c6d4b491f56f58f9";

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error("Sitemap enthält keine URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs gemeldet -> HTTP ${res.status}`);
if (!res.ok && res.status !== 202) process.exit(1);
