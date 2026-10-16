# Toft documentation

The user guide, the admin guide and the CLI & SDK guide, as one site:
**https://larchway-labs.github.io/toft-docs/**

Every Toft install links here, to the folder for the minor version it runs —
an install on 0.7.3 links to `/toft-docs/0.7/`. Nothing in the product fetches
this site; a link is only ever followed by a reader's browser.

## Layout

| Path | What |
|---|---|
| `src/content/docs/user/` | The user guide: deploying, running and sharing an app |
| `src/content/docs/admin/` | The admin guide: running an install |
| `src/content/docs/cli/` | The CLI & SDK guide |
| `astro.config.mjs` | One Starlight site; the sidebar has one group per guide |
| `scripts/build-site.sh` | Builds every published version into `site/` |
| `pages/` | The two root pages: `index.html` (→ `latest/`) and `404.html` |
| `.github/workflows/pages.yml` | Publishes `site/` to GitHub Pages |

Astro + Starlight + Pagefind. Search is a static index built into each
version's folder, so it searches that version only, and it works on a mirror
with no route to the internet.

## Versions

- **One branch per published minor: `release/0.7`, `release/0.8`.** Each is
  built into `/toft-docs/<minor>/`, and the newest is built again into
  `/toft-docs/latest/`.
- **`main` is the next minor** and is not published. Write documentation for
  unreleased behaviour there.
- **A Toft release cuts its branch before the image ships**: `git branch
  release/0.8 main && git push origin release/0.8`, then wait for the Publish
  workflow and check `https://larchway-labs.github.io/toft-docs/0.8/user/`
  answers. An install links to its minor the moment it runs, so a missing
  folder is a broken Documentation page.
- **A correction to a published version** is a commit on its `release/X.Y`
  branch (and on `main`, if it still applies). A patch release never gets a
  folder of its own: patches change no documented behaviour.
- A version that is not published yet lands on `404.html`, which names the
  version asked for and links to the same page in the newest one.

Every push to `main` or a `release/*` branch republishes the whole site.

## Writing

- `npm run dev` serves the site at `http://localhost:4321/toft-docs/dev/`.
- Light theme only, like the platform; `src/styles/toft.css` is the theme.
- Link between pages with relative links, never with a root-absolute path —
  the base differs per version.
- US spelling: **license**.
- The admin guide's `reference/settings.md` and `reference/checks-reference.md`
  restate what `web/src/lib/settings-index.ts` and the checks registry in the
  platform say. Nothing generates them yet, so a change to either owes these
  pages by hand.

## Mirroring for an install with no internet access

Copy a published version onto any static host — including an ordinary Toft
static app — keeping the `/<minor>/` folders, and set the install's `DOCS_URL`
to the mirror's root. The published files are on the `github-pages`
deployment; building them yourself is `DOCS_PREFIX=/your/path
scripts/build-site.sh`, which writes `site/`.
