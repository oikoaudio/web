import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oikoaudio.com'),
  title: 'Oiko Audio | Free audio plug-ins for macOS, Windows and Linux',
  description: 'Free CLAP and VST3 plugins for music makers and engineers. Download Wow for clean pitch modulation and Weft for playable spectral processing.',
  keywords: ['free audio plugins', 'VST3 plugins', 'CLAP plugins', 'Linux audio plugins', 'pitch modulation', 'wow and flutter', 'spectral processing', 'MPE audio effect'],
  authors: [{ name: 'David Fredman' }],
  openGraph: { title: 'Oiko Audio | Wow and Weft', description: 'Free audio plug-ins for clean pitch modulation and playable spectral processing.', type: 'website', siteName: 'Oiko Audio', images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Oiko Audio. Unstable pitch. Playable spectra.' }] },
  twitter: { card: 'summary_large_image', title: 'Oiko Audio | Wow and Weft', description: 'Free audio plug-ins for clean pitch modulation and playable spectral processing.', images: ['/og.png'] },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeScript = `try{const t=localStorage.getItem('oiko-theme');document.documentElement.dataset.theme=t==='dark'||t==='light'?t:'system'}catch{}`;
  return (
    <html lang="en" data-theme="system" suppressHydrationWarning>
      <body><script dangerouslySetInnerHTML={{ __html: themeScript }} />{children}</body>
    </html>
  );
}
