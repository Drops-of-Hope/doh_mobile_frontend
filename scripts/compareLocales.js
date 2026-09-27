const fs = require("fs");
const path = require("path");

function collectKeys(obj, prefix = "") {
  const keys = new Set();
  if (typeof obj !== "object" || obj === null) return keys;
  for (const k of Object.keys(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    keys.add(full);
    const child = obj[k];
    if (typeof child === "object" && child !== null) {
      for (const sub of collectKeys(child, full)) keys.add(sub);
    }
  }
  return keys;
}

function readJson(p) {
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read/parse", p, e.message);
    process.exit(2);
  }
}

const baseDir = path.join(__dirname, "..", "locales");
const files = ["en.json", "si.json", "ta.json"].map((f) =>
  path.join(baseDir, f)
);
const data = files.map((f) => ({ path: f, obj: readJson(f) }));
const keySets = data.map((d) => ({ path: d.path, keys: collectKeys(d.obj) }));

const allKeys = new Set();
for (const ks of keySets) for (const k of ks.keys) allKeys.add(k);

for (const ks of keySets) {
  const missing = [];
  const extra = [];
  for (const k of allKeys) {
    if (!ks.keys.has(k)) missing.push(k);
  }
  for (const k of ks.keys) {
    if (!allKeys.has(k)) extra.push(k);
  }
  console.log("\nLocale file:", ks.path);
  if (missing.length === 0) console.log("  No missing keys");
  else console.log("  Missing keys:", missing.slice(0, 50));
}

console.log("\nComparison complete");
