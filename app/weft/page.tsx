import type { Metadata } from 'next';
import { ProductPage } from '../product-page';
import { WeftStartContent, WeftExplainerContent, WeftManualContent, WeftReleaseContent } from '../product-content';

const description = 'Draw, capture and reshape spectral curves, or play notes over incoming audio. Free CLAP and VST3 builds for Linux, Windows and macOS.';
const image = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oikoaudio.com'}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/oiko-weft-dark.png`;
export const metadata: Metadata = { title: 'Weft | Oiko Audio', description, openGraph: { title: 'Weft | Oiko Audio', description, images: [image] }, twitter: { card: 'summary_large_image', title: 'Weft | Oiko Audio', description, images: [image] } };

export default function WeftPage() {
  return <ProductPage product="Weft" line="An expressive spectral filter." description="Draw cuts in the spectrum, bring out harmonics with notes and chords, or set the spectrum in motion." startHere={<><WeftStartContent /><WeftExplainerContent /></>} demo={{ src: '/videos/weft-demo.mp4', poster: '/videos/weft-demo-poster.jpg', width: 1152, height: 720, caption: 'Weft in action, with wavering support from Wow. Press play to hear the demo.' }} manual={<WeftManualContent includeStart={false} />} releases={<WeftReleaseContent />} />;
}
