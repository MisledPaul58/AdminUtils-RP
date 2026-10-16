import { createWriteStream } from "node:fs";
import { mkdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ZipArchive } from "archiver";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);

const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
const manifestPath = new URL("manifest.json", root);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

// The "[26.50]" part of the distribution filename is the targeted Minecraft
// version, derived from the manifest's min_engine_version (e.g. [1, 26, 50] -> "26.50").
const [, mcMajor, mcMinor] = manifest.header.min_engine_version;
const mcVersion = `${mcMajor}.${mcMinor}`;

// Everything that is NOT part of the shipped pack.
const IGNORED = [
    ".git/**",
    ".github/**",
    ".idea/**",
    ".vscode/**",
    "node_modules/**",
    "dist/**",
    "tools/**",
    "**/*.md",
    "*.json", // root-only: package.json, package-lock.json (manifest.json re-added below). Nested pack JSON (models/, animations/, ...) is kept.
    ".editorconfig",
    ".gitignore",
    ".gitattributes"
];

// "Dark" is the full pack. "Light" keeps the vanilla light UI by dropping the
// dark UI textures and the dark global variables.
const VARIANTS = [
    { label: "Dark", ignored: [] },
    { label: "Light", ignored: ["textures/ui/**", "ui/_global_variables.json"] }
];

// Optional filter: `node tools/pack.mjs light` builds only the Light variant.
const filter = process.argv[2]?.toLowerCase();
const selected = filter ? VARIANTS.filter((variant) => variant.label.toLowerCase() === filter) : VARIANTS;
if (selected.length === 0) {
    console.error(`[pack] unknown variant "${filter}" (expected "dark" or "light")`);
    process.exit(1);
}

// Fail loudly if this isn't a resource pack.
try {
    await stat(manifestPath);
} catch {
    console.error("[pack] manifest.json not found - is this the resource pack folder?");
    process.exit(1);
}

const outDir = new URL("dist/", root);
await mkdir(outDir, { recursive: true });

for (const variant of selected) {
    const outFile = fileURLToPath(new URL(`AdminUtils RP ${variant.label} [${mcVersion}] v${pkg.version}.mcpack`, outDir));
    const output = createWriteStream(outFile);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.on("warning", (err) => {
        if (err.code !== "ENOENT") throw err;
        console.warn(`[pack] ${err.message}`);
    });
    archive.on("error", (err) => {
        throw err;
    });

    const done = new Promise((resolve, reject) => {
        output.on("close", () => resolve(archive.pointer()));
        output.on("error", reject);
    });

    archive.pipe(output);
    // Pack contents: everything not ignored...
    archive.glob("**/*", { cwd: rootPath, dot: true, ignore: [...IGNORED, ...variant.ignored] });
    // ...plus the manifest, which is excluded by the "*.json" ignore above.
    archive.file(fileURLToPath(manifestPath), { name: "manifest.json" });

    await archive.finalize();
    const size = await done;

    console.log(`[pack] wrote ${outFile} (${(size / 1024).toFixed(1)} KiB)`);
}
