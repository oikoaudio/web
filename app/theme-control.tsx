'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'system' | 'dark' | 'light';
const themeEvent = 'oiko-theme-change';
const themes = [
  { value: 'system', label: 'System', title: 'System — follow device appearance' },
  { value: 'dark', label: 'Dark', title: 'Dark theme' },
  { value: 'light', label: 'Bright', title: 'Bright theme' },
] as const;

function ThemeIcon({ theme }: { theme: Theme }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    {theme === 'system' && <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M12 16v4M8 20h8" />
    </g>}
    {theme === 'dark' && <>
      <circle cx="12" cy="12" r="6" fill="currentColor" />
      <circle cx="15" cy="10" r="5.5" className="theme-icon-cutout" />
    </>}
    {theme === 'light' && <g fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="4.5" strokeWidth="1.4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" strokeWidth="1.2" />
    </g>}
  </svg>;
}

function readTheme(): Theme {
  const current = document.documentElement.dataset.theme;
  return current === 'dark' || current === 'light' ? current : 'system';
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  if (next === 'system') window.localStorage.removeItem('oiko-theme');
  else window.localStorage.setItem('oiko-theme', next);
  window.dispatchEvent(new Event(themeEvent));
}

export function ThemeControl() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'system');
  return (
    <div className="theme-control" role="group" aria-label="Colour theme">
      {themes.map((item) => (
        <button key={item.value} className={theme === item.value ? 'is-active' : ''} onClick={() => applyTheme(item.value)} aria-pressed={theme === item.value} aria-label={item.label} title={item.title} type="button">
          <ThemeIcon theme={item.value} />
        </button>
      ))}
    </div>
  );
}
