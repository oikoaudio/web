import type { Metadata } from 'next';
/* eslint-disable @next/next/no-img-element */
import { SiteHeader } from '../site-header';

const description = 'Tack is a seven-voice digital drum synth with aliasing oscillators, as plugins for your DAW and as firmware for the M-VAVE FM-1.';

export const metadata: Metadata = {
  title: 'Tack | Oiko Audio',
  description,
  alternates: { canonical: '/tack/' },
  openGraph: { title: 'Tack | Oiko Audio', description, images: [] },
  twitter: { card: 'summary', title: 'Tack | Oiko Audio', description, images: [] },
};

export default function TackOverview() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <main>
    <SiteHeader currentProduct="Tack" />
    <section className="oikontrol-intro tack-intro">
      <div className="tack-intro-head">
        <p className="index"><span className="status-dot" /> PUBLIC BETA</p>
        <h1>TACK</h1>
      </div>
      <div className="tack-intro-text">
        <h2>A digital drum synth, in two forms.</h2>
        <p>Tack is a digital drum synth with seven voices: three drums, a snare, a cymbal, and closed and open hats, with an FX bus. Its oscillators alias and its distortion is gritty, and a small turn of a dial makes expressive changes. It currently comes as plugins for your DAW and as firmware for the M-VAVE FM-1 hardware synth. Both are free software.</p>
        <p>Tack is Swedish for <b>Thank you</b>.</p>
        <p>Its sound engine is the LXR-02 firmware by Sonic Potions and Erica Synths, which Tack extends. The reverb the LXR leaves switched off is on, in stereo with low and high cuts. An LFO can play once from a voice&apos;s hit, and the delay can follow the tempo. A kit or a single voice can mutate, one small random change at a time, and step back the way it came. On the FM-1 the sequencer adds up to eight parameter locks a step, lanes that run backwards, ping-pong, bounce or at random and at half or quarter speed, velocity shapes that write a rhythm&apos;s accents into a lane, and steps that play only on chosen passes of their lane.</p>
        <p className="oikontrol-requirements">Tack is not affiliated with or endorsed by Erica Synths, Sonic Potions or M-VAVE.</p>
      </div>
      <figure className="tack-hero" aria-label="Tack as a plugin and on the FM-1">
        <img className="tack-hero-plugin" src={`${base}/images/tack-plugin-editor.png`} width={912} height={430} alt="The Tack plugin's editor: a tab per voice, with boxes of dials for the oscillator, FM, transient, filter, envelopes, mix and LFO." />
        <img src={`${base}/images/tack-overview.png`} width={720} height={720} alt="Tack on the FM-1's screen, HOME: seven lanes of steps, with pitch, filter, decay and volume below." />
        <img src={`${base}/images/tack-note.png`} width={720} height={720} alt="Tack on the FM-1's screen, NOTE: each step's note as a mark, with its velocity as a grey bar behind it." />
      </figure>
    </section>
    <section className="oikontrol-hardware" aria-label="The two forms of Tack">
      <article>
        <p className="index">HARDWARE / M-VAVE FM-1</p>
        <h2>Tack for the FM-1</h2>
        <p>New firmware that turns an M-VAVE FM-1 into a drum machine. Its step sequencer is based on the LXR-02 firmware&apos;s, with parameter locks, Euclidean lanes, chance, recurrence, velocity shapes, 16 patterns and a song. Install, update and back up from Chrome or Edge.</p>
        <dl>
          <div><dt>Sequencer</dt><dd>Built in, seven lanes of up to 64 steps, each with its own direction and speed</dd></div>
          <div><dt>Connects by</dt><dd>USB: stereo or 10 channels of audio, MIDI notes and clock</dd></div>
        </dl>
        <div className="actions"><a className="button primary" href={`${base}/tack/fm1/`}>Explore the firmware ↗</a><a className="button" href={`${base}/tack/fm1/install/`}>Install ↗</a></div>
      </article>
      <article>
        <p className="index">PLUGINS / CLAP · VST3 · AUDIO UNIT</p>
        <h2>Tack plugins</h2>
        <p>The same voices in your DAW, for automation and modulation: 227 parameters, seven stereo outputs, and separate plugins for a single drum, snare, cymbal or hi-hat. The DAW does the sequencing.</p>
        <dl>
          <div><dt>Sequencer</dt><dd>None, by design</dd></div>
          <div><dt>Runs on</dt><dd>Linux, macOS and Windows</dd></div>
        </dl>
        <div className="actions"><a className="button primary" href={`${base}/tack/plugin/`}>Explore the plugins ↗</a></div>
      </article>
    </section>
    <section className="oikontrol-install" aria-label="Kits">
      <div>
        <p className="index">KITS</p>
        <h2>One kit format</h2>
      </div>
      <div>
        <p>Both forms read <code>.SND</code> kit files, the format an LXR-02 writes to its SD card. The plugin&apos;s Save button writes that format too, so you can shape a kit at the computer and send it to the FM-1. No kits come with Tack, because kits belong to the people who made them.</p>
      </div>
    </section>
    <footer><p>OIKO AUDIO</p><p>Oiko Audio is a brand of Octofox Ltd.</p><p><a href="https://github.com/oikoaudio">Open source on GitHub ↗</a></p></footer>
  </main>;
}
