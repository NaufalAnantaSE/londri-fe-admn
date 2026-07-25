'use client';
import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  hydrated: boolean;
  hydrate: () => void;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

function resolve(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: 'system',
  resolved: 'light',
  hydrated: false,
  hydrate: () => {
    const saved = (localStorage.getItem('londri_theme') as Theme) || 'system';
    const res = resolve(saved);
    apply(res);
    set({ theme: saved, resolved: res, hydrated: true });
    // Listen to system changes when theme=system
    if (saved === 'system') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (get().theme === 'system') {
          const r = e.matches ? 'dark' : 'light';
          apply(r);
          set({ resolved: r });
        }
      });
    }
  },
  setTheme: (theme) => {
    localStorage.setItem('londri_theme', theme);
    const res = resolve(theme);
    apply(res);
    set({ theme, resolved: res });
  },
  toggle: () => {
    const current = get().resolved;
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('londri_theme', next);
    apply(next);
    set({ theme: next, resolved: next });
  },
}));
