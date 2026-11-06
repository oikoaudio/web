import type { Metadata } from 'next';
import { DocumentShell } from '../../../document-shell';
import { tackTabs } from '../tabs';
import { LEGEND, PANEL, SECTIONS } from './sheet-data';
import '../fm1-doc.css';

export const metadata: Metadata = { title: 'Tack for the FM-1 cheat sheet | Oiko Audio', description: 'Every key, hold and dial of Tack on the M-VAVE FM-1 on one page, with the panel drawn to scale. Prints on one landscape A4 sheet.' };

export default function TackCheatSheet() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <DocumentShell product="Tack" section="Manual" tabs={tackTabs('sheet')}>
    <div className="fm1-doc fm1-sheet">
      <section id="sheet">
        <h2>Cheat sheet</h2>
        <p>Every key, hold and dial on one page. It prints on one landscape A4 sheet from the browser. The <a href={`${basePath}/manuals/tack-fm1/maps/`}>mode maps</a> take one mode at a time.</p>
        <div className="fm1-figure fm1-panel" dangerouslySetInnerHTML={{ __html: PANEL + LEGEND }} />
      </section>
      <section dangerouslySetInnerHTML={{ __html: SECTIONS }} />
    </div>
  </DocumentShell>;
}
