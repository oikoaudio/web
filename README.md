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

Product copy, version labels, and homepage download rows are in `app/page.tsx`. Product-specific download rows are in `app/product-page.tsx`.

Manuals and release notes are published as site pages under `app/manuals` and `app/releases`.

Release archives are served directly from `public/downloads/<plugin>/latest/`. Keep the stable filenames in `release.json` when replacing a build so command-line download URLs do not change. Add matching SHA-256 values to `checksums.txt`.

Each plugin uses one `macos-universal.zip` archive containing Apple Silicon and Intel CLAP and VST3 builds. Audio Unit distribution is paused pending an upstream Logic compatibility fix.

Weft's manual and release notes are in `app/weft-content.tsx`. Update the version on its product page and homepage alongside the release archives, `release.json` and checksums. Do not publish a new version label while the download directory still contains the previous release.

Theme-matched plug-in captures live in `public/images/` as `oiko-<plugin>-dark.png` and `oiko-<plugin>-bright.png`.

## Domain

Configure `oikoaudio.com` as the custom domain in the repository's GitHub Pages settings. DNS is managed separately at Namecheap.
