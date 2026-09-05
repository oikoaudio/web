import type { Metadata } from 'next';
import { DocumentShell } from '../../document-shell';
import guide from './guide.json';

export const metadata: Metadata = { title: 'Oikontrol manual | Oiko Audio', description: 'Setup and controller reference for Akai Fire and Launch Control XL Mk2 in Bitwig Studio.' };

export default function OikontrolManual() {
  return <DocumentShell product="Oikontrol" section="Manual"><p>Version 2.23.0. This is the guide bundled with the extension.</p><nav className="oikontrol-manual-nav" aria-label="Controller reference"><a href="#installation-and-setup">Installation</a><a href="#akai-fire">Akai Fire</a><a href="#launch-control-xl">Launch Control XL</a></nav><div className="oikontrol-guide" dangerouslySetInnerHTML={{ __html: guide }} /></DocumentShell>;
}
