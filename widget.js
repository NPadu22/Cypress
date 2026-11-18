// At the Clinic · iOS widget for Scriptable (free on the App Store)
// Small (square): today's tip. Medium (rectangle): your sport's rule of the day + a tip or announcement.
// Optional widget Parameter: your sport, e.g. "softball", "men's soccer", "water polo", "golf".
// Content comes from https://npadu22.github.io/Cypress/widget.json and updates with the app.

const BASE = "https://npadu22.github.io/Cypress/";
const BLUE = new Color("#003876"), DEEP = new Color("#00234C"), GOLD = new Color("#FED41F"), WHITE = Color.white();
const fm = FileManager.local(), dir = fm.documentsDirectory();
const cachePath = n => fm.joinPath(dir, "attheclinic-" + n);

async function getJSON() {
  try { const d = await new Request(BASE + "widget.json").loadJSON(); fm.writeString(cachePath("feed.json"), JSON.stringify(d)); return d; }
  catch (e) { return fm.fileExists(cachePath("feed.json")) ? JSON.parse(fm.readString(cachePath("feed.json"))) : null; }
}
async function getLogo() {
  try { const img = await new Request(BASE + "logo.png").loadImage(); fm.writeImage(cachePath("logo.png"), img); return img; }
  catch (e) { return fm.fileExists(cachePath("logo.png")) ? fm.readImage(cachePath("logo.png")) : null; }
}
const F = (name, size) => new Font(name, size);
const now = new Date();
const dayNo = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 864e5);           // "Dispatch No." = day of the year
const dayIdx = Math.floor((now.getTime() - now.getTimezoneOffset() * 6e4) / 864e5);
const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase();

function findSport(feed, param) {
  if (!param || !feed) return null;
  const q = param.trim().toLowerCase();
  for (const [id, s] of Object.entries(feed.sports)) if (id === q || (s.keys || []).includes(q)) return s;
  for (const s of Object.values(feed.sports)) if (s.name.toLowerCase().includes(q)) return s;
  return null;
}

// Background: Charger Blue field, a gold rule, ticket-stub perforations and the Charger mark faded into the corner.
function background(w, h, logo, stubX) {
  const dc = new DrawContext(); dc.size = new Size(w, h); dc.opaque = true; dc.respectScreenScale = true;
  dc.setFillColor(BLUE); dc.fillRect(new Rect(0, 0, w, h));
  dc.setFillColor(DEEP); dc.fillRect(new Rect(0, h - 26, w, 26));
  dc.setFillColor(GOLD); dc.fillRect(new Rect(16, 14, 22, 3));
  if (logo) { const s = h * 1.05; dc.drawImageInRect(logo, new Rect(w - s * 0.78, h - s * 0.62, s, s * logo.size.height / logo.size.width)); }
  dc.setFillColor(new Color("#003876", 0.72)); dc.fillRect(new Rect(0, 0, w, h - 26)); // fade the mark
  dc.setFillColor(new Color("#00234C", 0.72)); dc.fillRect(new Rect(0, h - 26, w, 26));
  dc.setFillColor(GOLD); dc.fillRect(new Rect(16, 14, 22, 3));
  dc.setFillColor(new Color("#FFFFFF", 0.28));
  if (stubX) for (let y = 10; y < h - 32; y += 7) dc.fillEllipse(new Rect(stubX - 1.2, y, 2.4, 2.4));
  return dc.getImage();
}

function addLine(stack, text, font, color, lines) {
  const t = stack.addText(text); t.font = font; t.textColor = color; if (lines) t.lineLimit = lines; t.minimumScaleFactor = 0.75; return t;
}

async function build() {
  const feed = await getJSON(), logo = await getLogo();
  const fam = config.widgetFamily || "medium";
  const sport = findSport(feed, args.widgetParameter);
  const tips = feed ? feed.tips : [{ t: "Stay charged", d: "Open At the Clinic for today's plan." }];
  const tip = tips[dayIdx % tips.length], tip2 = tips[(dayIdx + 3) % tips.length];
  const w = new ListWidget(); w.url = (feed && feed.app) || BASE;
  w.refreshAfterDate = new Date(Date.now() + 3 * 3600e3);
  w.setPadding(14, 16, 10, 16);

  if (fam === "small") {
    w.backgroundImage = background(170, 170, logo, 0);
    w.addSpacer(8);
    addLine(w, "DISPATCH Nº " + dayNo, F("Futura-Medium", 9), GOLD, 1);
    w.addSpacer(6);
    const rule = sport && sport.rules.length ? sport.rules[dayIdx % sport.rules.length] : null;
    if (rule) { addLine(w, sport.call.toUpperCase(), F("Futura-Medium", 8), new Color("#FFFFFF", 0.7), 1); w.addSpacer(2); addLine(w, rule, F("Futura-Bold", 15), WHITE, 4); }
    else { addLine(w, tip.t, F("Futura-Bold", 17), WHITE, 2); w.addSpacer(3); addLine(w, tip.d, F("Futura-Medium", 11), new Color("#FFFFFF", 0.8), 3); }
    w.addSpacer();
    addLine(w, "THE CLINIC", F("Futura-Bold", 8), GOLD, 1);
  } else {
    w.backgroundImage = background(360, 170, logo, 128);
    const row = w.addStack(); row.layoutHorizontally(); row.topAlignContent();
    const L = row.addStack(); L.layoutVertically(); L.size = new Size(104, 0);
    L.addSpacer(10);
    if (logo) { const li = L.addImage(logo); li.imageSize = new Size(40, 27); }
    L.addSpacer(6);
    addLine(L, "THE CLINIC", F("Futura-Bold", 11), WHITE, 1);
    addLine(L, "DISPATCH Nº " + dayNo, F("Futura-Medium", 8), GOLD, 1);
    addLine(L, dateStr, F("Futura-Medium", 8), new Color("#FFFFFF", 0.7), 1);
    L.addSpacer();
    row.addSpacer(26);
    const R = row.addStack(); R.layoutVertically();
    R.addSpacer(10);
    if (sport && sport.rules.length) {
      const n = dayIdx % sport.rules.length;
      addLine(R, (sport.call + " · " + sport.name).toUpperCase(), F("Futura-Medium", 8), GOLD, 1);
      R.addSpacer(3);
      addLine(R, sport.rules[n], F("Futura-Bold", 16), WHITE, 3);
    } else {
      addLine(R, "TODAY'S CALL", F("Futura-Medium", 8), GOLD, 1);
      R.addSpacer(3);
      addLine(R, tip.t, F("Futura-Bold", 17), WHITE, 1);
      addLine(R, tip.d, F("Futura-Medium", 11), new Color("#FFFFFF", 0.82), 2);
    }
    R.addSpacer(8);
    const ann = feed && feed.announcements && feed.announcements[0];
    const fresh = ann && ann.when && (now - new Date(ann.when + "T12:00:00")) < 7 * 864e5;
    addLine(R, fresh ? "📣 " + ann.t : (sport ? tip.t + " · " + tip.d : tip2.t + " · " + tip2.d), F("Futura-Medium", 9), new Color("#FFFFFF", 0.7), 2);
    R.addSpacer();
    w.addSpacer();
    addLine(w, (feed && feed.place) || "Cypress, CA", F("Futura-Medium", 7), new Color("#FFFFFF", 0.5), 1);
  }
  return w;
}

const widget = await build();
if (config.runsInWidget) Script.setWidget(widget);
else if ((config.widgetFamily || "") === "small") await widget.presentSmall();
else await widget.presentMedium();
Script.complete();
