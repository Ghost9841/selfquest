// src/store/settings.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SoundTheme = 'zen' | 'fanfare' | 'retro';

export interface SettingsStore {
  windowsNotifications: boolean;
  inBrowserBanners: boolean;
  autoOpenWindow: boolean;
  soundEnabled: boolean;
  soundTheme: SoundTheme;
  soundVolume: number;
  autoResetDaily: boolean;

  setWindowsNotifications: (val: boolean) => void;
  setInBrowserBanners: (val: boolean) => void;
  setAutoOpenWindow: (val: boolean) => void;
  setSoundEnabled: (val: boolean) => void;
  setSoundTheme: (val: SoundTheme) => void;
  setSoundVolume: (val: number) => void;
  setAutoResetDaily: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      windowsNotifications: true,
      inBrowserBanners: true,
      autoOpenWindow: true,
      soundEnabled: true,
      soundTheme: 'zen',
      soundVolume: 0.8,
      autoResetDaily: true,

      setWindowsNotifications: (val: boolean) => {
        set({ windowsNotifications: val });
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ windowsNotifications: val });
        }
      },

      setInBrowserBanners: (val: boolean) => {
        set({ inBrowserBanners: val });
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ inBrowserBanners: val });
        }
      },

      setAutoOpenWindow: (val: boolean) => {
        set({ autoOpenWindow: val });
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ autoOpenWindow: val });
        }
      },

      setSoundEnabled: (val: boolean) => {
        set({ soundEnabled: val });
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ soundEnabled: val });
        }
      },

      setSoundTheme: (theme: SoundTheme) => {
        set({ soundTheme: theme });
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ soundTheme: theme });
        }
      },

      setSoundVolume: (vol: number) => {
        set({ soundVolume: vol });
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({ soundVolume: vol });
        }
      },

      setAutoResetDaily: (val: boolean) => {
        set({ autoResetDaily: val });
      },
    }),
    {
      name: 'selfquest-settings-storage',
      onRehydrateStorage: () => (state) => {
        if (state && typeof chrome !== 'undefined' && chrome.storage?.local) {
          chrome.storage.local.set({
            windowsNotifications: state.windowsNotifications,
            inBrowserBanners: state.inBrowserBanners,
            autoOpenWindow: state.autoOpenWindow,
            soundEnabled: state.soundEnabled,
            soundTheme: state.soundTheme,
          });
        }
      },
    }
  )
);
