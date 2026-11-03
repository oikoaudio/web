import type { Metadata } from 'next';
import { TackTool } from '../tool-page';
import { backupBody } from '../tool-pages';

export const metadata: Metadata = {
  title: 'Back up Tack | Oiko Audio',
  description: 'Save what an FM-1 running Tack keeps to a file, and load it back later. Works in Chrome or Edge.',
  alternates: { canonical: '/tack/fm1/backup/' },
};

export default function TackBackup() {
  return <TackTool index="TACK / BACKUP" body={backupBody} script="backup.js" />;
}
