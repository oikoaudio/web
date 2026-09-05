import type { Metadata } from 'next';
import { DocumentShell } from '../../document-shell';
import { WowManualContent } from '../../product-content';

export const metadata: Metadata = { title: 'Wow manual — Oiko Audio', description: 'Installation, controls, quality modes, pitch range, and latency for Oiko Wow.' };

export default function WowManual() {
  return <DocumentShell product="Wow" section="Manual"><WowManualContent basePath={process.env.NEXT_PUBLIC_BASE_PATH ?? ''} /></DocumentShell>;
}
