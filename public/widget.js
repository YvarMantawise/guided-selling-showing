/**
 * Berino Hair & Scalp Analysis Widget
 * Embed op elke website met: <script src="https://jouwdomein.com/widget.js"></script>
 */
(function () {
  'use strict';

  // ─── API base URL detecteren ───────────────────────────────────────────────
  var apiBase = '';
  var scripts = document.querySelectorAll('script[src]');
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute('src') || '';
    if (src.indexOf('widget.js') !== -1) {
      try {
        var u = new URL(src, window.location.href);
        apiBase = u.origin;
      } catch (e) { /* ignore */ }
      break;
    }
  }
  if (!apiBase) {
    console.error('[Berino Widget] Kan API base URL niet detecteren.');
    return;
  }

  // ─── State ─────────────────────────────────────────────────────────────────
  var state = {
    open: false,
    loading: false,
    canFinish: false,
    threadId: null, // OpenAI thread ID — bijgehouden over meerdere berichten
    stage: 'chat', // 'chat' | 'form' | 'submitting' | 'done'
    messages: [
      {
        role: 'assistant',
        content: 'Welkom \uD83D\uDC9A Dit is de Berino AI \u2014 een digitale haar- en hoofdhuidanalyse. Beantwoord een paar korte vragen en ontvang persoonlijk advies. Waar loop je op dit moment tegenaan?',
      },
    ],
  };

  // ─── CSS injecteren ────────────────────────────────────────────────────────
  var css = [
    '#bw-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#2D5A45;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(27,67,50,0.35);transition:transform .2s,background .2s;z-index:99998}',
    '#bw-btn:hover{background:#1B4332;transform:scale(1.05)}',
    '#bw-btn svg{width:24px;height:24px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#bw-panel{position:fixed;bottom:92px;right:24px;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.16);display:flex;flex-direction:column;overflow:hidden;z-index:99997;transform:translateY(20px) scale(0.97);opacity:0;pointer-events:none;transition:transform .25s ease,opacity .25s ease}',
    '#bw-panel.bw-open{transform:translateY(0) scale(1);opacity:1;pointer-events:all}',
    '#bw-header{background:#2D5A45;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}',
    '#bw-header-title{font-family:system-ui,sans-serif;font-size:15px;font-weight:600;display:flex;align-items:center;gap:8px}',
    '#bw-header-title span.bw-dot{width:8px;height:8px;background:#CAD2C5;border-radius:50%;display:inline-block}',
    '#bw-close{background:none;border:none;cursor:pointer;padding:4px;color:rgba(255,255,255,0.7);line-height:1}',
    '#bw-close:hover{color:#fff}',
    '#bw-close svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}',
    '#bw-progress-bar{flex-shrink:0;padding:10px 16px;background:#FAFAF8;border-bottom:1px solid #CAD2C5}',
    '#bw-progress-track{background:#CAD2C5;border-radius:4px;height:4px;overflow:hidden}',
    '#bw-progress-fill{height:100%;background:#2D5A45;border-radius:4px;transition:width .4s ease}',
    '#bw-progress-label{font-family:system-ui,sans-serif;font-size:11px;color:#6B6B6B;margin-top:4px}',
    '#bw-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:linear-gradient(to bottom,#FAFAF8,#fff)}',
    '.bw-msg{max-width:85%;font-family:system-ui,sans-serif;font-size:14px;line-height:1.55;padding:10px 14px;border-radius:12px;word-break:break-word}',
    '.bw-msg-assistant{background:#F5F1EB;color:#2F2F2F;align-self:flex-start;border-bottom-left-radius:4px}',
    '.bw-msg-user{background:#2D5A45;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}',
    '#bw-typing{align-self:flex-start;display:flex;gap:4px;padding:10px 14px;background:#F5F1EB;border-radius:12px;border-bottom-left-radius:4px}',
    '#bw-typing span{width:7px;height:7px;background:#52796F;border-radius:50%;animation:bwBounce 1.2s infinite}',
    '#bw-typing span:nth-child(2){animation-delay:.15s}',
    '#bw-typing span:nth-child(3){animation-delay:.3s}',
    '@keyframes bwBounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}',
    '#bw-input-area{padding:12px;border-top:1px solid #CAD2C5;background:#fff;flex-shrink:0}',
    '#bw-input-row{display:flex;gap:8px}',
    '#bw-input{flex:1;padding:10px 14px;border:1.5px solid #CAD2C5;border-radius:10px;font-family:system-ui,sans-serif;font-size:14px;color:#2F2F2F;background:#FAFAF8;outline:none;transition:border-color .2s}',
    '#bw-input:focus{border-color:#2D5A45}',
    '#bw-input:disabled{opacity:.5}',
    '#bw-send{width:40px;height:40px;background:#2D5A45;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}',
    '#bw-send:hover{background:#1B4332}',
    '#bw-send:disabled{opacity:.4;cursor:not-allowed}',
    '#bw-send svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#bw-finish-btn{margin-top:8px;width:100%;padding:10px;background:#2D5A45;color:#fff;border:none;border-radius:10px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;display:none}',
    '#bw-finish-btn:hover{background:#1B4332}',
    '#bw-form{padding:16px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;flex:1}',
    '.bw-form-group{display:flex;flex-direction:column;gap:4px}',
    '.bw-label{font-family:system-ui,sans-serif;font-size:13px;font-weight:600;color:#2F2F2F}',
    '.bw-field{padding:10px 12px;border:1.5px solid #CAD2C5;border-radius:10px;font-family:system-ui,sans-serif;font-size:14px;color:#2F2F2F;background:#FAFAF8;outline:none;transition:border-color .2s;-webkit-appearance:none}',
    '.bw-field:focus{border-color:#2D5A45}',
    '#bw-form-submit{padding:12px;background:#2D5A45;color:#fff;border:none;border-radius:10px;font-family:system-ui,sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:background .2s;margin-top:4px}',
    '#bw-form-submit:hover{background:#1B4332}',
    '#bw-form-submit:disabled{opacity:.5;cursor:not-allowed}',
    '#bw-form-back{padding:10px;background:none;border:none;color:#52796F;font-family:system-ui,sans-serif;font-size:13px;cursor:pointer;text-decoration:underline}',
    '#bw-done{padding:24px 16px;text-align:center;font-family:system-ui,sans-serif;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}',
    '#bw-done p{color:#6B6B6B;font-size:14px;line-height:1.6;max-width:280px}',
    '#bw-spinner{width:20px;height:20px;border:2px solid #CAD2C5;border-top-color:#2D5A45;border-radius:50%;animation:bwSpin .8s linear infinite;display:inline-block}',
    '@keyframes bwSpin{to{transform:rotate(360deg)}}',
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── DOM bouwen ────────────────────────────────────────────────────────────
  // Floating button
  var btn = document.createElement('button');
  btn.id = 'bw-btn';
  btn.setAttribute('aria-label', 'Haar & Hoofdhuid Analyse');
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  // Panel
  var panel = document.createElement('div');
  panel.id = 'bw-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Berino Haar & Hoofdhuid Analyse');

  panel.innerHTML = [
    // Header
    '<div id="bw-header">',
    '  <div id="bw-header-title"><span class="bw-dot"></span>Haar & Hoofdhuid Analyse</div>',
    '  <button id="bw-close" aria-label="Sluiten">',
    '    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    '  </button>',
    '</div>',

    // Progress bar (chat stage only)
    '<div id="bw-progress-bar">',
    '  <div id="bw-progress-track"><div id="bw-progress-fill" style="width:0%"></div></div>',
    '  <div id="bw-progress-label">Analyse wordt opgebouwd...</div>',
    '</div>',

    // Chat messages
    '<div id="bw-messages"></div>',

    // Input area
    '<div id="bw-input-area">',
    '  <div id="bw-input-row">',
    '    <input id="bw-input" type="text" placeholder="Type je antwoord..." autocomplete="off"/>',
    '    <button id="bw-send" aria-label="Verstuur">',
    '      <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    '    </button>',
    '  </div>',
    '  <button id="bw-finish-btn">Rapport aanvragen \u2192</button>',
    '</div>',

    // Form (hidden initially via JS)
    '<div id="bw-form" style="display:none">',
    '  <p style="font-family:system-ui,sans-serif;font-size:14px;color:#6B6B6B;margin:0">Nog één stap \u2014 vul je gegevens in om je persoonlijk rapport te ontvangen.</p>',
    '  <div class="bw-form-group"><label class="bw-label" for="bw-naam">Naam</label><input class="bw-field" id="bw-naam" type="text" placeholder="Jouw naam" autocomplete="name"/></div>',
    '  <div class="bw-form-group"><label class="bw-label" for="bw-email">E-mailadres</label><input class="bw-field" id="bw-email" type="email" placeholder="jij@voorbeeld.nl" autocomplete="email"/></div>',
    '  <div class="bw-form-group"><label class="bw-label" for="bw-geslacht">Geslacht</label>',
    '    <select class="bw-field" id="bw-geslacht">',
    '      <option value="">Selecteer</option>',
    '      <option value="vrouw">Vrouw</option>',
    '      <option value="man">Man</option>',
    '      <option value="anders">Anders / zeg ik liever niet</option>',
    '    </select>',
    '  </div>',
    '  <div class="bw-form-group"><label class="bw-label" for="bw-leeftijd">Leeftijd</label>',
    '    <select class="bw-field" id="bw-leeftijd">',
    '      <option value="">Selecteer je leeftijd</option>',
    '      <option value="0-20">0\u201320 jaar</option>',
    '      <option value="21-30">21\u201330 jaar</option>',
    '      <option value="31-40">31\u201340 jaar</option>',
    '      <option value="41-50">41\u201350 jaar</option>',
    '      <option value="51-60">51\u201360 jaar</option>',
    '      <option value="60+">60+ jaar</option>',
    '    </select>',
    '  </div>',
    '  <button id="bw-form-submit">Verstuur en ontvang mijn rapport</button>',
    '  <button id="bw-form-back">Terug naar het gesprek</button>',
    '</div>',

    // Done state
    '<div id="bw-done" style="display:none">',
    '  <div id="bw-spinner"></div>',
    '  <p>Je analyse wordt voorbereid. We sturen je zo door naar je persoonlijke adviespagina...</p>',
    '</div>',
  ].join('');

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  // ─── Shortcuts naar DOM elementen ─────────────────────────────────────────
  var elMessages  = panel.querySelector('#bw-messages');
  var elInput     = panel.querySelector('#bw-input');
  var elSend      = panel.querySelector('#bw-send');
  var elFinish    = panel.querySelector('#bw-finish-btn');
  var elProgress  = panel.querySelector('#bw-progress-fill');
  var elProgLabel = panel.querySelector('#bw-progress-label');
  var elProgressBar = panel.querySelector('#bw-progress-bar');
  var elInputArea = panel.querySelector('#bw-input-area');
  var elForm      = panel.querySelector('#bw-form');
  var elDone      = panel.querySelector('#bw-done');
  var elNaam      = panel.querySelector('#bw-naam');
  var elEmail     = panel.querySelector('#bw-email');
  var elGeslacht  = panel.querySelector('#bw-geslacht');
  var elLeeftijd  = panel.querySelector('#bw-leeftijd');
  var elFormSubmit = panel.querySelector('#bw-form-submit');
  var elFormBack  = panel.querySelector('#bw-form-back');

  // ─── Hulpfuncties ──────────────────────────────────────────────────────────
  function scrollToBottom() {
    elMessages.scrollTop = elMessages.scrollHeight;
  }

  function addMessage(role, content) {
    var el = document.createElement('div');
    el.className = 'bw-msg bw-msg-' + role;
    el.textContent = content;
    elMessages.appendChild(el);
    scrollToBottom();
  }

  function showTyping() {
    var el = document.createElement('div');
    el.id = 'bw-typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    elMessages.appendChild(el);
    scrollToBottom();
    return el;
  }

  function removeTyping() {
    var el = panel.querySelector('#bw-typing');
    if (el) el.parentNode.removeChild(el);
  }

  function updateProgress() {
    var userCount = state.messages.filter(function (m) { return m.role === 'user'; }).length;
    var pct = state.canFinish ? 100 : Math.min(userCount * 8, 90);
    elProgress.style.width = pct + '%';
    elProgLabel.textContent = state.canFinish ? 'Klaar om af te ronden' : 'Analyse wordt opgebouwd...';
  }

  function setLoading(val) {
    state.loading = val;
    elInput.disabled = val;
    elSend.disabled = val;
  }

  function showStage(stage) {
    state.stage = stage;
    var isChat = stage === 'chat';
    var isForm = stage === 'form';
    var isDone = stage === 'done';

    elMessages.style.display    = isChat ? 'flex' : 'none';
    elInputArea.style.display   = isChat ? 'block' : 'none';
    elProgressBar.style.display = isChat ? 'block' : 'none';
    elForm.style.display        = isForm ? 'flex' : 'none';
    elDone.style.display        = isDone ? 'flex' : 'none';
  }

  // ─── Chat flow ─────────────────────────────────────────────────────────────
  // Render initial message
  addMessage('assistant', state.messages[0].content);
  updateProgress();

  async function sendMessage(content) {
    if (!content.trim() || state.loading) return;

    var userMsg = { role: 'user', content: content.trim() };
    state.messages.push(userMsg);
    addMessage('user', userMsg.content);
    elInput.value = '';
    setLoading(true);

    showTyping();

    try {
      var resp = await fetch(apiBase + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.messages.map(function (m) { return { role: m.role, content: m.content }; }),
          threadId: state.threadId,
        }),
      });

      if (!resp.ok) throw new Error('API fout: ' + resp.status);
      var data = await resp.json();

      removeTyping();

      // Sla threadId op voor vervolggesprekken
      if (data.threadId && !state.threadId) {
        state.threadId = data.threadId;
      }

      var assistantMsg = { role: 'assistant', content: data.content };
      state.messages.push(assistantMsg);
      addMessage('assistant', assistantMsg.content);

      if (data.analyseKlaar && !state.canFinish) {
        state.canFinish = true;
        elFinish.style.display = 'block';
      }

      updateProgress();
    } catch (err) {
      removeTyping();
      var errEl = document.createElement('div');
      errEl.style.cssText = 'font-family:system-ui,sans-serif;font-size:13px;color:#dc2626;padding:8px 12px;background:#fef2f2;border-radius:8px';
      errEl.textContent = 'Er ging iets mis. Probeer het opnieuw.';
      elMessages.appendChild(errEl);
      scrollToBottom();
    } finally {
      setLoading(false);
      elInput.focus();
    }
  }

  // ─── Form submit ───────────────────────────────────────────────────────────
  async function submitForm() {
    var naam     = elNaam.value.trim();
    var email    = elEmail.value.trim();
    var geslacht = elGeslacht.value;
    var leeftijd = elLeeftijd.value;

    if (!naam || !email || !geslacht || !leeftijd) {
      alert('Vul alle velden in.');
      return;
    }

    elFormSubmit.disabled = true;
    elFormSubmit.textContent = 'Even geduld...';
    showStage('done');

    try {
      var resp = await fetch(apiBase + '/api/submit-analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          naam: naam,
          email: email,
          geslacht: geslacht,
          leeftijd: leeftijd,
          transcript: state.messages.map(function (m) { return { role: m.role, content: m.content }; }),
        }),
      });

      if (!resp.ok) throw new Error('Submit fout: ' + resp.status);
      var data = await resp.json();

      // Open advies pagina in nieuw tabblad (widget blijft op Shopify store)
      window.open(data.redirectUrl, '_blank');

      // Sluit widget na redirect
      setTimeout(function () { togglePanel(false); }, 1500);
    } catch (err) {
      showStage('form');
      elFormSubmit.disabled = false;
      elFormSubmit.textContent = 'Verstuur en ontvang mijn rapport';
      alert('Er ging iets mis. Probeer het opnieuw.');
    }
  }

  // ─── Panel open/close ──────────────────────────────────────────────────────
  function togglePanel(force) {
    state.open = typeof force === 'boolean' ? force : !state.open;
    if (state.open) {
      panel.classList.add('bw-open');
      elInput.focus();
    } else {
      panel.classList.remove('bw-open');
    }
    // Toggle icon: chat vs sluit
    btn.innerHTML = state.open
      ? '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" stroke-width="2" fill="none"/></svg>';
  }

  // ─── Event listeners ───────────────────────────────────────────────────────
  btn.addEventListener('click', function () { togglePanel(); });
  panel.querySelector('#bw-close').addEventListener('click', function () { togglePanel(false); });

  elSend.addEventListener('click', function () { sendMessage(elInput.value); });
  elInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(elInput.value);
    }
  });

  elFinish.addEventListener('click', function () { showStage('form'); });
  elFormBack.addEventListener('click', function () { showStage('chat'); });
  elFormSubmit.addEventListener('click', function () { submitForm(); });

})();
