import type { DocumentTab } from '../../document-shell';

export function tackTabs(page: 'manual' | 'maps' | 'sheet'): DocumentTab[] {
  const base = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/manuals/tack-fm1`;
  return [
    { label: 'Mode maps', href: `${base}/maps/`, active: page === 'maps' },
    { label: 'Cheat sheet', href: `${base}/cheat-sheet/`, active: page === 'sheet' },
    { label: 'Manual', href: `${base}/`, active: page === 'manual' },
  ];
}
