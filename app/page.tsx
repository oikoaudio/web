import { SiteHeader } from './site-header';
import { ThemeScreenshot } from './theme-screenshot';

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return (
    <main>
      <SiteHeader homeHref="#top" />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Independent audio software</p>
          <h1 className="hero-title" aria-label="Too many plugins. Anyway.">
            <span>Too many</span>
            <span>plugins.</span>
            <span className="hero-anyway">Anyway.</span>
          </h1>
          <p className="hero-intro">Oiko Audio makes tools for music makers and engineers<span className="hero-intro-break"><br /></span>{' '}in the spirit of exploration and sharing.</p>
        </div>
      </section>

      <section className="plugins" id="plugins" aria-label="Plug-ins">
        <div className="section-heading index-only">
          <p className="index">01 / PLUGINS</p>
        </div>

        <article className="plugin plugin-weft">
          <div className="plugin-copy">
            <div className="plugin-meta"><span className="product-index">001</span><span className="availability live">Public beta</span></div>
            <h3>WEFT</h3>
            <p className="plugin-line">An expressive spectral filter.</p>
            <div className="plugin-description">
              <p>Draw cuts in the spectrum, pick out chords with notes, or add movement to a loop. Capture a track’s spectral shape and reuse it on another track. Pin notes with the mouse or play them over MIDI while Weft processes your audio.</p>
            </div>
            <dl className="spec-list">
              <div><dt>Platforms</dt><dd>macOS · Windows · Linux</dd></div>
              <div><dt>Mask</dt><dd>Draw · Capture · Notes · Motion</dd></div>
              <div><dt>Formats</dt><dd>CLAP · VST3</dd></div>
            </dl>
            <div className="actions">
              <a className="button primary" href={`${basePath}/downloads/#weft`}>Download beta <Arrow /></a>
              <a className="button" href={`${basePath}/weft/#start-here`}>Start here <Arrow /></a>
              <a className="button" href={`${basePath}/weft/#faq`}>FAQ <Arrow /></a>
            </div>
          </div>
          <figure className="product-shot weft-shot">
            <ThemeScreenshot darkSrc={`${basePath}/images/oiko-weft-dark.png`} brightSrc={`${basePath}/images/oiko-weft-bright.png`} alt="Oiko Weft plug-in interface" darkWidth={954} darkHeight={704} brightWidth={954} brightHeight={704} frameCrop={{ dark: 3, bright: 3 }} />
            <figcaption>WEFT / earlier beta interface</figcaption>
          </figure>
        </article>

        <article className="plugin plugin-wow">
          <div className="plugin-copy">
            <div className="plugin-meta"><span className="product-index">002</span><span className="availability live">Public beta</span></div>
            <h3>WOW</h3>
            <p className="plugin-line">Clean pitch modulation.</p>
            <div className="plugin-description">
              <p>Wow produces slow warble, fast flutter and drift through clean playback-speed modulation. A lot of wow plug-ins use inexpensive interpolation, which can fold extra tones into the signal as playback speed moves. Wow uses rate-aware windowed-sinc resampling to keep aliasing down and high frequencies clear as the pitch moves.</p>
              <p>It is free and runs natively on Linux, macOS and Windows.</p>
            </div>
            <dl className="spec-list">
              <div><dt>Platforms</dt><dd>macOS · Windows · Linux</dd></div>
              <div><dt>Modes</dt><dd>Wow · Flutter · Drift</dd></div>
              <div><dt>Quality</dt><dd>Draft · Normal · HQ · Ultra</dd></div>
            </dl>
            <div className="actions">
              <a className="button primary" href={`${basePath}/downloads/#wow`}>Download beta <Arrow /></a>
              <a className="button" href={`${basePath}/wow/#start-here`}>Start here <Arrow /></a>
              <a className="button" href={`${basePath}/wow/#manual`}>Manual <Arrow /></a>
            </div>
          </div>
          <figure className="product-shot wow-shot">
            <ThemeScreenshot darkSrc={`${basePath}/images/oiko-wow-dark.png`} brightSrc={`${basePath}/images/oiko-wow-bright.png`} alt="Oiko Wow plug-in interface" darkWidth={504} darkHeight={394} brightWidth={508} brightHeight={398} frameCrop={{ dark: 3, bright: 5 }} />
            <figcaption>WOW / v0.1.1-beta.2</figcaption>
          </figure>
        </article>
      </section>

      <section aria-label="Controller extensions">
        <div className="oikontrol-install">
          <div>
            <p className="index">BITWIG EXTENSION</p>
            <h2>OIKONTROL</h2>
            <p className="plugin-line">An expressive instrument. A hands-on sequencer.</p>
            <p>Oikontrol turns the Akai Fire into an expressive Bitwig controller for live playing, sequencing and performance. Play with pitch bend and glissando, build drum patterns and chords, or develop a melody into several supporting voices.</p>
          </div>
          <div>
            <dl className="spec-list">
              <div><dt>Controllers</dt><dd>Akai Fire · Launch Control XL Mk2</dd></div>
              <div><dt>Requires</dt><dd>Bitwig Studio 6.0 or later</dd></div>
              <div><dt>Platforms</dt><dd>macOS · Windows · Linux</dd></div>
            </dl>
            <p>Also adds device, drum and arpeggiator controls to the Launch Control XL, while keeping user templates available for your own MIDI mappings.</p>
            <div className="actions"><a className="button primary" href={`${basePath}/oikontrol/`}>Explore Oikontrol ↗</a><a className="button" href={`${basePath}/downloads/#oikontrol`}>Download ↓</a></div>
          </div>
        </div>
      </section>
      <section className="download-callout" id="downloads"><h2>Ready to try them?</h2><a className="button primary" href={`${basePath}/downloads/`}>Downloads <Arrow /></a></section>

      <footer>
        <p>OIKO AUDIO</p>
        <p>Oiko Audio is a brand of Octofox Ltd.</p>
      </footer>
    </main>
  );
}
