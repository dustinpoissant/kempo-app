---
name: get-icon
description: Fetches icons from the Google Material Design icon set, saves them to this project, and formats them.
---

# Get Icon

## When to Use

Use this skill any time an icon is needed — whether the user explicitly asks for one or you determine that a UI element (button, control, action, etc.) would benefit from one. For example, if a user asks you to build a "minimize" button for the titlebar, you should proactively source an appropriate icon without being explicitly told to.

## Overview

Icons live in the `icons/` directory at the project root as SVG files. The project uses the **Material Symbols Outlined** style from Google's CDN. The workflow has three stages:

1. **Check local icons first** — the icon may already exist
2. **Find** the correct Material Symbols name if it doesn't
3. **Fetch, format, and save** using the CLI command

---

## Stage 1: Check Local Icons First

Before going to the internet, list the contents of `icons/` and look for an existing icon that fits the need.

- If a **clear match** exists (e.g. `icons/close.svg` for a close button), use it — no download needed.
- If a **reasonable match** exists for a directional icon (e.g. `icons/arrow.svg` for a left-arrow), use it with the appropriate `direction` attribute on `<k-icon>` — no download needed.
- If **nothing fits**, proceed to Stage 2.

---

## Stage 2: Find the Icon Name

Run the search command, which fetches icon names and tags from GitHub and caches them locally. Search matches both icon names **and tags**:

```powershell
npx kempo-listicons <search_term>
```

Example:
```powershell
npx kempo-listicons bold
# → format_bold

npx kempo-listicons chevron
# → chevron_right
#   chevron_left
#   keyboard_arrow_right
#   ...
```

Pick the best match for the intent. If no results, try different terms.

---

## Stage 3: Fetch, Format, and Save

```powershell
npx kempo-geticon <icon_name> [custom_name] [-y]
```

- `icon_name` — the Material Symbols name as returned by the search command
- `custom_name` — optional rename (e.g. `keyboard_double_arrow_right double_chevron` saves as `double_chevron.svg`)
- `-y` — auto-accept the directional prompt without user interaction

For directional icons (those with `_left`, `_up`, `_down`, `_backward` suffixes, or that have a `_right`/`_forward` variant), the script prompts to save the right-facing variant with a generic name. The `<k-icon>` component handles rotation via its `direction` attribute.

Examples:
```powershell
# Non-directional
npx kempo-geticon format_bold

# Directional — prompts to confirm saving right-facing variant as "chevron"
npx kempo-geticon chevron_left

# Directional with rename and auto-accept
npx kempo-geticon keyboard_double_arrow_up double_chevron -y
```

---

## Directional Icons and `<k-icon>`

| `direction` value | Rotation applied |
|---|---|
| *(omitted)* | 0° — points right |
| `down` | 90° |
| `left` | 180° |
| `up` | 270° |

Example:
```html
<k-icon name="arrow" direction="left"></k-icon>
```

---

## Icon Search Order

`<k-icon name="foo">` searches for `foo.svg` in this order:

1. `/icons/` — consumer's project `icons/` directory
2. `/framework/icons/` — kempo-app's `icons/` directory (this repo)
3. `/modules/kempo-ui/icons` — kempo-ui's built-in icons

Icons added to this repo's `icons/` override kempo-ui icons of the same name.
