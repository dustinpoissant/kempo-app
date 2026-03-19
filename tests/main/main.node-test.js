import path from "path";
import { readFileSync } from "fs";

/*
  Test utility functions from main.js
  These are extracted and tested independently since main.js
  cannot be imported outside Electron
*/

const frameworkRoot = path.resolve(".");
const appRoot = path.resolve("./example");

const resolvePath = pathname => {
  if(pathname.startsWith("/framework/")) return path.join(frameworkRoot, pathname.slice("/framework".length));
  if(pathname.startsWith("/modules/")){
    const modulePath = pathname.slice("/modules/".length);
    const parts = modulePath.split("/");
    const pkgName = parts[0].startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    const rest = parts.slice(pkgName.split("/").length).join("/");
    const pkgDir = path.join(appRoot, "node_modules", pkgName);
    return path.join(pkgDir, rest);
  }
  return path.join(appRoot, pathname);
};

const getFilePath = argv => argv.slice(1).find(arg => !arg.startsWith("-") && !arg.includes("://"));

export default {
  /*
    resolvePath
  */

  'resolvePath: /framework/ maps to framework root': ({ pass, fail }) => {
    const result = resolvePath("/framework/src/renderer/index.html");
    const expected = path.join(frameworkRoot, "/src/renderer/index.html");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: /modules/ maps to node_modules': ({ pass, fail }) => {
    const result = resolvePath("/modules/kempo-ui/dist/lit-all.min.js");
    const expected = path.join(appRoot, "node_modules", "kempo-ui", "dist", "lit-all.min.js");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: /modules/ handles scoped packages': ({ pass, fail }) => {
    const result = resolvePath("/modules/@scope/pkg/file.js");
    const expected = path.join(appRoot, "node_modules", "@scope", "pkg", "file.js");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: root paths map to app root': ({ pass, fail }) => {
    const result = resolvePath("/app.html");
    const expected = path.join(appRoot, "app.html");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  'resolvePath: nested root paths map correctly': ({ pass, fail }) => {
    const result = resolvePath("/pages/home.html");
    const expected = path.join(appRoot, "pages", "home.html");
    if(result === expected) pass();
    else fail(`Expected ${expected}, got ${result}`);
  },

  /*
    getFilePath
  */

  'getFilePath: returns file path from argv': ({ pass, fail }) => {
    const result = getFilePath(["electron", "myfile.txt"]);
    if(result === "myfile.txt") pass();
    else fail(`Expected "myfile.txt", got ${result}`);
  },

  'getFilePath: skips flags': ({ pass, fail }) => {
    const result = getFilePath(["electron", "--dev", "myfile.txt"]);
    if(result === "myfile.txt") pass();
    else fail(`Expected "myfile.txt", got ${result}`);
  },

  'getFilePath: skips protocol URLs': ({ pass, fail }) => {
    const result = getFilePath(["electron", "kempo-app://open/something", "myfile.txt"]);
    if(result === "myfile.txt") pass();
    else fail(`Expected "myfile.txt", got ${result}`);
  },

  'getFilePath: returns undefined when no file path': ({ pass, fail }) => {
    const result = getFilePath(["electron", "--dev", "--flag"]);
    if(result === undefined) pass();
    else fail(`Expected undefined, got ${result}`);
  },

  'getFilePath: returns undefined for only protocol URLs': ({ pass, fail }) => {
    const result = getFilePath(["electron", "app://link"]);
    if(result === undefined) pass();
    else fail(`Expected undefined, got ${result}`);
  },

  /*
    package.json fields
  */

  'package.json is valid JSON': ({ pass, fail }) => {
    try {
      const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
      if(pkg.name && pkg.version) pass();
      else fail("Missing name or version");
    } catch(e) {
      fail(`Invalid JSON: ${e.message}`);
    }
  },

  'package.json has type: module': ({ pass, fail }) => {
    const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
    if(pkg.type === "module") pass();
    else fail(`Expected type "module", got "${pkg.type}"`);
  },

  'package.json has main entry point': ({ pass, fail }) => {
    const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
    if(pkg.main === "src/main/main.js") pass();
    else fail(`Expected main "src/main/main.js", got "${pkg.main}"`);
  },

  'package.json has bin entries': ({ pass, fail }) => {
    const pkg = JSON.parse(readFileSync(path.join(frameworkRoot, "package.json"), "utf-8"));
    if(pkg.bin && pkg.bin["kempo-app"] && pkg.bin["kempo-interact"]) pass();
    else fail("Missing bin entries");
  },
};
