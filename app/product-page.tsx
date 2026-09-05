import type { ReactNode } from 'react';
import { SiteHeader } from './site-header';
import { ThemeScreenshot } from './theme-screenshot';

type ProductPageProps = {
  product: 'Wow' | 'Weft';
  line: string;
  description: string;
  startHere: ReactNode;
  demo?: { src: string; poster: string; width: number; height: number; caption: string };
  screenshot?: { darkSrc: string; brightSrc: string; darkWidth: number; darkHeight: number; brightWidth: number; brightHeight: number; frameCrop?: { dark: number; bright: number } };
  manual: ReactNode;
  releases: ReactNode;
};

export function ProductPage({ product, line, description, startHere, demo, screenshot, manual, releases }: ProductPageProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const slug = product.toLowerCase();
  return (
    <main>
      <SiteHeader currentProduct={product} />
      <article className="product-detail" id="overview">
        <header className="product-intro">
          <p className="eyebrow"><span className="status-dot" /> Public beta</p>
          <h1>{product.toUpperCase()}</h1>
          <p className="product-detail-line">{line}</p>
          <p className="product-detail-description">{description}</p>
          <div className="actions">
            <a className="button primary" href={demo ? '#demo' : '#start-here'}>{demo ? 'Watch & listen' : 'Start here'} <span aria-hidden="true">↓</span></a>
            <a className="button" id="downloads" href={`${basePath}/downloads/#${slug}`}>Download beta <span aria-hidden="true">↗</span></a>
          </div>
          <div className="product-section-links" aria-label="On this page">
            {demo && <a href="#start-here">Start here</a>}
            <a href="#manual">Manual</a>
            <a href="#release-notes">Release notes</a>
          </div>
        </header>

        {demo && <figure className="product-demo" id="demo">
          <video controls playsInline preload="none" poster={`${basePath}${demo.poster}`} width={demo.width} height={demo.height} aria-label={`${product} audio demo`} aria-describedby="demo-caption">
            <source src={`${basePath}${demo.src}`} type="video/mp4" />
            <a href={`${basePath}${demo.src}`}>Download the demo video</a>
          </video>
          <figcaption id="demo-caption">{demo.caption}</figcaption>
        </figure>}

        {!demo && screenshot && <figure className="product-demo product-screenshot">
          <ThemeScreenshot darkSrc={`${basePath}${screenshot.darkSrc}`} brightSrc={`${basePath}${screenshot.brightSrc}`} alt={`Oiko ${product} plug-in interface`} darkWidth={screenshot.darkWidth} darkHeight={screenshot.darkHeight} brightWidth={screenshot.brightWidth} brightHeight={screenshot.brightHeight} frameCrop={screenshot.frameCrop} />
        </figure>}

        <section className="product-page-section product-reading product-start" id="start-here">
          <header><p className="index">01 / EXPLORE</p><h2>Start here</h2></header>
          <div className="document-content">{startHere}</div>
        </section>
        <section className="product-page-section product-reading" id="manual">
          <header><p className="index">02 / REFERENCE</p><h2>Manual</h2><p>Controls, settings and practical details.</p></header>
          <div className="document-content">{manual}</div>
        </section>
        <section className="product-page-section product-reading" id="release-notes">
          <header><p className="index">03 / RELEASE NOTES</p><h2>Release notes</h2></header>
          <div className="document-content">{releases}</div>
        </section>
      </article>
      <footer><p>OIKO AUDIO</p><p>Oiko Audio is a brand of Octofox Ltd.</p></footer>
    </main>
  );
}
