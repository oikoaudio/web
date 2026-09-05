import type { Metadata } from 'next';
import { ProductPage } from '../product-page';
import { WowStartContent, WowExplainerContent, WowManualContent, WowReleaseContent } from '../product-content';

const description = 'Clean pitch modulation plugin in CLAP and VST3 formats, with downloads, manual, and release notes.';
const image = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oikoaudio.com'}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/oiko-wow-dark.png`;
export const metadata: Metadata = { title: 'Wow — Oiko Audio', description, openGraph: { title: 'Wow — Oiko Audio', description, images: [image] }, twitter: { card: 'summary_large_image', title: 'Wow — Oiko Audio', description, images: [image] } };

export default function WowPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return <ProductPage product="Wow" line="Clean pitch modulation." description="Slow warble, fast flutter and a little drift. Give a steady sound some movement, from a subtle wobble to an unmistakable bend." screenshot={{ darkSrc: '/images/oiko-wow-dark.png', brightSrc: '/images/oiko-wow-bright.png', darkWidth: 504, darkHeight: 394, brightWidth: 508, brightHeight: 398, frameCrop: { dark: 3, bright: 5 } }} startHere={<><WowStartContent /><WowExplainerContent basePath={basePath} /></>} manual={<WowManualContent basePath={basePath} includeIntroduction={false} />} releases={<WowReleaseContent />} />;
}
