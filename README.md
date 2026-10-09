# Terrizzi — Band Website

Static website for **Terrizzi**, a four-piece Dutch rock band. Live at [preview.terrizzi.nl](https://preview.terrizzi.nl).

## Pages

| File | Route | Purpose |
|---|---|---|
| `index.html` | `/` | Landing page with hero image, promo video and upcoming shows |
| `band.html` | `/band.html` | Band introduction and member profiles |
| `media.html` | `/media.html` | Embedded video |
| `live.html` | `/live.html` | Upcoming and past shows, booking contact |
| `elements.html` | `/elements.html` | HTML5 UP component reference (not linked in nav) |
| `generic.html` | `/generic.html` | HTML5 UP generic page template (not linked in nav) |

## Architecture

The site is a fully static multi-page HTML site — no build step, no framework, no JavaScript bundler.

```
.
├── index.html              # Home
├── band.html               # Band
├── media.html              # Media
├── live.html               # Live
├── CNAME                   # GitHub Pages custom domain
├── assets/
│   ├── css/
│   │   ├── main.css        # HTML5 UP Massively base styles (compiled from sass/)
│   │   ├── terrizzi.css    # Custom overrides and brand styles
│   │   ├── noscript.css    # Fallback styles when JS is disabled
│   │   └── fontawesome-all.min.css
│   ├── sass/               # SCSS source for main.css (not compiled at deploy time)
│   ├── js/                 # jQuery + HTML5 UP interaction scripts
│   ├── img/
│   │   ├── logo/           # Brand logos and icons (PNG, white/black, transparent variants)
│   │   ├── band/           # Band photos (black and white rehearsal/location shots, colour stage shots)
│   │   └── [member dirs]/  # Per-member portraits (daniel, maarten, joris, stefan)
│   └── webfonts/           # Font Awesome webfonts
└── images/                 # HTML5 UP template images (bg.jpg, overlay.png, pic0x.jpg)
```

### CSS layers

1. **`assets/sass/`** — HTML5 UP Massively SCSS source. The compiled output is `assets/css/main.css`. The SCSS is kept for reference; it is not recompiled during deploy.
2. **`assets/css/terrizzi.css`** — All band-specific customisations, loaded after `main.css`:
   - **Header / logo:** the header shows `Terrizzi_White.png` and is `position: sticky`, so the logo stays pinned at the top while scrolling. A dark bar fades in behind it once pinned. Sizes are driven by CSS variables on `#header` (`--pt`, `--pb`, `--logo-h`, `--gap`); the overlap with the home-page intro is calculated from the same variables, so change them there rather than in several places.
   - **Photo backgrounds:** `live.html`, `band.html` and `media.html` set a `page-live` / `page-band` / `page-media` class on `<body>`. Each class gives that page a fixed, darkened full-viewport photo background. To change a photo, edit the matching rule at the end of `terrizzi.css`.
   - **Home hero:** inline styles in `index.html` switch between a 9:16 (mobile) and 16:9 (desktop) hero image.
   - Member cards, tables (left-aligned), video embeds and social icon styling.

### JavaScript

The scripts in `assets/js/` are the HTML5 UP Massively bundle: jQuery, ScrollEx, ScrollY and utility helpers that handle scroll-triggered class toggling and the mobile nav drawer. The only custom addition is a small scroll handler at the end of `assets/js/main.js` that adds a `stuck` class to `#header` while it is pinned (this shows the dark bar behind the logo).

### Images

- **Use web-sized copies, not originals.** Photos shown on the site are resized (about 2000px wide for landscape, 1000px for portraits, 2400px for backgrounds) and named `*_web.jpg` or `*_bg.jpg`, typically 130–500 KB each. Full-size originals (several MB each) are intentionally **not** kept in the repo.
- To add a photo, resize it first, for example with ffmpeg:

  ```bash
  ffmpeg -i original.jpg -vf scale=2000:-2 -q:v 4 name_web.jpg
  ```

- Images below the fold use `loading="lazy"`.
- Give photos descriptive `alt` text.

### Content

- **Shows:** add a `<tr>` to the table in `live.html` (and the shorter table in `index.html`). Past shows go in the second table on `live.html`.
- **Booking:** all "Stuur een boekingsaanvraag" buttons link to `mailto:info@terrizzi.nl` with a prefilled subject.
- **Video:** the YouTube embeds in `index.html` and `media.html` currently use a placeholder video ID. Replace the ID in both places with the real video.

## Deploy — GitHub Pages

The repository deploys automatically to GitHub Pages on every push to `master`. No CI workflow file is required; GitHub Pages is configured to serve directly from the root of the `master` branch.

The `CNAME` file contains `preview.terrizzi.nl`, which tells GitHub Pages to respond on that custom domain. DNS must have a `CNAME` record pointing `preview.terrizzi.nl` → `dvterrizzi.github.io`.

**Deploy flow:**

```
git push origin master
       │
       └─▶ GitHub Pages picks up the push
               └─▶ serves the repo root as static files
                       └─▶ https://preview.terrizzi.nl
```

Because the site is purely static, there is no build phase. Any file pushed to `master` is immediately live (propagation typically takes under a minute).

## Local development

Serve the folder over HTTP to avoid problems with relative paths.

Preferably, use VS Code with the Live Server extension. Or otherwise:

```bash
# Python 3
python3 -m http.server 8080

# Ruby (preinstalled on macOS)
ruby -run -e httpd . -p 8080
```

Then open `http://localhost:8080`.

## Attribution

Base theme: [Massively by HTML5 UP](https://html5up.net) — licensed under [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/). Custom styles and all band content © Terrizzi.
