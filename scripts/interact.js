#!/usr/bin/env node
/**
 * interact.js — CLI script for LLMs to interact with the running Electron app
 * via Chrome DevTools Protocol on port 9222.
 *
 * Usage:
 *   node scripts/interact.js <command> [args...]
 *
 * Commands:
 *   screenshot [path]        Save a screenshot (defaults to scripts/screenshot.png)
 *   dom                      Print the full page HTML
 *   structure                Print a summary of all buttons, inputs, links, selects
 *   eval <js>                Evaluate JavaScript and print the result
 *   click <selector>         Click an element by CSS selector
 *   click-text <text>        Click the first element whose text contains <text>
 *   type <selector> <text>   Type text into an input element
 *   navigate <hash>          Navigate to a hash route (e.g. /settings)
 *   title                    Print the document title
 *   url                      Print the current URL
 */

import CDP from "chrome-remote-interface";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

const PORT = 9222;
const [,, command, ...args] = process.argv;

if(!command){
  console.error("Usage: node scripts/interact.js <command> [args...]");
  console.error("Run with --help for full command list.");
  process.exit(1);
}

const run = async () => {
  let client;
  try {
    const targets = await CDP.List({ port: PORT }).catch(() => {
      throw new Error(`Cannot connect to port ${PORT}. Start the app with: npm run dev`);
    });

    const target = targets.find(t => t.type === "page" && !t.url.startsWith("devtools://"));
    if(!target) throw new Error("No renderer page found.");

    client = await CDP({ target, port: PORT });
    const { Runtime, Page, DOM, Input } = client;

    await Runtime.enable();
    await Page.enable();
    await DOM.enable();

    switch (command) {
      case "screenshot": {
        const outputPath = args[0] || path.join(scriptDir, "screenshot.png");
        const { data } = await Page.captureScreenshot({ format: "png" });
        fs.writeFileSync(outputPath, Buffer.from(data, "base64"));
        console.log(`Screenshot saved to: ${outputPath}`);
        break;
      }

      case "dom": {
        const { result } = await Runtime.evaluate({
          expression: "document.documentElement.outerHTML",
          returnByValue: true,
        });
        console.log(result.value);
        break;
      }

      case "structure": {
        const { result } = await Runtime.evaluate({
          expression: `
            (function() {
              const out = { buttons: [], inputs: [], links: [], selects: [] };
              document.querySelectorAll('button, [role=button]').forEach(el => {
                out.buttons.push({ text: el.innerText.trim(), id: el.id, selector: el.tagName.toLowerCase() + (el.id ? '#'+el.id : '') + (el.className ? '.'+[...el.classList].join('.') : '') });
              });
              document.querySelectorAll('input, textarea').forEach(el => {
                out.inputs.push({ type: el.type, id: el.id, placeholder: el.placeholder, value: el.value });
              });
              document.querySelectorAll('a[href]').forEach(el => {
                out.links.push({ text: el.innerText.trim(), href: el.getAttribute('href') });
              });
              document.querySelectorAll('select').forEach(el => {
                out.selects.push({ id: el.id, options: [...el.options].map(o => o.text) });
              });
              return JSON.stringify(out, null, 2);
            })()
          `,
          returnByValue: true,
        });
        console.log(result.value);
        break;
      }

      case "eval": {
        const code = args.join(" ");
        if (!code) throw new Error("Usage: eval <javascript>");
        const { result, exceptionDetails } = await Runtime.evaluate({
          expression: code,
          returnByValue: true,
          awaitPromise: true,
        });
        if(exceptionDetails){
          console.error("JS Error:", exceptionDetails.text);
          process.exit(1);
        }
        console.log(result.value !== undefined ? JSON.stringify(result.value, null, 2) : "(undefined)");
        break;
      }

      case "click": {
        const selector = args[0];
        if(!selector) throw new Error("Usage: click <css-selector>");
        const { result, exceptionDetails } = await Runtime.evaluate({
          expression: `
            (function() {
              const el = document.querySelector(${JSON.stringify(selector)});
              if (!el) return 'Element not found: ' + ${JSON.stringify(selector)};
              el.click();
              return 'Clicked: ' + ${JSON.stringify(selector)};
            })()
          `,
          returnByValue: true,
        });
        if(exceptionDetails) throw new Error(exceptionDetails.text);
        console.log(result.value);
        break;
      }

      case "click-text": {
        const text = args.join(" ");
        if(!text) throw new Error("Usage: click-text <text>");
        const { result, exceptionDetails } = await Runtime.evaluate({
          expression: `
            (function() {
              const text = ${JSON.stringify(text.toLowerCase())};
              const els = [...document.querySelectorAll('button, a, [role=button], input[type=submit], input[type=button]')];
              const el = els.find(e => e.innerText.toLowerCase().includes(text) || e.value?.toLowerCase().includes(text) || e.getAttribute('aria-label')?.toLowerCase().includes(text));
              if (!el) return 'No element found with text: ' + ${JSON.stringify(text)};
              el.click();
              return 'Clicked element with text: ' + el.innerText.trim();
            })()
          `,
          returnByValue: true,
        });
        if(exceptionDetails) throw new Error(exceptionDetails.text);
        console.log(result.value);
        break;
      }

      case "type": {
        const [selector, ...textParts] = args;
        const text = textParts.join(" ");
        if(!selector || !text) throw new Error("Usage: type <css-selector> <text>");
        const { result, exceptionDetails } = await Runtime.evaluate({
          expression: `
            (function() {
              const el = document.querySelector(${JSON.stringify(selector)});
              if (!el) return 'Element not found: ' + ${JSON.stringify(selector)};
              el.focus();
              el.value = ${JSON.stringify(text)};
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
              return 'Typed into ' + ${JSON.stringify(selector)};
            })()
          `,
          returnByValue: true,
        });
        if(exceptionDetails) throw new Error(exceptionDetails.text);
        console.log(result.value);
        break;
      }

      case "navigate": {
        const hash = args[0];
        if(!hash) throw new Error("Usage: navigate <hash-route>  e.g. navigate /settings");
        const normalized = hash.startsWith("/") ? hash : "/" + hash;
        await Runtime.evaluate({
          expression: `window.location.hash = ${JSON.stringify("#" + normalized)}`,
        });
        console.log(`Navigated to #${normalized}`);
        break;
      }

      case "title": {
        const { result } = await Runtime.evaluate({
          expression: "document.title",
          returnByValue: true,
        });
        console.log(result.value);
        break;
      }

      case "url": {
        const { result } = await Runtime.evaluate({
          expression: "window.location.href",
          returnByValue: true,
        });
        console.log(result.value);
        break;
      }

      default:
        console.error(`Unknown command: "${command}"`);
        console.error("Available: screenshot, dom, structure, eval, click, click-text, type, navigate, title, url");
        process.exit(1);
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    if(client) await client.close();
  }
};

run();
