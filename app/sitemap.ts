import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oikoaudio.com';
  return [
    { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/downloads/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/wow/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/weft/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/oikontrol/`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/manuals/oikontrol/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/manuals/wow/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/manuals/weft/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/releases/wow/`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/releases/weft/`, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
