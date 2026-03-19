export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/modules/kempo-ui/dist/components/Toggle.js");
  await import("/framework/src/renderer/components/AppSettingBool.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
  await window.api.db.clear();
};

export default {
  'app-setting-bool is defined as a custom element': ({ pass, fail }) => {
    if(customElements.get("app-setting-bool")) pass();
    else fail("app-setting-bool not defined");
  },

  'app-setting-bool extends AppSetting': ({ pass, fail }) => {
    const el = document.createElement("app-setting-bool");
    if("setting" in el && "value" in el) pass();
    else fail("Does not inherit AppSetting properties");
  },

  'app-setting-bool renders a k-toggle': async ({ pass, fail }) => {
    await window.api.db.set("boolSetting", true);
    const el = document.createElement("app-setting-bool");
    el.setting = "boolSetting";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const toggle = el.shadowRoot.querySelector("k-toggle");
    if(toggle) pass();
    else fail("k-toggle not found");
  },

  'app-setting-bool renders slot for label': async ({ pass, fail }) => {
    const el = document.createElement("app-setting-bool");
    el.setting = "boolLabel";
    el.innerHTML = "Enable Feature";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const slot = el.shadowRoot.querySelector("slot");
    if(slot) pass();
    else fail("slot not found in app-setting-bool");
  },

  'app-setting-bool loads and renders boolean value from db': async ({ pass, fail }) => {
    await window.api.db.set("boolLoad", true);
    const el = document.createElement("app-setting-bool");
    el.setting = "boolLoad";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 200));
    await el.updateComplete;
    const toggle = el.shadowRoot.querySelector("k-toggle");
    if(toggle) pass();
    else fail("k-toggle not found after loading boolean value");
  },

  'app-setting-bool defaults falsy values to false': async ({ pass, fail }) => {
    const el = document.createElement("app-setting-bool");
    el.setting = "boolMissing";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const toggle = el.shadowRoot.querySelector("k-toggle");
    if(toggle && !toggle.value) pass();
    else fail("Toggle should be false for missing setting");
  },
};
