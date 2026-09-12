# Oiko Audio website

Static product site for Oiko Audio. It is designed to deploy to GitHub Pages and does not require a server for the current content.

## Local preview

```sh
npm ci
npm run dev
```

## Production builds

`npm run build:pages` creates a static export in `out/`. The included workflow deploys that directory to GitHub Pages whenever `main` is pushed. The production build uses `https://oikoaudio.com` as its canonical URL and public root.

## Updating releases

Product pages live under `app/<product>/`. Download rows are in `app/downloads/page.tsx`; their version labels come from each product's `public/downloads/<product>/latest/release.json`.

Wow and Weft each use the same content component for their product-page release notes and standalone `/releases/<product>/` page. Wow's content is in `app/product-content.tsx`, Weft's in `app/weft-content.tsx`, and Inton's in `app/inton/page.tsx`. The manuals share content the same way, so update those components once.

Release archives are served directly from `public/downloads/<plugin>/latest/`. Keep the stable filenames in `release.json` when replacing a build so command-line download URLs do not change. Add matching SHA-256 values to `checksums.txt`.

Each plugin uses one `macos-universal.zip` archive containing Apple Silicon and Intel CLAP and VST3 builds. Audio Unit distribution is paused pending an upstream Logic compatibility fix.

Update release archives, `release.json` and checksums together. Verify the downloaded archives against the published release checksums before copying them into the website. Do not publish a new version label while the download directory still contains the previous release.

Theme-matched plug-in captures live in `public/images/` as `oiko-<plugin>-dark.png` and `oiko-<plugin>-bright.png`.

## Domain

Configure `oikoaudio.com` as the custom domain in the repository's GitHub Pages settings. DNS is managed separately at Namecheap.
