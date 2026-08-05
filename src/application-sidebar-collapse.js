const STYLE_ID = "application-sidebar-collapse-style";

function installStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .app-shell .sidebar {
      width: 236px !important;
      transition: width .22s ease !important;
      overflow: hidden !important;
    }
    .app-shell .main {
      margin-left: 236px !important;
      transition: margin-left .22s ease, margin-right .16s ease !important;
    }
    body.application-nav-collapsed .app-shell .sidebar {
      width: 72px !important;
    }
    body.application-nav-collapsed .app-shell .main {
      margin-left: 72px !important;
    }
    body.application-nav-collapsed .app-shell .sidebar .brand b,
    body.application-nav-collapsed .app-shell .sidebar button > span,
    body.application-nav-collapsed .app-shell .sidebar .sidebar-footer,
    body.application-nav-collapsed .app-shell .sidebar [class*="profile"] > :not(:first-child) {
      opacity: 0 !important;
      pointer-events: none !important;
      width: 0 !important;
      overflow: hidden !important;
      white-space: nowrap !important;
    }
    body.application-nav-collapsed .app-shell .sidebar .brand {
      justify-content: center !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    body.application-nav-collapsed .app-shell .sidebar button {
      justify-content: center !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      gap: 0 !important;
    }
  `;
  document.head.appendChild(style);
}

function initialise() {
  installStyles();
  const sidebar = document.querySelector(".app-shell .sidebar");
  if (!sidebar || sidebar.dataset.collapseReady === "true") return false;

  sidebar.dataset.collapseReady = "true";
  let timer;

  const collapse = () => document.body.classList.add("application-nav-collapsed");
  const expand = () => {
    clearTimeout(timer);
    document.body.classList.remove("application-nav-collapsed");
  };
  const scheduleCollapse = (delay = 3000) => {
    clearTimeout(timer);
    timer = window.setTimeout(collapse, delay);
  };

  sidebar.addEventListener("mouseenter", expand);
  sidebar.addEventListener("mouseleave", () => scheduleCollapse(500));
  scheduleCollapse(3000);
  return true;
}

if (!initialise()) {
  const observer = new MutationObserver(() => {
    if (initialise()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
}
