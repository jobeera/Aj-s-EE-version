
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bell, Plus, Search, Users, FileText, GraduationCap, Megaphone,
  Workflow, Sparkles, Zap, BarChart3, Plug, MessageSquare, Link2,
  LayoutTemplate, Phone, Send
} from "lucide-react";
import "./styles.css";

const TOTAL = 12842;
const initialStageCounts = {
  "New": 1840,
  "Not Reachable": 1215,
  "Cold": 1980,
  "Warm": 2240,
  "Interested": 2380,
  "Applied": 1260,
  "Enrolled": 940,
  "Closed/Lost": 987
};
const previous = {
  total: 12596, untouched: 1320, hot: 2634,
  interested: 2302, applications: 3035, enrolled: 901
};

const firstNames = ["Ananya","Rahul","Priya","Vikram","Sneha","Arjun","Meera","Karthik"];
const lastNames = ["Sharma","Mehta","Nair","Singh","Reddy","Verma","Iyer","Rao"];
const programs = ["MBA","PGDM","B.Tech","Executive MBA"];
const sources = ["Google Ads","Meta Ads","Organic","Referral","Education Portal","Walk-in"];
const owners = ["Sneha Kulkarni","Vivek Rao","Harshitha Reddy"];

const seeded = i => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function makeLeads() {
  const leads = [];
  let id = 1;
  Object.entries(initialStageCounts).forEach(([stage, count], si) => {
    for (let j = 0; j < count; j++) {
      const fn = firstNames[Math.floor(seeded(id) * firstNames.length)];
      const ln = lastNames[Math.floor(seeded(id + 7) * lastNames.length)];
      const ai = Math.min(98, Math.round(35 + si * 6 + seeded(id + 9) * 25));
      leads.push({
        id,
        name: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${j % 97}@example.com`,
        phone: `+91 9${String(100000000 + Math.floor(seeded(id + 3) * 899999999)).slice(0, 9)}`,
        applicationId: `APP-${String(id).padStart(6, "0")}`,
        program: programs[Math.floor(seeded(id + 4) * programs.length)],
        source: sources[Math.floor(seeded(id + 5) * sources.length)],
        owner: owners[Math.floor(seeded(id + 6) * owners.length)],
        stage,
        ai,
        activities: stage === "New" && seeded(id + 11) < 0.57 ? 0 : 1 + Math.floor(seeded(id + 12) * 5)
      });
      id++;
    }
  });
  return leads;
}

const navGroups = [
  ["Revenue Workspace", [
    ["leads", "Lead Workspace", Users],
    ["applications", "Applications", FileText],
    ["admissions", "Admissions", GraduationCap]
  ]],
  ["Martech", [
    ["campaigns", "Campaigns", Megaphone],
    ["journeys", "Journeys", Workflow],
    ["content", "Content Lab", LayoutTemplate],
    ["landing", "Landing Pages", Link2],
    ["communications", "Communications", MessageSquare]
  ]],
  ["Intelligence", [
    ["ai", "AI Workspace", Sparkles],
    ["automation", "Automation", Zap],
    ["analytics", "Analytics", BarChart3],
    ["integrations", "Integrations", Plug]
  ]]
];

const pct = (n, d) => `${((n / d) * 100).toFixed(1)}%`;
const delta = (current, prev) => {
  const value = ((current - prev) / prev) * 100;
  return { value: Math.abs(value).toFixed(1), up: value >= 0 };
};

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [module, setModule] = useState("leads");
  const [leads, setLeads] = useState(makeLeads);
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setCollapsed(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const countStage = name => leads.filter(l => l.stage === name).length;
  const untouched = leads.filter(l => l.activities === 0).length;
  const hot = leads.filter(l => l.ai >= 75).length;
  const applications = countStage("Applied") + countStage("Enrolled");

  const kpis = [
    ["Total Leads", leads.length, previous.total],
    ["Untouched", untouched, previous.untouched],
    ["Hot", hot, previous.hot],
    ["Interested", countStage("Interested"), previous.interested],
    ["Applications", applications, previous.applications],
    ["Enrolled", countStage("Enrolled"), previous.enrolled]
  ];

  const filtered = useMemo(() => leads.filter(l => {
    const haystack = [l.name, l.email, l.phone, l.applicationId].join(" ").toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (!stage || l.stage === stage)
      && (!source || l.source === source);
  }), [leads, query, stage, source]);

  const selected = leads.find(l => l.id === selectedId) || leads[0];

  const showToast = message => {
    setToast(message);
    setTimeout(() => setToast(""), 1700);
  };

  const updateStage = newStage => {
    setLeads(prev => prev.map(l => l.id === selected.id ? { ...l, stage: newStage } : l));
    showToast("Stage updated");
  };

  const logActivity = () => {
    setLeads(prev => prev.map(l => l.id === selected.id ? { ...l, activities: l.activities + 1 } : l));
    showToast("Activity logged");
  };

  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""}`}>
      <aside
        className="sidebar"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setTimeout(() => setCollapsed(true), 3000)}
      >
        <div className="brand"><span className="logo">E</span><span className="nav-label">ExtraaEdge</span></div>
        <div className="nav-scroll">
          {navGroups.map(([group, items]) => (
            <div key={group}>
              <div className="nav-section">{group}</div>
              {items.map(([id, label, Icon]) => (
                <button key={id} className={`nav-item ${module === id ? "active" : ""}`} onClick={() => setModule(id)}>
                  <Icon size={18}/><span className="nav-label">{label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <strong>{navGroups.flatMap(g => g[1]).find(x => x[0] === module)?.[1]}</strong>
          <div className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, mobile, email, application ID"/></div>
          <div className="top-actions">
            <button className="icon-btn" onClick={() => setNotificationsOpen(v => !v)}><Bell size={18}/></button>
            <button className="secondary" onClick={() => showToast("Quick create opened")}><Plus size={17}/> Quick Create</button>
            <button className="primary" onClick={() => setAddLeadOpen(true)}><Plus size={17}/> Add Lead</button>
          </div>
        </header>

        <section className="content">
          <div className="kpi-row">
            {kpis.map(([label, value, prev]) => {
              const d = delta(value, prev);
              return <div className="kpi" key={label}>
                <div className="kpi-head"><span>{label}</span><b className={d.up ? "up" : "down"}>{d.up ? "▲" : "▼"} {d.value}%</b></div>
                <div className="kpi-value">{value.toLocaleString("en-IN")}</div>
                <div className="muted">vs previous period</div>
              </div>
            })}
          </div>

          {module === "leads" ? <>
            <div className="card funnel-card">
              <div className="card-head"><strong>Lead Status Funnel</strong><span className="muted">All Leads = {leads.length.toLocaleString("en-IN")}</span></div>
              <div className="funnel">
                <button className="funnel-item all" onClick={() => setStage("")}>
                  <span>All Leads</span><b>{leads.length.toLocaleString("en-IN")}</b><small>100.0%</small>
                </button>
                {Object.keys(initialStageCounts).map(name => {
                  const value = countStage(name);
                  return <button className="funnel-item" key={name} onClick={() => setStage(name)}>
                    <span>{name}</span><b>{value.toLocaleString("en-IN")}</b><small>{pct(value, leads.length)}</small>
                  </button>
                })}
              </div>
            </div>

            <div className="workspace">
              <div className="card">
                <div className="card-head"><strong>Lead Workspace</strong><span className="muted">{filtered.length.toLocaleString("en-IN")} visible</span></div>
                <div className="filters">
                  <select value={stage} onChange={e => setStage(e.target.value)}><option value="">All statuses</option>{Object.keys(initialStageCounts).map(s => <option key={s}>{s}</option>)}</select>
                  <select value={source} onChange={e => setSource(e.target.value)}><option value="">All sources</option>{sources.map(s => <option key={s}>{s}</option>)}</select>
                </div>
                <div className="lead-list">
                  {filtered.slice(0, 180).map(l => <button key={l.id} className={`lead ${selected.id === l.id ? "active" : ""}`} onClick={() => setSelectedId(l.id)}>
                    <span className="avatar">{l.name.split(" ").map(x => x[0]).join("")}</span>
                    <span className="lead-copy"><b>{l.name}</b><small>{l.email}</small><small>{l.phone} · {l.program}</small><small>{l.source} · {l.owner}</small></span>
                    <span className="pill">{l.stage}</span>
                  </button>)}
                </div>
              </div>

              <div className="card detail">
                <div className="detail-head">
                  <span className="avatar large">{selected.name.split(" ").map(x => x[0]).join("")}</span>
                  <div><h2>{selected.name}</h2><p>{selected.email} · {selected.phone}</p></div>
                  <div className="detail-actions">
                    <button className="secondary" onClick={() => showToast("Call opened")}><Phone size={16}/> Call</button>
                    <button className="secondary" onClick={() => showToast("WhatsApp opened")}><Send size={16}/> WhatsApp</button>
                    <button className="primary" onClick={logActivity}><Plus size={16}/> Log Activity</button>
                  </div>
                </div>
                <div className="metric-grid">
                  <Metric label="Stage" value={selected.stage}/>
                  <Metric label="AI score" value={selected.ai}/>
                  <Metric label="Activities" value={selected.activities}/>
                  <Metric label="Application ID" value={selected.applicationId} compact/>
                </div>
                <div className="insight"><strong>AI Next Best Action</strong><span>{selected.ai >= 75 ? "Prioritize immediate counselor outreach." : "Continue nurture based on programme interest."}</span></div>
                <div className="detail-grid">
                  <div className="subcard"><Row label="Program" value={selected.program}/><Row label="Source" value={selected.source}/><Row label="Owner" value={selected.owner}/></div>
                  <div className="subcard">
                    <label>Move lead stage</label>
                    <select value={selected.stage} onChange={e => updateStage(e.target.value)}>{Object.keys(initialStageCounts).map(s => <option key={s}>{s}</option>)}</select>
                    <p className="muted">Changing stage recalculates every KPI and funnel count.</p>
                  </div>
                </div>
              </div>
            </div>
          </> : <ModulePage module={module} showToast={showToast}/>}
        </section>
      </main>

      {notificationsOpen && <div className="drawer">
        <h3>Notifications</h3>
        <Notice title="42 new high-intent leads" text="AI score crossed 75 today."/>
        <Notice title="18 applications stalled" text="No counselor activity for 48 hours."/>
        <Notice title="Delivery anomaly" text="WhatsApp delivery is down 8.2%."/>
      </div>}

      {addLeadOpen && <AddLeadModal onClose={() => setAddLeadOpen(false)} onSave={data => {
        const next = { id: Math.max(...leads.map(l => l.id)) + 1, applicationId: `APP-${String(leads.length + 1).padStart(6,"0")}`, stage: "New", ai: 50, activities: 0, ...data };
        setLeads(prev => [next, ...prev]);
        setSelectedId(next.id);
        setAddLeadOpen(false);
        showToast("Lead created");
      }}/>}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Metric({label, value, compact}) {
  return <div className="metric"><span>{label}</span><b className={compact ? "compact" : ""}>{value}</b></div>
}
function Row({label, value}) {
  return <div className="row"><span>{label}</span><b>{value}</b></div>
}
function Notice({title, text}) {
  return <div className="notice-item"><b>{title}</b><span>{text}</span></div>
}
function ModulePage({module, showToast}) {
  const labels = {
    applications:"Applications", admissions:"Admissions", campaigns:"Campaigns",
    journeys:"Lifecycle Journeys", content:"Content Lab", landing:"Landing Pages",
    communications:"Communications", ai:"AI Workspace", automation:"Automation",
    analytics:"Analytics", integrations:"Integrations"
  };
  return <div className="card module-page">
    <div className="card-head"><strong>{labels[module]}</strong></div>
    <div className="module-grid">
      {[1,2,3].map(i => <div className="subcard" key={i}><h3>{labels[module]} {i}</h3><p className="muted">Interactive workspace for {labels[module].toLowerCase()} workflows.</p><button className="primary" onClick={() => showToast(`${labels[module]} action opened`)}>Open</button></div>)}
    </div>
  </div>
}
function AddLeadModal({onClose, onSave}) {
  const [form, setForm] = useState({name:"",phone:"",email:"",program:"MBA",source:"Google Ads",owner:"Sneha Kulkarni"});
  return <div className="modal"><div className="modal-box">
    <h3>Add Lead</h3>
    <div className="form-grid">
      {["name","phone","email"].map(k => <input key={k} placeholder={k[0].toUpperCase()+k.slice(1)} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}/>)}
      <select value={form.program} onChange={e => setForm({...form,program:e.target.value})}>{programs.map(x => <option key={x}>{x}</option>)}</select>
      <select value={form.source} onChange={e => setForm({...form,source:e.target.value})}>{sources.map(x => <option key={x}>{x}</option>)}</select>
      <select value={form.owner} onChange={e => setForm({...form,owner:e.target.value})}>{owners.map(x => <option key={x}>{x}</option>)}</select>
    </div>
    <div className="modal-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" onClick={() => form.name && form.phone && form.email && onSave(form)}>Create Lead</button></div>
  </div></div>
}

createRoot(document.getElementById("root")).render(<App/>);
