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

// No cross-compiling, ever — always whatever OS this is actually running on.
const hostPlatform = { win32: Platform.WINDOWS, darwin: Platform.MAC, linux: Platform.LINUX }[process.platform];

const appArgs = process.argv.slice(2);
const pkg = JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
// Debian packages require a maintainer email by spec — fpm fails the whole build
// (taking deb *and* rpm down with it, even though rpm doesn't itself require this)
// without one. Most consumer apps won't have filled this in, so check rather than
// assume it's there: skip straight to AppImage-only (needs none of this) instead of
// a hard crash. homepage has the same requirement; derive it from "repository" if
// the consumer has that but not "homepage" itself, before giving up on it too.
const authorEmail = typeof pkg.author === "string" ? pkg.author.match(/<(.+?)>/)?.[1] : pkg.author?.email;
const homepage = pkg.homepage || pkg.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "");

if(appArgs.includes("--package")){
  await runBuild("dir");
  process.exit(0);
}
if(appArgs.includes("--make")){
  // nsis: a real installer wizard (install location page, Start Menu + optional
  // Desktop shortcut) on win32. AppImage + deb on Linux: AppImage is a single
  // portable file that runs on most distros without installing anything, deb covers
  // Debian/Ubuntu's native package manager — both need package.json's author email +
  // homepage to be resolvable (see above), or fpm refuses to build deb (AppImage
  // doesn't need either). rpm is deliberately left out: fpm 1.9.3 (electron-builder's
  // bundled version, last released ~2022) generates a buildroot layout RPM 6 doesn't
  // recognize — every file in the package comes back "File not found" during
  // rpmbuild's %files step. Confirmed via a minimal repro outside electron-builder
  // entirely, so this is an fpm/RPM6 compatibility gap, not anything fixable here;
  // revisit once fpm ships an RPM6-compatible release.
  const linuxTargets = authorEmail && homepage ? ["AppImage", "deb"] : ["AppImage"];
  if(process.platform === "linux" && linuxTargets.length === 1){
    console.warn(`Skipping deb: package.json needs both "author" (with an email) and "homepage" (or "repository") — building AppImage only.`);
  }
  const target = { win32: "nsis", linux: linuxTargets, darwin: "dir" }[process.platform];
  await runBuild(target);
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

// Packages (or, for "nsis"/"AppImage"/etc., builds an installer for) the consumer app
// for the host OS/arch only via electron-builder. Unlike Electron Forge, none of this
// needs to touch the consumer's package.json on disk:
// - "main" is injected into the packaged copy via extraMetadata (dev/start never
//   read package.json's "main" anyway — they run kempo-app's main.js directly via
//   KEMPO_APP_ROOT, so there's never a real consumer entry script otherwise).
// - electronVersion is passed directly, which skips electron-builder's own
//   node_modules-presence/devDependencies lookup entirely.
async function runBuild(target){
  const appRoot = process.cwd();
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

  if(process.platform === "linux") await rebuildNativeModulesForElectron(appRoot, electronVersion);

  await build({
    targets: hostPlatform.createTarget(target),
    projectDir: appRoot,
    config: {
      appId,
      productName: appName,
      electronVersion,
      directories: { output: path.join(appRoot, "dist") },
      // homepage is injected the same way main is — deb/rpm need it resolvable, but
      // a consumer with only "repository" set (and not "homepage" itself) shouldn't
      // have to add a second, mostly-redundant field just to get deb/rpm building.
      extraMetadata: { main: "node_modules/kempo-app/src/main/main.js", homepage },
      icon,
      // Native deps here are commonly things like better-sqlite3, sharp, opencv-js,
      // onnxruntime (via @huggingface/transformers) — already Electron-ABI-matched
      // prebuilt binaries (verified working), and npmRebuild needs node-gyp/build
      // tools that aren't a safe assumption to have installed.
      npmRebuild: false,
      // asar's default native-module unpacking only catches *.node files, not the
      // sibling DLLs/.so's some of those prebuilts ship alongside — missing ones
      // break dlopen at runtime. Packaging as a plain folder avoids that whole class
      // of bug; the disk-size/obfuscation tradeoff isn't worth it here.
      asar: false,
      // electron-builder's own icon-embedding step shells out to app-builder.exe's
      // "rcedit" subcommand, which (even called standalone, regardless of signing
      // config) downloads "winCodeSign" — a bundle that also contains two mac-only
      // dylib *symlinks* unrelated to the Windows tools it actually needs, and
      // extracting those needs a Windows privilege regular accounts don't have by
      // default. The standalone `rcedit` npm package ships its own rcedit.exe
      // directly with no such download, so embedIcon (afterPack, below) uses that
      // instead of electron-builder's built-in path. Linux/mac icon embedding goes
      // through the ordinary `icon` config above instead — no equivalent hack needed.
      win: { signAndEditExecutable: false },
      afterPack: context => process.platform === "win32"
        ? embedIcon(path.join(context.appOutDir, `${appName}.exe`), icon, context.outDir)
        : undefined,
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

// better-sqlite3 (and any other module compiled via node-gyp rather than shipping
// N-API/electron prebuilds) installs whatever prebuild matches the Node that ran
// "npm install" — there's usually no prebuild published for Electron's own,
// embedder-specific ABI number, so npmRebuild:false's "the prebuilt binary already
// matches Electron" assumption silently doesn't hold on Linux (it happens to hold on
// Windows here only because of leftover build state, not anything guaranteed). Fix it
// by recompiling those modules against Electron's headers before packaging — Linux
// dev/CI boxes are a much safer bet for having a C++ toolchain than a Windows
// consumer's machine, which is why this isn't done unconditionally for npmRebuild.
async function rebuildNativeModulesForElectron(appRoot, electronVersion){
  const fs = require("fs");
  const nativeModuleDirs = [];
  // Walks a node_modules dir: each child is either a package (possibly with its own
  // nested node_modules to recurse into) or a @scope dir of packages.
  const walkNodeModules = (nodeModulesDir, depth) => {
    if(depth > 4) return;
    let entries;
    try { entries = fs.readdirSync(nodeModulesDir, { withFileTypes: true }); } catch { return; }
    for(const entry of entries){
      if(!entry.isDirectory()) continue;
      const pkgDirs = entry.name.startsWith("@")
        ? fs.readdirSync(path.join(nodeModulesDir, entry.name), { withFileTypes: true })
          .filter(e => e.isDirectory())
          .map(e => path.join(nodeModulesDir, entry.name, e.name))
        : [path.join(nodeModulesDir, entry.name)];
      for(const pkgDir of pkgDirs){
        if(fs.existsSync(path.join(pkgDir, "binding.gyp"))) nativeModuleDirs.push(pkgDir);
        const nested = path.join(pkgDir, "node_modules");
        if(fs.existsSync(nested)) walkNodeModules(nested, depth + 1);
      }
    }
  };
  walkNodeModules(path.join(appRoot, "node_modules"), 0);

  for(const dir of nativeModuleDirs){
    try {
      await execFileAsync("npx", [
        "node-gyp", "rebuild", "--release",
        `--target=${electronVersion}`,
        "--dist-url=https://artifacts.electronjs.org/headers/dist",
        `--arch=${process.arch}`,
      ], { cwd: dir });
    } catch(e){
      console.warn(`Could not rebuild ${path.basename(dir)} for Electron's ABI:`, e.message);
    }
  }
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
