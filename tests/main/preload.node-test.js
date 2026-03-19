import { readFileSync } from "fs";
import path from "path";

const preloadSource = readFileSync(path.resolve("src/main/preload.cjs"), "utf-8");

export default {
  'preload.cjs exposes db.get': ({ pass, fail }) => {
    if(preloadSource.includes('get:') && preloadSource.includes('"db:get"')) pass();
    else fail("db.get not found in preload");
  },

  'preload.cjs exposes db.set': ({ pass, fail }) => {
    if(preloadSource.includes('set:') && preloadSource.includes('"db:set"')) pass();
    else fail("db.set not found in preload");
  },

  'preload.cjs exposes db.delete': ({ pass, fail }) => {
    if(preloadSource.includes('delete:') && preloadSource.includes('"db:delete"')) pass();
    else fail("db.delete not found in preload");
  },

  'preload.cjs exposes db.has': ({ pass, fail }) => {
    if(preloadSource.includes('has:') && preloadSource.includes('"db:has"')) pass();
    else fail("db.has not found in preload");
  },

  'preload.cjs exposes db.clear': ({ pass, fail }) => {
    if(preloadSource.includes('clear:') && preloadSource.includes('"db:clear"')) pass();
    else fail("db.clear not found in preload");
  },

  'preload.cjs exposes window.minimize': ({ pass, fail }) => {
    if(preloadSource.includes('"window:minimize"')) pass();
    else fail("window.minimize not found");
  },

  'preload.cjs exposes window.maximize': ({ pass, fail }) => {
    if(preloadSource.includes('"window:maximize"')) pass();
    else fail("window.maximize not found");
  },

  'preload.cjs exposes window.close': ({ pass, fail }) => {
    if(preloadSource.includes('"window:close"')) pass();
    else fail("window.close not found");
  },

  'preload.cjs exposes window.new': ({ pass, fail }) => {
    if(preloadSource.includes('"window:new"')) pass();
    else fail("window.new not found");
  },

  'preload.cjs exposes window.isMaximized': ({ pass, fail }) => {
    if(preloadSource.includes('"window:isMaximized"')) pass();
    else fail("window.isMaximized not found");
  },

  'preload.cjs exposes window.onMaximizeChange': ({ pass, fail }) => {
    if(preloadSource.includes('onMaximizeChange') && preloadSource.includes('"window:maximize-change"')) pass();
    else fail("onMaximizeChange not found");
  },

  'preload.cjs exposes getPlatform': ({ pass, fail }) => {
    if(preloadSource.includes('getPlatform') && preloadSource.includes('"platform"')) pass();
    else fail("getPlatform not found");
  },

  'preload.cjs exposes getAppName': ({ pass, fail }) => {
    if(preloadSource.includes('getAppName') && preloadSource.includes('"app:name"')) pass();
    else fail("getAppName not found");
  },

  'preload.cjs exposes isDev': ({ pass, fail }) => {
    if(preloadSource.includes('isDev') && preloadSource.includes('"app:isDev"')) pass();
    else fail("isDev not found");
  },

  'preload.cjs exposes notification.show': ({ pass, fail }) => {
    if(preloadSource.includes('"notification:show"')) pass();
    else fail("notification.show not found");
  },

  'preload.cjs exposes notification.isSupported': ({ pass, fail }) => {
    if(preloadSource.includes('"notification:isSupported"')) pass();
    else fail("notification.isSupported not found");
  },

  'preload.cjs exposes contextMenu.show': ({ pass, fail }) => {
    if(preloadSource.includes('"contextmenu:extra-items"')) pass();
    else fail("contextMenu.show not found");
  },

  'preload.cjs exposes contextMenu.onClick': ({ pass, fail }) => {
    if(preloadSource.includes('"contextmenu:click"')) pass();
    else fail("contextMenu.onClick not found");
  },

  'preload.cjs fires settingchange event on db.set': ({ pass, fail }) => {
    if(preloadSource.includes('settingchange') && preloadSource.includes('CustomEvent')) pass();
    else fail("settingchange event not dispatched");
  },

  'preload.cjs uses contextBridge.exposeInMainWorld': ({ pass, fail }) => {
    if(preloadSource.includes('contextBridge.exposeInMainWorld')) pass();
    else fail("contextBridge.exposeInMainWorld not found");
  },

  'preload.cjs uses contextIsolation-safe API name': ({ pass, fail }) => {
    if(preloadSource.includes('"api"')) pass();
    else fail('API name "api" not found');
  },
};
