export const page = "../test-page.html";

export const beforeAll = async () => {
  const mod = await import("/framework/src/renderer/utils/visibility.js");
  window.__evaluate = mod.evaluate;
  window.__sharedProperties = mod.sharedProperties;
};

export default {
  /*
    sharedProperties
  */

  'sharedProperties has platform': ({ pass, fail }) => {
    const sp = window.__sharedProperties;
    if(sp.platform && sp.platform.type === String) pass();
    else fail("platform property not defined correctly");
  },

  'sharedProperties has dev with boolean converter': ({ pass, fail }) => {
    const sp = window.__sharedProperties;
    if(sp.dev && typeof sp.dev.converter === "function") pass();
    else fail("dev property not defined correctly");
  },

  'sharedProperties has theme': ({ pass, fail }) => {
    const sp = window.__sharedProperties;
    if(sp.theme && sp.theme.type === String) pass();
    else fail("theme property not defined correctly");
  },

  'sharedProperties has maximized with boolean converter': ({ pass, fail }) => {
    const sp = window.__sharedProperties;
    if(sp.maximized && typeof sp.maximized.converter === "function") pass();
    else fail("maximized property not defined correctly");
  },

  'sharedProperties has setting': ({ pass, fail }) => {
    const sp = window.__sharedProperties;
    if(sp.setting && sp.setting.type === String) pass();
    else fail("setting property not defined correctly");
  },

  /*
    dev converter
  */

  'dev converter: empty string returns true': ({ pass, fail }) => {
    const result = window.__sharedProperties.dev.converter("");
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'dev converter: "true" returns true': ({ pass, fail }) => {
    const result = window.__sharedProperties.dev.converter("true");
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'dev converter: "false" returns false': ({ pass, fail }) => {
    const result = window.__sharedProperties.dev.converter("false");
    if(result === false) pass();
    else fail(`Expected false, got ${result}`);
  },

  'dev converter: null returns null': ({ pass, fail }) => {
    const result = window.__sharedProperties.dev.converter(null);
    if(result === null) pass();
    else fail(`Expected null, got ${result}`);
  },

  /*
    evaluate
  */

  'evaluate: no conditions returns false': async ({ pass, fail }) => {
    const el = { platform: "", dev: null, theme: "", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    if(result === false) pass();
    else fail(`Expected false, got ${result}`);
  },

  'evaluate: matching platform returns true': async ({ pass, fail }) => {
    const el = { platform: "win", dev: null, theme: "", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'evaluate: non-matching platform returns false': async ({ pass, fail }) => {
    const el = { platform: "mac", dev: null, theme: "", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    if(result === false) pass();
    else fail(`Expected false, got ${result}`);
  },

  'evaluate: dev=false matches when isDev returns false': async ({ pass, fail }) => {
    const el = { platform: "", dev: false, theme: "", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'evaluate: dev=true fails when isDev returns false': async ({ pass, fail }) => {
    const el = { platform: "", dev: true, theme: "", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    if(result === false) pass();
    else fail(`Expected false, got ${result}`);
  },

  'evaluate: matching theme returns true': async ({ pass, fail }) => {
    document.documentElement.setAttribute("data-theme", "dark");
    const el = { platform: "", dev: null, theme: "dark", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    document.documentElement.removeAttribute("data-theme");
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'evaluate: non-matching theme returns false': async ({ pass, fail }) => {
    document.documentElement.setAttribute("data-theme", "light");
    const el = { platform: "", dev: null, theme: "dark", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    document.documentElement.removeAttribute("data-theme");
    if(result === false) pass();
    else fail(`Expected false, got ${result}`);
  },

  'evaluate: maximized=false matches when not maximized': async ({ pass, fail }) => {
    const el = { platform: "", dev: null, theme: "", maximized: false, setting: "" };
    const result = await window.__evaluate(el);
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'evaluate: setting with key=value checks stored value': async ({ pass, fail }) => {
    await window.api.db.set("color", "blue");
    const el = { platform: "", dev: null, theme: "", maximized: null, setting: "color=blue" };
    const result = await window.__evaluate(el);
    await window.api.db.delete("color");
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'evaluate: setting with key=value fails on mismatch': async ({ pass, fail }) => {
    await window.api.db.set("color", "red");
    const el = { platform: "", dev: null, theme: "", maximized: null, setting: "color=blue" };
    const result = await window.__evaluate(el);
    await window.api.db.delete("color");
    if(result === false) pass();
    else fail(`Expected false, got ${result}`);
  },

  'evaluate: setting with just key checks truthiness': async ({ pass, fail }) => {
    await window.api.db.set("enabled", true);
    const el = { platform: "", dev: null, theme: "", maximized: null, setting: "enabled" };
    const result = await window.__evaluate(el);
    await window.api.db.delete("enabled");
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'evaluate: setting with falsy value returns false': async ({ pass, fail }) => {
    await window.api.db.set("enabled", false);
    const el = { platform: "", dev: null, theme: "", maximized: null, setting: "enabled" };
    const result = await window.__evaluate(el);
    await window.api.db.delete("enabled");
    if(result === false) pass();
    else fail(`Expected false, got ${result}`);
  },

  'evaluate: multiple conditions are ANDed - all true': async ({ pass, fail }) => {
    const el = { platform: "win", dev: false, theme: "", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    if(result === true) pass();
    else fail(`Expected true, got ${result}`);
  },

  'evaluate: multiple conditions are ANDed - one false': async ({ pass, fail }) => {
    const el = { platform: "mac", dev: false, theme: "", maximized: null, setting: "" };
    const result = await window.__evaluate(el);
    if(result === false) pass();
    else fail(`Expected false (platform mismatch), got ${result}`);
  },
};
