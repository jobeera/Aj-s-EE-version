const STYLE_ID = "extraaedge-apply-controls-style";

function installStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .ee-apply-footer{position:sticky;bottom:0;display:flex;justify-content:flex-end;gap:10px;padding:12px 14px;margin:12px -14px -14px;background:#fff;border-top:1px solid #e3e8ef;box-shadow:0 -8px 18px rgba(15,35,55,.06);z-index:5}
    .ee-apply-footer button{min-width:92px;border-radius:8px;padding:9px 14px;font-weight:700;font-size:12px;cursor:pointer}
    .ee-cancel-button{background:#fff;border:1px solid #cfd8e3;color:#344054}
    .ee-apply-button{background:#0c3154;border:1px solid #0c3154;color:#fff}
    .ee-apply-button:hover{background:#082845}
    .columns-panel .ee-apply-footer{margin-left:-18px;margin-right:-18px;margin-bottom:-18px}
    .filter-builder .ee-apply-footer{margin-left:-12px;margin-right:-12px;margin-bottom:-12px}
  `;
  document.head.appendChild(style);
}

function clickToolbarButton(labelPattern) {
  const buttons = [...document.querySelectorAll(".toolbar-actions button")];
  const button = buttons.find((item) => labelPattern.test((item.textContent || "").trim()));
  button?.click();
}

function closePanel(panel) {
  if (panel.classList.contains("columns-panel")) clickToolbarButton(/^Columns$/i);
  if (panel.classList.contains("filter-builder")) clickToolbarButton(/Add Filter/i);
}

function enhanceColumns(panel) {
  if (panel.dataset.applyControls === "true") return;
  panel.dataset.applyControls = "true";
  const initialChecks = [...panel.querySelectorAll('input[type="checkbox"]')].map((input) => input.checked);
  const initialOrder = [...panel.querySelectorAll(':scope > div:not(.ee-apply-footer)')].map((row) => row.textContent.trim());

  const footer = buildFooter(
    () => closePanel(panel),
    () => {
      [...panel.querySelectorAll('input[type="checkbox"]')].forEach((input, index) => {
        if (input.checked !== initialChecks[index]) input.click();
      });
      const rows = [...panel.querySelectorAll(':scope > div:not(.ee-apply-footer)')];
      initialOrder.forEach((label) => {
        const row = rows.find((item) => item.textContent.trim() === label);
        if (row) panel.insertBefore(row, footer);
      });
      closePanel(panel);
    }
  );
  panel.appendChild(footer);
}

function enhanceFilters(panel) {
  if (panel.dataset.applyControls === "true") return;
  panel.dataset.applyControls = "true";
  const initialChipCount = document.querySelectorAll(".filter-chip").length;
  const footer = buildFooter(
    () => closePanel(panel),
    () => {
      const chips = [...document.querySelectorAll(".filter-chip")];
      chips.slice(initialChipCount).reverse().forEach((chip) => chip.querySelector("button")?.click());
      closePanel(panel);
    }
  );
  panel.appendChild(footer);
}

function buildFooter(onApply, onCancel) {
  const footer = document.createElement("div");
  footer.className = "ee-apply-footer";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "ee-cancel-button";
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onCancel();
  });

  const apply = document.createElement("button");
  apply.type = "button";
  apply.className = "ee-apply-button";
  apply.textContent = "Apply";
  apply.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onApply();
  });

  footer.append(cancel, apply);
  return footer;
}

function scan() {
  document.querySelectorAll(".columns-panel").forEach(enhanceColumns);
  document.querySelectorAll(".filter-builder").forEach(enhanceFilters);
}

installStyles();
scan();
new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
