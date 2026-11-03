import type { Metadata } from 'next';
import { ProductPage } from '../../product-page';
import { tackRepo, TackCreditsContent } from '../../tack-content';

const description = 'Tack plugins: a wild, aliasing digital drum synth with seven voices for your DAW, as CLAP, VST3 and Audio Unit. Free software, GPL-3.0.';

export const metadata: Metadata = {
  title: 'Tack plugins | Oiko Audio',
  description,
  alternates: { canonical: '/tack/plugin/' },
  openGraph: { title: 'Tack plugins | Oiko Audio', description, images: [] },
  twitter: { card: 'summary', title: 'Tack plugins | Oiko Audio', description, images: [] },
};

function StartContent() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <>
    <p>Tack runs the sound engine of the LXR-02 drum machine as a plugin. The engine is the firmware&apos;s code, changed only by a few bug fixes. The plugins, the editor and the code that runs the engine on a computer are new. There is no sequencer, because your DAW has one.</p>
    <p>In Tack, notes on MIDI channel 1 from C3 up trigger the voices, one note each. Channels 2 to 8 each play one voice chromatically.</p>
    <p>Want the sequencer on hardware? <a href={`${basePath}/tack/fm1/`}>Tack for the FM-1</a> is the same engine as firmware.</p>
  </>;
}

function ManualContent() {
  return <>
    <section>
      <h2>The plugins</h2>
      <p>Each format holds the same five plugins.</p>
      <dl className="manual-list">
        <div><dt>Tack</dt><dd>The whole kit: three drums, snare, cymbal, closed and open hi-hat, and the FX bus. It has seven stereo outputs, Main and one each for the three drums, snare, cymbal and hi-hat.</dd></div>
        <div><dt>Tack Drum</dt><dd>One drum voice.</dd></div>
        <div><dt>Tack Snare</dt><dd>The snare.</dd></div>
        <div><dt>Tack Cymbal</dt><dd>The cymbal.</dd></div>
        <div><dt>Tack Hi-hat</dt><dd>The closed and open hi-hat.</dd></div>
      </dl>
      <p>Every sound parameter on the device&apos;s front panel is a plugin parameter, 227 in Tack, and the host can automate and modulate them. The single-voice plugins play chromatically on any channel, or at the voice&apos;s tuned pitch when their Chromatic switch is off.</p>
    </section>
    <section>
      <h2>Sample rate and latency</h2>
      <p>The engine always runs at 44,140 Hz, the LXR-02&apos;s own rate, as its clock can&apos;t make 44.1 kHz exactly. Its filters, envelopes, delay and reverb are set in samples at that rate, so running it faster or slower would change the sound. Tack resamples its output to the host&apos;s rate instead, even when that is 44.1 kHz, so a kit sounds the same at any project rate.</p>
      <p>That costs a constant 5.8 ms of latency, which Tack reports so the host can compensate. A note or a parameter change lands within 0.73 ms of its place, as the engine computes envelopes and LFOs once per 64-sample block, like the device does.</p>
      <p>The resampler is libsamplerate at medium quality. What it adds is about 97 dB below the signal, far too quiet to hear, and in a 44.1 kHz project it rolls off gently above about 20 kHz. The aliasing you can hear in Tack comes from the engine&apos;s own oscillators and distortion, the same as on the LXR-02, and resampling neither adds to it nor removes it.</p>
      <p>Running the engine at the host&apos;s rate would change the kits. Envelopes and LFOs step a fixed amount each sample, the transients are recordings 50 ms long at 44.1 kHz, and the delay and reverb count their lengths in samples. At 96 kHz the oscillators would also alias differently, and that aliasing is part of how the kits sound.</p>
    </section>
    <section>
      <h2>Kits</h2>
      <p>Tack loads <code>.SND</code> kit files. Put folders of kits in the kit folder, where each folder is a pack. No kits come with Tack.</p>
      <dl className="manual-list">
        <div><dt>Linux</dt><dd><code>~/.local/share/Tack/Kits/</code></dd></div>
        <div><dt>macOS and Windows</dt><dd><code>Documents/Tack/Kits</code></dd></div>
      </dl>
      <p>Save kit writes a <code>.SND</code> file to the User pack. A single-voice plugin saves a kit with only its voice in it, and Tack&apos;s browser marks such files with the kind of voice. Picking one replaces only that voice of the open kit.</p>
      <p>Mutate kit and Mutate voice make a small random change to the kit or the open tab&apos;s voice, and each click goes on from the last. Back retraces the same steps to where you started. Volume, pan, routing, modulation targets, filter type and the FX stay as they are. A single-voice plugin has one Mutate button.</p>
    </section>
    <section>
      <h2>Installing</h2>
      <p>Download the zip for your platform from <a href={`${tackRepo}/releases/latest`}>the latest release</a>: Linux x86-64, Windows x86-64 or macOS, for Apple silicon and Intel alike. Each holds <code>Tack.clap</code> and <code>Tack.vst3</code>, and on macOS also <code>Tack.component</code>. Copy them to your plugin folders: <code>~/.clap</code> and <code>~/.vst3</code> on Linux, <code>C:\Program Files\Common Files\CLAP</code> and <code>VST3</code> on Windows, and <code>~/Library/Audio/Plug-Ins/CLAP</code>, <code>VST3</code> and <code>Components</code> on macOS.</p>
      <p>The macOS build is not signed, so macOS blocks it as downloaded. After copying, clear the download flag in Terminal: <code>xattr -dr com.apple.quarantine ~/Library/Audio/Plug-Ins</code>.</p>
      <h2>Building</h2>
      <p>To build Tack from source instead, you need CMake 3.21 or newer, Ninja, a C and C++ compiler and the OpenGL and X11 development files.</p>
      <pre>{`cmake -S host -B build/host -G Ninja
cmake --build build/host
cmake --build build/host --target install_tack`}</pre>
      <p>The last command copies <code>Tack.clap</code> to <code>~/.clap</code> and <code>Tack.vst3</code> to <code>~/.vst3</code>. The repository has the commands for Windows and macOS.</p>
    </section>
  </>;
}

function StatusContent() {
  return <>
    <p>This is a developer preview, and saved projects may not load in later versions.</p>
    <dl className="manual-list">
      <div><dt>Linux x86-64</dt><dd>CLAP and VST3 tested in Bitwig 6.1.6.</dd></div>
      <div><dt>Apple silicon Mac</dt><dd>CLAP and VST3 tested in Bitwig 6.1.6, and the Audio Unit in Logic Pro.</dd></div>
      <div><dt>Windows</dt><dd>Builds, and renders the same as Linux under Wine. Nobody has played it in a DAW yet.</dd></div>
    </dl>
  </>;
}

export default function TackPluginPage() {
  return <ProductPage
    product="Tack"
    title="TACK PLUGIN"
    stage="preview"
    download={false}
    startButton={false}
    links={[{ label: 'Download', href: `${tackRepo}/releases/latest`, primary: true }, { label: 'Source on GitHub', href: tackRepo }]}
    line="A wild digital drum synth for your DAW."
    description="Seven synthesised drum voices with 227 parameters to automate, seven stereo outputs, and an editor. CLAP, VST3 and Audio Unit."
    screenshot={{ darkSrc: '/images/tack-plugin-editor.png', brightSrc: '/images/tack-plugin-editor.png', darkWidth: 912, darkHeight: 436, brightWidth: 912, brightHeight: 436, alt: 'The Tack editor: a tab per voice, with boxes of dials for the oscillator, FM, transient, filter, envelopes, mix and LFO.', wide: true }}
    startHere={<StartContent />}
    manual={<ManualContent />}
    manualDescription="The plugins, kits, installing and building from source."
    sections={[
      { id: 'status', index: 'STATUS', title: 'Status', description: 'What is tested.', content: <StatusContent /> },
      { id: 'credits', index: 'CREDITS', title: 'Credits', content: <TackCreditsContent /> },
    ]}
  />;
}
