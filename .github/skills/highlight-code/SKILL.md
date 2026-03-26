---
name: highlight-code
description: Generates syntax-highlighted HTML for use in documentation code examples. USE THIS instead of creating temporary scripts.
---

# Highlight Code

## When to Use

Use this skill whenever you need syntax-highlighted HTML to embed in a documentation page — for example, when updating a `<pre><code class="hljs ...">` block in a `docs/` or `example/pages/` HTML file. **Do not create temporary `.mjs` scripts to do this.**

## Usage

Pipe code via stdin (supports multi-line):
```powershell
@"
<div class='container'>
  <h1>Hello</h1>
</div>
"@ | npx kempo-highlightcode <lang>
```

Or pass minified code as an argument:
```powershell
npx kempo-highlightcode <lang> "<div class='container'><h1>Hello</h1></div>"
```

**Supported languages:** `html`, `css`, `js` / `javascript`, `ts` / `typescript`, `json`, `md` / `markdown`, `sh` / `bash`, `xml`

## Output

Prints a complete `<pre><code class="hljs {lang}">…</code></pre>` block to stdout, with `<br>` tags instead of newlines — a single line suitable for embedding directly in HTML.

Input is automatically beautified before highlighting, so you can pass minified code.

## Workflow for Updating Doc Code Samples

Pipe the code into the script, capture to `$hl`, then use PowerShell's `.Replace()` to patch the HTML file:

```powershell
$hl = @"
export default {
  name: { type: 'text', required: true },
};

export const version = 1;
"@ | npx kempo-highlightcode javascript

$html = [System.IO.File]::ReadAllText((Resolve-Path 'example/pages/database/schema.html'))
$old = [regex]::Match($html, '(?s)<pre><code class="hljs javascript">.*?</code></pre>').Value
[System.IO.File]::WriteAllText((Resolve-Path 'example/pages/database/schema.html'), $html.Replace($old, $hl))
```

## Important Notes

- Use PowerShell **here-strings** (`@"…"@`) for multi-line code input via stdin.
- Use **single-quotes** for JS string literals inside the code. This preserves all quoting correctly through to node.
- HTML attribute values should be **unquoted** in the argument (`id=foo` not `id="foo"`) — the beautifier adds consistent formatting anyway.
- Use `[System.IO.File]::ReadAllText` / `WriteAllText` + `.Replace()` (not `-replace`) to avoid regex interpretation of the replacement string.
- If a page has multiple `<pre><code>` blocks, adjust the regex to match the specific one (e.g. match by a nearby unique string, or loop with an index).
- The beautifier handles indentation and formatting automatically.
- Output uses `<br>` instead of `\n`, keeping the block on one line in the HTML source.
