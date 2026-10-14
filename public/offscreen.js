// Offscreen Audio Player for Self Quest (Plays sounds even when popup is closed)

function playSynthesizedSound(theme = 'zen') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (theme === 'retro') {
      // 8-Bit Retro Chiptune Arpeggio
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
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
    } else if (theme === 'fanfare') {
      // Triumphant RPG Fanfare
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
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
    } else {
      // Zen Singing Bowl (Default)
      const osc = ctx.createOscillator();
      const overtone = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5

      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(1174.66, now); // D6

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
    }
  } catch (e) {
    console.error('[SelfQuest Offscreen] Audio playback error:', e);
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PLAY_OFFSCREEN_AUDIO') {
    playSynthesizedSound(message.theme || 'zen');
  }
});
