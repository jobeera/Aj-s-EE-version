const isApplications = () => window.location.hash === "#applications";
const FILTERS = ["Status","Sub-status","Source","Campaign","Program","Specialization","Intake","Counselor","Owner","Priority","Temperature","AI Score","Health Score","Progress %","Documents Uploaded","Payment Status","Fee Paid","City","State","Scholarship","Created Date","Updated Date","Last Activity","Last Call","Last WhatsApp"];

const style = document.createElement("style");
style.textContent = `
.ee-parity-toolbar{display:flex;justify-content:flex-end;gap:6px;padding:7px 8px;background:#fff;border:1px solid #e1e7ee;border-top:0}
.ee-parity-toolbar button,.ee-footer button{border:1px solid #d7e0e9;background:#fff;border-radius:8px;padding:7px 10px;font-size:10px;cursor:pointer}
.ee-popover{position:absolute;right:20px;top:155px;width:290px;max-height:440px;overflow:auto;background:#fff;border:1px solid #dce4ed;border-radius:12px;box-shadow:0 14px 35px rgba(15,35,55,.18);z-index:80;padding:10px}
.ee-popover h4{margin:0 0 4px;font-size:12px}.ee-popover p{margin:0 0 8px;font-size:9px;color:#71808f}
.ee-list{display:grid;gap:4px}.ee-row{display:flex;align-items:center;gap:8px;padding:7px;border-radius:7px}.ee-row:hover{background:#f5f8fb}.ee-row label{font-size:10px;display:flex;align-items:center;gap:7px}.ee-row[draggable=true]{cursor:grab}
.ee-filter-grid{display:flex;flex-wrap:wrap;gap:6px}.ee-filter-grid button{border:1px solid #d7e0e9;background:#f8fafc;border-radius:999px;padding:6px 9px;font-size:10px}
.ee-chipbar{display:flex;gap:6px;overflow:auto;padding:7px;background:#fff;border:1px solid #e1e7ee;border-top:0}.ee-chip{display:flex;align-items:center;gap:5px;border:1px solid #d7e0e9;border-radius:8px;padding:5px;background:#f8fafc;flex:none}.ee-chip b{font-size:9px}.ee-chip select,.ee-chip input{border:1px solid #d7e0e9;border-radius:6px;padding:4px;font-size:9px}.ee-chip input{width:82px}
.ee-footer{position:sticky;bottom:0;display:flex;justify-content:flex-end;gap:8px;padding:10px;margin:10px -10px -10px;background:#fff;border-top:1px solid #e3e8ef}.ee-footer .apply{background:#0c3154;color:#fff;border-color:#0c3154}
`;
document.head.appendChild(style);

function footer(apply,cancel){const f=document.createElement("div");f.className="ee-footer";const c=document.createElement("button");c.textContent="Cancel";c.onclick=cancel;const a=document.createElement("button");a.textContent="Apply";a.className="apply";a.onclick=apply;f.append(c,a);return f}
function closeAll(){document.querySelectorAll(".ee-popover").forEach(x=>x.remove())}

function enhanceApplicationPanels(){
 document.querySelectorAll(".columns-panel,.filter-builder").forEach(panel=>{
  if(panel.dataset.parity)return;panel.dataset.parity="1";
  const checks=[...panel.querySelectorAll('input[type="checkbox"]')].map(x=>x.checked);
  const chipsBefore=document.querySelectorAll(".filter-chip").length;
  panel.appendChild(footer(()=>panel.remove(),()=>{
   [...panel.querySelectorAll('input[type="checkbox"]')].forEach((x,i)=>{if(x.checked!==checks[i])x.click()});
   [...document.querySelectorAll(".filter-chip")].slice(chipsBefore).reverse().forEach(x=>x.querySelector("button")?.click());
   panel.remove();
  }));
 });
}

function setupLeadParity(){
 if(isApplications()||document.querySelector(".ee-parity-toolbar"))return;
 const anchor=document.querySelector(".filter-row"); const table=document.querySelector("table"); if(!anchor||!table)return;
 const toolbar=document.createElement("div");toolbar.className="ee-parity-toolbar";
 const filterBtn=document.createElement("button");filterBtn.textContent="Add Filter";
 const columnBtn=document.createElement("button");columnBtn.textContent="Columns";
 toolbar.append(filterBtn,columnBtn);anchor.after(toolbar);
 let hidden=new Set(), order=[...table.querySelectorAll("thead th")].map((th,i)=>({i,label:th.textContent.trim()||"Select"}));
 const applyColumns=()=>{const rows=[...table.rows];rows.forEach(row=>{const cells=[...row.cells];const ordered=order.map(o=>cells[o.i]).filter(Boolean);ordered.forEach(cell=>row.appendChild(cell));});[...table.rows].forEach(row=>[...row.cells].forEach((cell,i)=>cell.style.display=hidden.has(order[i]?.label)?"none":""));};
 columnBtn.onclick=()=>{closeAll();const snapOrder=order.map(x=>({...x})),snapHidden=new Set(hidden);const p=document.createElement("div");p.className="ee-popover";p.innerHTML="<h4>Customise columns</h4><p>Show, hide and drag columns.</p><div class='ee-list'></div>";const list=p.querySelector(".ee-list");let dragged=null;order.forEach(o=>{const r=document.createElement("div");r.className="ee-row";r.draggable=true;r.innerHTML=`<span>⋮⋮</span><label><input type='checkbox' ${hidden.has(o.label)?"":"checked"}>${o.label}</label>`;r.ondragstart=()=>dragged=o.label;r.ondragover=e=>e.preventDefault();r.ondrop=()=>{const from=order.findIndex(x=>x.label===dragged),to=order.findIndex(x=>x.label===o.label);const[m]=order.splice(from,1);order.splice(to,0,m);p.remove();columnBtn.click()};r.querySelector("input").onchange=e=>e.target.checked?hidden.delete(o.label):hidden.add(o.label);list.appendChild(r)});p.appendChild(footer(()=>{applyColumns();p.remove()},()=>{order=snapOrder;hidden=snapHidden;p.remove()}));document.body.appendChild(p)};
 filterBtn.onclick=()=>{closeAll();const p=document.createElement("div");p.className="ee-popover";p.innerHTML="<h4>Add filter</h4><p>Choose any admission attribute.</p><div class='ee-filter-grid'></div>";const grid=p.querySelector(".ee-filter-grid");FILTERS.forEach(name=>{const b=document.createElement("button");b.textContent=name;b.onclick=()=>addLeadChip(name);grid.appendChild(b)});p.appendChild(footer(()=>p.remove(),()=>{document.querySelectorAll(".ee-chip[data-new='1']").forEach(x=>x.remove());p.remove()}));document.body.appendChild(p)};
 function addLeadChip(name){let bar=document.querySelector(".ee-chipbar");if(!bar){bar=document.createElement("div");bar.className="ee-chipbar";toolbar.after(bar)}const chip=document.createElement("div");chip.className="ee-chip";chip.dataset.new="1";chip.innerHTML=`<b>${name}</b><select><option>equals</option><option>contains</option><option>greater than</option><option>less than</option></select><input><button>×</button>`;chip.querySelector("button").onclick=()=>chip.remove();bar.appendChild(chip)}
}

function scan(){enhanceApplicationPanels();setupLeadParity()}
scan();new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
