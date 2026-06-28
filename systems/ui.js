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
