(function () {
  'use strict';

  var script = document.currentScript;
  var appUrl = (script.getAttribute('data-url') || '').replace(/\/$/, '');
  var buttonText = script.getAttribute('data-tekst') || 'Gratis Advies';
  var buttonColor = script.getAttribute('data-color') || '#1B4332';

  if (!appUrl) {
    console.error('[GuidedSelling] data-url attribuut is verplicht.');
    return;
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  var css = [
    '#gs-btn {',
    '  position: fixed;',
    '  bottom: 24px;',
    '  right: 24px;',
    '  z-index: 2147483646;',
    '  display: flex;',
    '  align-items: center;',
    '  gap: 8px;',
    '  padding: 14px 22px;',
    '  background: ' + buttonColor + ';',
    '  color: #fff;',
    '  border: none;',
    '  border-radius: 50px;',
    '  font-family: system-ui, -apple-system, sans-serif;',
    '  font-size: 15px;',
    '  font-weight: 600;',
    '  cursor: pointer;',
    '  box-shadow: 0 4px 20px rgba(0,0,0,0.22);',
    '  transition: transform 0.15s ease, box-shadow 0.15s ease;',
    '  line-height: 1;',
    '}',
    '#gs-btn:hover {',
    '  transform: translateY(-2px);',
    '  box-shadow: 0 8px 28px rgba(0,0,0,0.28);',
    '}',
    '#gs-btn svg { flex-shrink: 0; }',

    '#gs-overlay {',
    '  display: none;',
    '  position: fixed;',
    '  inset: 0;',
    '  z-index: 2147483647;',
    '  background: rgba(0,0,0,0.55);',
    '  align-items: center;',
    '  justify-content: center;',
    '  padding: 16px;',
    '  backdrop-filter: blur(2px);',
    '}',
    '#gs-overlay.gs-open { display: flex; }',

    '#gs-modal {',
    '  position: relative;',
    '  width: 100%;',
    '  max-width: 480px;',
    '  height: min(680px, 90vh);',
    '  background: #fff;',
    '  border-radius: 20px;',
    '  overflow: hidden;',
    '  box-shadow: 0 24px 64px rgba(0,0,0,0.35);',
    '  animation: gs-pop 0.2s ease;',
    '}',
    '@keyframes gs-pop {',
    '  from { opacity: 0; transform: scale(0.96) translateY(8px); }',
    '  to   { opacity: 1; transform: scale(1)    translateY(0);   }',
    '}',

    '#gs-close {',
    '  position: absolute;',
    '  top: 12px;',
    '  right: 12px;',
    '  z-index: 1;',
    '  width: 32px;',
    '  height: 32px;',
    '  border: none;',
    '  border-radius: 50%;',
    '  background: rgba(0,0,0,0.18);',
    '  color: #fff;',
    '  font-size: 16px;',
    '  line-height: 1;',
    '  cursor: pointer;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  transition: background 0.15s;',
    '}',
    '#gs-close:hover { background: rgba(0,0,0,0.32); }',

    '#gs-iframe {',
    '  width: 100%;',
    '  height: 100%;',
    '  border: none;',
    '  display: block;',
    '}',

    '@media (max-width: 520px) {',
    '  #gs-modal {',
    '    max-width: 100%;',
    '    height: 100%;',
    '    border-radius: 0;',
    '  }',
    '  #gs-overlay { padding: 0; }',
    '}',
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Floating button ──────────────────────────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'gs-btn';
  btn.setAttribute('aria-label', buttonText);
  btn.innerHTML =
    '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />' +
    '</svg>' +
    buttonText;
  document.body.appendChild(btn);

  // ── Modal overlay ────────────────────────────────────────────────────────────
  var overlay = document.createElement('div');
  overlay.id = 'gs-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', buttonText);
  overlay.innerHTML =
    '<div id="gs-modal">' +
      '<button id="gs-close" aria-label="Sluiten">&#x2715;</button>' +
      '<iframe id="gs-iframe" src="" allow="microphone" allowfullscreen></iframe>' +
    '</div>';
  document.body.appendChild(overlay);

  var iframe = document.getElementById('gs-iframe');
  var closeBtn = document.getElementById('gs-close');
  var isOpen = false;

  // ── Open / close ─────────────────────────────────────────────────────────────
  function openWidget() {
    if (isOpen) return;
    isOpen = true;
    iframe.src = appUrl + '/?embed=1';
    overlay.classList.add('gs-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeWidget() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove('gs-open');
    document.body.style.overflow = '';
    // Reset iframe na korte delay zodat de sluit-animatie klaar is
    setTimeout(function () { iframe.src = ''; }, 300);
    btn.focus();
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  btn.addEventListener('click', openWidget);
  closeBtn.addEventListener('click', closeWidget);

  // Klik buiten modal sluit de widget
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeWidget();
  });

  // Escape-toets sluit de widget
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeWidget();
  });

  // postMessage van iframe (na form submit) sluit de widget
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'gs-close') closeWidget();
  });
})();
