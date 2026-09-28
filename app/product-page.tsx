import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { ThemeScreenshot } from './theme-screenshot';

type ProductSection = { id: string; index: string; title: string; description?: string; content: ReactNode };

const stageLabels = { beta: 'Public beta', alpha: 'Public alpha', preview: 'Developer preview' };

type ProductPageProps = {
  product: 'Wow' | 'Weft' | 'Inton' | 'Plugg';
  stage?: keyof typeof stageLabels;
  download?: boolean;
  startButton?: boolean;
  links?: { label: string; href: string; primary?: boolean }[];
  line: string;
  description: string;
  startHere: ReactNode;
  demo?: { src: string; poster: string; width: number; height: number; caption: string };
  screenshot?: { darkSrc: string; brightSrc: string; darkWidth: number; darkHeight: number; brightWidth: number; brightHeight: number; frameCrop?: { dark: number; bright: number }; alt?: string; wide?: boolean };
  manual: ReactNode;
  manualTitle?: string;
  manualDescription?: string;
  sections?: ProductSection[];
  releases?: ReactNode;
};

export function ProductPage({ product, stage = 'beta', download = true, startButton = true, links = [], line, description, startHere, demo, screenshot, manual, manualTitle = 'Manual', manualDescription = 'Controls, settings and practical details.', sections = [], releases }: ProductPageProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const slug = product.toLowerCase();
  const pageSections: ProductSection[] = [
    { id: 'start-here', index: 'EXPLORE', title: 'Start here', content: startHere },
    { id: 'manual', index: 'REFERENCE', title: manualTitle, description: manualDescription, content: manual },
    ...sections,
    ...(releases ? [{ id: 'release-notes', index: 'RELEASE NOTES', title: 'Release notes', content: releases }] : []),
  ];
  return (
    <main>
      <SiteHeader currentProduct={product} />
      <article className="product-detail" id="overview">
        <header className="product-intro">
          <p className="eyebrow"><span className="status-dot" /> {stageLabels[stage]}</p>
          <h1>{product.toUpperCase()}</h1>
          <p className="product-detail-line">{line}</p>
          <p className="product-detail-description">{description}</p>
          {(demo || startButton || download || links.length > 0) && <div className="actions">
            {(demo || startButton) && <a className="button primary" href={demo ? '#demo' : '#start-here'}>{demo ? 'Watch & listen' : 'Start here'} <span aria-hidden="true">↓</span></a>}
            {download && <a className="button" id="downloads" href={`${basePath}/downloads/#${slug}`}>Download {stage} <span aria-hidden="true">↗</span></a>}
            {links.map((link) => <a key={link.href} className={link.primary ? 'button primary' : 'button'} href={link.href}>{link.label} <span aria-hidden="true">{link.href.startsWith('#') ? '↓' : '↗'}</span></a>)}
          </div>}
          <div className="product-section-links" aria-label="On this page">
            {pageSections.filter((section) => demo || !startButton || section.id !== 'start-here').map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
          </div>
        </header>

        {demo && <figure className="product-demo" id="demo">
          <video controls playsInline preload="none" poster={`${basePath}${demo.poster}`} width={demo.width} height={demo.height} aria-label={`${product} audio demo`} aria-describedby="demo-caption">
            <source src={`${basePath}${demo.src}`} type="video/mp4" />
            <a href={`${basePath}${demo.src}`}>Download the demo video</a>
          </video>
          <figcaption id="demo-caption">{demo.caption}</figcaption>
        </figure>}

        {!demo && screenshot && <figure className={`product-demo product-screenshot${screenshot.wide ? ' wide' : ''}`}>
          <ThemeScreenshot darkSrc={`${basePath}${screenshot.darkSrc}`} brightSrc={`${basePath}${screenshot.brightSrc}`} alt={screenshot.alt ?? `Oiko ${product} plug-in interface`} darkWidth={screenshot.darkWidth} darkHeight={screenshot.darkHeight} brightWidth={screenshot.brightWidth} brightHeight={screenshot.brightHeight} frameCrop={screenshot.frameCrop} />
        </figure>}

        {pageSections.map((section, i) => <section key={section.id} className={`product-page-section product-reading${section.id === 'start-here' ? ' product-start' : ''}`} id={section.id}>
          <header><p className="index">{String(i + 1).padStart(2, '0')} / {section.index}</p><h2>{section.title}</h2>{section.description && <p>{section.description}</p>}</header>
          <div className="document-content">{section.content}</div>
        </section>)}
      </article>
      <footer><p>OIKO AUDIO</p><p>Oiko Audio is a brand of Octofox Ltd.</p><p><a href="https://github.com/oikoaudio">Open source on GitHub ↗</a></p></footer>
    </main>
  );
}
