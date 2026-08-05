const COLLAPSED_NAV_WIDTH = 72;
const DRAWER_GAP = 10;
const MIN_DRAWER_WIDTH = 380;

let dragging = false;

function drawer() {
  return document.querySelector('.drawer');
}

function resizeTo(clientX) {
  const panel = drawer();
  if (!panel) return;
  const maxWidth = window.innerWidth - COLLAPSED_NAV_WIDTH - DRAWER_GAP;
  const requestedWidth = window.innerWidth - clientX - DRAWER_GAP;
  const width = Math.min(maxWidth, Math.max(MIN_DRAWER_WIDTH, requestedWidth));
  panel.style.setProperty('width', `${width}px`, 'important');
  panel.style.setProperty('max-width', `calc(100vw - ${COLLAPSED_NAV_WIDTH + DRAWER_GAP}px)`, 'important');
}

document.addEventListener('mousedown', (event) => {
  if (!event.target.closest('.resize-handle')) return;
  dragging = true;
  document.querySelector('.app')?.classList.add('collapsed');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  event.preventDefault();
}, true);

window.addEventListener('mousemove', (event) => {
  if (!dragging) return;
  resizeTo(event.clientX);
});

window.addEventListener('mouseup', () => {
  if (!dragging) return;
  dragging = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

window.addEventListener('resize', () => {
  const panel = drawer();
  if (!panel) return;
  const maxWidth = window.innerWidth - COLLAPSED_NAV_WIDTH - DRAWER_GAP;
  if (panel.getBoundingClientRect().width > maxWidth) {
    panel.style.setProperty('width', `${maxWidth}px`, 'important');
  }
});
