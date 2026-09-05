import type { Metadata } from 'next';
import { DocumentShell } from '../../document-shell';
import { WeftManualContent } from '../../product-content';

export const metadata: Metadata = { title: 'Weft manual | Oiko Audio', description: 'Draw and capture curves, use Transform and Flip, play notes, and undo edits in Oiko Weft.' };

export default function WeftManual() {
  return <DocumentShell product="Weft" section="Manual"><WeftManualContent /></DocumentShell>;
}
