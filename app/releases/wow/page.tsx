import type { Metadata } from 'next';
import { DocumentShell } from '../../document-shell';
import { WowReleaseContent } from '../../product-content';

export const metadata: Metadata = { title: 'Wow release notes — Oiko Audio', description: 'Release history and known limitations for Oiko Wow.' };

export default function WowReleases() {
  return <DocumentShell product="Wow" section="Release notes"><WowReleaseContent /></DocumentShell>;
}
