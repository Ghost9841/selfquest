// src/components/SettingsModal.tsx

import { useState } from 'react';
import { Settings, Bell, Monitor, Globe, Volume2, VolumeX, Play, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSettingsStore, type SoundTheme } from '@/store/settings.store';
import { playChimeSound } from '@/utils/extensionBridge';

export function SettingsModal() {
  const [open, setOpen] = useState(false);
  const {
    windowsNotifications,
    inBrowserBanners,
    soundEnabled,
    soundTheme,
    autoResetDaily,
    setWindowsNotifications,
    setInBrowserBanners,
    setSoundEnabled,
    setSoundTheme,
    setAutoResetDaily,
  } = useSettingsStore();

  const handleTestSound = (theme: SoundTheme) => {
    playChimeSound('focus-end', theme);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          size="icon"
          variant="outline"
          className="h-9 w-9 rounded-xl border-white/10 bg-white/[0.04] text-gray-300 hover:bg-white/[0.1] hover:text-white backdrop-blur-xl shadow-md transition-all"
          title="Notification & Sound Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#131226]/95 backdrop-blur-2xl text-white border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            Alerts & Audio Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Section 1: Notification Types */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              Notification Delivery Channels
            </h3>

            {/* In-Browser Slide-In Banners Toggle */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-start justify-between gap-3 backdrop-blur-md">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-cyan-400" />
                  In-Browser Slide-In Banners (Inside Active Tabs)
                </Label>
                <p className="text-xs text-gray-400">
                  Displays an RPG alert card directly inside whatever webpage you are viewing (like YouTube, Reddit, Google).
                </p>
              </div>
              <Switch
                checked={inBrowserBanners}
                onCheckedChange={setInBrowserBanners}
                className="data-[state=checked]:bg-cyan-500 mt-0.5"
              />
            </div>

            {/* Windows System Notifications Toggle */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-start justify-between gap-3 backdrop-blur-md">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Monitor className="h-4 w-4 text-purple-400" />
                  Windows System Notifications (OS Toast)
                </Label>
                <p className="text-xs text-gray-400">
                  Sends desktop notification banners to the Windows Action Center (helpful if Brave is minimized).
                </p>
              </div>
              <Switch
                checked={windowsNotifications}
                onCheckedChange={setWindowsNotifications}
                className="data-[state=checked]:bg-purple-600 mt-0.5"
              />
            </div>
          </div>

          {/* Section 2: Sound & Audio Customization */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5" />
              Audio Chimes & Themes
            </h3>

            {/* Sound Enable Switch */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                )}
                <div>
                  <Label className="text-sm font-semibold text-white">Focus & Quest Sounds</Label>
                  <p className="text-xs text-gray-400">Plays background chimes when timer or reminder completes</p>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* Sound Theme Picker */}
            {soundEnabled && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Sound Style
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'zen', name: '🧘 Zen Bowl', desc: 'Resonant bell' },
                    { id: 'fanfare', name: '🎺 Fanfare', desc: 'Heroic triumph' },
                    { id: 'retro', name: '👾 8-Bit Retro', desc: 'Chiptune arcade' },
                  ].map((t) => (
                    <div
                      key={t.id}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        soundTheme === t.id
                          ? 'border-purple-400 bg-purple-600/30 shadow-md text-white'
                          : 'border-white/5 bg-white/[0.03] text-gray-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSoundTheme(t.id as SoundTheme)}
                        className="w-full text-left"
                      >
                        <p className="text-xs font-bold">{t.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{t.desc}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestSound(t.id as SoundTheme)}
                        className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white"
                      >
                        <Play className="h-2.5 w-2.5 fill-current" /> Test
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Daily Quests */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Daily Quests
            </h3>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-start justify-between gap-3">
              <div>
                <Label className="text-sm font-semibold text-white">Midnight Auto-Reset</Label>
                <p className="text-xs text-gray-400">
                  Automatically resets repeatable quests every day at 12:00 AM so you can repeat them daily.
                </p>
              </div>
              <Switch
                checked={autoResetDaily}
                onCheckedChange={setAutoResetDaily}
                className="data-[state=checked]:bg-purple-600 mt-0.5"
              />
            </div>
          </div>

          {/* Section 4: FAQ / Browser Closing Explanation */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200/90 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <HelpCircle className="h-4 w-4" />
              <span>Will it still remind me if I close the Brave browser (X)?</span>
            </div>
            <p className="leading-relaxed">
              • <strong>Minimized / Browsing:</strong> Yes, 100% full alarms, audio, and toolbar badge.<br />
              • <strong>Completely Exited (X):</strong> Extensions run inside the browser process. To keep alarms alive even when windows are closed, enable <em>"Continue running background apps when Brave is closed"</em> in <strong>brave://settings/system</strong>.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl px-5"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
