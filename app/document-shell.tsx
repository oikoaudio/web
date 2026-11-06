import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';

export type DocumentTab = { label: string; href: string; active: boolean };

export function DocumentShell({ product, section, tabs, children }: { product: 'Wow' | 'Weft' | 'Oikontrol' | 'Tack'; section: 'Manual' | 'Release notes'; tabs?: DocumentTab[]; children: ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const switcher = section === 'Release notes'
    ? [{ label: 'Weft', href: `${basePath}/releases/weft/`, active: product === 'Weft' }, { label: 'Wow', href: `${basePath}/releases/wow/`, active: product === 'Wow' }]
    : tabs;
  return (
    <main>
      <SiteHeader currentProduct={product} className="document-header" />
      <article className="document-page">
        <header className="document-title">
          <p className="index">{product.toUpperCase()} / {section.toUpperCase()}</p>
          <h1>{product}<br />{section}</h1>
          {switcher && <div className="document-switcher">
            {switcher.map((t) => <a key={t.href} href={t.href} className={t.active ? 'is-active' : ''}>{t.label}</a>)}
          </div>}
        </header>
        <div className="document-content">{children}</div>
      </article>
      <footer>
        <p>OIKO AUDIO</p>
        <p>Oiko Audio is a brand of Octofox Ltd.</p>
        <p><a href="https://github.com/oikoaudio">Open source on GitHub ↗</a></p>
      </footer>
    </main>
  );
}
