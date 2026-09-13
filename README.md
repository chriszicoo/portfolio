# Portfolio site

Plain HTML, CSS, and JavaScript. No build step, no dependencies. Open `index.html`
in a browser to preview it, or upload the whole folder to any static host
(GitHub Pages, Netlify, Vercel, itch.io, etc).

## Files

- `index.html` — page structure and copy (services, policies, hero text)
- `style.css` — all styling and colors
- `script.js` — mobile menu, scroll highlighting, video rendering, card tilt, accordion
- `videos-data.js` — the list of videos shown in the Work section
- `favicon.svg` — the small browser tab icon

## Adding a video

Open `videos-data.js`. Each project is one object in the `VIDEOS` array:

```js
{
  title: "Inventory and Currency System",
  description: "Short description of what the system does.",
  tags: ["DataStores", "UI", "Economy"],
  type: "youtube",
  src: "dQw4w9WgXcQ"
}
```

- `type: "youtube"` — set `src` to the video ID (the part after `v=` in a YouTube URL)
- `type: "medal"` — set `src` to a Medal.tv **embed** link, not the regular
  "Copy Link" one. Take your normal Medal clip link and change "clips" to
  singular "clip", then drop anything after the clip ID (like `?invite=...`).
  For example `https://medal.tv/games/roblox/clips/AbC123?invite=xyz` becomes
  `https://medal.tv/games/roblox/clip/AbC123`.
- `type: "file"` — set `src` to a path to an `.mp4` file you upload alongside the site,
  e.g. `"videos/inventory-demo.mp4"`

Delete the two placeholder objects at the top once you have real projects. The
video only loads when someone clicks play, so the page stays fast even with
several entries.

## Editing text

All copy lives directly in `index.html` — hero text, the "Why work with me" and
"What I can build" sections, and the Policies accordion. Search for the text
you want to change and edit it in place.

The policies (payment split, revisions, refunds, etc) are a starting draft
based on common freelance terms. Read through them and adjust anything that
doesn't match how you actually want to work before publishing.

## Dark and light mode

There's a toggle button (sun/moon icon) in the sidebar header, and on the
Privacy page. It remembers the person's choice in their browser's local
storage, and defaults to their system preference on a first visit. Colors for
both modes are set once in `style.css` under `:root` and `[data-theme="light"]`.

## Privacy page

`privacy.html` is a short, honest page explaining that the site collects
nothing by default, what the theme toggle stores locally, and that clicking
a YouTube video hands off to YouTube's own cookies once it loads. It's linked
from the footer of `index.html`. Update it if you add anything that changes
what the site does with data (an analytics script, a contact form, etc).

## Colors

All colors are defined once at the top of `style.css` under `:root`, so you
can retheme the whole site by changing a few values:

```css
--bg: #10141C;       /* page background */
--accent: #E8A33D;    /* primary accent, buttons */
--accent-2: #5FC7C0;  /* secondary accent, links, tags */
```

## Discord username

The handle shown in the sidebar and contact section is pulled from two spots
in `index.html`: the `.discord-pill` link near the top, and the
`#discordHandle` element in the contact section. Update both if it changes.
