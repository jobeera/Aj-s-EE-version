const style=document.createElement('style');
style.id='ee-product-system';
style.textContent=`
:root{--ee-bg:#f5f7fa;--ee-surface:#fff;--ee-border:#e3e8ef;--ee-text:#17212b;--ee-muted:#6f7b88;--ee-navy:#0c3154;--ee-navy-2:#174d80;--ee-orange:#f57b20;--ee-radius:12px;--ee-shadow:0 1px 2px rgba(16,24,40,.04);--ee-page-pad:20px}
html,body,#root{min-height:100%;background:var(--ee-bg)}
body{margin:0;color:var(--ee-text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.main,.g-main,main{box-sizing:border-box;background:var(--ee-bg)!important;min-height:100vh}
.main>*,.g-main>*,main>*{box-sizing:border-box}
.card,.g-card,.panel,.metric-card,.analytics-card{background:var(--ee-surface)!important;border:1px solid var(--ee-border)!important;border-radius:var(--ee-radius)!important;box-shadow:var(--ee-shadow)!important}
button,input,select,textarea{font:inherit;box-sizing:border-box}
button{transition:background .14s ease,border-color .14s ease,box-shadow .14s ease,transform .08s ease}button:active{transform:translateY(1px)}
button.primary,.btn-primary,.g-primary,.save,.publish{background:var(--ee-orange)!important;border-color:var(--ee-orange)!important;color:#fff!important;border-radius:9px!important}
button.secondary,.btn-secondary{background:#fff!important;color:var(--ee-navy)!important;border:1px solid var(--ee-border)!important;border-radius:9px!important}
input,select,textarea{border:1px solid #d8e0ea!important;border-radius:8px!important;background:#fff!important;color:var(--ee-text)!important;outline:none}input:focus,select:focus,textarea:focus{border-color:#91a9bf!important;box-shadow:0 0 0 3px rgba(23,77,128,.08)!important}
table{border-collapse:separate!important;border-spacing:0!important;background:#fff}th{font-size:11px!important;font-weight:650!important;color:#5e6b78!important;background:#f8fafc!important;border-bottom:1px solid var(--ee-border)!important}td{border-bottom:1px solid #edf1f5!important;color:#26313c}tr:hover td{background:#fbfcfe}
.drawer,.lead-drawer,.workspace-drawer{border-radius:16px 0 0 16px!important;box-shadow:-10px 0 30px rgba(16,24,40,.12)!important;overflow:hidden}
.drawer-header{border-bottom:1px solid var(--ee-border)!important;background:#fff!important}
.badge,.pill,.chip{border-radius:999px!important;font-weight:600}
.page-header,.g-header{background:#fff!important;border-bottom:1px solid var(--ee-border)!important}
.toolbar,.filters,.filter-bar{gap:8px!important}
.modal,.popover,.dropdown-menu{border:1px solid var(--ee-border)!important;border-radius:12px!important;box-shadow:0 12px 34px rgba(16,24,40,.14)!important}
@media(max-width:900px){:root{--ee-page-pad:12px}.drawer,.lead-drawer,.workspace-drawer{border-radius:12px 0 0 12px!important}}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
