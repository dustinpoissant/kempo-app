export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppSettingString.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
  await window.api.db.clear();
};

export default {
  'app-setting-string is defined as a custom element': ({ pass, fail }) => {
    if(customElements.get("app-setting-string")) pass();
    else fail("app-setting-string not defined");
  },

  'app-setting-string extends AppSetting': ({ pass, fail }) => {
    const el = document.createElement("app-setting-string");
    if("setting" in el && "value" in el) pass();
    else fail("Does not inherit AppSetting properties");
  },

  'app-setting-string renders a text input': async ({ pass, fail }) => {
    await window.api.db.set("strSetting", "hello");
    const el = document.createElement("app-setting-string");
    el.setting = "strSetting";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="text"]');
    if(input) pass();
    else fail("text input not found");
  },

  'app-setting-string renders slot for label': async ({ pass, fail }) => {
    const el = document.createElement("app-setting-string");
    el.setting = "strLabel";
    el.innerHTML = "Username";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const slot = el.shadowRoot.querySelector("slot");
    if(slot) pass();
    else fail("slot not found");
  },

  'app-setting-string loads string value from db': async ({ pass, fail }) => {
    await window.api.db.set("strLoad", "world");
    const el = document.createElement("app-setting-string");
    el.setting = "strLoad";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    if(el.value === "world") pass();
    else fail(`Expected "world", got "${el.value}"`);
  },

  'app-setting-string input has empty value when setting is missing': async ({ pass, fail }) => {
    const el = document.createElement("app-setting-string");
    el.setting = "strMissing";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="text"]');
    if(input && input.value === "") pass();
    else fail(`Expected empty value, got "${input?.value}"`);
  },

  'app-setting-string updates value on input change': async ({ pass, fail }) => {
    await window.api.db.set("strChange", "old");
    const el = document.createElement("app-setting-string");
    el.setting = "strChange";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="text"]');
    input.value = "new value";
    input.dispatchEvent(new Event("change"));
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(el.value === "new value") pass();
    else fail(`Expected "new value", got "${el.value}"`);
  },

  'app-setting-string saves to db on change': async ({ pass, fail }) => {
    await window.api.db.set("strSave", "original");
    const el = document.createElement("app-setting-string");
    el.setting = "strSave";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="text"]');
    input.value = "updated";
    input.dispatchEvent(new Event("change"));
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    const stored = await window.api.db.get("strSave");
    if(stored === "updated") pass();
    else fail(`Expected "updated" in db, got "${stored}"`);
  },
};
