import type { Metadata } from 'next';
import { DocumentShell } from '../../document-shell';
import { WeftReleaseContent } from '../../product-content';

export const metadata: Metadata = { title: 'Weft release notes | Oiko Audio', description: 'What changed in Oiko Weft 0.5.0-beta.1.' };

export default function WeftReleases() {
  return <DocumentShell product="Weft" section="Release notes"><WeftReleaseContent /></DocumentShell>;
}
