function WeftKnownIssues() {
  return <ul>
    <li>Changing Resolution clears the processing buffers and briefly interrupts the sound.</li>
    <li>Bitwig Studio 6.1 may keep the old latency after a Resolution change in CLAP. Deactivate and reactivate Weft after changing it, especially before exporting. VST3 updates latency correctly in the reported tests.</li>
    <li>In REAPER on Linux, the CLAP editor may be blank on its first opening. Toggle REAPER&apos;s UI control off and back on.</li>
    <li>Weft reads note changes once per audio block and updates their effect at the FFT frame rate. Resolution sets the shortest possible attack and release.</li>
    <li>The beta builds are unsigned, and the macOS builds are not notarized.</li>
  </ul>;
}

export function WeftStartContent() {
  return <>
    <p>Try Weft on a drum loop, a textured synth or any sound with plenty of frequencies to work with. Draw a few cuts in the graph and listen to what comes through. Hold Shift as you draw for a softer brush.</p>
    <p>To bring out a chord, raise Note Depth and click a few piano keys. Those notes pick out regions of the sound already playing. Try changing the notes while the loop repeats, or send MIDI into Weft and play them from a keyboard.</p>
    <p>For another starting point, click Capture while audio plays, then click it again to keep that spectral shape. Draw over it, reshape it with Transform, or Flip its peaks into valleys.</p>
    <p>With both Depth controls at 0 dB, a flat curve and Output at 0 dB, the audio passes through unchanged apart from processing latency. That gives you a useful starting point for hearing what each part adds.</p>
  </>;
}

export function WeftExplainerContent() {
  return <section className="technical-explainer" id="how-notes-shape-the-spectrum">
    <h2>How notes shape the spectrum</h2>
    <p>Each note in Weft opens a family of harmonic regions in the incoming audio. Their width follows musical intervals, while pitch bend, pressure and timbre reshape each note&apos;s contribution.</p>
    <p>Musical pitches usually fall between the fixed frequency bins of an FFT. Weft compensates for that alignment so narrow note openings retain their strength across the keyboard. Resolution still determines how finely nearby frequencies can be separated.</p>
  </section>;
}

export function WeftManualContent({ includeStart = true }: { includeStart?: boolean } = {}) {
  return <>
    {includeStart && <section><h2>Start here</h2><WeftStartContent /></section>}
    <section>
      <h2>Reshape with spectral precision</h2>
      <p>Drag in the graph to set each frequency bin&apos;s gain. Hold Shift for a soft circular brush. The small selector at the top left changes the drawing range: 30, 60, 90 or 144 dB. At the bottom of the 144 dB view, −∞ means those bins are silent. Reset clears the curve without changing the other controls.</p>
      <p>Click Transform, or hold Alt, to reshape the curve:</p>
      <ul>
        <li>Drag the bottom edge vertically to change the depth of the cuts.</li>
        <li>Drag either side vertically to tilt around 1 kHz.</li>
        <li>Drag inside the graph horizontally to shift the curve up or down in frequency.</li>
      </ul>
      <p>When you let go, the result becomes the new curve and the handles return to neutral. You can draw over it normally. Escape cancels the active drag and leaves Transform mode.</p>
      <p>A transform can move parts of the curve outside the graph. Dashed red marks show where it continues. Those parts keep their shape, and another transform can bring them back. Values above 0 dB add no gain to the base curve. Values at or below -144 dB silence their bins.</p>
    </section>
    <section>
      <h2>Capture, Flip and curve files</h2>
      <p>Click Capture to average the incoming spectrum, then click it again to stop. Watch the preview build while audio plays. Weft sets the strongest captured region to 0 dB and uses the result as the new curve. Capture reads the input before Motion and Note Control, so their settings stay as they were.</p>
      <p>A short capture gives you a snapshot. Leave it running through a phrase to capture more of the track. Escape discards an unfinished capture. Reset cancels it and clears the curve.</p>
      <p>Flip turns peaks into valleys within the existing range. Flip twice to get back to the original. To make room for one track in another, capture the first track, Flip, then Copy. Paste the curve into Weft on the second track and adjust its depth with Transform. The cut stays fixed until you edit it.</p>
      <p>The Curve menu has Copy, Paste, Save and Load. These transfer only the curve, leaving notes and other settings alone. Files use the .weftcurve extension. When you load one at a different sample rate, Weft keeps the cuts at the same frequencies. Stop Capture before using Transform, Flip, Paste or Load.</p>
    </section>
    <section>
      <h2>Play or pin notes</h2>
      <p>Raise Note Depth, then click the piano keys to pin notes. Click an active key again to remove it, or drag across keys to add or remove several. The Reset beside the keys clears the pinned notes.</p>
      <p>You can also route MIDI or note events into Weft while it processes audio. Play over a pinned chord, or use live notes alone. In a host with hybrid tracks, put Weft after the sound source. Otherwise, send a MIDI track to the track or plugin carrying the audio. The routing controls depend on your DAW.</p>
      <p>Hold keeps the notes you are playing, plus any new notes that arrive. Turn it off to release them. Notes you pinned by hand stay. Notes still held on an external keyboard keep playing too. You can remove held notes by clicking their piano keys.</p>
      <dl className="manual-list">
        <div><dt>Depth</dt><dd>At 0 dB, Note Control is neutral. Raise it to lower the background around the notes and make their regions stand out.</dd></div>
        <div><dt>Width</dt><dd>Sets the spread around each note, in cents.</dd></div>
        <div><dt>Partials</dt><dd>Opens up to 24 harmonics per note. A value of 1 uses only the fundamental.</dd></div>
        <div><dt>Partial Rolloff</dt><dd>Sets how much quieter the upper partials become per octave.</dd></div>
        <div><dt>Attack / Release</dt><dd>Control how note regions open and close. The displayed times include the selected Resolution&apos;s minimum response time.</dd></div>
        <div><dt>Vel Sens</dt><dd>At 0%, all notes act at full strength. Raise it to follow velocity. Clicked notes use 50% velocity, so you can pin a quieter chord and play louder notes over it.</dd></div>
      </dl>
    </section>
    <section>
      <h2>Expression and sustain</h2>
      <p>Pitch bend or per-note tuning moves a note and its partials. Pressure and per-note volume change its strength. Timbre or CC74 changes the partial rolloff for that note. The Bend control sets the pitch-bend range.</p>
      <p>Weft follows CLAP note expression and MIDI/MPE channel expression whenever the host sends them. There is no MPE switch. A sustain pedal holds released notes on its own MIDI channel until the pedal comes up. It leaves pinned notes alone.</p>
    </section>
    <section>
      <h2>Spectral motion</h2>
      <p>Start with Depth. At 0 dB, motion has no effect. Raise it to hear the selected shape move across the spectrum.</p>
      <p>Drift moves broad, irregular shapes. Try Ripple or Saw for repeating patterns. Harmonic opens a comb of frequencies, Scan moves an opening and Notch moves a cut. Splash sends an expanding cut out from each incoming note.</p>
      <p>Use Free for a rate in hertz or Sync for beat divisions. Phase offsets the cycle, Size changes its width or spacing, and Direction selects forward, reverse or alternating movement. The fastest rates depend on Resolution.</p>
    </section>
    <section>
      <h2>Resolution and output</h2>
      <p>Mode selects the FFT resolution, from Rough to Precise. Lower settings respond faster. Higher settings separate nearby frequencies more finely but add latency. Resolution cannot be automated.</p>
      <p>Smooth blends neighbouring spectral bins and adds 30 ms of mask smoothing. It changes the sound. The Shift brush only changes how you draw.</p>
      <p>Output sets the final level. The thin meter above it measures the outgoing audio and turns orange at 0 dBFS. It is not a limiter.</p>
    </section>
    <section>
      <h2>Undo and saved settings</h2>
      <p>The bent-arrow buttons undo and redo parameters, curve edits and pinned notes. A complete drag is one step, whether you move a slider, draw a stroke or drag across several keys.</p>
      <p>Use Ctrl+Z to undo and Ctrl+Shift+Z to redo while Weft is focused. On macOS, use Cmd instead of Ctrl. When typing a number, these shortcuts edit the text.</p>
      <p>Incoming MIDI, host automation, theme, zoom and graph range stay out of this history. Weft&apos;s local undo is separate from your DAW&apos;s project undo.</p>
      <p>Your DAW saves the parameters, curve and pinned notes with the project. Duplicating the device copies them too.</p>
    </section>
    <section id="faq">
      <h2>Installation and display</h2>
      <p>Copy the formats you use into their matching folders, then rescan plugins in your DAW. Keep plugin bundles intact rather than copying the files inside them.</p>
      <div className="doc-table compact-table">
        <div><b>macOS</b><code>~/Library/Audio/Plug-Ins/CLAP</code><code>~/Library/Audio/Plug-Ins/VST3</code></div>
        <div><b>Windows</b><code>C:\Program Files\Common Files\CLAP</code><code>C:\Program Files\Common Files\VST3</code></div>
        <div><b>Linux</b><code>~/.clap</code><code>~/.vst3</code></div>
      </div>
      <p>Click OIKO AUDIO in the title bar to choose a size from 50% to 200%. The sun or moon button changes the theme.</p>
    </section>
    <section><h2>Known issues</h2><WeftKnownIssues /></section>
  </>;
}

export function WeftReleaseContent() {
  return <>
    <section className="release-entry">
      <div className="release-heading"><h2>0.1.1-beta3</h2><time dateTime="2026-09-04">4 September 2026</time></div>
      <ul>
        <li>Capture the spectral contour of incoming audio.</li>
        <li>Transform the curve using depth, tilt and frequency position controls.</li>
        <li>Flip curves to turn peaks into valleys and carve out space.</li>
        <li>Save, load, copy and paste curves.</li>
        <li>Hold Shift to draw with a soft circular brush.</li>
        <li>Added undo and redo for parameters, curves and pinned notes. Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z.</li>
        <li>MIDI sustain pedal input now holds released notes.</li>
        <li>Increased the graph range to −144 dB, where Weft fully mutes the affected bins.</li>
        <li>Updated control defaults, cursor and transform hints, note highlights, output metering, and the manual.</li>
      </ul>
      <p>CLAP and VST3 for Linux, Windows and universal macOS.</p>
    </section>
    <section className="release-entry">
      <div className="release-heading"><h2>0.1.1-beta2</h2></div>
      <p>Improved macOS interface scaling and resizing.</p>
    </section>
    <section className="release-entry">
      <div className="release-heading"><h2>0.1.1-beta1</h2><time dateTime="2026-08-30">30 August 2026</time></div>
      <p>First public beta: spectral drawing, pinned and incoming notes, note expression, spectral motion and five FFT resolutions. The original Freeze function has since been replaced by Capture.</p>
    </section>
    <section><h2>Known issues</h2><WeftKnownIssues /></section>
  </>;
}
