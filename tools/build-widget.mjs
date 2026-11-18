// Builds widget.json (the feed the iOS widget reads) from the content in index.html.
// Run after changing tips, sport rules or announcements: node tools/build-widget.mjs
import fs from "node:fs"; import vm from "node:vm";
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const grab = (start, end) => { const i = html.indexOf(start); if (i < 0) throw new Error("missing " + start); const j = html.indexOf(end, i); return html.slice(i, j + end.length); };
const ctx = {}; vm.createContext(ctx);
vm.runInContext([grab("const SPORTS=[", "\n];"), grab("const BASICS=[", "\n];"), grab("const SIMPLE={", "\n};"),
  "this.out={SPORTS,BASICS,SIMPLE};"].join("\n"), ctx);
const data = JSON.parse(html.match(/<script type="application\/json" id="cy-data">([\s\S]*?)<\/script>/)[1]);
const { SPORTS, BASICS, SIMPLE } = ctx.out;
const call = id => id === "baseball" || id === "softball" ? "Now batting" : id.includes("soc") ? "Taking the pitch" : id === "flag" ? "Taking the field" : id.includes("swim") ? "In lane four" : id.includes("wp") ? "In the cap" : id === "golf" ? "Now on the tee" : id === "bvb" ? "On the sand" : "Starting lineup";
const keys = { baseball: ["baseball"], softball: ["softball"], mbb: ["mbb", "mens basketball", "men's basketball"], wbb: ["wbb", "womens basketball", "women's basketball", "basketball"], msoc: ["msoc", "mens soccer", "men's soccer"], wsoc: ["wsoc", "womens soccer", "women's soccer", "soccer"], wvb: ["wvb", "volleyball"], bvb: ["bvb", "beach", "beach volleyball"], flag: ["flag", "flag football"], mwp: ["mwp", "mens water polo", "men's water polo"], wwp: ["wwp", "womens water polo", "women's water polo", "water polo", "polo"], mswim: ["mswim", "mens swim", "men's swim"], wswim: ["wswim", "womens swim", "women's swim", "swim", "dive", "swim & dive"], golf: ["golf"] };
const out = {
  updated: new Date().toISOString().slice(0, 10),
  app: "https://npadu22.github.io/Cypress/",
  tips: BASICS.map(b => ({ t: b.n, d: b.d.replace(/\{rd\}/g, data.settings?.rdName || "the RD") })),
  sports: Object.fromEntries(SPORTS.map(s => [s.id, { name: (s.who === "Men" ? "Men's " : "Women's ") + s.n, call: call(s.id), rules: SIMPLE[s.id] || [], keys: keys[s.id] || [s.id] }])),
  announcements: (data.announcements || []).slice(0, 3).map(a => ({ t: a.t, when: a.when || "" })),
  place: "33.83°N 118.03°W · Valley View St · Cypress, CA"
};
fs.writeFileSync(new URL("../widget.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log("widget.json:", out.tips.length, "tips,", Object.keys(out.sports).length, "sports");
