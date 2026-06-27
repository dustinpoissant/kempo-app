#!/usr/bin/env node
import { spawn, execFile } from "child_process";
import { promisify } from "util";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";
import { readFileSync } from "fs";
import { build, Platform } from "electron-builder";
import { appBuilderPath } from "app-builder-bin";
import { rcedit } from "rcedit";

const execFileAsync = promisify(execFile);

const require = createRequire(import.meta.url);
const frameworkRoot = path.join(fileURLToPath(import.meta.url), "..", "..");
const mainScript = path.join(frameworkRoot, "src", "main", "main.js");

const appArgs = process.argv.slice(2);

if(appArgs.includes("--package")){
  await runBuild("dir");
  process.exit(0);
}
if(appArgs.includes("--make")){
  // No cross-compiling, host platform only. nsis: a real installer wizard (install
  // location page, Start Menu + optional Desktop shortcut) on win32; dir everywhere
  // else for now — Forge/electron-builder's mac/Linux installer targets (dmg,
  // deb/rpm) need extra system tooling we don't assume is installed.
  await runBuild(process.platform === "win32" ? "nsis" : "dir");
  process.exit(0);
}

const electronPath = require("electron");
const electronFlags = [];
if(appArgs.includes("--dev")){
  electronFlags.push("--inspect=5858");
  electronFlags.push("--remote-debugging-port=9222");
}

const env = { ...process.env, KEMPO_APP_ROOT: process.cwd() };
delete env.ELECTRON_RUN_AS_NODE;

spawn(electronPath, [...electronFlags, mainScript, ...appArgs], {
  stdio: "inherit",
  env,
}).on("exit", code => process.exit(code ?? 0));

// Packages (or, for "nsis", builds an installer for) the consumer app for the host
// OS/arch only via electron-builder. Unlike Electron Forge, none of this needs to
// touch the consumer's package.json on disk:
// - "main" is injected into the packaged copy via extraMetadata (dev/start never
//   read package.json's "main" anyway — they run kempo-app's main.js directly via
//   KEMPO_APP_ROOT, so there's never a real consumer entry script otherwise).
// - electronVersion is passed directly, which skips electron-builder's own
//   node_modules-presence/devDependencies lookup entirely.
async function runBuild(target){
  const appRoot = process.cwd();
  const pkg = JSON.parse(readFileSync(path.join(appRoot, "package.json"), "utf-8"));
  const kempoConfig = pkg["kempo-app"] || {};
  const appName = kempoConfig.appName || pkg.name || "Kempo App";
  const icon = kempoConfig.appIcon ? path.join(appRoot, kempoConfig.appIcon) : undefined;
  const electronVersion = require("electron/package.json").version;
  const appId = `com.kempo-app.${(kempoConfig.protocolName || pkg.name || "app").replace(/[^a-zA-Z0-9-]/g, "")}`;

  // No certificate, so don't sign — without this, electron-builder auto-discovers
  // for a signing identity by default, which downloads "winCodeSign" tooling that
  // needs symlink-creation privileges to extract (fails on Windows without admin
  // /Developer Mode), even though we were never going to sign anything anyway.
  process.env.CSC_IDENTITY_AUTO_DISCOVERY = "false";

  await build({
    targets: Platform.WINDOWS.createTarget(target),
    projectDir: appRoot,
    config: {
      appId,
      productName: appName,
      electronVersion,
      directories: { output: path.join(appRoot, "dist") },
      extraMetadata: { main: "node_modules/kempo-app/src/main/main.js" },
      icon,
      // Native deps here are commonly things like better-sqlite3, sharp, opencv-js,
      // onnxruntime (via @huggingface/transformers) — already Electron-ABI-matched
      // prebuilt binaries (verified working), and npmRebuild needs node-gyp/build
      // tools that aren't a safe assumption to have installed.
      npmRebuild: false,
      // asar's default native-module unpacking only catches *.node files, not the
      // sibling DLLs some of those prebuilts ship alongside — missing DLLs break
      // dlopen at runtime. Packaging as a plain folder avoids that whole class of
      // bug; the disk-size/obfuscation tradeoff isn't worth it here.
      asar: false,
      // electron-builder's own icon-embedding step shells out to app-builder.exe's
      // "rcedit" subcommand, which (even called standalone, regardless of signing
      // config) downloads "winCodeSign" — a bundle that also contains two mac-only
      // dylib *symlinks* unrelated to the Windows tools it actually needs, and
      // extracting those needs a Windows privilege regular accounts don't have by
      // default. The standalone `rcedit` npm package ships its own rcedit.exe
      // directly with no such download, so embedIcon (afterPack, below) uses that
      // instead of electron-builder's built-in path.
      win: { signAndEditExecutable: false },
      afterPack: context => embedIcon(path.join(context.appOutDir, `${appName}.exe`), icon, context.outDir),
      nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
      },
    },
  });
}

// Convert the consumer's icon to .ico (app-builder.exe's own "icon" subcommand —
// confirmed standalone-safe, no winCodeSign involved, unlike its "rcedit" one), then
// embed it on the built .exe via the standalone rcedit package. Best-effort: a
// failure here means the .exe keeps Electron's default icon, not a broken build.
async function embedIcon(exePath, iconPngPath, outDir){
  if(!iconPngPath) return;
  try {
    const { stdout } = await execFileAsync(appBuilderPath, [
      "icon", "--format", "ico",
      "--root", path.dirname(iconPngPath),
      "--input", iconPngPath,
      "--out", path.join(outDir, ".icon-ico"),
    ]);
    const icoPath = JSON.parse(stdout || "{}").icons?.[0]?.file;
    if(!icoPath) return;
    await rcedit(exePath, { icon: icoPath });
  } catch(e){
    console.warn("Could not embed app icon:", e.message);
  }
}
