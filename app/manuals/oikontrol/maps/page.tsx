import type { Metadata } from 'next';
import { DocumentShell } from '../../../document-shell';
import { oikontrolTabs } from '../tabs';
import { MODES } from './maps-data';
import './fire-doc.css';

export const metadata: Metadata = { title: 'Oikontrol Akai Fire control map | Oiko Audio', description: 'What every button, encoder and pad on the Akai Fire does in Oikontrol, drawn on the Fire panel and arranged by mode.' };

export default function OikontrolMaps() {
  const manual = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/manuals/oikontrol/`;
  return <DocumentShell product="Oikontrol" section="Manual" tabs={oikontrolTabs('maps')}>
    <div className="fire-doc">
      <section id="maps">
        <h2>Akai Fire control map</h2>
        <p>What every button, encoder and pad on the Fire does, drawn on the panel. The Fire changes role from mode to mode, so the map has one panel per mode. On each, the button that takes you there is <span className="fire-key e">blue</span>, the controls that do something particular in that mode are ringed in <span className="fire-key m">orange</span>, the pad areas are tinted <span className="fire-key p">green</span>, and controls that work the same in every mode are <span className="fire-key s">grey</span>. The <a href={manual}>manual</a> has the details.</p>
        <nav className="fire-nav" aria-label="Modes">{MODES.map((m) => <a key={m.key} href={`#${m.key}`}>{m.title}</a>)}</nav>
      </section>
      {MODES.map((m) => <section key={m.key} id={m.key} className="fire-mode">
        <div className="fire-mode-head">
          <kbd className="cap" aria-hidden="true">{m.entry}</kbd>
          <div><h2>{m.title}</h2><p className="fire-how">Get there: <span dangerouslySetInnerHTML={{ __html: m.how }} /></p></div>
        </div>
        <p dangerouslySetInnerHTML={{ __html: m.intro }} />
        <div className="fire-figure" dangerouslySetInnerHTML={{ __html: m.svg }} />
        <ul className="fire-notes">{m.notes.map((n, i) => <li key={i} dangerouslySetInnerHTML={{ __html: n }} />)}</ul>
        <p className="fire-more"><a href={`${manual}#${m.manual}`}>{m.title} in the manual</a></p>
      </section>)}
    </div>
  </DocumentShell>;
}
