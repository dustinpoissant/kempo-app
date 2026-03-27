import fs from "fs/promises";
import syncFs from "fs";
import path from "path";
import os from "os";

/*
  Tests the fs API logic used by both IPC handlers and global.api.fs.
  Since main.js can't be imported outside Electron, we test the same
  fs operations the handlers delegate to.
*/

let testDir;

export const beforeEach = async () => {
  testDir = syncFs.mkdtempSync(path.join(os.tmpdir(), "kempo-fs-test-"));
};

export const afterEach = async () => {
  syncFs.rmSync(testDir, { recursive: true, force: true });
};

const filePath = name => path.join(testDir, name);

export default {
  /*
    readFile / writeFile
  */

  'fs.writeFile + readFile round-trips text': async ({ pass, fail }) => {
    const fp = filePath("test.txt");
    await fs.writeFile(fp, "hello world", "utf-8");
    const content = await fs.readFile(fp, "utf-8");
    if(content === "hello world") pass();
    else fail(`Expected "hello world", got "${content}"`);
  },

  'fs.readFile defaults to utf-8': async ({ pass, fail }) => {
    const fp = filePath("utf8.txt");
    await fs.writeFile(fp, "café", "utf-8");
    const content = await fs.readFile(fp, "utf-8");
    if(content === "café") pass();
    else fail(`Expected "café", got "${content}"`);
  },

  'fs.readFile throws for missing file': async ({ pass, fail }) => {
    try {
      await fs.readFile(filePath("nonexistent.txt"), "utf-8");
      fail("Should have thrown");
    } catch {
      pass();
    }
  },

  /*
    appendFile
  */

  'fs.appendFile appends to existing file': async ({ pass, fail }) => {
    const fp = filePath("append.txt");
    await fs.writeFile(fp, "line1\n", "utf-8");
    await fs.appendFile(fp, "line2\n", "utf-8");
    const content = await fs.readFile(fp, "utf-8");
    if(content === "line1\nline2\n") pass();
    else fail(`Got "${content}"`);
  },

  'fs.appendFile creates file if missing': async ({ pass, fail }) => {
    const fp = filePath("new-append.txt");
    await fs.appendFile(fp, "first", "utf-8");
    const content = await fs.readFile(fp, "utf-8");
    if(content === "first") pass();
    else fail(`Got "${content}"`);
  },

  /*
    readDir
  */

  'fs.readDir lists directory contents': async ({ pass, fail }) => {
    await fs.writeFile(filePath("a.txt"), "", "utf-8");
    await fs.writeFile(filePath("b.txt"), "", "utf-8");
    const entries = await fs.readdir(testDir);
    if(entries.includes("a.txt") && entries.includes("b.txt") && entries.length === 2) pass();
    else fail(`Expected [a.txt, b.txt], got ${JSON.stringify(entries)}`);
  },

  'fs.readDir returns empty for empty directory': async ({ pass, fail }) => {
    const subdir = filePath("empty");
    await fs.mkdir(subdir);
    const entries = await fs.readdir(subdir);
    if(Array.isArray(entries) && entries.length === 0) pass();
    else fail(`Expected [], got ${JSON.stringify(entries)}`);
  },

  /*
    mkdir
  */

  'fs.mkdir creates a directory': async ({ pass, fail }) => {
    const dir = filePath("newdir");
    await fs.mkdir(dir);
    const s = await fs.stat(dir);
    if(s.isDirectory()) pass();
    else fail("Not a directory");
  },

  'fs.mkdir recursive creates nested directories': async ({ pass, fail }) => {
    const dir = filePath("a/b/c");
    await fs.mkdir(dir, { recursive: true });
    const s = await fs.stat(dir);
    if(s.isDirectory()) pass();
    else fail("Nested directory not created");
  },

  /*
    rm
  */

  'fs.rm removes a file': async ({ pass, fail }) => {
    const fp = filePath("to-delete.txt");
    await fs.writeFile(fp, "bye", "utf-8");
    await fs.rm(fp);
    try {
      await fs.access(fp);
      fail("File still exists");
    } catch {
      pass();
    }
  },

  'fs.rm recursive removes a directory': async ({ pass, fail }) => {
    const dir = filePath("dir-to-delete");
    await fs.mkdir(dir);
    await fs.writeFile(path.join(dir, "child.txt"), "x", "utf-8");
    await fs.rm(dir, { recursive: true, force: true });
    try {
      await fs.access(dir);
      fail("Directory still exists");
    } catch {
      pass();
    }
  },

  /*
    exists (uses fs.access pattern from main.js)
  */

  'exists returns true for existing file': async ({ pass, fail }) => {
    const fp = filePath("exists.txt");
    await fs.writeFile(fp, "", "utf-8");
    try { await fs.access(fp); pass(); }
    catch { fail("Should exist"); }
  },

  'exists returns false for missing file': async ({ pass, fail }) => {
    try {
      await fs.access(filePath("nope.txt"));
      fail("Should not exist");
    } catch {
      pass();
    }
  },

  /*
    stat (mirrors the serialized shape from main.js)
  */

  'stat returns expected shape for a file': async ({ pass, fail }) => {
    const fp = filePath("stat-file.txt");
    await fs.writeFile(fp, "data", "utf-8");
    const s = await fs.stat(fp);
    const result = {
      size: s.size,
      isFile: s.isFile(),
      isDirectory: s.isDirectory(),
      isSymbolicLink: s.isSymbolicLink(),
      createdAt: s.birthtime.toISOString(),
      modifiedAt: s.mtime.toISOString(),
      accessedAt: s.atime.toISOString(),
    };
    if(result.size === 4 && result.isFile === true && result.isDirectory === false && result.isSymbolicLink === false
      && typeof result.createdAt === "string" && typeof result.modifiedAt === "string" && typeof result.accessedAt === "string") pass();
    else fail(`Unexpected stat result: ${JSON.stringify(result)}`);
  },

  'stat returns expected shape for a directory': async ({ pass, fail }) => {
    const dir = filePath("stat-dir");
    await fs.mkdir(dir);
    const s = await fs.stat(dir);
    const result = {
      size: s.size,
      isFile: s.isFile(),
      isDirectory: s.isDirectory(),
      isSymbolicLink: s.isSymbolicLink(),
      createdAt: s.birthtime.toISOString(),
      modifiedAt: s.mtime.toISOString(),
      accessedAt: s.atime.toISOString(),
    };
    if(result.isFile === false && result.isDirectory === true) pass();
    else fail(`Expected directory, got ${JSON.stringify(result)}`);
  },

  'stat throws for missing path': async ({ pass, fail }) => {
    try {
      await fs.stat(filePath("missing"));
      fail("Should have thrown");
    } catch {
      pass();
    }
  },

  /*
    rename
  */

  'fs.rename moves a file': async ({ pass, fail }) => {
    const from = filePath("old.txt");
    const to = filePath("new.txt");
    await fs.writeFile(from, "moved", "utf-8");
    await fs.rename(from, to);
    const content = await fs.readFile(to, "utf-8");
    try {
      await fs.access(from);
      fail("Old file still exists");
    } catch {
      if(content === "moved") pass();
      else fail(`Content mismatch: "${content}"`);
    }
  },

  /*
    copyFile
  */

  'fs.copyFile copies a file': async ({ pass, fail }) => {
    const src = filePath("source.txt");
    const dest = filePath("dest.txt");
    await fs.writeFile(src, "copied", "utf-8");
    await fs.copyFile(src, dest);
    const content = await fs.readFile(dest, "utf-8");
    if(content === "copied") pass();
    else fail(`Expected "copied", got "${content}"`);
  },

  'fs.copyFile preserves original': async ({ pass, fail }) => {
    const src = filePath("keep.txt");
    const dest = filePath("keep-copy.txt");
    await fs.writeFile(src, "original", "utf-8");
    await fs.copyFile(src, dest);
    const srcContent = await fs.readFile(src, "utf-8");
    if(srcContent === "original") pass();
    else fail("Source was modified");
  },

  /*
    main.js source checks — IPC handlers and global.api.fs
  */

  'main.js registers all fs IPC handlers': ({ pass, fail }) => {
    const src = syncFs.readFileSync(path.resolve("src/main/main.js"), "utf-8");
    const channels = ["fs:readFile", "fs:writeFile", "fs:appendFile", "fs:readDir", "fs:mkdir", "fs:rm", "fs:exists", "fs:stat", "fs:rename", "fs:copyFile"];
    const missing = channels.filter(ch => !src.includes(`"${ch}"`));
    if(missing.length === 0) pass();
    else fail(`Missing IPC handlers: ${missing.join(", ")}`);
  },

  'main.js global.api has fs namespace': ({ pass, fail }) => {
    const src = syncFs.readFileSync(path.resolve("src/main/main.js"), "utf-8");
    const methods = ["readFile", "writeFile", "appendFile", "readDir", "mkdir", "rm", "exists", "stat", "rename", "copyFile"];
    const globalApiSection = src.slice(src.indexOf("global.api"));
    const missing = methods.filter(m => !globalApiSection.includes(m));
    if(missing.length === 0) pass();
    else fail(`Missing global.api.fs methods: ${missing.join(", ")}`);
  },

  'main.js imports fs/promises': ({ pass, fail }) => {
    const src = syncFs.readFileSync(path.resolve("src/main/main.js"), "utf-8");
    if(src.includes('from "fs/promises"')) pass();
    else fail("fs/promises import not found");
  },
};
