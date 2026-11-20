import type { DocumentTab } from '../../document-shell';

export function oikontrolTabs(page: 'manual' | 'maps'): DocumentTab[] {
  const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/manuals/oikontrol`;
  return [
    { label: 'Manual', href: `${base}/`, active: page === 'manual' },
    { label: 'Fire control map', href: `${base}/maps/`, active: page === 'maps' },
  ];
}
