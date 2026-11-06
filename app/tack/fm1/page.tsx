import type { Metadata } from 'next';
import { ProductPage } from '../../product-page';
import { tackRepo, TackStartContent, TackManualContent, TackStatusContent, TackCreditsContent } from '../../tack-content';

const description = 'Tack is a seven-voice drum synth and step sequencer for the M-VAVE FM-1, installed from the browser. Free software, GPL-3.0.';

export const metadata: Metadata = {
  title: 'Tack for the FM-1 | Oiko Audio',
  description,
  alternates: { canonical: '/tack/fm1/' },
  openGraph: { title: 'Tack for the FM-1 | Oiko Audio', description, images: [] },
  twitter: { card: 'summary', title: 'Tack for the FM-1 | Oiko Audio', description, images: [] },
};

export default function TackPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <ProductPage
    product="Tack"
    title="TACK FM-1"
    stage="beta"
    download={false}
    startButton={false}
    links={[{ label: 'Install', href: `${basePath}/tack/fm1/install/`, primary: true }, { label: 'Try it', href: `${basePath}/tack/fm1/try/` }, { label: 'Back up', href: `${basePath}/tack/fm1/backup/` }, { label: 'Kit bank', href: `${basePath}/tack/fm1/kits/` }, { label: 'Read the manual', href: `${basePath}/manuals/tack-fm1/` }, { label: 'Cheat sheet', href: `${basePath}/manuals/tack-fm1/cheat-sheet/` }, { label: 'Mode maps', href: `${basePath}/manuals/tack-fm1/maps/` }, { label: 'Source on GitHub', href: tackRepo }]}
    line="A drum synth for the M-VAVE FM-1."
    description="Seven synthesised voices and a step sequencer with parameter locks, Euclidean lanes, chance, recurrence, velocity shapes, and a direction and speed for each lane. It installs from the browser and sends 10 channels of USB audio."
    screenshot={{ pixel: true, darkSrc: '/images/tack-overview-240.png', brightSrc: '/images/tack-overview-240.png', darkWidth: 240, darkHeight: 240, brightWidth: 240, brightHeight: 240, alt: 'The FM-1 screen running Tack: seven lanes of steps, with pitch, filter, decay and volume below.' }}
    startHere={<TackStartContent />}
    manualDescription="Every key, page and mode."
    manual={<TackManualContent />}
    sections={[
      { id: 'status', index: 'STATUS', title: 'Status', description: 'What is tested, and what to expect.', content: <TackStatusContent /> },
      { id: 'credits', index: 'CREDITS', title: 'Credits', content: <TackCreditsContent /> },
    ]}
  />;
}
