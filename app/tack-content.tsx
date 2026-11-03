/* eslint-disable @next/next/no-img-element */
import './tack/fm1/tools.css';

export const tackRepo = 'https://github.com/oikoaudio/tack';

function Screens({ shots }: { shots: { name: string; alt: string; caption: string }[] }) {
  const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/tack-`;
  return <div className="tack-screens">
    {shots.map((shot) => <figure key={shot.name}>
      <a href={`${base}${shot.name}.png`}><img src={`${base}${shot.name}-240.png`} alt={shot.alt} width={240} height={240} loading="lazy" /></a>
      <figcaption>{shot.caption}</figcaption>
    </figure>)}
  </div>;
}

export function TackStartContent() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <>
    <p>Tack replaces the firmware of an M-VAVE FM-1 with a seven-voice drum synth and a step sequencer. It is a whole firmware, so the FM-1&apos;s own synth is gone while Tack is on it.</p>
    <p>The voices, the FX and the sequencer come from the LXR firmware by Sonic Potions and Erica Synths, compiled for the FM-1&apos;s chip and extended. The panel and the screens are new. Tack is not made or endorsed by Erica Synths or M-VAVE.</p>
    <h3>A first pattern</h3>
    <ol>
      <li><a href={`${basePath}/tack/fm1/install/`}>Install Tack</a> from Chrome or Edge. Read the status section below first.</li>
      <li>Press <b>HOME</b> for the overview. One of the first seven black keys picks a voice.</li>
      <li>Press white keys to set steps on that voice, then press <b>PLAY</b>.</li>
      <li>Turn <b>K1</b> to <b>K4</b> for its pitch, filter, decay and volume.</li>
      <li>Hold a step and turn a dial to lock that value to the step.</li>
      <li>Stop, press <b>SAVE</b> to see what it will write, and press it again.</li>
    </ol>
    <dl className="manual-list">
      <div><dt>Voices</dt><dd>Three drums, a snare, a cymbal, and closed and open hats, each with its own synth parameters.</dd></div>
      <div><dt>Sequencer</dt><dd>Seven lanes of up to 64 steps, each with its own length. Steps have velocity, nudge, flam, chance, recurrence and up to eight parameter locks.</dd></div>
      <div><dt>Patterns</dt><dd>16 patterns, chains that loop, and one song of up to 63 rows.</dd></div>
      <div><dt>USB</dt><dd>Stereo or 10 channel audio, MIDI notes, and MIDI clock in.</dd></div>
      <div><dt>Kits</dt><dd>128 slots for kits in the LXR-02&apos;s <code>.SND</code> format. None come with Tack.</dd></div>
    </dl>
  </>;
}

export function TackManualContent() {
  return <>
    <section id="controls">
      <h2>Keys and buttons</h2>
      <dl className="manual-list">
        <div><dt>White keys</dt><dd>The 16 steps of the bar showing, on release.</dd></div>
        <div><dt>Black keys 1 to 7</dt><dd>Pick a voice and play it. With REC running they record it. With SEQ held they pick it silently, and with ARP held they mute it.</dd></div>
        <div><dt>Black key 8</dt><dd>ROLL while held. The rate is on GLO.</dd></div>
        <div><dt>Black key 11</dt><dd>COPY. Hold it and press a white key to copy this pattern onto that one.</dd></div>
        <div><dt>K1 to K4</dt><dd>Whatever the screen shows above them.</dd></div>
        <div><dt>SELECT, ALGORITHM, PRESET</dt><dd>Tempo, morph and kit. With <b>SEL</b> held, <b>SELECT</b> is the shuffle, which is also on GLO. In the bars view and NOTE, SELECT walks the steps, and with <b>SEL</b> held it jumps a bar, and ALGORITHM nudges the selected one.</dd></div>
        <div><dt>OCT- and OCT+</dt><dd>Bars 1 to 4. In NOTE they move the keys up to three octaves. On a sound page, hold one to bring its row onto the dials.</dd></div>
        <div><dt>HOME</dt><dd>The overview, from anywhere.</dd></div>
        <div><dt>SEQ</dt><dd>The last detail view, the bars view or NOTE. Tapped in one, the other. Hold it with a white key for a pattern.</dd></div>
        <div><dt>EDIT, ENV, LFO, FX, GLO, ARP</dt><dd>Open a page. A second press moves to the page&apos;s next screen if it has one, and otherwise does nothing. ARP opens the selected lane.</dd></div>
        <div><dt>PLAY, REC</dt><dd>Start and stop, and live recording.</dd></div>
        <div><dt>SAVE</dt><dd>Opens the save page. A second press writes what it says. <b>SEL</b> and <b>SAVE</b> together write your changes at once.</dd></div>
      </dl>
      <p>Light on a voice key means: bright, the selected voice. Middle, this pattern has steps on it. Glow, an empty lane. Dark, muted. Each key flashes as its voice plays.</p>
      <p>On a page, a line under a label marks each of K1 to K4, from left to right, and a dial with nothing to do there has none. On HOME the four dials are always K1 to K4. Hold <b>SEL</b> on its own for a second to list what it does on the current page.</p>
    </section>

    <section id="overview-page">
      <h2>The overview</h2>
      <p><b>HOME</b> shows all seven lanes with their lengths, playheads and mutes, and each step&apos;s height is its velocity. Below them are the selected voice&apos;s four main dials and its envelope. Above the grid are the transport, REC, <code>SW</code> and the shuffle amount when it isn&apos;t 0, and four marks just above the grid: white for the bar it shows, grey for the other bars in use, and dim for the room to add more. <code>FX</code> shows there if the voice goes to the FX.</p>
      <p>Bottom right are the 16 patterns in the white keys&apos; order: the one playing is lit, those with steps are grey, and the one queued has an outline. Above them is what&apos;s playing: <code>PATTERN 1</code>, or the row of the chain or song, such as <code>CHAIN 1/3</code>. To its right, <code>NEXT 2</code> shows a queued pattern.</p>
      <Screens shots={[{ name: 'overview', alt: 'The overview: seven rows of steps with velocity as height, the four main dials, the decay, and a map of the 16 patterns.', caption: 'HOME: all seven lanes.' }]} />
    </section>

    <section id="steps">
      <h2>Steps and locks</h2>
      <p>Press a white key to set or clear a step. Hold a step to work on it:</p>
      <dl className="manual-list">
        <div><dt>K1 to K4</dt><dd>Lock those values on the step, on the overview and the sound pages. A step holds eight locks. <b>EDIT</b> clears them.</dd></div>
        <div><dt>ALGORITHM</dt><dd>Nudge, on a ruler, in 24ths of a step. It moves one 24th at a time up to 9, for small changes of feel, then 12, 15, 18 and 21 either way. At 120 BPM a 24th is about 5 ms.</dd></div>
        <div><dt>PRESET</dt><dd>Chance.</dd></div>
        <div><dt>SELECT</dt><dd>Recurrence: a cycle of 1 to 8 passes. Then the first eight black keys pick the passes the step plays on.</dd></div>
      </dl>
    </section>

    <section id="bars-view">
      <h2>The bars view</h2>
      <p>Press <b>SEQ</b> for one voice&apos;s bar at a larger size, in the white keys&apos; order. Each step of the lane stands on a line, its height is velocity, and the ruler under it is its nudge. <code>L2</code> counts its locks, boxes show recurrence, and chance and flam show as text.</p>
      <p>A key, <b>SEL</b> or <b>SELECT</b> selects a step, and the top bar shows it as <code>S3</code>. K1 to K4 are then that step&apos;s velocity, nudge, flam and chance, with or without the key held. Nothing locks in this view, and it doesn&apos;t tune the sound. Use the overview for those.</p>
      <p><code>CHN</code> or <code>SONG</code> beside the voice&apos;s name means a chain or the song is picking the pattern, so the steps are whichever pattern is playing.</p>
    </section>

    <section id="note-mode">
      <h2>NOTE</h2>
      <p>Tap <b>SEQ</b> again for NOTE: the same grid and the same selected step, showing each step&apos;s note as a mark, with its velocity as a grey bar behind it. All 27 keys play the voice from F3 to G5.</p>
      <p>With <b>REC</b> off a key sets the selected step, turning it on if it was off, and stays there so you can try another. A step that is on keeps its velocity and chance, and its lit key clears it. Hold <b>SEL</b> to only listen. With REC on they write: stopped, step by step from the selected step, and running, live.</p>
      <dl className="manual-list">
        <div><dt>K1</dt><dd>The step&apos;s note.</dd></div>
        <div><dt>K2</dt><dd>The step&apos;s velocity.</dd></div>
        <div><dt>K3</dt><dd>How hard the keys write.</dd></div>
        <div><dt>K4</dt><dd>The step on or off.</dd></div>
      </dl>
      <p>NOTE carries on over EDIT, ENV and LFO, so the keys play the voice while the dials tune it. <b>HOME</b> ends it, and <b>SEQ</b> brings it back.</p>
      <p>A note is an offset from the kit&apos;s tuning. C4 means the kit&apos;s own pitch, not concert C4.</p>
      <Screens shots={[
        { name: 'bars', alt: 'The bars view: two rows of eight velocity bars, with velocity, nudge, flam and chance dials.', caption: 'SEQ: velocity as height, nudge on the ruler.' },
        { name: 'note', alt: 'NOTE: the same grid with note names on the steps, with note, velocity, key velocity and hit dials.', caption: 'SEQ again: the same steps as notes.' },
      ]} />
    </section>

    <section id="lanes">
      <h2>Lanes</h2>
      <dl className="manual-list">
        <div><dt>SEL or a voice&apos;s black key held</dt><dd>After a moment, the top bar shows that lane&apos;s length. The keys in the lane glow, the last step is lit, and keys past the end are off.</dd></div>
        <div><dt>Then a white key</dt><dd>That step becomes the lane&apos;s last, for polyrhythms. A black key plays its voice as you hold it, so use <b>SEL</b> to stay silent. While recording, only <b>SEL</b> does this.</dd></div>
        <div><dt>SEL held, OCT+ or OCT-</dt><dd>A bar more or less on the selected lane. A new bar starts as a copy of the one before, with its locks and recurrence. A bar that still has steps from when the lane was longer stays as it was.</dd></div>
        <div><dt>SEL and EDIT, held a second</dt><dd>Clears the lane.</dd></div>
      </dl>
      <p>Tap <b>ARP</b> for the selected lane&apos;s bars, with the white keys still its steps. Tapped again it moves on through three screens: LANE, EUCLID and VEL SHAPE.</p>
      <h3>LANE</h3>
      <dl className="manual-list">
        <div><dt>K1</dt><dd>The lane&apos;s length, 1 to 64. No step changes, so twelve-step lanes give you 12/8.</dd></div>
        <div><dt>K2</dt><dd>Direction: forward, reverse, ping-pong, bounce or random.</dd></div>
        <div><dt>K3</dt><dd>Speed: 1X, 1/2 or 1/4.</dd></div>
        <div><dt>K4</dt><dd>START, the step a pass begins from. The lane plays round from there, and no step moves.</dd></div>
        <div><dt>ALGORITHM</dt><dd>A nudge for the whole lane.</dd></div>
      </dl>
      <p>A direction changes the order of the steps within a pass, and passes start and end where they would going forward. Ping-pong turns at the end of each pass, so each end step plays twice and the lane stays on the bar. Bounce turns on the end steps, so a 16 step lane takes 30 steps there and back and drifts against the others. Random plays every step once a pass, in a new order each time.</p>
      <p>A pattern&apos;s length is its longest lane in steps at 1X, whatever the speed. So 16 steps at 1/2 take two bars and carry on across the pattern&apos;s repeats, but a pattern change or the next song row won&apos;t wait for them. Each pattern saves its own lanes&apos; direction, speed and start.</p>
      <Screens shots={[{ name: 'lane', alt: 'The lane page: the step bars, with length, direction, speed and start dials.', caption: 'ARP: how the lane plays.' }]} />
      <h3>EUCLID</h3>
      <p>K1 to K3 are the Euclidean length, hits and rotation. A turn rewrites which of the lane&apos;s steps are on, and sets its length. Velocity, locks and other settings stay on their steps. K4 puts the lane back as it was before the first turn. That works once, on the last lane you changed.</p>
    </section>

    <section id="morph">
      <h2>Morph</h2>
      <p>Morph blends the kit towards a second kit from the bank, with one dial. The kit itself doesn&apos;t change: the dials still show it and SAVE still writes it.</p>
      <dl className="manual-list">
        <div><dt>POLY held, PRESET</dt><dd>The tenth black key, printed POLY. Picks the kit to morph to, from NONE through the bank. The top bar says <code>MORPH TO</code> and its name.</dd></div>
        <div><dt>ALGORITHM</dt><dd>How far it goes. With steps on screen, in the bars view and NOTE, this dial stays the nudge.</dd></div>
        <div><dt>CC 1 on channel 1</dt><dd>The same, for a mod wheel or a DAW&apos;s automation.</dd></div>
      </dl>
      <p>Every sound parameter blends, so a wave or filter type steps through the ones between the two kits. An FX&apos;s type changes half way across. LFO and velocity targets and FX sends stay the kit&apos;s. Each pattern saves its second kit and how far it goes, so a song can move between them. While a second kit is set, HOME shows the two names with a crossfader between them.</p>
      <p>To keep a sound from between two kits, press <b>SAVE</b> and turn K4 to <code>BLEND</code>. LFO and velocity targets come from the first kit.</p>
      <Screens shots={[{ name: 'morph', alt: 'The overview with two kit names and a crossfader between them above the voice name.', caption: 'HOME with a second kit set.' }]} />
    </section>

    <section id="velocity-shapes">
      <h2>Velocity shapes</h2>
      <p>The third ARP screen, VEL SHAPE, is the velocity page. It writes a rhythm&apos;s accents into the selected lane&apos;s steps. The steps then hold those velocities, so they save and copy like any others, and you can edit any step by hand afterwards. Empty steps get a value too, so a step you add fits the shape.</p>
      <dl className="manual-list">
        <div><dt>K1</dt><dd>The shape, or OFF to put back the velocities from before you started. That works once, on the last lane you shaped.</dd></div>
        <div><dt>K2</dt><dd>The centre the accents swing around.</dd></div>
        <div><dt>K3</dt><dd>How far they swing.</dd></div>
        <div><dt>K4</dt><dd>Moves the shape later, step by step.</dd></div>
      </dl>
      <p>Each turn writes the whole lane again, so it replaces hand edits. The black keys pick the voice, and OCT shows the other bars.</p>
      <dl className="manual-list">
        <div><dt>METER, PHRASE</dt><dd>Strong and weak beats of a 16 step bar.</dd></div>
        <div><dt>SAMBA, PAILA, MARCHA, BOSSA</dt><dd>16 steps.</dd></div>
        <div><dt>CASCARA, SON, RUMBA</dt><dd>16 step patterns: the stick pattern, and the 3-2 son and rumba claves.</dd></div>
        <div><dt>MARTILLO, TUMBAO</dt><dd>8 steps, for a bongo or conga line.</dd></div>
        <div><dt>BEMBE</dt><dd>12 steps, the bell of a 12/8 bar. Give the lane a length of 12.</dd></div>
      </dl>
      <Screens shots={[{ name: 'velocity', alt: 'The velocity page: the step bars with a shape across them, and shape, centre, amount and shift dials.', caption: 'ARP three times: a shape written into the lane.' }]} />
    </section>

    <section id="patterns">
      <h2>Patterns, chains and the song</h2>
      <dl className="manual-list">
        <div><dt>SEQ held, one white key</dt><dd>Pattern 1 to 16. While running it changes when the longest lane reaches its end, counted at 1X. Let go of SEQ before picking the next pattern, because a second key while SEQ stays held makes a chain.</dd></div>
        <div><dt>SEQ held, several white keys</dt><dd>A chain, which loops until you pick one pattern. A chain isn&apos;t saved.</dd></div>
        <div><dt>SEQ held, ARP</dt><dd>The song, up to 63 rows of one pattern each. White keys fill the rows. K1 is the row, K2 its pattern or the end, K3 stop or loop, and K4 turns the song on or off. Picking one pattern turns the song off and keeps its rows.</dd></div>
        <div><dt>COPY on the SONG page</dt><dd>While a chain plays, a tap writes it over the rows from the selected one. The song&apos;s end and any rows after the chain stay.</dd></div>
      </dl>
      <p>A row plays its pattern once, so a repeat is a second row. Rows can&apos;t be inserted or deleted yet.</p>
    </section>

    <section id="sound">
      <h2>Sound pages</h2>
      <p><b>EDIT</b>, <b>ENV</b> and <b>LFO</b> show three rows of four. The dials work the middle row, and holding <b>OCT-</b> or <b>OCT+</b> brings the lower or upper row onto them. <b>EDIT</b> has a second screen.</p>
      <p><b>FX</b> has the sends, lit by the black keys, then the FX type, mix and two settings of that type. Hold <b>OCT-</b> for the rest.</p>
      <p><b>GLO</b> has tempo, shuffle, external MIDI clock, roll rate, and the <code>CPU</code>, <code>PEAK</code> and <code>XRUN</code> readings. With <b>OCT-</b> held, two more dials change the sound of everything, and the last one sets what the black keys do:</p>
      <dl className="manual-list">
        <div><dt>K2, RATE</dt><dd>Lowers every voice&apos;s sample rate, before the FX, so delay and distortion stay clean. The kit saves it.</dd></div>
        <div><dt>K3, BITS</dt><dd>Lowers the bit depth of the final mix, from 16 bits to 2, after the FX. Tails break into steps and cut to silence, and loud hits stay fairly intact. The pattern saves it.</dd></div>
        <div><dt>K4, PREVIEW</dt><dd>Sets whether the first seven black keys play their voice when pressed. Off, they only select it, except while <b>REC</b> is on. <b>SAVE</b> keeps it.</dd></div>
      </dl>
      <p><b>FX</b> runs one effect at a time: distortion, ring modulator, compressor, delay or reverb. The delay&apos;s <code>MODE</code> picks normal or ping-pong, each free or in sync. In sync, <code>TIME</code> picks a fraction of the bar from <code>1/32</code> to <code>1/2</code>, including dotted ones, and follows the tempo. The buffer holds about 0.74 seconds, or half that in ping-pong, so long fractions at slow tempos stop there. Picking the reverb starts its dials from a setting for drums. Its <code>MIX</code> is its level, added to the dry sound, which stays as it is. <code>PRE</code> is its pre-delay, <code>DECAY</code> its length, which rings for good at the top, <code>E/L MIX</code> the balance from early reflections on the left to the late tail on the right, and <code>LOW CUT</code> and <code>HIGH CUT</code> take 24 dB an octave off each end of it, set in hertz. The reverb is the heaviest of them on the CPU, so watch <code>PEAK</code> on <b>GLO</b>.</p>
      <p>The LXR has this reverb in its code but leaves it switched off. Tack turns it on and changes it. It is stereo, where the code had one output for both sides. Fixes to its delay lines and a slow movement inside the loop take out the flutter and growl of the tail. <code>LOW CUT</code> and <code>HIGH CUT</code> are new, and <code>MIX</code> adds to the dry sound in place of the crossfade the other FX use. It is also built to use less CPU than the LXR&apos;s code did on this chip.</p>
      <Screens shots={[
        { name: 'edit', alt: 'EDIT: three rows of oscillator dials and wave pictures.', caption: 'EDIT' },
        { name: 'env', alt: 'ENV: envelope pictures across decay, slope and level.', caption: 'ENV' },
        { name: 'fx', alt: 'FX: six send boxes, then FX type, mix and settings.', caption: 'FX' },
      ]} />
      <p>Each voice has its own LFO, and its target can be a parameter of any voice. With <code>SYNC</code> off, <code>FREQ</code> is a rate. With it on, <code>FREQ</code> picks a fraction of the bar, from <code>4/1</code> to <code>1/32</code>. Switching either way jumps to the nearest speed at the current tempo.</p>
      <p>With <code>ONCE</code> on, the LFO plays start to end each time <code>RETRIG</code>&apos;s voice fires, then leaves its target where you set it. If <code>RETRIG</code> is off, it takes its own voice. A rising wave dips the target and recovers, so <code>SAW UP</code> on a volume or on <code>FX MIX</code> ducks it, with <code>FREQ</code> setting how long. A falling wave rises and returns, which makes an extra envelope for any parameter.</p>
      <p>A random LFO with <code>RETRIG</code> on takes a new value each time that voice fires, and holds it until the next hit. At the lowest <code>FREQ</code> it changes only on hits, so a small <code>AMOUNT</code> varies each hit a little.</p>
    </section>

    <section id="kits">
      <h2>Kits</h2>
      <p>No kits come with Tack, because kits belong to the people who made them. Tack reads the <code>.SND</code> files an LXR-02 writes to its SD card, and <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tack/plugin/`}>the Tack plugin</a> writes the same files. Save from the full Tack plugin: a single-voice plugin saves only its own voice. <a href="https://www.ericasynths.lv/news/fresh-kits-and-patterns-lxr-02-hrtl">Erica Synths publishes kit packs</a> for the LXR-02, and third parties sell others.</p>
      <p><b>PRESET</b> copies a kit from the bank into the pattern, and on pages other than HOME the top bar names it for a moment. From then on the pattern keeps its own copy, with your edits and its name, and <b>SAVE</b> stores it with the pattern. The sound comes back with the pattern, and changing the bank doesn&apos;t change it. <b>SEL</b> and <b>HOME</b> held a second goes back to the kit as it is in the bank.</p>
      <p>One turn back from the bank&apos;s first kit is the init kit, a clean start. It is built into the firmware and is in no slot, so nothing overwrites it: <b>SAVE</b> puts a kit made from it in a free slot.</p>
      <p><b>SEL</b> held with <b>PRESET</b> mutates the whole kit, and <b>SEL</b> held with <b>ALGORITHM</b> mutates the selected voice. Each click forward is a small random change on top of the last, and turning back retraces the same path to where you started, up to 99 steps. Volume, pan, routing, modulation targets, filter type and the FX stay as they are. A wave changes only now and then. Any other edit starts a new walk from there, and <b>SAVE</b> keeps the result like any other edit.</p>
      <p>A new pattern with no steps plays on with the sound that&apos;s playing, and keeps it once you add steps or edit it. A copied pattern takes the sound with it.</p>
      <p><b>SAVE</b> opens one page, and K4 picks what it saves. K1 or <b>SELECT</b> picks the slot. A second <b>SAVE</b> writes it, with the sequencer stopped, and any page button leaves without writing.</p>
      <dl className="manual-list">
        <div><dt>PTRN</dt><dd>On the pattern&apos;s own slot, saves every changed pattern with its kit, the song and the tempo. On another slot, which the white keys also pick, it&apos;s save as: the pattern and its kit go there, and you carry on there.</dd></div>
        <div><dt>BLEND</dt><dd>With morph above 0, saves what you hear as a new kit in the bank. The pattern stays on its two kits.</dd></div>
        <div><dt>KIT</dt><dd>Saves the kit to the bank, starting on its own slot if it came from there. A slot in use shows the name you would replace, and an empty one shows the kit&apos;s. K2 moves the cursor along the name and K3 changes the letter. <b>OCT-</b> clears the name and <b>OCT+</b> picks a random one. Once you change the name, picking another slot keeps it. A kit can&apos;t be saved without a name.</dd></div>
      </dl>
      <p>The <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tack/fm1/kits/`}>kit bank page</a> replaces the bank with up to 128 kits from <code>.SND</code> files, a folder or a <code>.zip</code>, and saves the bank to a <code>.zip</code>. It works in Chrome or Edge.</p>
    </section>

    <section id="sync">
      <h2>MIDI and clock</h2>
      <p>On MIDI channel 1, notes 60 to 66 play the voices. Notes 0 to 15 and Program Change 0 to 15 pick a pattern.</p>
      <p>Turn on external clock on <b>GLO</b> to follow MIDI Beat Clock over USB. Tack takes Start, Stop and Continue, so <b>PLAY</b> does nothing and says so. It ignores MIDI Time Code and Song Position Pointer, so a DAW that starts mid-bar isn&apos;t followed to its position.</p>
      <p>Tack runs its own clock, locked to the pulses, so jitter on the pulses doesn&apos;t reach the steps. The lock takes 12 pulses, and a gap of three pulses or more starts it again.</p>
      <p>MIDI out is USB only. Notes that arrive go back out on the voice&apos;s channel, so a DAW track that sends Tack its own output plays voices twice.</p>
    </section>

    <section id="usb-audio">
      <h2>USB audio</h2>
      <p>Every power-on is stereo. <b>GLO</b> with <b>OCT-</b> held switches USB audio, with the sequencer stopped:</p>
      <div className="doc-table compact-table">
        <div><b>1-2</b><span>The master</span><span /></div>
        <div><b>3-8</b><span>D1 D2 D3 SN CY HH</span><span>Each as it leaves the voice, so a voice sent to the FX is dry here</span></div>
        <div><b>9-10</b><span>The FX bus</span><span>Dry and wet, of the voices sent to it</span></div>
      </div>
      <p>Audio is 44.1 kHz only. The engine runs at exactly that rate on the FM-1, where the LXR-02 and the Tack plugin run at 44,140 Hz. Its pitches and times follow the rate it is built for, and renders of the factory kits match the plugin&apos;s as closely as two renders of the same sound do, apart from a slightly different top end above 16 kHz.</p>
      <p>Switching re-enumerates the FM-1, so USB MIDI goes for a moment and a DAW can lose its links. Switch before starting the DAW&apos;s audio engine. With no host after 8 seconds it goes back to stereo. On <b>GLO</b> with <b>OCT+</b> held, <code>DROPS</code> counts lost packets, and each one is a click.</p>
      <p>Saving on the FM-1 while it streams USB audio is experimental. On some computers the save interrupts the stream, the recording then stays garbled, and it recovers only when the recording application restarts. Stop recording before you save.</p>
    </section>

    <section id="updates">
      <h2>Updating and going back</h2>
      <p>The <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tack/fm1/install/`}>install page</a> updates Tack over USB from Chrome or Edge. Back up first on the <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tack/fm1/backup/`}>backup page</a>. A backup holds the patterns, the song, the settings and the startup kit, but not the kit bank, which the <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tack/fm1/kits/`}>kit bank page</a> saves.</p>
      <p>The install page&apos;s last section writes M-VAVE&apos;s firmware back. Saved patterns and kits can be lost in that step.</p>
    </section>

    <section id="troubleshooting">
      <h2>Troubleshooting</h2>
      <dl className="manual-list faq-list">
        <div><dt>The black keys don&apos;t pick voices</dt><dd>In NOTE and on the sound pages reached from it, the keys are notes. Press <b>HOME</b>, or hold <b>SEQ</b> and press the black key.</dd></div>
        <div><dt>SAVE says STOP FIRST</dt><dd>Stop the sequencer. Saving stops the sound for a moment, so it doesn&apos;t run during playback.</dd></div>
        <div><dt>The installer doesn&apos;t find the FM-1</dt><dd>Use Chrome or Edge, allow MIDI when asked, use a data cable straight into the computer, and close anything else using the FM-1&apos;s MIDI port.</dd></div>
        <div><dt>The FM-1 doesn&apos;t start after an install</dt><dd>After two failed starts it waits in the chip&apos;s own update mode. <a href="https://github.com/hugelton/felucca-bsp/tree/main/tools">fm1_rescue</a> puts stock firmware back from a Mac or Linux computer. Then install again.</dd></div>
        <div><dt>A DAW loses the FM-1 after a save in 10 channel mode</dt><dd>Saving during a stream can stall USB audio. Save while the stream is stopped, or restart the DAW&apos;s audio engine.</dd></div>
      </dl>
    </section>
  </>;
}

export function TackStatusContent() {
  return <>
    <p>This is a developer preview. It has run on one FM-1, so expect rough edges, and expect the panel to change between versions. Patterns saved in one version may not load in the next.</p>
    <dl className="manual-list">
      <div><dt>Run on a real FM-1</dt><dd>Installing and updating over a unit that came from V15, and going from Tack back to V15 and returning. Sound, saving, a power cycle, kit upload and switching, backup and restore, stereo and 10 channel USB audio, and following a DAW&apos;s MIDI clock.</dd></div>
      <div><dt>Mostly in the simulator</dt><dd>NOTE, chains, the song, and the external clock&apos;s step timing have test scripts and light use on the unit, but no long sessions.</dd></div>
      <div><dt>Not tested</dt><dd>Installing on an FM-1 with M-VAVE&apos;s V16 bootloader. A long playing run. TRS MIDI, hat choke and MIDI out from the sequencer.</dd></div>
    </dl>
  </>;
}

export function TackCreditsContent() {
  return <>
    <p>Tack is Swedish for <b>Thank you</b>.</p>
    <p>Tack&apos;s engine and sequencer are the LXR firmware by Erica Synths and Sonic Potions, under GPL-3.0. It is built on fm1-base and felucca-bsp, from Felucca by Leo Kuroshita, with work by Charles Vestal. USB audio&apos;s 10 channels follow Acid Moogi by Tom Perez. The BEMBE shape comes from the <a href="https://magenta.tensorflow.org/datasets/groove">Groove MIDI Dataset</a> by Gillick, Roberts, Engel, Eck and Bamman, under CC BY 4.0.</p>
    <p>LXR and Erica Synths are trademarks of Erica Synths. M-VAVE and FM-1 are trademarks of their respective owners. Tack is modified firmware and is not affiliated with either.</p>
    <p>Tack comes with no warranty. Replacing a device&apos;s firmware is at your own risk.</p>
  </>;
}
