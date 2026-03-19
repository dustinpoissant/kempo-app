#!/usr/bin/env node
import { spawn } from "child_process";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const electronPath = require("electron");
const mainScript = path.join(fileURLToPath(import.meta.url), "..", "..", "src", "main", "main.js");

const appArgs = process.argv.slice(2);
const electronFlags = [];
if(appArgs.includes("--dev")){
  electronFlags.push("--inspect=5858", "--remote-debugging-port=9222");
}

spawn(electronPath, [...electronFlags, mainScript, ...appArgs], {
  stdio: "inherit",
  env: { ...process.env, KEMPO_APP_ROOT: process.cwd() },
}).on("exit", code => process.exit(code ?? 0));
