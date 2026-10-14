(() => {
  'use strict';

  const config = window.LOADSCREEN_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const root = $('.loadscreen');
  const percentageEl = $('#percent');
  const progressEl = $('#progress-fill');
  const trackEl = $('#progress-track');
  const statusEl = $('#status');
  const fpsEl = $('#fps');

  let highestFraction = 0;

  // Loading screenshots from FiveM use 0..1 loadFraction values. Never fake
  // this value or make the screen close from JavaScript before FiveM is ready.
  function applyProgress(fraction) {
    if (typeof fraction !== 'number' || !Number.isFinite(fraction)) return;
    highestFraction = Math.max(highestFraction, Math.min(1, Math.max(0, fraction)));
    const value = Math.round(highestFraction * 100);
    percentageEl.textContent = `${value}%`;
    progressEl.style.width = `${(highestFraction * 100).toFixed(2)}%`;
    trackEl.setAttribute('aria-valuenow', String(value));
    if (value === 100) setStatus('Finalizing connection…');
  }

  function setStatus(text) {
    if (typeof text !== 'string') return;
    const safe = text.replace(/[\r\n\t]+/g, ' ').trim().slice(0, 135);
    if (safe) statusEl.textContent = safe; // never innerHTML: log lines are untrusted
  }

  function applyConfig() {
    $('#loading-title').textContent = typeof config.title === 'string' ? config.title : 'LOADING EXPERIENCE';
    $('#version-label').textContent = typeof config.versionText === 'string' ? config.versionText : 'FiveM loading screen';
    $('#resource-version').textContent = typeof config.resourceVersion === 'string' ? config.resourceVersion : '';
    if (typeof config.accentColor === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(config.accentColor)) {
      document.documentElement.style.setProperty('--accent', config.accentColor);
    }
    if (config.showStatus) root.classList.add('show-status');
    if (config.showBrowserFps === false) fpsEl.style.display = 'none';
    if (config.showEscapeHint === false) $('.cancel-hint').style.display = 'none';
  }

  window.addEventListener('message', ({ data }) => {
    if (!data || typeof data !== 'object') return;
    switch (data.eventName) {
      case 'loadProgress':
        applyProgress(data.loadFraction);
        break;
      case 'startDataFileEntries':
      case 'onDataFileEntry':
      case 'performMapLoadFunction':
        setStatus('Loading world assets…');
        break;
      case 'startInitFunction':
        setStatus('Initializing game…');
        break;
      case 'initFunctionInvoking':
        setStatus(typeof data.name === 'string' ? `Initializing ${data.name}` : 'Initializing game…');
        break;
      case 'onLogLine':
        // These are only shown if showStatus is enabled in config.js.
        if (config.showStatus && typeof data.message === 'string') setStatus(data.message);
        break;
      default:
        break;
    }
  });

  // Browser rendering frame rate; not the in-game FPS.
  let count = 0;
  let periodStart = 0;
  function fpsLoop(now) {
    if (!periodStart) periodStart = now;
    count += 1;
    const duration = now - periodStart;
    if (duration >= 1050) {
      const fps = Math.round(count * 1000 / duration);
      fpsEl.textContent = `${fps}fps`;
      periodStart = now;
      count = 0;
    }
    window.requestAnimationFrame(fpsLoop);
  }

  applyConfig();
  applyProgress(0);
  if (config.showBrowserFps !== false) window.requestAnimationFrame(fpsLoop);

  // Local HTML preview only: add ?preview=1 to the address. Never runs during
  // a normal FiveM connection because the loadscreen URL contains no preview flag.
  if (new URLSearchParams(window.location.search).get('preview') === '1') {
    let demo = 0;
    setStatus('Preview mode — loading sample assets…');
    const timer = window.setInterval(() => {
      demo = Math.min(1, demo + 0.025);
      applyProgress(demo);
      if (demo === 1) window.clearInterval(timer);
    }, 175);
  }
})();
