import type { Metadata } from 'next';
import { TackTool } from '../tool-page';
import { kitsBody } from '../tool-pages';

export const metadata: Metadata = {
  title: 'Kit bank | Tack | Oiko Audio',
  description: 'Fill the kit bank of an FM-1 running Tack from .SND files, or save it to a file. Works in Chrome or Edge.',
  alternates: { canonical: '/tack/fm1/kits/' },
};

export default function TackKits() {
  return <TackTool index="TACK / KITS" body={kitsBody} script="kits.js" />;
}
