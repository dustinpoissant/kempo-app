import { css } from "/modules/kempo-ui/dist/lit-all.min.js";

export const sharedStyles = css`
  :host { display: contents; }
  :host([hidden]) { display: none !important; }
`;

export const sharedProperties = {
  platform: { type: String },
  dev: { type: Boolean, converter: v => v === "" || v === "true" ? true : v === "false" ? false : null },
  theme: { type: String },
  maximized: { type: Boolean, converter: v => v === "" || v === "true" ? true : v === "false" ? false : null },
  setting: { type: String },
};

export const evaluate = async (el) => {
  const { platform, dev, theme, maximized, setting } = el;
  const checks = [];
  if(platform) checks.push((await window.api.getPlatform()) === platform);
  if(dev !== null) checks.push((await window.api.isDev()) === dev);
  if(theme) checks.push(document.documentElement.getAttribute("data-theme") === theme);
  if(maximized !== null) checks.push((await window.api.window.isMaximized()) === maximized);
  if(setting){
    const [key, val] = setting.split("=");
    const stored = await window.api.db("settings").get(key);
    checks.push(val !== undefined ? String(stored) === val : !!stored);
  }
  return checks.length ? checks.every(Boolean) : false;
};
