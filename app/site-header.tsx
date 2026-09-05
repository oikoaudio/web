import { ThemeControl } from './theme-control';

const products = ['Weft', 'Wow', 'Oikontrol'] as const;

type SiteHeaderProps = {
  currentProduct?: (typeof products)[number];
  homeHref?: string;
  downloadsCurrent?: boolean;
  className?: string;
};

export function SiteHeader({ currentProduct, homeHref, downloadsCurrent, className }: SiteHeaderProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  return (
    <header className={className ? `site-header ${className}` : 'site-header'}>
      <a className="wordmark" href={homeHref ?? `${basePath}/`} aria-label="Oiko Audio home">OIKO AUDIO</a>
      <nav aria-label="Primary navigation">
        {products.map((product) => (
          <a key={product} href={`${basePath}/${product.toLowerCase()}/`} aria-current={currentProduct === product ? 'page' : undefined}>
            {product}
          </a>
        ))}
        <a href={`${basePath}/downloads/`} aria-current={downloadsCurrent ? 'page' : undefined}>Downloads</a>
      </nav>
      <ThemeControl />
    </header>
  );
}
