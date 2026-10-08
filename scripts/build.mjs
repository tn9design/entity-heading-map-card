import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const rootDir = path.resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(await readFile(path.join(rootDir, "package.json"), "utf8"));
const notices = await readFile(path.join(rootDir, "THIRD_PARTY_NOTICES.txt"), "utf8");
const beta = process.argv.includes("--beta");
const tag = beta ? "entity-heading-map-card-beta" : "entity-heading-map-card";
const filename = tag + ".js";
const source = await readFile(path.join(rootDir, "src/entity-heading-map-card.js"), "utf8");
await mkdir(path.join(rootDir, "dist"), { recursive: true });
const worker = await build({ entryPoints: [path.join(rootDir, "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs")], bundle: true, format: "iife", target: "es2020", minify: true, write: false });
await build({
  stdin: { contents: source.replaceAll("__CARD_TAG__", tag), resolveDir: path.join(rootDir, "src"), sourcefile: "entity-heading-map-card.js" },
  outfile: path.join(rootDir, "dist", filename), bundle: true, format: "esm", target: "es2020", minify: false,
  loader: { ".css": "text" }, legalComments: "inline",
  banner: { js: `/* Advanced Map Card 3000 ${packageJson.version}${beta ? " isolated beta" : ""} */\n/* ${notices.replaceAll("*/", "* /")} */` },
  plugins: [{ name: "existing-leaflet", setup(builder) {
    builder.onResolve({ filter: /^card-vector-worker$/ }, () => ({ path: "worker", namespace: "card-worker" }));
    builder.onLoad({ filter: /.*/, namespace: "card-worker" }, () => ({ contents: `export default ${JSON.stringify(worker.outputFiles[0].text)};`, loader: "js" }));
    builder.onResolve({ filter: /^leaflet$/ }, () => ({ path: "leaflet", namespace: "card-global" }));
    builder.onLoad({ filter: /.*/, namespace: "card-global" }, () => ({ contents: "export default window.L;", loader: "js" }));
  } }]
});
console.log(`Built dist/${filename}`);
