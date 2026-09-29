import type { Metadata } from 'next';
import { ProductPage } from '../product-page';
import { repo, PluggStartContent, PluggFeatureContent, PluggStatusContent, PluggFaqContent, PluggCreditsContent } from '../plugg-content';

const description = 'Plugg installs Windows audio plug-ins from the vendor\'s own installer and publishes them to your Linux DAW as native VST3s. Free software, GPL-3.0-or-later.';

export const metadata: Metadata = {
  title: 'Plugg | Oiko Audio',
  description,
  alternates: { canonical: '/plugg/' },
  openGraph: { title: 'Plugg | Oiko Audio', description, images: [] },
  twitter: { card: 'summary', title: 'Plugg | Oiko Audio', description, images: [] },
};

export default function PluggPage() {
  return <ProductPage
    product="Plugg"
    stage="preview"
    download={false}
    startButton={false}
    links={[{ label: 'Download', href: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/downloads/#plugg`, primary: true }, { label: 'Install', href: '#install' }, { label: 'Source on GitHub', href: repo }]}
    line="Your Windows audio plug-ins in your Linux DAW."
    description="Drop in a vendor's installer or a Windows VST3, and it shows up in your DAW as a native plug-in. It also handles vendor apps and iLok-licensed plug-ins."
    screenshot={{ darkSrc: '/images/plugg-library-dark.png', brightSrc: '/images/plugg-library-light.png', darkWidth: 1120, darkHeight: 900, brightWidth: 1120, brightHeight: 900, alt: 'The Plugg window: a list of vendors with status dots, their vendor apps, and the disk space each one uses.', wide: true }}
    startHere={<PluggStartContent />}
    manualTitle="Features"
    manualDescription="What Plugg does, how it works and how to install it."
    manual={<PluggFeatureContent />}
    sections={[
      { id: 'status', index: 'STATUS', title: 'Status', description: 'What is tested, and what to expect.', content: <PluggStatusContent /> },
      { id: 'faq', index: 'FAQ', title: 'FAQ', content: <PluggFaqContent /> },
      { id: 'credits', index: 'CREDITS', title: 'Credits', content: <PluggCreditsContent /> },
    ]}
  />;
}
