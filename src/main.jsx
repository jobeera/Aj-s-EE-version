import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bell, Search, Users, FileText, Megaphone, MessageSquare, Phone,
  BarChart3, Plug, Settings, Plus, Send, Mail, Bot, X, ChevronLeft,
  ChevronRight, Download, MoreHorizontal, CheckCircle2
} from "lucide-react";
import "./styles.css";

const statusCounts = {
  New: 1840,
  "Not Reachable": 1215,
  Cold: 1980,
  Warm: 2240,
  Interested: 2380,
  "Application Initiated": 1260,
  Enrolled: 940,
  "Closed/Lost": 987,
};

const substatuses = {
  New: ["Uncontacted", "Acknowledged"],
  "Not Reachable": ["No Answer", "Switched Off", "Invalid Number"],
  Cold: ["Low Intent", "Future Intake", "Budget Concern"],
  Warm: ["Callback Requested", "Brochure Shared", "Fee Discussed"],
  Interested: ["Counselling Done", "Campus Visit Planned", "Application Intent"],
  "Application Initiated": ["Step 1 Completed", "Documents Pending", "Payment Initiated", "Payment Completed", "Offer Enabled"],
  Enrolled: ["Admission Confirmed", "Fee Paid"],
  "Closed/Lost": ["Not Interested", "Joined Elsewhere", "Duplicate"],
};

const firstNames = ["Karthik", "Meera", "Vikram", "Ananya", "Rohan", "Nidhi", "Siddharth", "Tanvi", "Aman", "Priya", "Rahul", "Sneha"];
const lastNames = ["Iyer", "Reddy", "Verma", "Pillai", "Sharma", "Dubey", "Patel", "Rathi", "Gupta", "Nair", "Singh", "Mehta"];
const programs = ["PGDM", "MBA", "B.Tech", "BBA", "Executive MBA"];
const specializations = ["Finance", "Marketing", "Business Analytics", "Computer Science", "HR", "Operations"];
const sources = ["Instagram", "YouTube", "Organic", "Meta Lead Ads", "Google Ads", "Referral", "Walk-in", "Consultant"];
const campaigns = ["PGDM Retargeting", "MBA Search Q3", "Engineering Q1", "Open Day", "Scholarship Drive", "Campus Event"];
const counselors = ["Vivek Rao", "Sneha Kulkarni", "Aayush Sharma", "Harshitha Reddy"];
const priorities = ["Low", "Medium", "High"];

const seeded = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function makeStudents() {
  const rows = [];
  let id = 1;
  Object.entries(statusCounts).forEach(([status, count], statusIndex) => {
    for (let index = 0; index < count; index += 1) {
      const first = firstNames[Math.floor(seeded(id) * firstNames.length)];
      const last = lastNames[Math.floor(seeded(id + 5) * lastNames.length)];
      const ai = Math.min(98, Math.round(34 + statusIndex * 6 + seeded(id + 8) * 27));
      const progress = status === "Application Initiated" ? Math.round(20 + seeded(id + 12) * 70) : status === "Enrolled" ? 100 : 0;
      rows.push({
        id,
        name: `${first} ${last}`,
        studentId: `STU-${String(id).padStart(6, "0")}`,
        applicationId: `APP-${String(id).padStart(6, "0")}`,
        phone: `+91 9${String(100000000 + Math.floor(seeded(id + 1) * 899999999)).slice(0, 9)}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${id % 91}@example.com`,
        program: programs[Math.floor(seeded(id + 2) * programs.length)],
        specialization: specializations[Math.floor(seeded(id + 3) * specializations.length)],
        intake: seeded(id + 4) > 0.5 ? "Jan 2027" : "Jul 2027",
        source: sources[Math.floor(seeded(id + 6) * sources.length)],
        campaign: campaigns[Math.floor(seeded(id + 7) * campaigns.length)],
        counselor: counselors[Math.floor(seeded(id + 9) * counselors.length)],
        status,
        substatus: substatuses[status][Math.floor(seeded(id + 10) * substatuses[status].length)],
        ai,
        temperature: ai >= 80 ? "Hot" : ai >= 58 ? "Warm" : "Cold",
        priority: priorities[Math.floor(seeded(id + 11) * priorities.length)],
        progress,
        lastActivity: ["2 mins ago", "15 mins ago", "1 hr ago", "3 hrs ago", "Yesterday"][Math.floor(seeded(id + 13) * 5)],
        nextFollowUp: ["Today 4:30 PM", "Tomorrow 11:00 AM", "Aug 06, 10:30 AM", "Not scheduled"][Math.floor(seeded(id + 14) * 4)],
      });
      id += 1;
    }
  });
  return rows;
}

const navItems = [
  ["students", "Lead Manager", Users],
  ["applications", "Applications", FileText],
  ["campaigns", "Campaigns", Megaphone],
  ["communications", "Communications", MessageSquare],
  ["calling", "AI Calling", Phone],
  ["analytics", "Reports & Analytics", BarChart3],
  ["integrations", "Integrations", Plug],
  ["settings", "Settings", Settings],
];

const fmt = (number) => number.toLocaleString("en-IN");

function App() {
  const [students, setStudents] = useState(makeStudents);
  const [module, setModule] = useState("students");
  const [collapsed, setCollapsed] = useState(false);
  const [selectedId, setSelectedId] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", substatus: "", source: "", campaign: "", program: "", counselor: "", temperature: "", priority: "" });
  const [savedView, setSavedView] = useState("All Leads");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(500);
  const [drawerTab, setDrawerTab] = useState("Overview");
  const [applicationMode, setApplicationMode] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");
  const resizeRef = useRef(false);
  const pageSize = 25;

  useEffect(() => {
    const timer = setTimeout(() => setCollapsed(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const move = (event) => {
      if (!resizeRef.current) return;
      const width = Math.min(window.innerWidth * 0.72, Math.max(360, window.innerWidth - event.clientX));
      setDrawerWidth(width);
    };
    const up = () => { resizeRef.current = false; document.body.style.cursor = ""; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  const selected = students.find((student) => student.id === selectedId) || students[0];
  const counts = useMemo(() => Object.keys(statusCounts).reduce((acc, status) => ({ ...acc, [status]: students.filter((student) => student.status === status).length }), {}), [students]);

  const filtered = useMemo(() => students.filter((student) => {
    const text = [student.name, student.phone, student.email, student.studentId, student.applicationId].join(" ").toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    return Object.entries(filters).every(([key, value]) => !value || student[key] === value);
  }), [students, query, filters]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1700);
  };

  const updateStudent = (patch) => {
    setStudents((current) => current.map((student) => student.id === selected.id ? { ...student, ...patch } : student));
    notify("Student updated");
  };

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, ...(key === "status" ? { substatus: "" } : {}) }));
    setPage(1);
  };

  const applyView = (view) => {
    setSavedView(view);
    const next = { status: "", substatus: "", source: "", campaign: "", program: "", counselor: "", temperature: "", priority: "" };
    if (view === "My Hot Students") { next.temperature = "Hot"; next.counselor = "Vivek Rao"; }
    if (view === "Untouched New") { next.status = "New"; next.substatus = "Uncontacted"; }
    if (view === "Applications Pending") next.status = "Application Initiated";
    if (view === "Payment Pending") { next.status = "Application Initiated"; next.substatus = "Payment Initiated"; }
    setFilters(next);
    setPage(1);
  };

  const bulkChange = (field, value) => {
    if (!value) return;
    if (!selectedRows.size) return notify("Select students first");
    setStudents((current) => current.map((student) => selectedRows.has(student.id) ? { ...student, [field]: value } : student));
    notify(`${selectedRows.size} students updated`);
  };

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar" onMouseEnter={() => setCollapsed(false)} onMouseLeave={() => setTimeout(() => setCollapsed(true), 3000)}>
        <div className="brand"><div className="logo">E</div><span className="nav-label">ExtraaEdge</span></div>
        <nav>
          {navItems.map(([id, label, Icon]) => (
            <button key={id} className={`nav-item ${module === id ? "active" : ""}`} onClick={() => setModule(id)}>
              <Icon size={18}/><span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-metrics nav-label">
          <div><span>Today's Follow-ups</span><b>128</b></div>
          <div><span>Pending Tasks</span><b>27</b></div>
          <div><span>AI Queue</span><b>19</b></div>
        </div>
      </aside>

      <main className="main" style={{ marginRight: drawerOpen ? drawerWidth : 0 }}>
        <header className="topbar">
          <div className="global-search"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student, email, phone, application, campaign..."/></div>
          <div className="top-actions"><button className="secondary"><Bot size={16}/>AI Assistant</button><button className="icon-button"><Bell size={18}/></button><button className="primary"><Plus size={16}/>Add</button></div>
        </header>

        {module === "students" ? (
          <section className="workspace">
            <div className="kpi-row">
              {[
                ["All Leads", students.length], ["Uncontacted", counts.New], ["Interested", counts.Interested],
                ["Application Started", counts["Application Initiated"]], ["Enrolled", counts.Enrolled],
              ].map(([label, value]) => <div className="kpi" key={label}><span>{label}</span><b>{fmt(value)}</b><small>↑ {label === "Uncontacted" ? "4.2" : "6.1"}%</small></div>)}
            </div>

            <div className="saved-views">
              {["All Leads", "My Hot Students", "Untouched New", "Applications Pending", "Payment Pending"].map((view) => (
                <button key={view} className={savedView === view ? "active" : ""} onClick={() => applyView(view)}>{view}</button>
              ))}
            </div>

            <div className="filter-row">
              <Filter label="Status" value={filters.status} options={Object.keys(statusCounts)} onChange={(value) => setFilter("status", value)}/>
              <Filter label="Sub-status" value={filters.substatus} options={filters.status ? substatuses[filters.status] : Object.values(substatuses).flat()} onChange={(value) => setFilter("substatus", value)}/>
              <Filter label="Source" value={filters.source} options={sources} onChange={(value) => setFilter("source", value)}/>
              <Filter label="Campaign" value={filters.campaign} options={campaigns} onChange={(value) => setFilter("campaign", value)}/>
              <Filter label="Program" value={filters.program} options={programs} onChange={(value) => setFilter("program", value)}/>
              <Filter label="Counselor" value={filters.counselor} options={counselors} onChange={(value) => setFilter("counselor", value)}/>
              <Filter label="Temperature" value={filters.temperature} options={["Hot", "Warm", "Cold"]} onChange={(value) => setFilter("temperature", value)}/>
              <Filter label="Priority" value={filters.priority} options={priorities} onChange={(value) => setFilter("priority", value)}/>
            </div>

            <div className="table-card">
              <div className="bulk-row">
                <span><b>{selectedRows.size}</b> selected</span>
                <select value="" onChange={(event) => bulkChange("counselor", event.target.value)}><option value="">Assign counselor</option>{counselors.map((item) => <option key={item}>{item}</option>)}</select>
                <select value="" onChange={(event) => bulkChange("status", event.target.value)}><option value="">Change status</option>{Object.keys(statusCounts).map((item) => <option key={item}>{item}</option>)}</select>
                <button onClick={() => notify("WhatsApp composer opened")}><Send size={15}/>WhatsApp</button>
                <button onClick={() => notify("AI call workspace opened")}><Bot size={15}/>AI Call</button>
                <button onClick={() => notify("SMS composer opened")}><MessageSquare size={15}/>SMS</button>
                <button onClick={() => notify("Email composer opened")}><Mail size={15}/>Email</button>
                <button onClick={() => notify("Export prepared")}><Download size={15}/>Export</button>
                <div className="spacer"/>
                <button onClick={() => setDrawerOpen(true)}>Student 360</button>
              </div>

              <div className="table-wrap">
                <table>
                  <thead><tr><th><input type="checkbox" checked={rows.length > 0 && rows.every((row) => selectedRows.has(row.id))} onChange={(event) => setSelectedRows(event.target.checked ? new Set(rows.map((row) => row.id)) : new Set())}/></th><th>Student</th><th>Phone</th><th>Program</th><th>Source / Campaign</th><th>Counselor</th><th>Status</th><th>Sub-status</th><th>AI Score</th><th>Last Activity</th><th>Next Follow-up</th><th/></tr></thead>
                  <tbody>{rows.map((student) => (
                    <tr key={student.id} className={selected.id === student.id ? "selected" : ""} onClick={() => { setSelectedId(student.id); setDrawerOpen(true); setApplicationMode(null); }}>
                      <td onClick={(event) => event.stopPropagation()}><input type="checkbox" checked={selectedRows.has(student.id)} onChange={() => setSelectedRows((current) => { const next = new Set(current); next.has(student.id) ? next.delete(student.id) : next.add(student.id); return next; })}/></td>
                      <td><div className="student-cell"><span className="avatar">{student.name.split(" ").map((part) => part[0]).join("")}</span><div><b>{student.name}</b><small>{student.studentId}</small></div></div></td>
                      <td>{student.phone}</td><td><b>{student.program}</b><small>{student.specialization} · {student.intake}</small></td><td><b>{student.source}</b><small>{student.campaign}</small></td><td>{student.counselor}</td><td><span className={`status ${student.status.replaceAll(" ", "-").replace("/", "-").toLowerCase()}`}>{student.status}</span></td><td>{student.substatus}</td><td><b>{student.ai}</b><small>{student.temperature} · {student.priority}</small></td><td>{student.lastActivity}</td><td>{student.nextFollowUp}</td><td><MoreHorizontal size={16}/></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>

              <div className="pagination"><span>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {fmt(filtered.length)}</span><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={15}/></button><span>Page {page} of {pageCount}</span><button disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}><ChevronRight size={15}/></button></div>
            </div>
          </section>
        ) : <Placeholder module={module}/>} 
      </main>

      {drawerOpen && <aside className="drawer" style={{ width: drawerWidth }}>
        <div className="resize-handle" onMouseDown={() => { resizeRef.current = true; document.body.style.cursor = "col-resize"; }}/>
        <div className="drawer-head"><div><h2>Student 360</h2></div><button onClick={() => setDrawerOpen(false)}><X size={18}/></button></div>
        <div className="profile"><span className="avatar large">{selected.name.split(" ").map((part) => part[0]).join("")}</span><div><h3>{selected.name}</h3><p>{selected.studentId} · {selected.phone}</p><p>{selected.email}</p></div></div>
        <div className="quick-actions">
          <Quick label="WhatsApp" icon={<Send size={17}/>} onClick={() => notify("WhatsApp opened")}/>
          <Quick label="Call" icon={<Phone size={17}/>} onClick={() => notify("Call opened")}/>
          <Quick label="AI Call" icon={<Bot size={17}/>} onClick={() => notify("AI call opened")}/>
          <Quick label="SMS" icon={<MessageSquare size={17}/>} onClick={() => notify("SMS opened")}/>
          <Quick label="Email" icon={<Mail size={17}/>} onClick={() => notify("Email opened")}/>
          <Quick label="More" icon={<MoreHorizontal size={17}/>} onClick={() => notify("More actions opened")}/>
        </div>
        <div className="tabs">{["Overview", "Timeline", "Applications", "Communications", "AI Summary"].map((tab) => <button key={tab} className={drawerTab === tab ? "active" : ""} onClick={() => { setDrawerTab(tab); setApplicationMode(null); }}>{tab}</button>)}</div>
        <div className="drawer-body">
          {applicationMode ? <ApplicationEditor student={selected} mode={applicationMode} onBack={() => setApplicationMode(null)} onSave={() => { notify("Application saved"); setApplicationMode(null); }}/> : (
            <>
              {drawerTab === "Overview" && <Overview student={selected} onUpdate={updateStudent} onApplication={(mode) => setApplicationMode(mode)}/>} 
              {drawerTab === "Timeline" && <Timeline student={selected}/>} 
              {drawerTab === "Applications" && <ApplicationCard student={selected} onOpen={(mode) => setApplicationMode(mode)}/>} 
              {drawerTab === "Communications" && <Communications/>} 
              {drawerTab === "AI Summary" && <AISummary student={selected}/>} 
            </>
          )}
        </div>
      </aside>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Filter({ label, value, options, onChange }) {
  return <label className="filter"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">All</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function Quick({ label, icon, onClick }) { return <button className="quick" onClick={onClick}>{icon}<span>{label}</span></button>; }

function Overview({ student, onUpdate, onApplication }) {
  return <>
    <div className="overview-grid"><Info label="AI Score" value={`${student.ai}/100`}/><Info label="Status" value={student.status}/><Info label="Stage" value={student.substatus}/><Info label="Next Follow-up" value={student.nextFollowUp}/></div>
    <div className="panel"><h4>AI Summary</h4><p>{student.name} is a {student.temperature.toLowerCase()} lead interested in {student.program} ({student.specialization}). Recent engagement indicates {student.ai >= 75 ? "high" : "moderate"} conversion potential.</p></div>
    <div className="panel"><h4>Lead Information</h4><div className="info-columns"><Info label="Program" value={`${student.program} (${student.specialization})`}/><Info label="Intake" value={student.intake}/><Info label="Source" value={student.source}/><Info label="Campaign" value={student.campaign}/><Info label="Counselor" value={student.counselor}/><Info label="Priority" value={student.priority}/></div><div className="inline-controls"><select value={student.status} onChange={(event) => onUpdate({ status: event.target.value, substatus: substatuses[event.target.value][0] })}>{Object.keys(statusCounts).map((status) => <option key={status}>{status}</option>)}</select><select value={student.substatus} onChange={(event) => onUpdate({ substatus: event.target.value })}>{substatuses[student.status].map((item) => <option key={item}>{item}</option>)}</select></div></div>
    <ApplicationCard student={student} onOpen={onApplication}/>
    <div className="panel"><h4>Latest Communications</h4><CommunicationRow icon="WA" title="WhatsApp sent" meta="2 mins ago" text="Programme details and scholarship information"/><CommunicationRow icon="CL" title="Counselor call" meta="3 hrs ago" text="Connected for 3m 42s"/><CommunicationRow icon="EM" title="Email opened" meta="Yesterday" text="PGDM brochure and fee structure"/></div>
  </>;
}

function ApplicationCard({ student, onOpen }) {
  const progress = Math.max(30, student.progress);
  return <div className="panel application-card"><div className="panel-title"><div><h4>Applications (1)</h4><b>{student.program} ({student.specialization}) · {student.intake}</b><small>{student.applicationId}</small></div><span className="application-badge">In Progress</span></div><div className="progress-label"><span>Progress</span><b>{progress}%</b></div><div className="progress"><i style={{ width: `${progress}%` }}/></div><div className="application-actions"><button onClick={() => onOpen("view")}>View Application</button><button className="edit" onClick={() => onOpen("edit")}>Edit Application</button></div></div>;
}

function ApplicationEditor({ student, mode, onBack, onSave }) {
  const readonly = mode === "view";
  return <div className="application-editor"><div className="editor-head"><div><h3>{readonly ? "View" : "Edit"} Application</h3><p>{student.applicationId} · {student.program}</p></div><button onClick={onBack}>Back</button></div><div className="form-grid"><Field label="Full Name" value={student.name} readonly={readonly}/><Field label="Mobile" value={student.phone} readonly={readonly}/><Field label="Email" value={student.email} readonly={readonly} full/><Field label="Program" value={student.program} readonly={readonly}/><Field label="Specialization" value={student.specialization} readonly={readonly}/><Field label="Intake" value={student.intake} readonly={readonly}/><Field label="Date of Birth" value="15-Aug-2004" readonly={readonly}/><Field label="Parent Name" value="Rajesh Iyer" readonly={readonly}/><Field label="Parent Mobile" value="+91 98220 99887" readonly={readonly}/><Field label="Address" value="Baner, Pune, Maharashtra" readonly={readonly} full textarea/></div><div className="panel"><h4>Documents</h4><DocumentRow name="10th Marksheet" status="Verified"/><DocumentRow name="12th Marksheet" status="Verified"/><DocumentRow name="Aadhaar" status="DigiLocker Verified"/><DocumentRow name="Entrance Scorecard" status="Pending"/></div>{!readonly && <button className="save-application" onClick={onSave}><CheckCircle2 size={16}/>Save Application</button>}</div>;
}

function Timeline({ student }) { return <div className="timeline"><TimelineItem time="Today, 10:24 AM" title="AI WhatsApp" text="Student asked about scholarship eligibility and application fee."/><TimelineItem time="Today, 9:42 AM" title="Counselor Call" text={`Programme outcomes explained by ${student.counselor}.`}/><TimelineItem time="Yesterday" title="Application Started" text={`${Math.max(30, student.progress)}% application completed.`}/><TimelineItem time="2 days ago" title="Campaign Touch" text={`${student.source} · ${student.campaign}`}/></div>; }
function Communications() { return <div className="panel"><h4>Communication History</h4><CommunicationRow icon="WA" title="WhatsApp" meta="2 mins ago" text="Programme and scholarship details delivered"/><CommunicationRow icon="CL" title="Outbound Call" meta="3 hrs ago" text="Connected for 3m 42s"/><CommunicationRow icon="AI" title="AI Call" meta="Yesterday" text="Eligibility confirmation completed"/><CommunicationRow icon="SM" title="SMS" meta="Yesterday" text="Application link delivered"/><CommunicationRow icon="EM" title="Email" meta="2 days ago" text="Brochure opened"/></div>; }
function AISummary({ student }) { return <><div className="panel ai-panel"><h4>AI Student Summary</h4><p>{student.name} has engaged through {student.source} and has shown interest in {student.program} ({student.specialization}). The recommended next action is a counselor follow-up with scholarship and fee information.</p></div><div className="panel"><h4>WhatsApp Summary</h4><p>Positive sentiment. Asked about eligibility, scholarship, fees and campus accommodation.</p></div><div className="panel"><h4>Call Summary</h4><p>Requested a parent callback and detailed application guidance.</p></div></>; }

function Info({ label, value }) { return <div className="info"><span>{label}</span><b>{value}</b></div>; }
function Field({ label, value, readonly, full, textarea }) { return <label className={`field ${full ? "full" : ""}`}><span>{label}</span>{textarea ? <textarea defaultValue={value} readOnly={readonly} rows={3}/> : <input defaultValue={value} readOnly={readonly}/>}</label>; }
function DocumentRow({ name, status }) { return <div className="document-row"><span>{name}</span><b>{status}</b></div>; }
function CommunicationRow({ icon, title, meta, text }) { return <div className="communication-row"><span className="comm-icon">{icon}</span><div><b>{title}</b><small>{text}</small></div><time>{meta}</time></div>; }
function TimelineItem({ time, title, text }) { return <div className="timeline-item"><span className="timeline-dot"/><div><small>{time}</small><b>{title}</b><p>{text}</p></div></div>; }
function Placeholder({ module }) { const label = navItems.find(([id]) => id === module)?.[1]; return <section className="placeholder"><h2>{label}</h2><p>This workspace is ready for the next approved build.</p></section>; }

createRoot(document.getElementById("root")).render(<App/>);
