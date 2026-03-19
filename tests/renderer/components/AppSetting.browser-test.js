export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppSettingString.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
  await window.api.db.clear();
};

/*
  AppSetting is a base class (not registered as a custom element).
  Tests exercise its behavior through app-setting-string.
*/

export default {
  'AppSetting subclass has setting property': ({ pass, fail }) => {
    const el = document.createElement("app-setting-string");
    if("setting" in el) pass();
    else fail("setting property not found");
  },

  'AppSetting subclass has value property': ({ pass, fail }) => {
    const el = document.createElement("app-setting-string");
    if("value" in el) pass();
    else fail("value property not found");
  },

  'AppSetting default setting is empty string': ({ pass, fail }) => {
    const el = document.createElement("app-setting-string");
    if(el.setting === "") pass();
    else fail(`Expected empty string, got "${el.setting}"`);
  },

  'AppSetting default value is undefined': ({ pass, fail }) => {
    const el = document.createElement("app-setting-string");
    if(el.value === undefined) pass();
    else fail(`Expected undefined, got ${el.value}`);
  },

  'AppSetting loads value from db on connect': async ({ pass, fail }) => {
    await window.api.db.set("testSetting", "hello");
    const el = document.createElement("app-setting-string");
    el.setting = "testSetting";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    if(el.value === "hello") pass();
    else fail(`Expected "hello", got "${el.value}"`);
  },

  'AppSetting saves value to db when value changes': async ({ pass, fail }) => {
    await window.api.db.set("saveSetting", "old");
    const el = document.createElement("app-setting-string");
    el.setting = "saveSetting";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    el.value = "new";
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    const stored = await window.api.db.get("saveSetting");
    if(stored === "new") pass();
    else fail(`Expected "new", got "${stored}"`);
  },

  'AppSetting uses flex layout': ({ pass, fail }) => {
    const Ctor = customElements.get("app-setting-string");
    let styles = Ctor.styles;
    while(Array.isArray(styles)) styles = styles.flat();
    const cssText = Array.isArray(styles) ? styles.map(s => s.cssText).join("") : (typeof styles === "object" && styles?.cssText) ? styles.cssText : String(styles || "");
    // Check the prototype chain for styles from AppSetting
    let found = cssText.includes("display: flex") || cssText.includes("display:flex");
    if(!found){
      // The styles may be inherited; check the superclass
      let proto = Object.getPrototypeOf(Ctor);
      while(proto && proto.styles){
        const s = proto.styles;
        const t = Array.isArray(s) ? s.map(x => x.cssText || "").join("") : (s?.cssText || "");
        if(t.includes("display: flex") || t.includes("display:flex")){ found = true; break; }
        proto = Object.getPrototypeOf(proto);
      }
    }
    if(found) pass();
    else fail("Flex layout not found in AppSetting styles");
  },

  'AppSetting uses space-between justify': ({ pass, fail }) => {
    const Ctor = customElements.get("app-setting-string");
    let styles = Ctor.styles;
    while(Array.isArray(styles)) styles = styles.flat();
    const cssText = Array.isArray(styles) ? styles.map(s => s.cssText).join("") : (typeof styles === "object" && styles?.cssText) ? styles.cssText : String(styles || "");
    let found = cssText.includes("space-between");
    if(!found){
      let proto = Object.getPrototypeOf(Ctor);
      while(proto && proto.styles){
        const s = proto.styles;
        const t = Array.isArray(s) ? s.map(x => x.cssText || "").join("") : (s?.cssText || "");
        if(t.includes("space-between")){ found = true; break; }
        proto = Object.getPrototypeOf(proto);
      }
    }
    if(found) pass();
    else fail("justify-content: space-between not found in AppSetting styles");
  },
};
