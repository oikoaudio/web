import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { SiteHeader } from '../site-header';

export const metadata: Metadata = { title: 'Downloads | Oiko Audio', description: 'Download Weft and Wow for macOS, Windows and Linux, and Oikontrol controller extensions for Bitwig Studio.' };
const download = 'https://github.com/oikoaudio/bitwig-oikontrol/releases/download/oikontrol-v2.23.0/Oikontrol.bwextension';

const downloadRows = [
  { platform: 'macOS', detail: 'Universal', formats: 'CLAP · VST3', file: 'macos-universal.zip' },
  { platform: 'Windows', detail: 'x86-64', formats: 'CLAP · VST3', file: 'windows-x86_64.zip' },
  { platform: 'Linux', detail: 'x86-64', formats: 'CLAP · VST3', file: 'linux-x86_64.tar.gz' },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function readChecksums(file: string): Record<string, string> {
  const content = readFileSync(path.join(process.cwd(), 'public/downloads', file), 'utf8');
  return Object.fromEntries(content.trim().split(/\r?\n/).map((line) => {
    const [hash, filename] = line.trim().split(/\s+/);
    return [filename, hash];
  }));
}

export default function DownloadsPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const weftChecksums = readChecksums('weft/latest/checksums.txt');
  const wowChecksums = readChecksums('wow/latest/checksums.txt');
  const oikontrolChecksums = readChecksums('oikontrol/v2.23.0/checksums.txt');
  return <main>
    <SiteHeader downloadsCurrent />
    <header className="downloads-intro">
      <p className="eyebrow"><span className="status-dot" /> Free audio software</p>
      <h1>Downloads</h1>
      <p>Choose your product and platform. Weft and Wow come in CLAP and VST3 formats, with universal macOS builds for Apple Silicon and Intel.</p>
      <div className="actions"><a className="button" href="#weft">Weft ↓</a><a className="button" href="#wow">Wow ↓</a><a className="button" href="#oikontrol">Oikontrol ↓</a></div>
    </header>
    <section className="downloads-catalog" aria-label="Product downloads">
        <div className="download-panel" id="weft">
          <div className="download-panel-head">
            <div><span className="download-product">WEFT</span><span className="version">v0.1.1-beta3</span></div>
            <a href={`${basePath}/weft/#release-notes`}>Release notes <Arrow /></a>
          </div>
          <div className="download-table">
            {downloadRows.map((row) => (
              <a key={row.file} href={`${basePath}/downloads/weft/latest/weft-${row.file}`} className="download-row" download>
                <strong>{row.platform}</strong><span>{row.detail}</span><span>CLAP · VST3</span><code><span className="checksum-label">SHA-256</span>{weftChecksums[`weft-${row.file}`]}</code><span className="download-arrow">↓</span>
              </a>
            ))}
          </div>
          <p className="download-note">Current beta builds are not signed for distribution or notarized. <a href={`${basePath}/downloads/weft/latest/checksums.txt`}>SHA-256 checksums</a></p>
        </div>
        <div className="download-panel" id="wow">
          <div className="download-panel-head">
            <div><span className="download-product">WOW</span><span className="version">v0.1.1-beta.3</span></div>
            <a href={`${basePath}/wow/#release-notes`}>Release notes <Arrow /></a>
          </div>
          <div className="download-table">
            {downloadRows.map((row) => (
              <a key={row.file} href={`${basePath}/downloads/wow/latest/wow-${row.file}`} className="download-row" download>
                <strong>{row.platform}</strong><span>{row.detail}</span><span>{row.formats}</span><code><span className="checksum-label">SHA-256</span>{wowChecksums[`wow-${row.file}`]}</code><span className="download-arrow">↓</span>
              </a>
            ))}
          </div>
          <p className="download-note">Current beta builds are not signed for distribution or notarized. <a href={`${basePath}/downloads/wow/latest/checksums.txt`}>SHA-256 checksums</a></p>
        </div>
        <div className="download-panel" id="oikontrol">
          <div className="download-panel-head">
            <div><span className="download-product">OIKONTROL</span><span className="version">v2.23.0</span></div>
            <a href="https://github.com/oikoaudio/bitwig-oikontrol/releases/tag/oikontrol-v2.23.0">Release notes <Arrow /></a>
          </div>
          <div className="download-table">
            {downloadRows.map((row) => (
              <a key={row.platform} href={download} className="download-row">
                <strong>{row.platform}</strong><span>Bitwig Studio 6.0 or later</span><span>Controller extension</span><code><span className="checksum-label">SHA-256</span>{oikontrolChecksums['Oikontrol.bwextension']}</code><span className="download-arrow">↓</span>
              </a>
            ))}
          </div>
          <p className="download-note">The same extension works on all three platforms. <a href={`${basePath}/downloads/oikontrol/v2.23.0/checksums.txt`}>SHA-256 checksum</a> · <a href="https://github.com/oikoaudio/bitwig-oikontrol">Source code <Arrow /></a></p>
          <details className="download-installation">
            <summary>Installation instructions</summary>
            <ol><li>Download the extension and put it in your Bitwig Studio <strong>Extensions</strong> folder.</li><li>Open <strong>Settings → Controllers</strong> in Bitwig.</li><li>Add <strong>Fire Oikontrol</strong> or <strong>LCXL Oikontrol</strong> and select your controller&apos;s MIDI ports.</li></ol><p>On Windows and macOS, the folder is normally in Documents → Bitwig Studio → Extensions. On Linux, look in Bitwig Studio → Extensions in your home folder.</p><p>The <strong>?</strong> button beside the controller in Bitwig opens the bundled manual.</p>
          </details>
        </div>
    </section>
    <footer><p>OIKO AUDIO</p><p>Oiko Audio is a brand of Octofox Ltd.</p></footer>
  </main>;
}
