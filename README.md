# Terrizzi — Band Website

Website for **Terrizzi**, a four-piece Dutch rock band. Live at [preview.terrizzi.nl](https://preview.terrizzi.nl).

## Pages

| Source | Output | Purpose |
|---|---|---|
| `src/index.njk` | `/index.html` | Landing page with hero image, promo video and upcoming shows |
| `src/band.njk` | `/band.html` | Band introduction and member profiles |
| `src/media.njk` | `/media.html` | Embedded video |
| `src/404.njk` | `/404.html` | "Pagina niet gevonden", shown by GitHub Pages for any missing URL |
| `src/live.njk` | `/live.html` | Upcoming and past shows, booking contact |

## Architecture

The site is built with [Eleventy](https://www.11ty.dev/) (11ty). The pages are [Nunjucks](https://mozilla.github.io/nunjucks/) templates that share one layout, and repeating content (gigs, band members, links) lives in data files. Eleventy renders everything to plain static HTML in `_site/`. There is no client-side framework or bundler.

```
.
├── eleventy.config.js      # Eleventy config: input/output folders, files copied as-is
├── package.json            # Eleventy dependency and npm scripts
├── .github/workflows/
│   ├── deploy.yml          # Preview: every push to master → preview.terrizzi.nl
│   └── release.yml         # Production: every published release → www.terrizzi.nl
├── src/
│   ├── _includes/
│   │   ├── base.njk        # Shared layout: <head>, header, nav, footer, scripts
│   │   └── macros.njk      # Reusable pieces: gigs table, booking button
│   ├── _data/
│   │   ├── site.json       # Band name, email, social links, nav, promo video URL
│   │   ├── gigs.json       # Upcoming and past shows
│   │   ├── members.json    # Band members: name, role, photo, social links
│   │   ├── env.js          # Preview vs production build (domain, URL, noindex)
│   │   └── year.js         # Current year for the copyright line
│   ├── index.njk           # Home
│   ├── band.njk            # Band
│   ├── media.njk           # Media
│   ├── live.njk            # Live
│   ├── 404.njk             # Page not found
│   └── CNAME.njk           # Generates the CNAME file (custom domain) for each build
├── assets/                 # Copied into the build as-is
│   ├── css/
│   │   ├── main.css        # HTML5 UP Massively base styles (compiled from sass/)
│   │   ├── terrizzi.css    # Custom overrides and brand styles
│   │   ├── noscript.css    # Fallback styles when JS is disabled
│   │   └── fontawesome-all.min.css
│   ├── sass/               # SCSS source for main.css (not compiled during the build)
│   ├── js/                 # jQuery + HTML5 UP interaction scripts
│   ├── img/
│   │   ├── logo/           # Brand logos and icons (PNG, white/black, transparent variants)
│   │   ├── band/           # Band photos (black and white rehearsal/location shots, colour stage shots)
│   │   └── [member dirs]/  # Per-member portraits (daniel, maarten, joris, stefan)
│   └── webfonts/           # Font Awesome webfonts
├── images/                 # HTML5 UP template images used by main.css (bg.jpg, overlay.png)
└── _site/                  # Build output (not committed)
```

### Templates

Each page in `src/` extends `_includes/base.njk` and fills in its own blocks (`main`, plus `head` and `intro` on the home page). Front matter at the top of each page sets the `<title>`, the `<body>` class and which nav item is active. To change something that appears on every page (nav, footer, scripts), edit `base.njk` once.

### Search engines and link previews

- **Preview vs production:** builds are *preview* by default. Only a build run with `SITE_ENV=production` counts as production (see `src/_data/env.js`).
  - **Preview** (local and `preview.terrizzi.nl`): every page gets `<meta name="robots" content="noindex, nofollow">`, so search engines skip it, and links use `https://preview.terrizzi.nl`.
  - **Production:** pages can be indexed, and links use `https://www.terrizzi.nl`. Any future production deploy workflow **must** build with `SITE_ENV=production`.
- **Meta tags:** every page has `lang="nl"`, a meta description, a canonical URL and Open Graph / Twitter tags. These make WhatsApp, Instagram, Facebook etc. show a title, description and image when someone shares a link.
  - The default description and the share image (`assets/img/social/terrizzi-share.jpg`, 1200×630) are set in `site.json`.
  - A page can set its own `description` in its front matter.
- **404 page:** `src/404.njk` is never indexed. It sets `baseHref: /`, so its links and images also work on nested missing URLs like `/foo/bar`.

### CSS layers

1. **`assets/sass/`** — HTML5 UP Massively SCSS source. The compiled output is `assets/css/main.css`. The SCSS is kept for reference; it is not recompiled during deploy.
2. **`assets/css/terrizzi.css`** — All band-specific customisations, loaded after `main.css`:
   - **Header / logo:** the header shows `Terrizzi_White.png` and is `position: sticky`, so the logo stays pinned at the top while scrolling. A dark bar fades in behind it once pinned. Sizes are driven by CSS variables on `#header` (`--pt`, `--pb`, `--logo-h`, `--gap`); the overlap with the home-page intro is calculated from the same variables, so change them there rather than in several places.
   - **Photo backgrounds:** The live, band and media pages set a `page-live` / `page-band` / `page-media` class on `<body>` (via `bodyClass` in their front matter). Each class gives that page a fixed, darkened full-viewport photo background. To change a photo, edit the matching rule at the end of `terrizzi.css`.
   - **Home hero:** inline styles in `src/index.njk` switch between a 9:16 (mobile) and 16:9 (desktop) hero image.
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
- Give photos descriptive `alt` text in Dutch (who or what is in the photo). Member photos get theirs automatically from `members.json` ("Daniël, basgitaar bij Terrizzi"). Purely decorative images such as the logo stamps use `alt=""`.

### Content

Most content updates are edits to a data file in `src/_data/`. No HTML needed.

- **Shows:** add an entry to `upcoming` in `gigs.json`. It appears on both the Live page and the home page. Add a `tickets` URL to show a Tickets button on the Live page. Move a show to `past` once it has happened.

  ```json
  { "date": "17 januari 2027", "venue": "Popcentrale", "city": "Dordrecht", "tickets": "" }
  ```

- **Band members:** edit `members.json` (name, role, photo path, social links).
- **Social links, email, nav:** edit `site.json`. The footer, nav icons, copyright line and booking buttons all read from it.
- **Booking:** all "Stuur een boekingsaanvraag" buttons link to the email in `site.json` with a prefilled subject (`bookingSubject`).
- **Video:** `promoVideo` in `site.json` is used by both the home and media pages. It is currently a placeholder video; replace it with the real embed URL.

## Deploy — GitHub Pages

The site has two environments, built from the same source in this repository:

| | Preview | Production |
|---|---|---|
| URL | https://preview.terrizzi.nl | https://www.terrizzi.nl |
| Deploys when | every push to `master` | a GitHub release is published |
| Workflow | `.github/workflows/deploy.yml` | `.github/workflows/release.yml` |
| Hosted by | this repo's GitHub Pages | GitHub Pages of [`dvterrizzi/terrizziweb-production`](https://github.com/dvterrizzi/terrizziweb-production) (`gh-pages` branch) |
| Search engines | `noindex` on every page | indexable |

The `CNAME` file (the custom domain) is generated per build by `src/CNAME.njk` from `src/_data/env.js`, so preview and production each get their own domain.

### Preview

Every push to `master` builds the site and publishes `_site/` to this repo's GitHub Pages. You can also start it by hand from the **Actions** tab (**Run workflow**).

**One-time setting:** in this repository's **Settings → Pages**, **Source** must be set to **GitHub Actions**. DNS needs a `CNAME` record pointing `preview.terrizzi.nl` → `dvterrizzi.github.io`.

```
git push origin master
       │
       └─▶ GitHub Actions: npm ci → npm run build
               └─▶ uploads _site/ and deploys it to GitHub Pages
                       └─▶ https://preview.terrizzi.nl
```

### Production

When the preview looks right, publish a release: on GitHub go to **Releases → Draft a new release**, create a new tag such as `v1.1.0`, and click **Publish release**. Or from the terminal:

```bash
gh release create v1.1.0 --title "v1.1.0" --notes "What changed"
```

The release workflow then:
1. builds that tag with `SITE_ENV=production`;
2. checks that the build has `CNAME` `www.terrizzi.nl` and no `noindex` tags (except the 404 page);
3. force-pushes the result to the `gh-pages` branch of `terrizziweb-production`, which GitHub Pages serves on `www.terrizzi.nl`.

The production repo only ever holds the latest build. Never edit it by hand; the next release overwrites it. To redeploy without a new release, use **Actions → Deploy production → Run workflow** and pick a tag.

**One-time setup:**
- The `PRODUCTION_DEPLOY_KEY` secret in this repo holds the private half of an SSH deploy key. The production repo has the public half, with write access.
- In the production repo, **Settings → Pages** is set to **Deploy from a branch → `gh-pages` / (root)**, with custom domain `www.terrizzi.nl` and **Enforce HTTPS** on.
- DNS: `www` is a `CNAME` to `dvterrizzi.github.io`, and `terrizzi.nl` has GitHub's A/AAAA records, so GitHub redirects it to `www`.

Deploys usually take one to two minutes. Progress and errors are visible in the **Actions** tab.

## Local development

Requires [Node.js](https://nodejs.org/) (on macOS: `brew install node`).

```bash
npm install       # once, installs Eleventy
npm start         # dev server with live reload at http://localhost:8080
npm run build     # one-off build into _site/
```

Edit files in `src/` or `assets/`; the dev server rebuilds and reloads the browser automatically.

## Attribution

Base theme: [Massively by HTML5 UP](https://html5up.net) — licensed under [Creative Commons Attribution 3.0](https://creativecommons.org/licenses/by/3.0/). Custom styles and all band content © Terrizzi.
