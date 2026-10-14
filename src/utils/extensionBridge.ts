// Utility for communicating with Chrome/Brave Extension APIs and synthesizing audio

export function isChromeExtension(): boolean {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
}

// Set extension toolbar badge
export function setBadge(text: string, color?: string) {
  if (typeof chrome !== 'undefined' && chrome.action?.setBadgeText) {
    chrome.action.setBadgeText({ text: text || '' });
    if (color && chrome.action.setBadgeBackgroundColor) {
      chrome.action.setBadgeBackgroundColor({ color });
    }
  }
}

// Schedule quest reminder via background service worker or chrome.alarms
export function scheduleReminder(questId: string, reminderTime: string, questTitle: string, xpReward: number) {
  const targetTime = new Date(reminderTime).getTime();
  if (isNaN(targetTime) || targetTime <= Date.now()) return;

  if (isChromeExtension()) {
    try {
      chrome.runtime.sendMessage({
        type: 'SCHEDULE_REMINDER',
        questId,
        reminderTime,
        questTitle,
        xpReward
      });
    } catch (e) {
      console.warn('Could not send message to background worker:', e);
    }
  } else {
    // Fallback for dev mode / browser preview
    const delay = targetTime - Date.now();
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`⚔️ Quest Alert: ${questTitle}`, {
            body: `Time to conquer this quest! (+${xpReward} XP awaiting)`,
            icon: '/icon.png'
          });
        } else {
          console.log(`[Dev Reminder] Time for quest: ${questTitle}`);
        }
      }, delay);
    }
  }
}

// Cancel a scheduled reminder
export function cancelReminder(questId: string) {
  if (isChromeExtension()) {
    try {
      chrome.runtime.sendMessage({
        type: 'CANCEL_REMINDER',
        questId
      });
    } catch (e) {
      console.warn('Could not send message to background worker:', e);
    }
  }
}

// Notify background worker when Pomodoro starts
export function startTimerService(endTime: number, mode: 'work' | 'break', questTitle?: string) {
  if (isChromeExtension()) {
    try {
      chrome.runtime.sendMessage({
        type: 'START_TIMER',
        endTime,
        mode,
        questTitle
      });
    } catch (e) {
      console.warn('Could not notify background worker:', e);
    }
  }
}

// Notify background worker when Pomodoro stops/resets
export function stopTimerService() {
  if (isChromeExtension()) {
    try {
      chrome.runtime.sendMessage({
        type: 'STOP_TIMER'
      });
    } catch (e) {
      console.warn('Could not notify background worker:', e);
    }
  }
}

export function playChimeSound(
  type: 'focus-start' | 'focus-end' | 'level-up' = 'focus-end',
  theme: 'zen' | 'fanfare' | 'retro' = 'zen'
) {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'focus-start') {
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
      return;
    }

    if (type === 'level-up' || theme === 'fanfare') {
      const freqs = [440, 554.37, 659.25, 880];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + (idx === 3 ? 0.9 : 0.35));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.95);
      });
      return;
    }

    if (theme === 'retro') {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.13);
      });
      return;
    }

    // Default: Zen Singing Bowl
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(1174.66, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    overtone.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 2.25);
    overtone.stop(now + 2.25);
  } catch (err) {
    console.warn('Audio synthesis not supported or blocked:', err);
  }
}
