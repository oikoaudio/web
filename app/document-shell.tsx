import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';

export function DocumentShell({ product, section, children }: { product: 'Wow' | 'Weft' | 'Oikontrol'; section: 'Manual' | 'Release notes'; children: ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return (
    <main>
      <SiteHeader currentProduct={product} className="document-header" />
      <article className="document-page">
        <header className="document-title">
          <p className="index">{product.toUpperCase()} / {section.toUpperCase()}</p>
          <h1>{product}<br />{section}</h1>
          <div className="document-switcher">
            {section === 'Manual' && <a href={`${basePath}/manuals/oikontrol/`} className={product === 'Oikontrol' ? 'is-active' : ''}>Oikontrol</a>}
            <a href={`${basePath}/${section === 'Manual' ? 'manuals' : 'releases'}/weft/`} className={product === 'Weft' ? 'is-active' : ''}>Weft</a>
            <a href={`${basePath}/${section === 'Manual' ? 'manuals' : 'releases'}/wow/`} className={product === 'Wow' ? 'is-active' : ''}>Wow</a>
          </div>
        </header>
        <div className="document-content">{children}</div>
      </article>
      <footer>
        <p>OIKO AUDIO</p>
        <p>Oiko Audio is a brand of Octofox Ltd.</p>
      </footer>
    </main>
  );
}
