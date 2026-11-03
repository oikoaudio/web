import type { Metadata } from 'next';
import { TackTool } from '../tool-page';
import { installBody, release } from '../tool-pages';

export const metadata: Metadata = {
  title: 'Install Tack | Oiko Audio',
  description: 'Install Tack on an M-VAVE FM-1 from Chrome or Edge, over USB. Also puts the stock firmware back.',
  alternates: { canonical: '/tack/fm1/install/' },
};

export default function TackInstall() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <TackTool index={`TACK / INSTALL / ${release.version}`} body={installBody} script="install.js">
    <p className="tool-release">
      {release.file}, {release.bytes.toLocaleString('en-GB')} bytes, identity {release.identity}.<br />
      SHA-256 <code>{release.sha256}</code><br />
      <a href={`${basePath}/tack/fm1/firmware/${release.file}`}>Download the package</a> · <a href={`${basePath}/tack/fm1/firmware/LICENSE.txt`}>Licence</a> · <a href={`${basePath}/tack/fm1/firmware/NOTICE.md`}>Notice</a>
    </p>
  </TackTool>;
}
