const style=document.createElement('style');
style.id='ee-module-parity';
style.textContent=`
/* Shared page hierarchy */
header,.page-header,.g-header{min-height:68px!important;padding:0 20px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important}
header h1,.page-header h1,.g-header h1{margin:0!important;font-size:20px!important;line-height:1.2!important;color:#17212b!important}
header p,.page-header p,.g-header p{margin:4px 0 0!important;font-size:11px!important;color:#6f7b88!important}
.head-actions,.page-actions,.g-actions{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important}
.head-actions button,.page-actions button,.g-actions button{min-height:34px!important;padding:7px 11px!important;border-radius:8px!important;font-size:11px!important}
/* Shared content rhythm */
.prompt,.studio,.content,.page-content,.g-content{max-width:none!important}
.prompt{margin:14px 16px 10px!important}.understanding{margin:0 16px 10px!important}.studio{margin:0 16px 16px!important;gap:10px!important}
/* Shared filter + table controls */
.filters button,.filter-bar button,.toolbar button{min-height:34px!important;border-radius:8px!important;padding:7px 10px!important}
.filters input,.filters select,.filter-bar input,.filter-bar select,.toolbar input,.toolbar select{min-height:34px!important}
/* Shared drawers */
.drawer,.lead-drawer,.workspace-drawer{top:10px!important;bottom:10px!important;right:10px!important;height:auto!important;border:1px solid #dfe5ec!important}
.drawer-header{min-height:58px!important;padding:10px 14px!important}
/* Keep modules visually aligned with the shell */
.shell .side,.app-shell .sidebar,.g-shell .g-sidebar{display:none!important}
.shell main,.app-shell .main,.g-shell .g-main{margin-left:236px!important;width:auto!important}
body.ee-shell-collapsed .shell main,body.ee-shell-collapsed .app-shell .main,body.ee-shell-collapsed .g-shell .g-main{margin-left:72px!important}
/* Consistent scroll + focus */
*{scrollbar-width:thin;scrollbar-color:#cbd5df transparent}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #7ca5c9!important;outline-offset:2px!important}
@media(max-width:900px){header,.page-header,.g-header{padding:0 12px!important}.prompt{margin:10px 10px 8px!important}.understanding{margin:0 10px 8px!important}.studio{margin:0 10px 10px!important}.shell main,.app-shell .main,.g-shell .g-main{margin-left:72px!important}}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
