'use client';
import { create } from 'zustand';
import type { AdminUser } from './types';

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  hydrated: boolean;
  hydrate: () => void;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}
export const useAuth = create<AuthState>((set) => ({
  token: null, user: null, hydrated: false,
  hydrate: () => {
    const token = localStorage.getItem('londri_token');
    const raw = localStorage.getItem('londri_user');
    set({ token, user: raw ? JSON.parse(raw) : null, hydrated: true });
  },
  login: (token, user) => {
    localStorage.setItem('londri_token', token);
    localStorage.setItem('londri_user', JSON.stringify(user));
    set({ token, user, hydrated: true });
  },
  logout: () => {
    localStorage.removeItem('londri_token');
    localStorage.removeItem('londri_user');
    set({ token: null, user: null });
  },
}));
