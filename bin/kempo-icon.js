#!/usr/bin/env node
import { createRequire } from "module";
import { resolve } from "path";
import { execFileSync } from "child_process";

const require = createRequire(import.meta.url);
const bin = resolve(require.resolve("kempo-ui/package.json"), "..", "bin", "icon.js");
execFileSync(process.execPath, [bin, ...process.argv.slice(2)], { stdio: "inherit" });
