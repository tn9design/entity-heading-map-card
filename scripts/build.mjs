import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const distDir = path.join(rootDir, "dist");
const distPath = path.join(distDir, "entity-heading-map-card.js");

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const sourcePath = path.join(rootDir, "src", "entity-heading-map-card.js");
const src = await readFile(sourcePath, "utf8");

const timestampFormatter = new Intl.DateTimeFormat("sv-SE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZoneName: "short",
});

const buildTimestamp = timestampFormatter
  .format(new Date())
  .replace(",", "")
  .replace(" GMT", " UTC");

const output = src
  .replaceAll("__CARD_VERSION__", packageJson.version)
  .replaceAll("__CARD_BUILD_TIMESTAMP__", buildTimestamp);

await mkdir(distDir, { recursive: true });
await writeFile(distPath, output);
