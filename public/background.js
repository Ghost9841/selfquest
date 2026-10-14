// Background Service Worker for Self Quest Chrome/Brave Extension

// Helper to set toolbar badge
function updateBadge(text, color) {
  if (chrome.action) {
    chrome.action.setBadgeText({ text: text || '' });
    if (color) {
      chrome.action.setBadgeBackgroundColor({ color });
    }
  }
}

// Helper to open or focus Self Quest floating window with deep navigation
function openOrFocusSelfQuest(routeParams = {}) {
  const queryString = new URLSearchParams(routeParams).toString();
  const targetUrl = `index.html${queryString ? '?' + queryString : ''}`;

  chrome.windows.getAll({ populate: true }, (windows) => {
    let existingTab = null;
    let existingWin = null;

    for (const win of windows) {
      for (const tab of win.tabs || []) {
        if (tab.url && tab.url.includes('index.html')) {
          existingTab = tab;
          existingWin = win;
          break;
        }
      }
      if (existingTab) break;
    }

    if (existingTab && existingWin && existingWin.id !== undefined && existingTab.id !== undefined) {
      chrome.windows.update(existingWin.id, { focused: true });
      chrome.tabs.update(existingTab.id, { url: targetUrl, active: true });
    } else {
      // Calculate clean top-right or centered screen position
      chrome.windows.create({
        url: targetUrl,
        type: 'popup',
        width: 440,
        height: 640,
        focused: true,
      });
    }
  });
}

// Helper to trigger audio in background
async function playBackgroundSound(theme = 'zen') {
  try {
    if (!chrome.offscreen) return;

    const hasDoc = await chrome.offscreen.hasDocument?.();
    if (!hasDoc) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'Play focus timer and reminder audio chimes',
      });
    }

    chrome.runtime.sendMessage({
      type: 'PLAY_OFFSCREEN_AUDIO',
      theme: theme,
    }).catch(() => {});
  } catch (err) {
    console.warn('[SelfQuest Background] Audio play error:', err);
  }
}

// Safely create Windows native toast notification
function showWindowsNotification(id, title, message) {
  try {
    const iconUrl = chrome.runtime.getURL('icon128.png');
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: iconUrl,
      title: title,
      message: message,
      priority: 2,
      requireInteraction: true,
    }, (notifId) => {
      if (chrome.runtime.lastError) {
        console.error('[SelfQuest Background] Notification error:', chrome.runtime.lastError.message);
      } else {
        console.log('[SelfQuest Background] Windows notification created:', notifId);
      }
    });
  } catch (err) {
    console.error('[SelfQuest Background] Failed to show Windows notification:', err);
  }
}

// Send In-Page Slide-In Banner to active browser tabs
function broadcastInPageBanner(data) {
  chrome.tabs.query({ active: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      tabs.forEach((tab) => {
        if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('brave://') && !tab.url.startsWith('devtools://')) {
          chrome.tabs.sendMessage(tab.id, {
            type: 'SHOW_IN_PAGE_BANNER',
            ...data,
          }).catch(() => {});
        }
      });
    }
  });
}

// Listen for clicks on desktop Windows notifications (1-Click Open & Navigate)
chrome.notifications.onClicked.addListener((notificationId) => {
  console.log('[SelfQuest Background] Notification clicked:', notificationId);
  chrome.notifications.clear(notificationId);

  if (notificationId.startsWith('pomodoro-done')) {
    openOrFocusSelfQuest({ tab: 'timer' });
  } else if (notificationId.startsWith('reminder-')) {
    // Format: reminder-<questId>-<timestamp>
    const parts = notificationId.split('-');
    const questId = parts.length >= 2 ? parts[1] : undefined;
    openOrFocusSelfQuest({ tab: 'quests', questId: questId });
  } else {
    openOrFocusSelfQuest({ tab: 'dashboard' });
  }
});

// Listen for alarms (Reminders & Timer completion)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log('[SelfQuest Background] Alarm fired:', alarm.name);

  // Load user settings
  const settings = await chrome.storage.local.get([
    'windowsNotifications',
    'inBrowserBanners',
    'autoOpenWindow',
    'soundEnabled',
    'soundTheme',
    'activeQuestTitle',
    'timerMode',
  ]);

  const allowWindows = settings.windowsNotifications !== false;
  const allowInBrowser = settings.inBrowserBanners !== false;
  const autoOpen = settings.autoOpenWindow !== false;
  const allowSound = settings.soundEnabled !== false;
  const soundTheme = settings.soundTheme || 'zen';

  // 1. Pomodoro Timer Completed
  if (alarm.name === 'pomodoro-timer') {
    updateBadge('DONE', '#10B981');
    if (chrome.action.setTitle) {
      chrome.action.setTitle({ title: 'Self Quest: Focus Session Complete! 🎉' });
    }

    if (allowSound) {
      await playBackgroundSound(soundTheme);
    }

    const mode = settings.timerMode === 'break' ? 'Break' : 'Focus Session';
    const quest = settings.activeQuestTitle ? ` for "${settings.activeQuestTitle}"` : '';
    const title = `🎉 ${mode} Complete!`;
    const message = settings.timerMode === 'break'
      ? 'Break is over! Time to conquer your next quest.'
      : `Awesome work${quest}! Open Self Quest to claim your focus XP.`;

    if (allowWindows) {
      showWindowsNotification('pomodoro-done-' + Date.now(), title, message);
    }

    if (allowInBrowser) {
      broadcastInPageBanner({
        title,
        message,
        xp: settings.timerMode === 'break' ? null : 15,
        icon: settings.timerMode === 'break' ? '☕' : '🎉',
        tab: 'timer',
      });
    }

    // Auto-pop open Self Quest directly to the Focus Claim screen
    if (autoOpen) {
      openOrFocusSelfQuest({ tab: 'timer' });
    }
    return;
  }

  // 2. Pomodoro Minute Tick
  if (alarm.name === 'pomodoro-tick') {
    chrome.storage.local.get(['timerEndTime', 'timerMode'], (res) => {
      if (!res.timerEndTime) {
        chrome.alarms.clear('pomodoro-tick');
        updateBadge('', '#8B5CF6');
        return;
      }

      const remainingMs = res.timerEndTime - Date.now();
      if (remainingMs <= 0) {
        chrome.alarms.clear('pomodoro-tick');
        updateBadge('DONE', '#10B981');
      } else {
        const remainingMinutes = Math.ceil(remainingMs / 60000);
        const badgeColor = res.timerMode === 'break' ? '#10B981' : '#8B5CF6';
        updateBadge(`${remainingMinutes}m`, badgeColor);
        if (chrome.action.setTitle) {
          chrome.action.setTitle({ title: `Self Quest: ${remainingMinutes}m remaining (${res.timerMode || 'focus'})` });
        }
      }
    });
    return;
  }

  // 3. Quest Reminder
  if (alarm.name.startsWith('quest-reminder:')) {
    const questId = alarm.name.replace('quest-reminder:', '');

    if (allowSound) {
      await playBackgroundSound(soundTheme);
    }

    chrome.storage.local.get(['quest-storage'], (res) => {
      let questTitle = 'Scheduled Task';
      let xpReward = 15;

      try {
        if (res['quest-storage'] && res['quest-storage'].state && res['quest-storage'].state.quests) {
          const quest = res['quest-storage'].state.quests.find((q) => q.id === questId);
          if (quest) {
            questTitle = quest.title;
            xpReward = quest.xpReward;
          }
        }
      } catch (e) {
        console.error('Error fetching quest for reminder:', e);
      }

      const title = `⚔️ Quest Alert: ${questTitle}`;
      const message = `It is time to tackle this quest! (+${xpReward} XP awaiting)`;

      if (allowWindows) {
        showWindowsNotification('reminder-' + questId + '-' + Date.now(), title, message);
      }

      if (allowInBrowser) {
        broadcastInPageBanner({
          title,
          message,
          xp: xpReward,
          icon: '⚔️',
          tab: 'quests',
          questId: questId,
        });
      }

      // Auto-pop open Self Quest directly to the Quests tab with this quest highlighted
      if (autoOpen) {
        openOrFocusSelfQuest({ tab: 'quests', questId: questId });
      }
    });
  }
});

// Listen for messages from popup/UI/content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_SELFQUEST') {
    openOrFocusSelfQuest({ tab: message.tab, questId: message.questId });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'START_TIMER') {
    const { endTime, mode, questTitle } = message;

    chrome.storage.local.set({
      timerEndTime: endTime,
      timerMode: mode,
      activeQuestTitle: questTitle || '',
    });

    chrome.alarms.create('pomodoro-timer', { when: endTime });
    chrome.alarms.create('pomodoro-tick', { periodInMinutes: 1 });

    const remainingMins = Math.max(1, Math.ceil((endTime - Date.now()) / 60000));
    const badgeColor = mode === 'break' ? '#10B981' : '#8B5CF6';
    updateBadge(`${remainingMins}m`, badgeColor);

    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'STOP_TIMER') {
    chrome.alarms.clear('pomodoro-timer');
    chrome.alarms.clear('pomodoro-tick');
    chrome.storage.local.remove(['timerEndTime', 'timerMode', 'activeQuestTitle']);
    updateBadge('', '#8B5CF6');
    if (chrome.action.setTitle) {
      chrome.action.setTitle({ title: 'Self Quest' });
    }
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'SCHEDULE_REMINDER') {
    const { questId, reminderTime } = message;
    const targetMs = new Date(reminderTime).getTime();
    if (targetMs > Date.now()) {
      chrome.alarms.create(`quest-reminder:${questId}`, { when: targetMs });
      console.log(`[SelfQuest] Scheduled reminder for quest ${questId} at ${new Date(targetMs).toLocaleTimeString()}`);
    }
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'CANCEL_REMINDER') {
    chrome.alarms.clear(`quest-reminder:${message.questId}`);
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'UPDATE_BADGE') {
    updateBadge(message.text, message.color);
    sendResponse({ success: true });
    return true;
  }
});
