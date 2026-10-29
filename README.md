# drooxOS

droox's social media page, built as a fake computer with real links.
One HTML file, two themes: **Windows 98** (the default) and **Frutiger Aero** (glass over a Windows 7 style wallpaper).

## Files

| File | What's in it |
| --- | --- |
| `index.html` | The links, the bio, the profile picture and every piece of text |
| `style.css` | The look of both themes |
| `script.js` | Theme switching, the window, menus, clock, pixel icons, the logo and the live notice |
| `favicon.svg` | The logo (a waving flag with the d on top) shown in the browser tab |
| `og-image.png` | The preview image when someone pastes the link in Discord, WhatsApp, etc. |

Nothing to install: it's all static files.

## Editing

**Change or add a link:** in `index.html`, each link in the window is a `<li><a class="link" ...>` block.
Copy a block and change the `href`, the name (`link-name`) and the handle (`link-handle`).
The same link also shows up in the Start menu (`<a class="sm-item" ...>`), so change it there too.
If the number of links changes, update "7 object(s)" / "7 items" in the status bar.

For a platform that has no icon yet, grab its SVG from [simpleicons.org](https://simpleicons.org),
add a `<symbol id="i-name">` at the top of `index.html`, a color to `BRAND_COLORS` in `script.js`
and a `--brand` in `style.css` (next to `.ico[data-brand="twitch"]`).

**Bio:** look for `class="bio"` in `index.html`.

**Folder name:** "Social media" shows up in the window title, the desktop icon, the taskbar button and the address bar
(search `index.html` for it).

**Profile picture:** it uses the Twitch picture (and the GitHub one if Twitch fails). To use your own,
put an `avatar.png` in this folder and point the `src` of the two `<img>` tags that use `static-cdn.jtvnw.net` to `avatar.png`.

**Logo:** in the 98 theme it's hand-drawn pixel art, one character per pixel (`LOGO_PIXELS` in `script.js`).
In Aero it's a vector (`ICONS.logo` in `script.js`, plus a big copy in the wallpaper inside `index.html`).

## Themes

- Visitors switch with the **View** menu, **Start > Change theme** or the `98`/`Aero` button next to the clock.
  The choice is saved in their browser.
- You can share a link with a theme already picked: add `?theme=aero` or `?theme=98` to the address.

## Live notice

When you're live on Twitch, the site shows "LIVE" on the Twitch link, a red dot next to the clock
and a balloon with the stream title. That comes from [DecAPI](https://decapi.me) (free, no key).
If it's down, the site just doesn't show the notice.

To see what it looks like without going live, add `?live` to the address.

## Run it on your PC

From the site folder:

```bash
py -m http.server 8000
```

Then open http://localhost:8000.

## Publishing

Any static host works. The simplest free ones:

- **GitHub Pages:** create a repository, push these files and turn on *Settings > Pages* for the `main` branch.
  The site ends up at `https://thiagotodeschini.github.io/<repo-name>/`.
- **Cloudflare Pages** or **Netlify:** you can drag the whole folder into their dashboard.

After publishing, change `og:image` in `index.html` to the image's full address
(for example `https://thiagotodeschini.github.io/droox-links/og-image.png`), otherwise Discord won't show the preview.
A custom domain works with all of these.
