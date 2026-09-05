import type { Metadata } from 'next';
import { DocumentShell } from '../../document-shell';
import { WeftReleaseContent } from '../../product-content';

export const metadata: Metadata = { title: 'Weft release notes | Oiko Audio', description: 'What changed in Oiko Weft 0.1.1-beta3, plus the current host compatibility notes.' };

export default function WeftReleases() {
  return <DocumentShell product="Weft" section="Release notes"><WeftReleaseContent /></DocumentShell>;
}
