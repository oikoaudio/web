import type { Metadata } from 'next';
import { DocumentShell } from '../../../document-shell';
import { tackTabs } from '../tabs';
import { MODES } from './maps-data';
import '../fm1-doc.css';

export const metadata: Metadata = { title: 'Tack for the FM-1 mode maps | Oiko Audio', description: 'Each of Tack’s modes on a drawing of the M-VAVE FM-1 panel: the key that takes you there, and what every control does in it.' };

export default function TackMaps() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <DocumentShell product="Tack" section="Manual" tabs={tackTabs('maps')}>
    <div className="fm1-doc">
      <section id="maps">
        <h2>Mode maps</h2>
        <p>One map for each mode. The key that takes you there is blue; the controls that matter there are ringed in orange. Each screen is Tack’s own, in that mode. The <a href={`${basePath}/manuals/tack-fm1/cheat-sheet/`}>cheat sheet</a> has every key on one page, and the <a href={`${basePath}/manuals/tack-fm1/`}>manual</a> the details.</p>
        <nav className="fm1-nav" aria-label="Modes">{MODES.map((m) => <a key={m.key} href={`#${m.key}`}>{m.title}</a>)}</nav>
      </section>
      {MODES.map((m) => <section key={m.key} id={m.key} className="fm1-mode">
        <div className="fm1-mode-head">
          <div className="fm1-beacon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: m.caps }} />
          <div><h2>{m.title}</h2><p className="fm1-how">Get there: {m.how}</p></div>
        </div>
        <p>{m.intro}</p>
        <div className="fm1-figure" dangerouslySetInnerHTML={{ __html: m.svg }} />
      </section>)}
    </div>
  </DocumentShell>;
}
