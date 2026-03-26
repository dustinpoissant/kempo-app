#!/usr/bin/env node
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "docs");
const example = join(root, "example");
const nm = join(root, "node_modules");

/*
  Clean generated directories
*/

const generated = ["modules", "framework", "pages", "media", "icons"];
for(const dir of generated){
  const target = join(docs, dir);
  if(existsSync(target)) rmSync(target, { recursive: true });
}

/*
  Copy node_modules dependencies
*/

const copyDir = (src, dest) => {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
};

copyDir(join(nm, "kempo-css", "dist"), join(docs, "modules", "kempo-css", "dist"));
copyDir(join(nm, "kempo-ui", "dist"), join(docs, "modules", "kempo-ui", "dist"));
copyDir(join(nm, "kempo-ui", "icons"), join(docs, "modules", "kempo-ui", "icons"));

/*
  Copy framework files (components, utils, icons)
*/

copyDir(join(root, "src", "renderer", "components"), join(docs, "framework", "src", "renderer", "components"));
copyDir(join(root, "src", "renderer", "utils"), join(docs, "framework", "src", "renderer", "utils"));
copyDir(join(root, "icons"), join(docs, "framework", "icons"));

/*
  Copy example app assets
*/

copyDir(join(example, "media"), join(docs, "media"));
copyDir(join(example, "icons"), join(docs, "icons"));
cpSync(join(example, "theme.css"), join(docs, "theme.css"));

/*
  Copy pages, fixing absolute paths so they resolve relative to the docs root.
  The Electron custom protocol serves /media/... from the consumer root;
  in the browser docs site paths must be relative.
*/

mkdirSync(join(docs, "pages"), { recursive: true });
const copyPages = (srcDir, destDir) => {
  mkdirSync(destDir, { recursive: true });
  for(const entry of readdirSync(srcDir)){
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    if(statSync(srcPath).isDirectory()){
      copyPages(srcPath, destPath);
    } else {
      let content = readFileSync(srcPath, "utf-8");
      content = content.replaceAll('="/media/', '="media/');
      content = content.replaceAll("='/media/", "='media/");
      writeFileSync(destPath, content);
    }
  }
};
copyPages(join(example, "pages"), join(docs, "pages"));

console.log("docs built successfully");
