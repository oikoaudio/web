import type { Metadata } from 'next';
import { DocumentShell } from '../../document-shell';
import { TackManualContent } from '../../tack-content';

export const metadata: Metadata = { title: 'Tack for the FM-1 manual | Oiko Audio', description: 'Keys, pages, sequencer, kits, MIDI clock and USB audio for Tack on the M-VAVE FM-1.' };

export default function TackManual() {
  return <DocumentShell product="Tack" section="Manual"><TackManualContent /></DocumentShell>;
}
