import type { Metadata } from 'next';
import { ProductPage } from '../product-page';

const description = 'Inton is a free MTS-ESP host for Linux, macOS and Windows. It supports multiple scales per project and morphing between them.';

export const metadata: Metadata = {
  title: 'Inton | Oiko Audio',
  description,
  alternates: { canonical: '/inton/' },
  openGraph: { title: 'Inton | Oiko Audio', description, images: [] },
  twitter: { card: 'summary', title: 'Inton | Oiko Audio', description, images: [] },
};

export default function IntonPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <ProductPage
    product="Inton"
    stage="beta"
    line="Microtuning for your DAW."
    description="Inton is a free MTS-ESP master for Linux, macOS and Windows. It loads standard tuning formats, and allows you to build and edit scales and morph between them within your DAW."
    demo={{ src: '/videos/inton-demo.mp4', poster: '/videos/inton-demo-poster.jpg', width: 1162, height: 720, caption: 'Inton in Bitwig, with Serum 2 and Weft. Press play to hear the demo.' }}
    startHere={<>
      <p>A lot of care has gone into keeping Inton easy to use. In the simplest case, pick one of the equal division, just intonation or non-octave scales from the built-in library and observe Inton connect to and tune all the MTS-ESP capable instruments in your DAW session. It also imports standard tuning files, such as Scala (.scl) or .tun files.
         You can also build scale sets and morph between scales using automation, create and edit scales within the plug-in. The interactive wheel shows how the notes line up against standard twelve-note tuning.</p>
      <h3>Install</h3>
      <p><strong>Inton is a beta</strong>, and is being tested for Linux, macOS and Windows. Please do not use it in mission critical projects yet.</p>
      <ol>
        <li><a href={`${basePath}/downloads/#inton`}>Download and extract the ZIP for your platform.</a> Close your DAW and copy the plug-in to the folder listed in the README.</li>
        <li><p>Inton uses ODDsound’s <a href="https://github.com/ODDSound/MTS-ESP">MTS-ESP library</a> to share tuning between plug-ins. Thanks to ODDsound for making it available. Install the included MTS-ESP runtime if needed using the provided installer. The helper keeps an existing installation:</p>
          <ul>
            <li><strong>Windows:</strong> double-click <code>Install MTS-ESP.cmd</code> in the extracted folder. If prompted, allow the installer to make changes and follow its instructions.</li>
            <li><strong>macOS:</strong> double-click <code>Install MTS-ESP.command</code> in the extracted folder.</li>
            <li><strong>Linux:</strong> open a terminal in the extracted folder and run <code>bash scripts/install-mts.sh</code>.</li>
          </ul>
        </li>
      </ol>
    </>}
    manualTitle="Usage guide"
    manual={<>
      <h3>Usage</h3>
      <p>In your DAW, load Inton and an MTS-ESP-compatible instrument, enabling that instrument’s MTS tuning option if needed. Use one active MTS master at a time.
Open the Library with the folder icon and select a scale. Try a few chords with a sawtooth patch, then return to 12 EDO to compare with ordinary twelve-note equal temperament.</p>
      <h3>Build a scale set</h3>
      <p>The list icon opens Scale set. Use the + row to add another scale, or drag a Library preset onto the Scale set tab. Click a slot’s dot or double-click its row to activate it.</p>
      <h3>Automate tuning changes</h3>
      <p>Automate <strong>Set position</strong> in your DAW to choose a scale. <strong>Morph</strong> sets how long the transition takes: zero switches immediately; a longer time lets held notes glide into the new tuning.</p>
      <p>A set holds up to 32 scales. Your DAW project saves the scales and keyboard mappings; it does not need the original files to reopen them.</p>
      <h3>Edit and transpose</h3>
      <p>Close the Library and use the cog beside the scale title to edit a copy. Apply keeps your changes; Cancel discards them. The original Library file stays unchanged.</p>
      <p>Set the reference frequency and transposition in the footer. Click <strong>oiko audio</strong> for interface scaling and the Listening guide, or use the moon and sun to switch themes.</p>
      <h3>Resize the interface</h3>
      <p>Drag the bottom-right corner to choose a size from 50% to 200% in 25% steps. Release to resize the window, or press Escape to cancel. The plug-in remembers your chosen size.</p>
      <h3>If the tuning is not changing</h3>
      <p>Check that the instrument supports MTS-ESP and has it enabled. If Inton says Unavailable, install the included runtime and restart your DAW. If it says Tuning blocked, check for another active MTS master.</p>
    </>}
    releases={<>
      <h3>0.5.0-beta.1</h3>
      <p>Wow, Weft and Inton now share one release version. These plugins are still maturing; sound, controls and automation mappings may change between beta releases. Keep the previous plugin version and a backup of existing projects before updating.</p>
      <ul><li>Corner-drag resizing from 50% to 200%, with the chosen size restored when reopening the editor.</li><li>Updated shared editor and host integration, including macOS window sizing.</li></ul>
      <p>Parameter identities and Scale set slot numbering are unchanged. Check tuning recall and automated scale changes before saving over an existing project. Archives include the MTS-ESP runtime and installation instructions.</p>
      <h3>0.4.0-beta.1</h3>
      <ul>
        <li>Reworked scale browsing, editing and undo handling.</li>
        <li>Fixed parameter handling when modulation pushes a control beyond its limits.</li>
      </ul>
      <h4>Shared fixes</h4>
      <ul>
        <li>CLAP automation events now retain their position within the audio block.</li>
        <li>State loading checks incoming data as it arrives, avoiding large allocations based on an invalid size.</li>
      </ul>
      <p>Builds are unsigned; macOS builds are not notarized.</p>
      <h3>0.3.80 · Public alpha</h3>
      <p>Free CLAP and VST3 downloads for Linux x86-64, macOS Apple Silicon and Intel, and Windows x86-64. Each ZIP includes the official ODDsound MTS runtime and installation instructions.</p>
      <p>The macOS plug-ins are not notarized.</p>
    </>}
  />;
}
