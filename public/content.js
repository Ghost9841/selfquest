// In-Page Slide-In Banner for Self Quest (Displays inside active browser tabs & interactive deep-links)

(() => {
  if (window.__selfQuestInjected) return;
  window.__selfQuestInjected = true;

  function showInPageBanner(data) {
    const { title, message, xp, icon = '⚔️', tab = 'timer', questId } = data;

    let container = document.getElementById('selfquest-notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'selfquest-notification-container';
      container.style.cssText = `
        position: fixed !important;
        top: 24px !important;
        right: 24px !important;
        z-index: 2147483647 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        pointer-events: none !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif !important;
      `;
      document.documentElement.appendChild(container);
    }

    // Create banner
    const banner = document.createElement('div');
    banner.style.cssText = `
      pointer-events: auto !important;
      width: 360px !important;
      background: rgba(18, 17, 36, 0.95) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border: 1px solid rgba(139, 92, 246, 0.5) !important;
      border-radius: 18px !important;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(139, 92, 246, 0.3) !important;
      padding: 16px !important;
      color: #ffffff !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 12px !important;
      box-sizing: border-box !important;
      transform: translateX(120%) !important;
      opacity: 0 !important;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
      cursor: pointer !important;
    `;

    // Top Row: Icon + Title + Close Button
    const topRow = document.createElement('div');
    topRow.style.cssText = `
      display: flex !important;
      align-items: flex-start !important;
      gap: 12px !important;
      width: 100% !important;
    `;

    const iconBox = document.createElement('div');
    iconBox.style.cssText = `
      width: 42px !important;
      height: 42px !important;
      border-radius: 12px !important;
      background: rgba(139, 92, 246, 0.25) !important;
      border: 1px solid rgba(139, 92, 246, 0.5) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 22px !important;
      flex-shrink: 0 !important;
    `;
    iconBox.textContent = icon;

    const content = document.createElement('div');
    content.style.cssText = `
      flex: 1 !important;
      min-width: 0 !important;
    `;

    const titleEl = document.createElement('div');
    titleEl.style.cssText = `
      font-size: 14px !important;
      font-weight: 700 !important;
      color: #ffffff !important;
      line-height: 1.3 !important;
      margin-bottom: 3px !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    `;
    titleEl.textContent = title;

    if (xp) {
      const xpTag = document.createElement('span');
      xpTag.style.cssText = `
        font-size: 11px !important;
        font-weight: 700 !important;
        background: rgba(245, 158, 11, 0.25) !important;
        border: 1px solid rgba(245, 158, 11, 0.5) !important;
        color: #fbbf24 !important;
        padding: 1px 7px !important;
        border-radius: 999px !important;
        display: inline-block !important;
      `;
      xpTag.textContent = `+${xp} XP`;
      titleEl.appendChild(xpTag);
    }

    const descEl = document.createElement('div');
    descEl.style.cssText = `
      font-size: 12px !important;
      color: #cbd5e1 !important;
      line-height: 1.4 !important;
    `;
    descEl.textContent = message;

    content.appendChild(titleEl);
    content.appendChild(descEl);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      background: transparent !important;
      border: none !important;
      color: #94a3b8 !important;
      font-size: 15px !important;
      cursor: pointer !important;
      padding: 0 4px !important;
      line-height: 1 !important;
      transition: color 0.2s !important;
    `;
    closeBtn.onmouseenter = () => { closeBtn.style.color = '#ffffff'; };
    closeBtn.onmouseleave = () => { closeBtn.style.color = '#94a3b8'; };

    const dismiss = (e) => {
      if (e) e.stopPropagation();
      banner.style.transform = 'translateX(120%)';
      banner.style.opacity = '0';
      setTimeout(() => {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 400);
    };

    closeBtn.onclick = dismiss;

    topRow.appendChild(iconBox);
    topRow.appendChild(content);
    topRow.appendChild(closeBtn);

    // Bottom Row: Action button to open Self Quest & navigate
    const actionRow = document.createElement('div');
    actionRow.style.cssText = `
      display: flex !important;
      justify-content: flex-end !important;
      align-items: center !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
      padding-top: 8px !important;
    `;

    const openBtn = document.createElement('button');
    openBtn.textContent = tab === 'timer' ? 'Open & Claim XP ➔' : 'Open Quest in Self Quest ➔';
    openBtn.style.cssText = `
      background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
      border: 1px solid rgba(139, 92, 246, 0.5) !important;
      color: #ffffff !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      padding: 6px 14px !important;
      border-radius: 10px !important;
      cursor: pointer !important;
      box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35) !important;
      transition: transform 0.15s ease, filter 0.15s ease !important;
    `;
    openBtn.onmouseenter = () => { openBtn.style.filter = 'brightness(1.15)'; };
    openBtn.onmouseleave = () => { openBtn.style.filter = 'brightness(1)'; };

    const handleOpenSelfQuest = () => {
      try {
        chrome.runtime.sendMessage({
          type: 'OPEN_SELFQUEST',
          tab: tab,
          questId: questId || undefined,
        });
      } catch (err) {
        console.warn('Could not contact background worker:', err);
      }
      dismiss();
    };

    openBtn.onclick = (e) => {
      e.stopPropagation();
      handleOpenSelfQuest();
    };

    banner.onclick = handleOpenSelfQuest;

    actionRow.appendChild(openBtn);
    banner.appendChild(topRow);
    banner.appendChild(actionRow);
    container.appendChild(banner);

    requestAnimationFrame(() => {
      banner.style.transform = 'translateX(0)';
      banner.style.opacity = '1';
    });

    setTimeout(dismiss, 10000);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'SHOW_IN_PAGE_BANNER') {
      showInPageBanner(message);
    }
  });
})();
