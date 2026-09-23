# Oiko Audio website

Static product site for Oiko Audio. It is designed to deploy to GitHub Pages and does not require a server for the current content.

## Local preview

```sh
npm ci
npm run fetch:releases
npm run dev
```

## Production builds

`npm run build:pages` creates a static export in `out/`. The included workflow deploys that directory to GitHub Pages whenever `main` is pushed. The production build uses `https://oikoaudio.com` as its canonical URL and public root.

## Updating releases

Product pages live under `app/<product>/`. Download rows are in `app/downloads/page.tsx`; their version labels come from each product's `public/downloads/<product>/latest/release.json`.

Wow and Weft each use the same content component for their product-page release notes and standalone `/releases/<product>/` page. Wow's content is in `app/product-content.tsx`, Weft's in `app/weft-content.tsx`, and Inton's in `app/inton/page.tsx`. The manuals share content the same way, so update those components once.

Plugin downloads come from the GitHub releases of [oikoaudio/oikoaudio](https://github.com/oikoaudio/oikoaudio). Before each build, the deploy workflow runs `npm run fetch:releases`, which downloads the newest published release of Weft, Wow and Inton into `public/downloads/<plugin>/latest/`. It fails the build unless every archive matches the release's `checksums.txt` and `release.json`. That directory is ignored by Git; run the same command before a local preview. The plugin repository's release workflow can start this deployment after publishing; see its `docs/releases.md`.

Each plugin uses one `macos-universal.zip` archive containing Apple Silicon and Intel CLAP and VST3 builds. Audio Unit distribution is paused pending an upstream Logic compatibility fix.

Update the release notes and manuals before deploying a new plugin release, because the download labels come from the fetched `release.json`. Oikontrol downloads link to its own GitHub release, and its checksum stays in `public/downloads/oikontrol/`.

Theme-matched plug-in captures live in `public/images/` as `oiko-<plugin>-dark.png` and `oiko-<plugin>-bright.png`.

## Domain

Configure `oikoaudio.com` as the custom domain in the repository's GitHub Pages settings. DNS is managed separately at Namecheap.
