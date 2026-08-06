const WORKFLOW_HASH = "#workflows";
const STYLE_ID = "ee-workflow-nav-style";

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .ee-workflow-nav{width:100%;border:0;background:transparent;color:#dbe8f4;border-radius:9px;display:flex;align-items:center;gap:12px;padding:0 12px;cursor:pointer;white-space:nowrap;height:42px;margin-bottom:4px}
    .ee-workflow-nav:hover,.ee-workflow-nav.active{background:rgba(255,255,255,.16);color:#fff}
    .app-shell .ee-workflow-nav{color:#dfeaf4}
    .app-shell .ee-workflow-nav:hover,.app-shell .ee-workflow-nav.active{background:#174d80;color:#fff}
    .app.collapsed .ee-workflow-nav .nav-label{opacity:0;pointer-events:none}
  `;
  document.head.appendChild(style);
}

function makeButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ee-workflow-nav";
  button.dataset.workflowNav = "true";
  button.setAttribute("aria-label", "Workflow Studio");
  button.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1"></rect>
      <rect x="15" y="3" width="6" height="6" rx="1"></rect>
      <rect x="9" y="15" width="6" height="6" rx="1"></rect>
      <path d="M6 9v3h6"></path>
      <path d="M18 9v3h-6"></path>
      <path d="M12 12v3"></path>
    </svg>
    <span class="nav-label">Workflow Studio</span>
  `;
  button.addEventListener("click", () => {
    if (window.location.hash === WORKFLOW_HASH) return;
    window.location.hash = "workflows";
    window.location.reload();
  });
  return button;
}

function installNavigation() {
  installStyle();
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar || sidebar.querySelector('[data-workflow-nav="true"]')) return;

  const button = makeButton();
  const buttons = [...sidebar.querySelectorAll(":scope > button, nav > button")];
  const settingsButton = buttons.find((item) => /settings/i.test(item.textContent || ""));
  const analyticsButton = buttons.find((item) => /analytics|reports/i.test(item.textContent || ""));

  if (settingsButton?.parentElement === sidebar) {
    sidebar.insertBefore(button, settingsButton);
  } else if (analyticsButton?.parentElement) {
    analyticsButton.parentElement.insertBefore(button, analyticsButton.nextSibling);
  } else {
    const nav = sidebar.querySelector("nav");
    (nav || sidebar).appendChild(button);
  }
}

installNavigation();
new MutationObserver(installNavigation).observe(document.documentElement, { childList: true, subtree: true });
