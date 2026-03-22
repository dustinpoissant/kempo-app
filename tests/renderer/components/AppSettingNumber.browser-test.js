export const page = "../test-page.html";

export const beforeAll = async () => {
  await import("/framework/src/renderer/components/AppSettingNumber.js");
};

export const beforeEach = async () => {
  document.body.innerHTML = "";
  await window.api.db("settings").clear();
};

export default {
  'app-setting-number is defined as a custom element': ({ pass, fail }) => {
    if(customElements.get("app-setting-number")) pass();
    else fail("app-setting-number not defined");
  },

  'app-setting-number extends AppSetting': ({ pass, fail }) => {
    const el = document.createElement("app-setting-number");
    if("setting" in el && "value" in el) pass();
    else fail("Does not inherit AppSetting properties");
  },

  'app-setting-number renders a number input': async ({ pass, fail }) => {
    await window.api.db("settings").set("numSetting", 42);
    const el = document.createElement("app-setting-number");
    el.setting = "numSetting";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="number"]');
    if(input) pass();
    else fail("number input not found");
  },

  'app-setting-number renders slot for label': async ({ pass, fail }) => {
    const el = document.createElement("app-setting-number");
    el.setting = "numLabel";
    el.innerHTML = "Max Items";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const slot = el.shadowRoot.querySelector("slot");
    if(slot) pass();
    else fail("slot not found");
  },

  'app-setting-number loads number value from db': async ({ pass, fail }) => {
    await window.api.db("settings").set("numLoad", 100);
    const el = document.createElement("app-setting-number");
    el.setting = "numLoad";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    if(el.value === 100) pass();
    else fail(`Expected 100, got ${el.value}`);
  },

  'app-setting-number input has empty value when setting is missing': async ({ pass, fail }) => {
    const el = document.createElement("app-setting-number");
    el.setting = "numMissing";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="number"]');
    if(input && input.value === "") pass();
    else fail(`Expected empty value, got "${input?.value}"`);
  },

  'app-setting-number converts input to Number on change': async ({ pass, fail }) => {
    await window.api.db("settings").set("numConvert", 0);
    const el = document.createElement("app-setting-number");
    el.setting = "numConvert";
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 100));
    await el.updateComplete;
    const input = el.shadowRoot.querySelector('input[type="number"]');
    input.value = "55";
    input.dispatchEvent(new Event("change"));
    await el.updateComplete;
    await new Promise(r => setTimeout(r, 50));
    if(typeof el.value === "number" && el.value === 55) pass();
    else fail(`Expected number 55, got ${typeof el.value} ${el.value}`);
  },
};
