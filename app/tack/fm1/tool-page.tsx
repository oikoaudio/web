import type { ReactNode } from 'react';
import { SiteHeader } from '../../site-header';
import { release } from './tool-pages';
import './tools.css';

/* The install, backup and kit bank pages. Their markup and scripts are written here by Tack's make_web.py. The
   scripts find their elements by id, so React renders the markup once and leaves it alone. */
export function TackTool({ index, body, script, children }: { index: string; body: string; script: string; children?: ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return (
    <main>
      <SiteHeader currentProduct="Tack" />
      <article className="device-tool">
        <p className="index">{index}</p>
        <div dangerouslySetInnerHTML={{ __html: body }} suppressHydrationWarning />
        {children}
      </article>
      <script type="module" defer src={`${basePath}/tack/fm1/${script}?v=${release.version}`} />
      <footer><p>OIKO AUDIO</p><p>Oiko Audio is a brand of Octofox Ltd.</p><p><a href="https://github.com/oikoaudio">Open source on GitHub ↗</a></p></footer>
    </main>
  );
}
