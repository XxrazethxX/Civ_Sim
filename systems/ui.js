export const uiSystem = {
  id: 'ui',
  owns: ['render scheduling', 'tooltips', 'modals', 'masonry layout', 'accessibility labels', 'device classes'],
  qualityRule: 'UI helpers may read simulation state but should not advance gameplay.'
};

export function normalizeNativeTooltips(root = document) {
  root.querySelectorAll('[title]').forEach(el => {
    const value = el.getAttribute('title');
    if (!value) return;
    el.dataset.uiTip = el.dataset.uiTip || value;
    el.removeAttribute('title');
    if (!el.getAttribute('aria-label') && ['BUTTON', 'SELECT'].includes(el.tagName)) {
      el.setAttribute('aria-label', (el.textContent || el.value || value).trim().replace(/\s+/g, ' '));
    }
  });
}

export function createRenderScheduler(renderers) {
  let lastActiveTab = '';
  let lastSecond = -1;
  return function schedule({ activeTab, time, dropdownActive }) {
    const activeChanged = activeTab !== lastActiveTab;
    const secondChanged = time !== lastSecond;
    lastActiveTab = activeTab;
    lastSecond = time;
    if (dropdownActive) return { fullTab: false, hud: true };
    if (activeChanged) return { fullTab: true, hud: true };
    if (['Military', 'Trade', 'Population'].includes(activeTab)) return { fullTab: false, hud: secondChanged };
    return { fullTab: true, hud: true };
  };
}

export function createInspectorHost({
  id = 'inspectorHost',
  titleId = 'inspectorTitle',
  bodyId = 'inspectorBody',
  documentRef = document,
  onOpen,
  onClose
} = {}) {
  let host = documentRef.getElementById(id);
  if (!host) {
    host = documentRef.createElement('aside');
    host.id = id;
    documentRef.body.appendChild(host);
  }
  host.classList.add('inspector-host');
  host.setAttribute('role', 'complementary');
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = `
    <section class="inspector-panel" aria-labelledby="${titleId}" tabindex="-1">
      <div class="inspector-head">
        <div>
          <div class="inspector-kicker">Inspector</div>
          <h2 id="${titleId}">Details</h2>
          <div class="inspector-subtitle" id="inspectorSubtitle"></div>
        </div>
        <button class="detail-close inspector-close" type="button" data-inspector-close aria-label="Close inspector">x</button>
      </div>
      <div class="inspector-body" id="${bodyId}"></div>
    </section>
  `;

  const panel = host.querySelector('.inspector-panel');
  const title = host.querySelector(`#${titleId}`);
  const subtitle = host.querySelector('#inspectorSubtitle');
  const body = host.querySelector(`#${bodyId}`);
  const closeButton = host.querySelector('[data-inspector-close]');
  let previousFocus = null;

  function close({ restoreFocus = true } = {}) {
    if (!host.classList.contains('show')) return;
    host.classList.remove('show');
    host.setAttribute('aria-hidden', 'true');
    documentRef.body.classList.remove('inspector-open');
    if (restoreFocus && previousFocus && documentRef.contains(previousFocus)) {
      previousFocus.focus();
    }
    previousFocus = null;
    onClose?.();
  }

  function open({ title: nextTitle = 'Details', subtitle: nextSubtitle = '', html = '' } = {}) {
    previousFocus = documentRef.activeElement;
    title.textContent = nextTitle;
    subtitle.textContent = nextSubtitle;
    subtitle.style.display = nextSubtitle ? '' : 'none';
    body.innerHTML = html;
    host.classList.add('show');
    host.setAttribute('aria-hidden', 'false');
    documentRef.body.classList.add('inspector-open');
    onOpen?.(body);
    requestAnimationFrame(() => (closeButton || panel)?.focus());
  }

  closeButton.onclick = () => close();
  documentRef.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !host.classList.contains('show')) return;
    if (documentRef.querySelector('.detail-overlay.show')) return;
    event.preventDefault();
    close();
  });

  return {
    host,
    panel,
    body,
    open,
    close,
    isOpen: () => host.classList.contains('show')
  };
}
