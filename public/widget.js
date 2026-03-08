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
    '  z-index: 2147483645;',
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
    '  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.2s ease;',
    '  line-height: 1;',
    '}',
    '#gs-btn:hover {',
    '  transform: translateY(-2px);',
    '  box-shadow: 0 8px 28px rgba(0,0,0,0.28);',
    '}',
    '#gs-btn.gs-hidden {',
    '  opacity: 0;',
    '  pointer-events: none;',
    '}',
    '#gs-btn svg { flex-shrink: 0; }',

    '#gs-panel {',
    '  position: fixed;',
    '  top: 0;',
    '  right: 0;',
    '  bottom: 0;',
    '  z-index: 2147483647;',
    '  width: 420px;',
    '  max-width: 100vw;',
    '  background: #fff;',
    '  box-shadow: -8px 0 40px rgba(0,0,0,0.18);',
    '  transform: translateX(100%);',
    '  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);',
    '  display: flex;',
    '  flex-direction: column;',
    '}',
    '#gs-panel.gs-open {',
    '  transform: translateX(0);',
    '}',

    '#gs-panel-header {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  padding: 14px 16px;',
    '  border-bottom: 1px solid rgba(0,0,0,0.08);',
    '  background: ' + buttonColor + ';',
    '  flex-shrink: 0;',
    '}',
    '#gs-panel-title {',
    '  font-family: system-ui, -apple-system, sans-serif;',
    '  font-size: 15px;',
    '  font-weight: 600;',
    '  color: #fff;',
    '  margin: 0;',
    '}',
    '#gs-close {',
    '  width: 32px;',
    '  height: 32px;',
    '  border: none;',
    '  border-radius: 50%;',
    '  background: rgba(255,255,255,0.2);',
    '  color: #fff;',
    '  font-size: 16px;',
    '  line-height: 1;',
    '  cursor: pointer;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  transition: background 0.15s;',
    '  flex-shrink: 0;',
    '}',
    '#gs-close:hover { background: rgba(255,255,255,0.32); }',

    '#gs-iframe {',
    '  width: 100%;',
    '  flex: 1;',
    '  border: none;',
    '  display: block;',
    '  min-height: 0;',
    '}',

    '@media (max-width: 480px) {',
    '  #gs-panel { width: 100vw; }',
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

  // ── Side panel ───────────────────────────────────────────────────────────────
  var panel = document.createElement('div');
  panel.id = 'gs-panel';
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', buttonText);
  panel.innerHTML =
    '<div id="gs-panel-header">' +
      '<span id="gs-panel-title">' + buttonText + '</span>' +
      '<button id="gs-close" aria-label="Sluiten">&#x2715;</button>' +
    '</div>' +
    '<iframe id="gs-iframe" src="" allow="microphone" allowfullscreen></iframe>';
  document.body.appendChild(panel);

  var iframe = document.getElementById('gs-iframe');
  var closeBtn = document.getElementById('gs-close');
  var isOpen = false;

  // ── Open / close ─────────────────────────────────────────────────────────────
  function openWidget() {
    if (isOpen) return;
    isOpen = true;
    iframe.src = appUrl + '/?embed=1';
    panel.classList.add('gs-open');
    btn.classList.add('gs-hidden');
    closeBtn.focus();
  }

  function closeWidget() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('gs-open');
    btn.classList.remove('gs-hidden');
    setTimeout(function () { iframe.src = ''; }, 300);
    btn.focus();
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  btn.addEventListener('click', openWidget);
  closeBtn.addEventListener('click', closeWidget);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeWidget();
  });

  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'gs-close') closeWidget();
  });
})();
