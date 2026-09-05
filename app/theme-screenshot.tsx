type ThemeScreenshotProps = {
  darkSrc: string;
  brightSrc: string;
  alt: string;
  darkWidth: number;
  darkHeight: number;
  brightWidth: number;
  brightHeight: number;
  frameCrop?: { dark: number; bright: number };
};

export function ThemeScreenshot(props: ThemeScreenshotProps) {
  const imageRevision = '3';
  const captures = [
    { theme: 'dark', src: props.darkSrc, width: props.darkWidth, height: props.darkHeight, crop: props.frameCrop?.dark ?? 0 },
    { theme: 'bright', src: props.brightSrc, width: props.brightWidth, height: props.brightHeight, crop: props.frameCrop?.bright ?? 0 },
  ];
  return (
    <span className="theme-screenshot" role="img" aria-label={props.alt}>
      {/* Clip the captured window frame before scaling, including a pixel of resampling bleed. */}
      {captures.map(({ theme, src, width, height, crop }) => {
        const innerWidth = width - crop * 2;
        const innerHeight = height - crop * 2;
        return <span key={theme} className={`theme-screenshot-frame theme-screenshot-${theme}`} style={{ aspectRatio: `${innerWidth} / ${innerHeight}` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${src}?v=${imageRevision}`} alt="" aria-hidden="true" width={width} height={height} style={{ width: `${width / innerWidth * 100}%`, left: `${-crop / innerWidth * 100}%`, top: `${-crop / innerHeight * 100}%` }} />
        </span>;
      })}
    </span>
  );
}
