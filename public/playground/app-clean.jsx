// HungryDB — UI components
// Phases: idle → dragging → extracting → database

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ────────────────────────────────────────────────────────────────────── */
/* Icons — minimal stroke set                                              */
/* ────────────────────────────────────────────────────────────────────── */
const Icon = ({ name, size = 16, stroke = 1.4 }) => {
  const s = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "users":     return <svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3 2.9-5 6.5-5s6.5 2 6.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8 0 5 1.7 5 4.5"/></svg>;
    case "box":       return <svg viewBox="0 0 24 24" {...s}><path d="M3 7l9-4 9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>;
    case "receipt":   return <svg viewBox="0 0 24 24" {...s}><path d="M5 3v18l2-1.5L9 21l2-1.5L13 21l2-1.5L17 21l2-1.5V3l-2 1.5L15 3l-2 1.5L11 3 9 4.5 7 3 5 4.5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>;
    case "truck":     return <svg viewBox="0 0 24 24" {...s}><path d="M2 6h11v10H2zM13 9h5l3 3v4h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case "clipboard": return <svg viewBox="0 0 24 24" {...s}><rect x="6" y="4" width="12" height="17" rx="1"/><path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1M9 10h6M9 14h6M9 18h4"/></svg>;
    case "list":      return <svg viewBox="0 0 24 24" {...s}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "upload":    return <svg viewBox="0 0 24 24" {...s}><path d="M12 16V4M6 10l6-6 6 6M4 18v2a1 1 0 001 1h14a1 1 0 001-1v-2"/></svg>;
    case "x":         return <svg viewBox="0 0 24 24" {...s}><path d="M5 5l14 14M19 5L5 19"/></svg>;
    case "arrow":     return <svg viewBox="0 0 24 24" {...s}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "sparkle":   return <svg viewBox="0 0 24 24" {...s}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM19 3v3M21 4.5h-4M5 17v3M6.5 18.5h-3"/></svg>;
    case "download":  return <svg viewBox="0 0 24 24" {...s}><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>;
    case "search":    return <svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/></svg>;
    case "check":     return <svg viewBox="0 0 24 24" {...s}><path d="M5 12l4 4 10-10"/></svg>;
    case "chevron":   return <svg viewBox="0 0 24 24" {...s}><path d="M6 9l6 6 6-6"/></svg>;
    case "activity":  return <svg viewBox="0 0 24 24" {...s}><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>;
    case "trend-up":  return <svg viewBox="0 0 24 24" {...s}><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>;
    case "trend-dn":  return <svg viewBox="0 0 24 24" {...s}><path d="M3 7l6 6 4-4 8 8M15 17h6v-6"/></svg>;
    case "plus":      return <svg viewBox="0 0 24 24" {...s}><path d="M12 5v14M5 12h14"/></svg>;
    case "filter":    return <svg viewBox="0 0 24 24" {...s}><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>;
    case "sort":      return <svg viewBox="0 0 24 24" {...s}><path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/></svg>;
    default:          return null;
  }
};

/* ────────────────────────────────────────────────────────────────────── */
/* File icons — flat, format-coded                                         */
/* ────────────────────────────────────────────────────────────────────── */
const FileIcon = ({ kind, size = 36 }) => {
  const palette = {
    excel: { bg: "#1F6F47", label: "XLSX" },
    pdf:   { bg: "#B23A2E", label: "PDF"  },
    word:  { bg: "#2A5BB0", label: "DOCX" },
    csv:   { bg: "#5A6E3A", label: "CSV"  },
    scan:  { bg: "#7A6450", label: "SCAN" },
  }[kind] || { bg: "#666", label: "FILE" };

  return (
    <div style={{
      width: size, height: size * 1.25, position: "relative",
      background: "#fff", border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: 3, boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
      overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: size * 0.32, height: size * 0.32,
        background: "linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.04) 50%)",
      }}/>
      <div style={{ background: palette.bg, color: "#fff", padding: "3px 0",
        textAlign: "center", fontSize: size * 0.22, fontWeight: 700,
        letterSpacing: "0.04em", fontFamily: "'JetBrains Mono', monospace" }}>
        {palette.label}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* DropZone — phase: idle / dragging                                       */
/* ────────────────────────────────────────────────────────────────────── */
const DropZone = ({ onDrop, sector }) => {
  const [dragging, setDragging] = useState(false);
  const [hoveredFile, setHoveredFile] = useState(null);
  const data = window.HUNGRYDB_DATA;

  // Floating preview chips (decorative — represent files-to-be-dropped)
  const chips = data.SOURCE_FILES;

  return (
    <div className="dropzone-stage">
      {/* Header */}
      <div className="hd-header">
        <div className="hd-brand">
          <div className="hd-logo">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="6"  rx="8" ry="3"/>
              <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
              <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>
            </svg>
          </div>
          <div className="hd-wordmark">HungryDB</div>
        </div>
        <div className="hd-pill">
          <span className="hd-dot"/>
          <span>{sector}</span>
        </div>
      </div>

      {/* Centerpiece */}
      <div className="hd-center">
        <div className="hd-eyebrow">Step 1 of 2</div>
        <h1 className="hd-title">
          Drop in everything.<br/>
          <span className="hd-title-em">We build the database.</span>
        </h1>
        <p className="hd-sub">
          Excel, PDFs, Word, scanned receipts, CSV exports from your legacy ERP.
          No prep. No clean tables required.
        </p>

        {/* The actual drop area */}
        <div
          className={`hd-drop ${dragging ? "is-drag" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); onDrop(); }}
          onClick={onDrop}
        >
          <div className="hd-drop-inner">
            <div className="hd-drop-icon"><Icon name="upload" size={28} stroke={1.2}/></div>
            <div className="hd-drop-headline">Drop files here</div>
            <div className="hd-drop-meta">or <span className="hd-link">browse</span> · up to 2 GB</div>
          </div>

          {/* Floating decorative file chips */}
          <div className="hd-chips">
            {chips.map((f, i) => (
              <div
                key={f.id}
                className={`hd-chip hd-chip-${i}`}
                onMouseEnter={() => setHoveredFile(f.id)}
                onMouseLeave={() => setHoveredFile(null)}
              >
                <FileIcon kind={f.kind} size={28}/>
                <div className="hd-chip-meta">
                  <div className="hd-chip-name">{f.name}</div>
                  <div className="hd-chip-size">{f.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hd-formats">
          <span>XLSX</span><span>·</span>
          <span>PDF</span><span>·</span>
          <span>DOCX</span><span>·</span>
          <span>CSV</span><span>·</span>
          <span>JPG / Scan</span><span>·</span>
          <span>PNG</span>
        </div>
      </div>

      <div className="hd-footer">
        <span>GoBD compliant</span>
        <span className="hd-footer-dot">·</span>
        <span>Hosted in Frankfurt, DE</span>
        <span className="hd-footer-dot">·</span>
        <span>End-to-end encrypted</span>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* ExtractionView — animated parsing                                        */
/* ────────────────────────────────────────────────────────────────────── */
const ExtractionView = ({ onDone, sector }) => {
  const [progress, setProgress] = useState(0);
  const [activeFile, setActiveFile] = useState(0);
  const [messages, setMessages] = useState([]);
  const data = window.HUNGRYDB_DATA;
  const files = data.SOURCE_FILES;

  const SCRIPT = useMemo(() => [
    { t: 200,  m: "Files received", k: "info" },
    { t: 500,  m: "Sector detected: Bakery / Pastry", k: "infer" },
    { t: 900,  m: "customer_list_2024.xlsx — 5 customers, 7 fields", k: "ok" },
    { t: 1300, m: "invoice_2026-04-12.pdf — 4 line items, VAT 7%", k: "ok" },
    { t: 1600, m: "order_millmann_supply.docx — supplier matched", k: "ok" },
    { t: 1900, m: "handwritten_receipt.jpg — OCR + handwriting recognition", k: "ok" },
    { t: 2200, m: "legacy_erp_export_2023.csv — 1,812 bookings", k: "ok" },
    { t: 2500, m: "Relations resolved: 4 foreign keys", k: "infer" },
    { t: 2800, m: "Schema ready", k: "done" },
  ], []);

  useEffect(() => {
    const start = performance.now();
    const TOTAL = 3100;
    let raf;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / TOTAL);
      setProgress(p);
      setActiveFile(Math.min(files.length - 1, Math.floor(p * files.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 350);
    };
    raf = requestAnimationFrame(tick);

    const timers = SCRIPT.map(s => setTimeout(() => {
      setMessages(prev => [...prev, s]);
    }, s.t));

    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="ex-stage">
      <div className="ex-grid">
        {/* Left: files being parsed */}
        <div className="ex-col">
          <div className="ex-coltitle">Sources</div>
          <div className="ex-files">
            {files.map((f, i) => {
              const state = i < activeFile ? "done" : i === activeFile ? "active" : "wait";
              return (
                <div key={f.id} className={`ex-file ex-${state}`}>
                  <FileIcon kind={f.kind} size={26}/>
                  <div className="ex-file-meta">
                    <div className="ex-file-name">{f.name}</div>
                    <div className="ex-file-note">{f.note}</div>
                  </div>
                  <div className="ex-file-status">
                    {state === "done" && <Icon name="check" size={14} stroke={2}/>}
                    {state === "active" && <span className="ex-spinner"/>}
                    {state === "wait" && <span className="ex-wait">·</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: animated extraction visualization */}
        <div className="ex-col ex-center-col">
          <div className="ex-coltitle">Extraction</div>
          <div className="ex-viz">
            <div className="ex-viz-bg">
              {[...Array(48)].map((_, i) => (
                <div key={i} className="ex-cell" style={{ animationDelay: `${(i % 12) * 60 + Math.floor(i/12)*40}ms` }}/>
              ))}
            </div>
            <div className="ex-percent">
              <div className="ex-percent-num">{Math.round(progress * 100)}</div>
              <div className="ex-percent-pct">%</div>
            </div>
            <div className="ex-viz-label">Detecting fields</div>
          </div>
          <div className="ex-progress">
            <div className="ex-progress-bar" style={{ width: `${progress * 100}%` }}/>
          </div>
        </div>

        {/* Right: live log */}
        <div className="ex-col">
          <div className="ex-coltitle">Log</div>
          <div className="ex-log">
            {messages.map((m, i) => (
              <div key={i} className={`ex-log-line ex-log-${m.k}`}>
                <span className="ex-log-mark"/>
                <span className="ex-log-text">{m.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* Schema helpers — clone, fuzzy search, slug, singularize, PK generator   */
/* ────────────────────────────────────────────────────────────────────── */
const cloneTables = (tables) => {
  const out = {};
  for (const k of Object.keys(tables)) {
    const t = tables[k];
    out[k] = {
      ...t,
      pos: { ...(t.pos || { x: 80, y: 80 }) },
      fields: t.fields.map(f => ({ ...f })),
      rows: t.rows.map(r => ({ ...r, _provenance: { ...(r._provenance || {}) } })),
    };
  }
  return out;
};

const singularize = (s) =>
  s.endsWith("ies") ? s.slice(0, -3) + "y" :
  s.endsWith("ses") ? s.slice(0, -2) :
  s.endsWith("s")   ? s.slice(0, -1) : s;

const slugifyTableKey = (label, existing) => {
  let base = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "table";
  let k = base, i = 2;
  while (existing.includes(k)) k = `${base}_${i++}`;
  return k;
};

const nextPkValue = (table) => {
  const pk = table.fields.find(f => f.pk);
  if (!pk) return "";
  const n = (table.rows?.length || 0) + 1;
  if (pk.type === "int") return n;
  const prefix = (table.label || "row").replace(/[^A-Za-z]/g, "").slice(0, 1).toUpperCase() || "R";
  return `${prefix}${String(n).padStart(3, "0")}`;
};

const fuzzyFind = (tables, q) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const out = [];
  for (const k of Object.keys(tables)) {
    const t = tables[k];
    if (t.label.toLowerCase().includes(needle) || k.toLowerCase().includes(needle)) {
      out.push({ kind: "table", table: k, label: t.label, hint: `${t.rows.length} rows · ${t.fields.length} fields` });
    }
    for (let ci = 0; ci < t.fields.length; ci++) {
      const f = t.fields[ci];
      if (f.name.toLowerCase().includes(needle)) {
        out.push({ kind: "field", table: k, col: ci, label: `${t.label} · ${f.name}`,
                   hint: f.type + (f.pk ? " · PK" : f.ref ? ` → ${f.ref}` : "") });
      }
    }
    for (let ri = 0; ri < t.rows.length && out.length < 40; ri++) {
      const row = t.rows[ri];
      for (let ci = 0; ci < t.fields.length; ci++) {
        const f = t.fields[ci];
        const val = row[f.name];
        if (val === null || val === undefined) continue;
        const sv = String(val);
        if (sv.toLowerCase().includes(needle)) {
          out.push({ kind: "row", table: k, rowIdx: ri, col: ci, label: sv,
                     hint: `${t.label} · ${f.name} · row ${ri + 1}` });
          break;
        }
      }
    }
    if (out.length > 40) break;
  }
  return out.slice(0, 14);
};

/* Inline form for creating a new table from the sidebar */
const NewTableForm = ({ parents, onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  return (
    <form
      className="db-rail-newform"
      onSubmit={(e) => { e.preventDefault(); if (name.trim()) onCreate(name.trim(), parent || null); }}
    >
      <input
        autoFocus
        className="db-rail-input"
        placeholder="Table name (e.g. Deliveries)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Escape") onCancel(); }}
      />
      <label className="db-rail-sublabel">Belongs to (optional)</label>
      <select
        className="db-rail-select"
        value={parent}
        onChange={(e) => setParent(e.target.value)}
      >
        <option value="">— independent —</option>
        {parents.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
      </select>
      <div className="db-rail-newform-acts">
        <button type="button" className="db-rail-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="db-rail-create" disabled={!name.trim()}>
          <Icon name="plus" size={12}/> Create
        </button>
      </div>
      <div className="db-rail-newform-hint">
        Adds an <code>id</code> primary key automatically{parent ? <>, plus a <code>{singularize(parent)}_id</code> link to <strong>{parents.find(p=>p.key===parent)?.label}</strong>.</> : "."}
      </div>
    </form>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* Activity feed — animated ingest cards                                   */
/* ────────────────────────────────────────────────────────────────────── */

// Pre-seeded ingest cards so the Activity panel feels lived-in on first load.
// These are "done" already — no animation, fully expandable.
const seedActivityEvents = () => ([
  {
    id: "seed-1", fileName: "handwritten_receipt.jpg", fileSize: "412 KB",
    kind: "scan", table: "invoices", tableLabel: "Invoices",
    rowIdx: null, addedRows: 1, detectedFields: 5,
    cells: [
      { name: "id", type: "pk", value: "INV-0143", pk: true },
      { name: "customer_id", type: "fk", value: "C003", ref: "customers" },
      { name: "date", type: "date", value: "2026-04-28" },
      { name: "amount", type: "money", value: "84.20" },
      { name: "status", type: "text", value: "paid" },
    ],
    ts: Date.now() - 1000 * 60 * 4,
  },
  {
    id: "seed-2", fileName: "millmann_supply_order.docx", fileSize: "28 KB",
    kind: "word", table: "orders", tableLabel: "Supplier Orders",
    rowIdx: null, addedRows: 1, detectedFields: 4,
    cells: [
      { name: "id", type: "pk", value: "O-0042", pk: true },
      { name: "supplier_id", type: "fk", value: "S001", ref: "suppliers" },
      { name: "date", type: "date", value: "2026-04-22" },
      { name: "total", type: "money", value: "1840.00" },
    ],
    ts: Date.now() - 1000 * 60 * 27,
  },
  {
    id: "seed-3", fileName: "customer_list_march.xlsx", fileSize: "64 KB",
    kind: "excel", table: "customers", tableLabel: "Customers",
    rowIdx: null, addedRows: 3, detectedFields: 4,
    cells: [
      { name: "id", type: "pk", value: "C006", pk: true },
      { name: "name", type: "text", value: "Café Murnau" },
      { name: "city", type: "text", value: "Garmisch" },
      { name: "since", type: "date", value: "2026-03-14" },
    ],
    ts: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: "seed-4", fileName: "invoice_2026-04-12.pdf", fileSize: "118 KB",
    kind: "pdf", table: "invoices", tableLabel: "Invoices",
    rowIdx: null, addedRows: 1, detectedFields: 5,
    cells: [
      { name: "id", type: "pk", value: "INV-0140", pk: true },
      { name: "customer_id", type: "fk", value: "C002", ref: "customers" },
      { name: "date", type: "date", value: "2026-04-12" },
      { name: "amount", type: "money", value: "212.29" },
      { name: "status", type: "text", value: "open" },
    ],
    ts: Date.now() - 1000 * 60 * 60 * 26,
  },
]);

const relTime = (ts) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60)        return `${s}s ago`;
  if (s < 3600)      return `${Math.floor(s/60)}m ago`;
  if (s < 86400)     return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

// IngestCard — animates through reading → extracting → linking → done.
// Pre-seeded events skip the animation and start expanded.
const PHASES = [
  { key: "reading",    label: "Reading document",    ms: 700 },
  { key: "extracting", label: "Extracting fields",   ms: 900 },
  { key: "linking",    label: "Linking to schema",   ms: 700 },
  { key: "done",       label: "Added to table",      ms: 0   },
];

const IngestCard = ({ event, onPickTable, onJumpToCell }) => {
  const isLive = !!event.isLive;
  const [phaseIdx, setPhaseIdx] = useState(isLive ? 0 : 3);
  const [expanded, setExpanded] = useState(!isLive);

  useEffect(() => {
    if (!isLive) return;
    let cancelled = false;
    const tick = (i) => {
      if (cancelled || i >= PHASES.length - 1) return;
      const t = setTimeout(() => {
        if (cancelled) return;
        setPhaseIdx(i + 1);
        if (i + 1 === PHASES.length - 1) {
          setTimeout(() => !cancelled && setExpanded(true), 250);
        } else {
          tick(i + 1);
        }
      }, PHASES[i].ms);
      return t;
    };
    tick(0);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phase = PHASES[phaseIdx];
  const done = phase.key === "done";
  const progressPct = ((phaseIdx) / (PHASES.length - 1)) * 100;

  const openCell = (cellName) => {
    if (event.rowIdx == null || !onJumpToCell) {
      onPickTable && onPickTable(event.table);
      return;
    }
    // Find column index of the cell in the row
    const colIdx = Math.max(0, event.cells.findIndex(c => c.name === cellName));
    onJumpToCell(event.table, event.rowIdx, colIdx);
  };

  return (
    <div className={`ingest-card ${done ? "is-done" : "is-running"} ${expanded ? "is-expanded" : ""}`}>
      <div className="ingest-card-head" onClick={() => done && setExpanded(v => !v)}>
        <FileIcon kind={event.kind} size={34}/>
        <div className="ingest-card-meta">
          <div className="ingest-card-name" title={event.fileName}>{event.fileName}</div>
          <div className="ingest-card-sub">
            <span>{event.fileSize}</span>
            <span className="ingest-dot-sep">•</span>
            <span>{relTime(event.ts)}</span>
            {done && <>
              <span className="ingest-dot-sep">•</span>
              <span className="ingest-table-chip" onClick={(e)=>{e.stopPropagation(); onPickTable && onPickTable(event.table);}}>
                <Icon name="arrow" size={10}/> {event.tableLabel}
              </span>
            </>}
          </div>
        </div>
        {done && (
          <button className="ingest-expand-btn" onClick={(e)=>{e.stopPropagation(); setExpanded(v=>!v);}}>
            <span className={`ingest-chev ${expanded?"is-open":""}`}><Icon name="chevron" size={14}/></span>
          </button>
        )}
        {!done && <div className="ingest-running-badge"><span className="ingest-spinner"/>Working</div>}
      </div>

      {!done && (
        <div className="ingest-card-body">
          <div className="ingest-progress">
            <div className="ingest-progress-fill" style={{ width: `${progressPct}%` }}/>
          </div>
          <div className="ingest-phases">
            {PHASES.slice(0, -1).map((p, i) => (
              <div key={p.key} className={`ingest-phase ${i < phaseIdx ? "is-past" : i === phaseIdx ? "is-active" : "is-future"}`}>
                <span className="ingest-phase-dot"/>
                <span className="ingest-phase-label">{p.label}</span>
                {i < phaseIdx && <Icon name="check" size={11}/>}
              </div>
            ))}
          </div>
        </div>
      )}

      {done && expanded && (
        <div className="ingest-card-expanded">
          <div className="ingest-stats">
            <div className="ingest-stat">
              <div className="ingest-stat-v">{event.addedRows}</div>
              <div className="ingest-stat-l">{event.addedRows === 1 ? "row added" : "rows added"}</div>
            </div>
            <div className="ingest-stat">
              <div className="ingest-stat-v">{event.detectedFields}</div>
              <div className="ingest-stat-l">fields detected</div>
            </div>
            <div className="ingest-stat">
              <div className="ingest-stat-v ingest-stat-ok">100%</div>
              <div className="ingest-stat-l">confidence</div>
            </div>
          </div>

          <div className="ingest-rowprev-h">Row added to <strong>{event.tableLabel}</strong></div>
          <div className="ingest-rows">
            {event.cells.map((c, i) => (
              <div key={c.name} className="ingest-cell" style={{ animationDelay: `${i * 60}ms` }} onClick={() => openCell(c.name)}>
                <div className="ingest-cell-name">
                  {c.pk && <span className="ingest-cell-pk">PK</span>}
                  {c.type === "fk" && <span className="ingest-cell-fk">FK</span>}
                  <span>{c.name}</span>
                </div>
                <div className={`ingest-cell-val ingest-val-${c.pk ? "pk" : (c.type || "text")}`}>{String(c.value ?? "")}</div>
              </div>
            ))}
          </div>

          <button className="ingest-open-table" onClick={() => onPickTable && onPickTable(event.table)}>
            <Icon name="arrow" size={12}/> Open {event.tableLabel}
          </button>
        </div>
      )}
    </div>
  );
};

const ActivityPanel = ({ events, onIngest, onPickTable, onJumpToCell }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (fileList) => {
    if (!onIngest || !fileList || !fileList.length) return;
    Array.from(fileList).forEach(f => {
      const size = f.size ? (f.size > 1024*1024
        ? `${(f.size/1024/1024).toFixed(1)} MB`
        : `${Math.max(1, Math.round(f.size/1024))} KB`) : "—";
      onIngest(f.name || String(f), size);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const totalRows = events.reduce((n, e) => n + (e.addedRows || 0), 0);

  return (
    <div className="activity-panel">
      <div
        className={`activity-drop ${dragOver ? "is-drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
      >
        <div className="activity-drop-icon"><Icon name="upload" size={20}/></div>
        <div className="activity-drop-text">
          <div className="activity-drop-title">Drop a document on the agent</div>
          <div className="activity-drop-sub">PDF, Excel, Word, scans — it picks the right table.</div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
        />
      </div>

      <div className="activity-summary">
        <div className="activity-summary-stat">
          <div className="activity-summary-v">{events.length}</div>
          <div className="activity-summary-l">documents</div>
        </div>
        <div className="activity-summary-stat">
          <div className="activity-summary-v">{totalRows}</div>
          <div className="activity-summary-l">rows added</div>
        </div>
        <div className="activity-summary-stat">
          <div className="activity-summary-v ingest-stat-ok">live</div>
          <div className="activity-summary-l">agent</div>
        </div>
      </div>

      <div className="activity-divider"><span>Recent ingestions</span></div>

      <div className="activity-feed">
        {events.length === 0 && (
          <div className="activity-empty">
            <Icon name="upload" size={18}/>
            <div>No ingestions yet. Drop a file above to get started.</div>
          </div>
        )}
        {events.map(ev => (
          <IngestCard key={ev.id} event={ev} onPickTable={onPickTable} onJumpToCell={onJumpToCell}/>
        ))}
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────────────── */
/* DatabaseView — schema diagram + table grid + sidebar                    */
/* ────────────────────────────────────────────────────────────────────── */
const DatabaseView = ({ sector, onReset }) => {
  const data = window.HUNGRYDB_DATA;

  // Live, mutable copy of the schema so search, new-table, agent ingest and grid
  // edits all read/write the same source of truth.
  const [tables, setTables] = useState(() => cloneTables(data.TABLES));
  const [relations, setRelations] = useState(() => data.RELATIONS.map(r => ({ ...r })));
  const [activeTable, setActiveTable] = useState(null);  // null = schema overview
  const [activeRow, setActiveRow] = useState(null);
  const [provenanceCell, setProvenanceCell] = useState(null);  // { table, rowIdx, field }
  const [sidebarTab, setSidebarTab] = useState("activity");

  // Activity feed — every ingestion produces a card here. Pre-seeded with
  // a handful of mock completed ingestions so the demo feels lived-in.
  const [ingestEvents, setIngestEvents] = useState(() => seedActivityEvents());

  // Search bar state
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [pendingFocus, setPendingFocus] = useState(null); // { table, rowIdx, col }
  const searchRef = useRef(null);

  // "New table" sidebar form
  const [newTableOpen, setNewTableOpen] = useState(false);

  const tableKeys = Object.keys(tables);

  const updateTable = useCallback((key, mutator) => {
    setTables(prev => ({ ...prev, [key]: mutator(prev[key]) }));
  }, []);

  const createTable = (label, parentKey) => {
    const key = slugifyTableKey(label, Object.keys(tables));
    const fields = [{ name: "id", type: "uuid", pk: true }];
    if (parentKey && tables[parentKey]) {
      fields.push({ name: `${singularize(parentKey)}_id`, type: "fk", ref: parentKey });
    }
    const count = Object.keys(tables).length;
    const newTable = {
      label,
      english: label,
      icon: "list",
      pos: { x: 80 + (count % 3) * 380, y: 80 + Math.floor(count / 3) * 280 },
      fields,
      rows: [],
    };
    setTables(prev => ({ ...prev, [key]: newTable }));
    if (parentKey) {
      setRelations(prev => [...prev, { from: key, fromField: `${singularize(parentKey)}_id`, to: parentKey }]);
    }
    setActiveTable(key);
    setActiveRow(null);
    setNewTableOpen(false);
  };

  const focusCell = (table, rowIdx, col) => {
    setActiveTable(table);
    setActiveRow(rowIdx ?? null);
    setPendingFocus({ table, rowIdx: rowIdx ?? 0, col: col ?? 0 });
    setQuery("");
    setShowResults(false);
  };

  // ⌘K / Ctrl-K focuses the global search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Agent-driven ingest — pretend to read the file and append a synthetic row
  // to the best-matching table. Returns a rich payload that the Activity panel
  // uses to render an animated ingestion card.
  const ingestFile = (fileName, fileSize) => {
    const lower = (fileName || "").toLowerCase();
    const match = (re) => tableKeys.find(k => re.test(tables[k].label) || re.test(k));
    let pickKey =
      /invoice|inv|rechnung/.test(lower) ? match(/invoice/i) :
      /customer|kunde|client/.test(lower) ? match(/customer/i) :
      /supplier|vendor|lieferant/.test(lower) ? match(/supplier/i) :
      /order|po\b|bestellung/.test(lower) ? match(/order/i) :
      /product|price|preis|artikel/.test(lower) ? match(/product/i) : null;
    pickKey = pickKey || activeTable || tableKeys[0];
    const target = tables[pickKey];
    if (!target) return null;

    const newRow = { _provenance: {} };
    const cells = [];
    target.fields.forEach((f) => {
      let v = "";
      if (f.pk) v = nextPkValue(target);
      else if (f.type === "money")   v = (Math.random() * 400 + 50).toFixed(2);
      else if (f.type === "int")     v = Math.floor(Math.random() * 20) + 1;
      else if (f.type === "percent") v = "7%";
      else if (f.type === "date")    v = "2026-05-" + String(Math.floor(Math.random() * 10) + 1).padStart(2, "0");
      else if (f.type === "fk") {
        const ref = tables[f.ref];
        const refRow = ref?.rows[Math.floor(Math.random() * Math.max(1, ref?.rows.length || 1))];
        const refPk = ref?.fields.find(x => x.pk)?.name;
        v = (refRow && refPk) ? refRow[refPk] : "";
      }
      else if (f.name === "name") v = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
      else v = "";
      newRow[f.name] = v;
      newRow._provenance[f.name] = "agent:" + fileName;
      cells.push({ name: f.name, type: f.type, value: v, pk: !!f.pk, ref: f.ref });
    });

    const newRowIdx = (tables[pickKey]?.rows.length) || 0;
    setTables(prev => ({
      ...prev,
      [pickKey]: { ...prev[pickKey], rows: [...prev[pickKey].rows, newRow] },
    }));

    // Determine extension/kind for the card icon
    const ext = (lower.match(/\.([a-z0-9]+)$/) || ["", ""])[1];
    const kind =
      ["pdf"].includes(ext)                ? "pdf"   :
      ["xlsx", "xls", "csv"].includes(ext) ? "excel" :
      ["doc", "docx"].includes(ext)        ? "word"  :
      ["jpg", "jpeg", "png", "tif", "tiff", "heic"].includes(ext) ? "scan" :
      "csv";

    return {
      id: `ing-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fileName,
      fileSize: fileSize || "—",
      kind,
      table: pickKey,
      tableLabel: target.label,
      rowIdx: newRowIdx,
      cells,
      addedRows: 1,
      detectedFields: cells.length,
      ts: Date.now(),
    };
  };

  const results = showResults ? fuzzyFind(tables, query) : [];

  return (
    <div className="db-stage">
      {/* TOP CHROME */}
      <div className="db-topbar">
        <div className="db-topbar-left">
          <div className="db-brand-mini">
            <div className="hd-logo hd-logo-sm">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="6"  rx="8" ry="3"/>
                <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/>
                <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>
              </svg>
            </div>
            <div className="db-brand-name">HungryDB</div>
          </div>
          <div className="db-divider"/>
          <button className="db-crumb" onClick={() => { setActiveTable(null); setActiveRow(null); }}>
            Schema
          </button>
          {activeTable && (
            <>
              <span className="db-crumb-sep">/</span>
              <span className="db-crumb is-active">{tables[activeTable].label}</span>
            </>
          )}
        </div>
        <div className="db-topbar-center">
          <Icon name="search" size={14}/>
          <input
            ref={searchRef}
            className="db-search-input"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setQuery(""); setShowResults(false); e.currentTarget.blur(); }
              else if (e.key === "Enter" && results[0]) {
                const r = results[0];
                focusCell(r.table, r.rowIdx, r.col);
              }
            }}
            placeholder="Search tables, fields, rows…"
          />
          <kbd className="db-kbd">⌘K</kbd>
          {showResults && query && (
            <div className="db-search-pop">
              {results.length === 0 ? (
                <div className="db-search-empty">No matches in {tableKeys.length} tables</div>
              ) : results.map((r, i) => (
                <button
                  key={i}
                  className="db-search-row"
                  onMouseDown={(e) => { e.preventDefault(); focusCell(r.table, r.rowIdx, r.col); }}
                >
                  <span className={`db-search-kind db-search-kind-${r.kind}`}>{r.kind}</span>
                  <span className="db-search-label">{r.label}</span>
                  <span className="db-search-hint">{r.hint}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="db-topbar-right"/>
      </div>

      {/* MAIN GRID */}
      <div className="db-main">
        {/* Left rail — table list */}
        <aside className="db-rail">
          <div className="db-rail-section">
            <div className="db-rail-h">Database</div>
            <button
              className={`db-rail-item ${activeTable === null ? "is-active" : ""}`}
              onClick={() => { setActiveTable(null); setActiveRow(null); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5h7v7H3zM14 5h7v7h-7zM3 16h7v5H3zM14 16h7v5h-7z"/>
              </svg>
              <span>Schema</span>
            </button>
          </div>
          <div className="db-rail-section">
            <div className="db-rail-h">Tables</div>
            {tableKeys.map(k => {
              const t = tables[k];
              return (
                <button
                  key={k}
                  className={`db-rail-item ${activeTable === k ? "is-active" : ""}`}
                  onClick={() => { setActiveTable(k); setActiveRow(null); }}
                >
                  <Icon name={t.icon} size={14}/>
                  <span>{t.label}</span>
                  <span className="db-rail-count">{t.rows.length}</span>
                </button>
              );
            })}
            {newTableOpen ? (
              <NewTableForm
                parents={tableKeys.map(k => ({ key: k, label: tables[k].label }))}
                onCreate={createTable}
                onCancel={() => setNewTableOpen(false)}
              />
            ) : (
              <button className="db-rail-add" onClick={() => setNewTableOpen(true)}>
                <Icon name="plus" size={13}/>
                <span>New table</span>
              </button>
            )}
          </div>
          <div className="db-rail-section db-rail-section-bottom">
            <div className="db-rail-h">Inferred</div>
            {data.INFERENCE_NOTES.slice(0, 3).map((n, i) => (
              <div key={i} className="db-infer">
                <div className="db-infer-label">{n.label}</div>
                <div className="db-infer-value">{n.value}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center — schema or table grid */}
        <main className="db-content">
          {activeTable === null ? (
            <SchemaView data={data} tables={tables} relations={relations} onPick={(k) => setActiveTable(k)}/>
          ) : (
            <TableGrid
              tableKey={activeTable}
              table={tables[activeTable]}
              updateTable={updateTable}
              data={data}
              activeRow={activeRow}
              setActiveRow={setActiveRow}
              provenanceCell={provenanceCell}
              setProvenanceCell={setProvenanceCell}
              pendingFocus={pendingFocus && pendingFocus.table === activeTable ? pendingFocus : null}
              clearPendingFocus={() => setPendingFocus(null)}
            />
          )}
        </main>

        {/* Right — Intelligence sidebar */}
        <aside className="db-side">
          <div className="db-side-tabs">
            <button className={`db-side-tab ${sidebarTab==="intel"?"is-active":""}`} onClick={() => setSidebarTab("intel")}>
              <Icon name="sparkle" size={13}/> Intelligence
            </button>
            <button className={`db-side-tab ${sidebarTab==="activity"?"is-active":""}`} onClick={() => setSidebarTab("activity")}>
              <Icon name="upload" size={13}/> Activity
            </button>
            <button className={`db-side-tab ${sidebarTab==="exports"?"is-active":""}`} onClick={() => setSidebarTab("exports")}>
              <Icon name="download" size={13}/> Exports
            </button>
          </div>

          {sidebarTab === "intel"    && <IntelPanel data={data} tables={tables} onPickTable={(k)=>setActiveTable(k)} onJumpToActivity={()=>setSidebarTab("activity")}/>}
          {sidebarTab === "activity" && <ActivityPanel events={ingestEvents} onIngest={(name,size)=>{
            const ev = ingestFile(name, size);
            if (ev) setIngestEvents(prev => [{ ...ev, isLive: true }, ...prev]);
            return ev;
          }} onPickTable={(k)=>setActiveTable(k)} onJumpToCell={focusCell}/>}
          {sidebarTab === "exports"  && <ExportsPanel data={data}/>}
        </aside>
      </div>

      {/* Provenance overlay */}
      {provenanceCell && (
        <ProvenanceOverlay
          cell={provenanceCell}
          tables={tables}
          data={data}
          onClose={() => setProvenanceCell(null)}
        />
      )}
    </div>
  );
};

/* Schema (ERD) view ─────────────────────────────────────────────────── */
const SchemaView = ({ data, tables, relations, onPick }) => {
  tables = tables || data.TABLES;
  relations = relations || data.RELATIONS;
  const tableKeys = Object.keys(tables);
  const W = 1180, H = 700;
  const TW = 280, TH = 220;

  // Local positions — let the user drag tables around. Seed from data.
  const [positions, setPositions] = React.useState(() => {
    const out = {};
    tableKeys.forEach(k => { out[k] = { ...(tables[k].pos || { x: 80, y: 80 }) }; });
    return out;
  });
  // When new tables are added, seed positions for them.
  React.useEffect(() => {
    setPositions(prev => {
      let changed = false;
      const out = { ...prev };
      tableKeys.forEach(k => {
        if (!out[k]) { out[k] = { ...(tables[k].pos || { x: 80, y: 80 }) }; changed = true; }
      });
      return changed ? out : prev;
    });
  }, [tableKeys.length]);

  // Pan / zoom state. viewBox = (vx, vy, vw, vh) in canvas coords.
  const [view, setView] = React.useState({ x: 0, y: 0, w: W, h: H });
  const svgRef = React.useRef(null);

  // Drag state — either dragging a node, or panning the canvas.
  const dragRef = React.useRef(null); // { kind: 'node'|'pan', key?, startX, startY, startPos? }

  // Convert client (px) → canvas coords using current view + svg size
  const clientToCanvas = (cx, cy) => {
    const r = svgRef.current.getBoundingClientRect();
    const sx = view.w / r.width;
    const sy = view.h / r.height;
    return { x: view.x + (cx - r.left) * sx, y: view.y + (cy - r.top) * sy };
  };

  const onMouseDownNode = (k, e) => {
    e.stopPropagation();
    const p = clientToCanvas(e.clientX, e.clientY);
    dragRef.current = {
      kind: "node", key: k,
      startMx: p.x, startMy: p.y,
      startPx: positions[k].x, startPy: positions[k].y,
      moved: false,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseDownCanvas = (e) => {
    if (e.button !== 0) return;
    dragRef.current = {
      kind: "pan",
      startCx: e.clientX, startCy: e.clientY,
      startVx: view.x, startVy: view.y,
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.kind === "node") {
      const p = clientToCanvas(e.clientX, e.clientY);
      const dx = p.x - d.startMx, dy = p.y - d.startMy;
      if (Math.abs(dx) + Math.abs(dy) > 2) d.moved = true;
      setPositions(prev => ({ ...prev, [d.key]: { x: d.startPx + dx, y: d.startPy + dy } }));
    } else if (d.kind === "pan") {
      const r = svgRef.current.getBoundingClientRect();
      const sx = view.w / r.width;
      const sy = view.h / r.height;
      setView(v => ({ ...v, x: d.startVx - (e.clientX - d.startCx) * sx, y: d.startVy - (e.clientY - d.startCy) * sy }));
    }
  };

  const onMouseUp = (e) => {
    const d = dragRef.current;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    if (d?.kind === "node" && !d.moved) {
      // treat as click → drill into table
      onPick(d.key);
    }
    dragRef.current = null;
  };

  // Wheel = zoom around the cursor
  const onWheel = (e) => {
    if (!svgRef.current) return;
    e.preventDefault();
    const r = svgRef.current.getBoundingClientRect();
    const cx = view.x + ((e.clientX - r.left) / r.width) * view.w;
    const cy = view.y + ((e.clientY - r.top) / r.height) * view.h;
    const factor = e.deltaY > 0 ? 1.12 : 1 / 1.12;
    const nw = Math.min(W * 4, Math.max(W * 0.4, view.w * factor));
    const nh = nw * (H / W);
    // keep cursor anchor stable
    const nx = cx - ((e.clientX - r.left) / r.width) * nw;
    const ny = cy - ((e.clientY - r.top) / r.height) * nh;
    setView({ x: nx, y: ny, w: nw, h: nh });
  };

  // Reset / fit
  const resetView = () => setView({ x: 0, y: 0, w: W, h: H });

  // Compute edge endpoints — anchor on the side of each table at the FK/PK row
  const ROW_Y = (idx) => 48 + idx * 28 + 14;
  const edges = relations.map(r => {
    const ta = tables[r.from], tb = tables[r.to];
    if (!ta || !tb) return null;
    const a = positions[r.from], b = positions[r.to];
    if (!a || !b) return null;
    const fromIdx = Math.min(ta.fields.findIndex(f => f.name === r.fromField), 5);
    const toIdx = Math.min(tb.fields.findIndex(f => f.pk), 5);

    // Determine sides dynamically based on current positions
    const acx = a.x + TW / 2, bcx = b.x + TW / 2;
    const acy = a.y + TH / 2, bcy = b.y + TH / 2;
    const dx = bcx - acx, dy = bcy - acy;
    let aSide, bSide;
    if (Math.abs(dx) > Math.abs(dy) * 0.6) {
      // mostly horizontal — exit side facing partner
      aSide = dx > 0 ? "R" : "L";
      bSide = dx > 0 ? "L" : "R";
    } else {
      // mostly vertical — bow out to the right of both
      aSide = "R"; bSide = "R";
    }

    const ax = a.x + (aSide === "R" ? TW : 0);
    const ay = a.y + ROW_Y(fromIdx >= 0 ? fromIdx : 1);
    const bx = b.x + (bSide === "R" ? TW : 0);
    const by = b.y + ROW_Y(toIdx >= 0 ? toIdx : 0);

    const aDir = aSide === "R" ? 1 : -1;
    const bDir = bSide === "R" ? 1 : -1;
    const samePush = aSide === bSide;
    const baseOff = samePush ? 100 : 70;
    const c1x = ax + aDir * baseOff;
    const c2x = bx + bDir * baseOff;
    const c1y = ay;
    const c2y = by;

    return { ...r, ax, ay, bx, by, c1x, c1y, c2x, c2y };
  }).filter(Boolean);

  return (
    <div className="schema-wrap">
      <div className="schema-head">
        <div>
          <div className="schema-eyebrow">Inferred Schema</div>
          <h2 className="schema-title">{data.INFERENCE_NOTES[0].value}</h2>
        </div>
        <div className="schema-stats">
          <div className="schema-stat"><div className="schema-stat-num">{tableKeys.length}</div><div className="schema-stat-lbl">Tables</div></div>
          <div className="schema-stat"><div className="schema-stat-num">{tableKeys.reduce((s,k)=>s+tables[k].rows.length,0)}</div><div className="schema-stat-lbl">Rows shown</div></div>
          <div className="schema-stat"><div className="schema-stat-num">1,812</div><div className="schema-stat-lbl">+ from CSV</div></div>
          <div className="schema-stat"><div className="schema-stat-num">{relations.length}</div><div className="schema-stat-lbl">Relations</div></div>
        </div>
      </div>

      <div className="schema-canvas">
        <div className="schema-tools">
          <button className="schema-tool" onClick={() => {
            const f = 1 / 1.2;
            setView(v => ({ x: v.x + v.w*(1-f)/2, y: v.y + v.h*(1-f)/2, w: v.w*f, h: v.h*f }));
          }} title="Zoom in">+</button>
          <button className="schema-tool" onClick={() => {
            const f = 1.2;
            setView(v => ({ x: v.x + v.w*(1-f)/2, y: v.y + v.h*(1-f)/2, w: Math.min(W*4, v.w*f), h: Math.min(H*4, v.h*f) }));
          }} title="Zoom out">−</button>
          <button className="schema-tool schema-tool-text" onClick={resetView} title="Fit">Fit</button>
        </div>
        <svg
          ref={svgRef}
          className="schema-svg"
          viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
          onMouseDown={onMouseDownCanvas}
          onWheel={onWheel}
        >
          <defs>
            <pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.05)"/>
            </pattern>
          </defs>
          {/* generous background so panning still hits dots */}
          <rect x={-W*2} y={-H*2} width={W*5} height={H*5} fill="url(#dotgrid)"/>

          {/* edges */}
          {edges.map((e, i) => (
            <g key={i} className="schema-edge">
              <path
                d={`M ${e.ax} ${e.ay} C ${e.c1x} ${e.c1y}, ${e.c2x} ${e.c2y}, ${e.bx} ${e.by}`}
                stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeDasharray="4 4"
                opacity="0.55"
              />
              <circle cx={e.ax} cy={e.ay} r="3" fill="var(--accent)" opacity="0.9"/>
              <circle cx={e.bx} cy={e.by} r="3" fill="#fff" stroke="var(--accent)" strokeWidth="1.5"/>
            </g>
          ))}

          {/* tables */}
          {tableKeys.map((k, idx) => {
            const t = tables[k];
            const p = positions[k] || { x: 0, y: 0 };
            return (
              <g key={k}
                 transform={`translate(${p.x} ${p.y})`}
                 className="schema-node"
                 onMouseDown={(e) => onMouseDownNode(k, e)}
                 style={{ animationDelay: `${idx * 70}ms`, cursor: "grab" }}>
                <rect width={TW} height={TH} rx="10" fill="#fff" stroke="rgba(0,0,0,0.08)" strokeWidth="1"/>
                <rect width={TW} height={36} rx="10" fill="var(--bg-warm)" />
                <rect y="26" width={TW} height={10} fill="var(--bg-warm)"/>
                <line x1="0" y1="36" x2={TW} y2="36" stroke="rgba(0,0,0,0.06)"/>
                <text x="44" y="22" style={{ font: "600 13px 'Inter', sans-serif", fill: "var(--ink)" }}>
                  {t.label}
                </text>
                <text x="44" y="33" style={{ font: "500 10px 'JetBrains Mono', monospace", fill: "var(--ink-mute)" }}>
                  {k} · {t.rows.length} rows
                </text>
                <foreignObject x="14" y="10" width="22" height="22">
                  <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: "var(--accent)", display: "flex" }}>
                    <Icon name={t.icon} size={16} stroke={1.5}/>
                  </div>
                </foreignObject>

                {t.fields.slice(0, 6).map((f, i) => (
                  <g key={f.name} transform={`translate(0 ${48 + i * 28})`}>
                    {i > 0 && <line x1="14" y1="0" x2={TW-14} y2="0" stroke="rgba(0,0,0,0.04)"/>}
                    <text x="14" y="18" style={{ font: f.pk ? "600 11px 'JetBrains Mono', monospace" : "500 11px 'JetBrains Mono', monospace", fill: f.pk ? "var(--accent)" : "var(--ink)" }}>
                      {f.pk ? "● " : f.ref ? "↳ " : "  "}{f.name}
                    </text>
                    <text x={TW - 14} y="18" textAnchor="end" style={{ font: "500 10px 'JetBrains Mono', monospace", fill: "var(--ink-mute)" }}>
                      {f.type}{f.ref ? ` → ${f.ref}` : ""}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="schema-hint">
        <Icon name="arrow" size={14}/>
        <span>Drag tables to rearrange · scroll to zoom · drag empty space to pan · click a table to view rows</span>
      </div>
    </div>
  );
};

/* TableGrid view — Excel-like editable grid ───────────────────────────── */
const TableGrid = ({ tableKey, table, updateTable, data, activeRow, setActiveRow, provenanceCell, setProvenanceCell, pendingFocus, clearPendingFocus }) => {
  const t = table || data.TABLES[tableKey];
  const rows = t.rows;
  const fields = t.fields;

  const setRows = (updater) =>
    updateTable(tableKey, prev => ({ ...prev, rows: typeof updater === "function" ? updater(prev.rows) : updater }));
  const setFields = (updater) =>
    updateTable(tableKey, prev => ({ ...prev, fields: typeof updater === "function" ? updater(prev.fields) : updater }));

  // Selection: { r: rowIndex, c: colIndex } — colIndex into fields[]
  const [sel, setSel] = React.useState({ r: 0, c: 0 });
  const [editing, setEditing] = React.useState(null); // { r, c, draft }
  const [colWidths, setColWidths] = React.useState(() =>
    Object.fromEntries(fields.map(f => [f.name, defaultColWidth(f)]))
  );
  React.useEffect(() => {
    setColWidths(prev => {
      const out = { ...prev };
      let changed = false;
      fields.forEach(f => { if (!out[f.name]) { out[f.name] = defaultColWidth(f); changed = true; } });
      return changed ? out : prev;
    });
  }, [tableKey, fields.length]);

  // When user runs a search and picks a result, jump to that row/col + open editor
  React.useEffect(() => {
    if (!pendingFocus) return;
    const { rowIdx, col } = pendingFocus;
    const r = Math.min(Math.max(rowIdx ?? 0, 0), Math.max(0, rows.length - 1));
    const c = Math.min(Math.max(col ?? 0, 0), Math.max(0, fields.length - 1));
    setSel({ r, c });
    clearPendingFocus && clearPendingFocus();
  }, [pendingFocus]);

  const wrapRef = React.useRef(null);

  // Focus selected cell into view; refocus the grid after edits
  React.useEffect(() => {
    if (editing) return;
    wrapRef.current?.focus();
  }, [editing, sel.r, sel.c, tableKey]);

  const totalCols = fields.length;
  const totalRows = rows.length;

  const beginEdit = (r, c, seedChar) => {
    const f = fields[c];
    if (!f) return;
    const cur = rows[r]?.[f.name];
    setEditing({ r, c, draft: seedChar !== undefined ? seedChar : (cur ?? "") });
  };

  const commitEdit = () => {
    if (!editing) return;
    const { r, c, draft } = editing;
    const f = fields[c];
    setRows(prev => {
      const next = [...prev];
      const row = { ...(next[r] || {}) };
      row[f.name] = coerceValue(draft, f);
      // Mark as user-edited — drop any provenance for this cell so it shows as authored
      row._provenance = { ...(row._provenance || {}) };
      row._provenance[f.name] = "edited:you";
      next[r] = row;
      return next;
    });
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  const addRow = () => {
    const newRow = { _provenance: {} };
    fields.forEach(f => {
      if (f.pk) newRow[f.name] = nextPkValue(t);
      else newRow[f.name] = "";
    });
    const newIdx = rows.length;
    setRows(prev => [...prev, newRow]);
    // Auto-enter edit mode on the first non-PK cell so the user can just type.
    // If the table only has a PK column, don't auto-edit (would wipe the PK value).
    const firstEditable = fields.findIndex(f => !f.pk);
    if (firstEditable >= 0) {
      setSel({ r: newIdx, c: firstEditable });
      setTimeout(() => setEditing({ r: newIdx, c: firstEditable, draft: "" }), 0);
    } else {
      setSel({ r: newIdx, c: 0 });
    }
  };

  const deleteRow = (r) => {
    setRows(prev => prev.filter((_, i) => i !== r));
    setSel(s => ({ r: Math.min(s.r, rows.length - 2), c: s.c }));
  };

  const addColumn = () => {
    let i = fields.length + 1;
    let baseName;
    do { baseName = "field_" + i++; } while (fields.some(f => f.name === baseName));
    const newField = { name: baseName, type: "text" };
    setFields(prev => [...prev, newField]);
    setColWidths(w => ({ ...w, [baseName]: 140 }));
    setRows(prev => prev.map(r => ({ ...r, [baseName]: "" })));
    // Jump to the new column header so the user can rename it
    setSel(s => ({ r: s.r, c: fields.length }));
  };

  const onKey = (e) => {
    if (editing) {
      if (e.key === "Enter")      { e.preventDefault(); commitEdit(); setSel(s => ({ r: Math.min(s.r + 1, totalRows - 1), c: s.c })); }
      else if (e.key === "Tab")   { e.preventDefault(); commitEdit(); setSel(s => ({ r: s.r, c: Math.min(s.c + 1, totalCols - 1) })); }
      else if (e.key === "Escape"){ e.preventDefault(); cancelEdit(); }
      return;
    }
    const { r, c } = sel;
    if (e.key === "ArrowDown")    { e.preventDefault(); setSel({ r: Math.min(r + 1, totalRows - 1), c }); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel({ r: Math.max(r - 1, 0), c }); }
    else if (e.key === "ArrowLeft"){ e.preventDefault(); setSel({ r, c: Math.max(c - 1, 0) }); }
    else if (e.key === "ArrowRight" || e.key === "Tab") { e.preventDefault(); setSel({ r, c: Math.min(c + 1, totalCols - 1) }); }
    else if (e.key === "Enter" || e.key === "F2") { e.preventDefault(); beginEdit(r, c); }
    else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      const f = fields[c];
      setRows(prev => {
        const next = [...prev];
        next[r] = { ...next[r], [f.name]: "" };
        return next;
      });
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      // start editing with the typed character
      beginEdit(r, c, e.key);
    }
  };

  const startResize = (fieldName, startX, startW) => {
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      setColWidths(w => ({ ...w, [fieldName]: Math.max(60, startW + dx) }));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
  };

  // Selected cell info for formula bar
  const selField = fields[sel.c];
  const selRow = rows[sel.r];
  const selVal = selField && selRow ? selRow[selField.name] : "";
  const selAddress = selField ? `${columnLetter(sel.c)}${sel.r + 1}` : "";

  return (
    <div className="grid-wrap">
      <div className="grid-head">
        <div>
          <div className="grid-eyebrow">Table</div>
          <h2 className="grid-title">{t.label}</h2>
        </div>
        <div className="grid-meta">
          <span><strong>{rows.length}</strong> rows</span>
          <span className="grid-meta-dot">·</span>
          <span><strong>{fields.length}</strong> fields</span>
          <button className="grid-meta-btn" onClick={addRow} title="Add row (⌘↵)">
            <Icon name="plus" size={12}/> Row
          </button>
          <button className="grid-meta-btn" onClick={addColumn} title="Add column">
            <Icon name="plus" size={12}/> Column
          </button>
        </div>
      </div>

      {/* Formula bar */}
      <div className="xl-formula">
        <div className="xl-addr">{selAddress}</div>
        <div className="xl-fx">ƒx</div>
        <input
          className="xl-fbar"
          value={editing ? editing.draft : (selVal ?? "")}
          readOnly={!editing}
          onChange={(e) => editing && setEditing({ ...editing, draft: e.target.value })}
          onFocus={() => { if (!editing && selField) beginEdit(sel.r, sel.c); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); commitEdit(); }
            else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
          }}
          placeholder="Click a cell to edit"
        />
      </div>

      <div className="xl-wrap" ref={wrapRef} tabIndex={0} onKeyDown={onKey}>
        <table className="xl-table" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 44 }}/>
            {fields.map(f => <col key={f.name} style={{ width: colWidths[f.name] || 140 }}/>)}
            <col style={{ width: 32 }}/>
          </colgroup>
          <thead>
            <tr>
              <th className="xl-corner"></th>
              {fields.map((f, ci) => (
                <th key={f.name} className={`xl-th ${sel.c === ci ? "is-sel-col" : ""}`}>
                  <div className="xl-th-inner">
                    <span className="xl-th-letter">{columnLetter(ci)}</span>
                    <span className={`xl-th-name ${f.pk ? "is-pk" : ""} ${f.ref ? "is-fk" : ""}`}>
                      {f.pk ? "● " : f.ref ? "↳ " : ""}{f.name}
                    </span>
                    <span className="xl-th-type">{f.type}{f.ref ? `→${f.ref}` : ""}</span>
                  </div>
                  <div
                    className="xl-resize"
                    onMouseDown={(e) => { e.preventDefault(); startResize(f.name, e.clientX, colWidths[f.name] || 140); }}
                  />
                </th>
              ))}
              <th className="xl-th xl-th-add" onClick={addColumn} title="Add column">
                <Icon name="plus" size={12}/>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={sel.r === ri ? "is-sel-row" : ""}>
                <td
                  className={`xl-rownum ${sel.r === ri ? "is-sel" : ""}`}
                  onClick={() => { setSel({ r: ri, c: 0 }); setActiveRow(ri); }}
                >
                  {ri + 1}
                </td>
                {fields.map((f, ci) => {
                  const val = row[f.name];
                  const prov = row._provenance?.[f.name];
                  const isSel = sel.r === ri && sel.c === ci;
                  const isEditing = editing && editing.r === ri && editing.c === ci;
                  return (
                    <td
                      key={f.name}
                      className={`xl-td ${isSel ? "is-sel" : ""} ${prov ? "has-prov" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSel({ r: ri, c: ci });
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setSel({ r: ri, c: ci });
                        beginEdit(ri, ci);
                      }}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          className="xl-input"
                          value={editing.draft}
                          onChange={(e) => setEditing({ ...editing, draft: e.target.value })}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); commitEdit(); setSel(s => ({ r: Math.min(s.r + 1, totalRows - 1), c: s.c })); }
                            else if (e.key === "Tab") { e.preventDefault(); commitEdit(); setSel(s => ({ r: s.r, c: Math.min(s.c + 1, totalCols - 1) })); }
                            else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                          }}
                        />
                      ) : (
                        <>
                          <span className="xl-td-val">{formatVal(val, f)}</span>
                          {prov && prov !== "edited:you" && (
                            <span
                              className="xl-prov-dot"
                              title={`Source: ${prov}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setProvenanceCell({ table: tableKey, rowIdx: ri, field: f.name });
                              }}
                            />
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
                <td className="xl-rowend">
                  <button className="xl-row-del" onClick={() => deleteRow(ri)} title="Delete row">
                    <Icon name="x" size={11}/>
                  </button>
                </td>
              </tr>
            ))}
            {/* Add-row sentinel */}
            <tr className="xl-addrow" onClick={addRow}>
              <td className="xl-rownum is-add">+</td>
              <td className="xl-td xl-td-add" colSpan={fields.length + 1}>
                Add row
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const columnLetter = (i) => {
  // 0 → A, 25 → Z, 26 → AA …
  let s = "";
  let n = i;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
};

const defaultColWidth = (f) => {
  if (f.type === "uuid") return 200;
  if (f.type === "date") return 110;
  if (f.type === "money") return 110;
  if (f.type === "int") return 80;
  if (f.type === "percent") return 90;
  if (f.type === "enum") return 110;
  if (f.type === "fk") return 140;
  if (f.name === "id" || f.name === "number" || f.name === "sku") return 140;
  return 160;
};

const coerceValue = (draft, f) => {
  if (draft === "" || draft === null) return "";
  if (f.type === "int") {
    const n = parseInt(draft, 10);
    return isNaN(n) ? draft : n;
  }
  if (f.type === "money") {
    const n = parseFloat(String(draft).replace(/[^\d.-]/g, ""));
    return isNaN(n) ? draft : n;
  }
  return draft;
};

const formatVal = (v, f) => {
  if (v === null || v === undefined) return <span className="grid-null">∅</span>;
  if (f.type === "money") return <span>€ {v}</span>;
  if (f.type === "fk") return <code className="grid-fk">{v}</code>;
  if (f.name === "status") {
    const cls = { paid: "ok", open: "wait", overdue: "bad" }[v] || "";
    return <span className={`grid-status grid-status-${cls}`}>{v}</span>;
  }
  return v;
};

/* ProvenanceOverlay ─────────────────────────────────────────────────── */
const ProvenanceOverlay = ({ cell, tables, data, onClose }) => {
  const t = (tables && tables[cell.table]) || data.TABLES[cell.table];
  const row = t.rows[cell.rowIdx];
  const prov = row?._provenance?.[cell.field];
  const fileId = prov?.split(":")[0];
  const file = data.SOURCE_FILES.find(f => f.id === fileId);
  const value = row ? row[cell.field] : "";

  return (
    <div className="prov-backdrop" onClick={onClose}>
      <div className="prov-card" onClick={e => e.stopPropagation()}>
        <button className="prov-close" onClick={onClose}><Icon name="x" size={16}/></button>
        <div className="prov-eyebrow">Provenance</div>
        <div className="prov-grid">
          <div className="prov-left">
            <div className="prov-label">Value in database</div>
            <div className="prov-value">{String(value)}</div>
            <div className="prov-meta">
              <div><span>Table</span> {t.label}</div>
              <div><span>Field</span> {cell.field}</div>
              <div><span>Row</span> #{cell.rowIdx + 1}</div>
              <div><span>Confidence</span> {prov === "inferred" ? "inferred" : "directly extracted"}</div>
            </div>
          </div>
          <div className="prov-right">
            <div className="prov-source-head">
              {file && <FileIcon kind={file.kind} size={28}/>}
              <div>
                <div className="prov-source-name">{file?.name || "Inferred"}</div>
                <div className="prov-source-loc">{prov === "inferred" ? "AI inference" : prov}</div>
              </div>
            </div>
            <div className="prov-doc">
              <FakeDoc file={file} highlight={prov} value={value}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Fake document preview ──────────────────────────────────────────────── */
const FakeDoc = ({ file, highlight, value }) => {
  if (!file) return <div className="prov-doc-empty">Inferred from context — no direct source.</div>;

  if (file.kind === "excel" || file.kind === "csv") {
    // mini grid
    const cols = ["A","B","C","D","E","F","G"];
    const targetCell = highlight?.split(":")[1] || "";
    const targetCol = targetCell.match(/[A-Z]+/)?.[0];
    const targetRow = parseInt(targetCell.match(/\d+/)?.[0] || "0", 10);
    return (
      <div className="fakedoc-xls">
        <div className="fakedoc-xls-bar">
          <span>{file.name}</span>
          <span className="fakedoc-xls-tab">Sheet1</span>
        </div>
        <div className="fakedoc-xls-grid">
          <div className="fakedoc-xls-row fakedoc-xls-head">
            <div className="fakedoc-xls-cell fakedoc-xls-corner"/>
            {cols.map(c => <div key={c} className="fakedoc-xls-cell fakedoc-xls-colhead">{c}</div>)}
          </div>
          {[1,2,3,4,5,6,7,8,9,10,11].map(r => (
            <div key={r} className="fakedoc-xls-row">
              <div className="fakedoc-xls-cell fakedoc-xls-rowhead">{r}</div>
              {cols.map(c => {
                const isTarget = c === targetCol && r === targetRow;
                return (
                  <div key={c} className={`fakedoc-xls-cell ${isTarget ? "is-hl" : ""}`}>
                    {isTarget ? String(value) :
                      r === 1 ? ["ID","Name","Typ","Adresse","PLZ","USt-ID","Seit"][cols.indexOf(c)] || "" :
                      r % 2 === 0 ? "···" : "··"}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (file.kind === "scan") {
    return (
      <div className="fakedoc-scan">
        <div className="fakedoc-scan-paper">
          <div className="fakedoc-scan-line" style={{ width: "55%" }}>Hofmeister Bakery</div>
          <div className="fakedoc-scan-line" style={{ width: "40%", fontStyle: "italic" }}>Munich</div>
          <div className="fakedoc-scan-divider"/>
          <div className="fakedoc-scan-row"><span>Date</span><span className="fakedoc-hl">{value}</span></div>
          <div className="fakedoc-scan-row"><span>Customer</span><span>Ms. Berger</span></div>
          <div className="fakedoc-scan-row"><span>2× Stollen</span><span>25.00</span></div>
          <div className="fakedoc-scan-row"><span>5× Pretzel</span><span>7.40</span></div>
          <div className="fakedoc-scan-divider"/>
          <div className="fakedoc-scan-row"><span><strong>Total</strong></span><span><strong>€32.40</strong></span></div>
        </div>
        <div className="fakedoc-scan-stamp">SCAN · 1200 dpi</div>
      </div>
    );
  }

  if (file.kind === "pdf") {
    return (
      <div className="fakedoc-pdf">
        <div className="fakedoc-pdf-page">
          <div className="fakedoc-pdf-head">
            <div>
              <div style={{fontWeight:600}}>Hofmeister Bakery</div>
              <div style={{fontSize:10, color:"#888"}}>Maximilian St 14 · 80539 Munich</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:18, fontWeight:600}}>INVOICE</div>
              <div style={{fontSize:11}} className="fakedoc-hl">{String(value)}</div>
            </div>
          </div>
          <div className="fakedoc-pdf-block">
            <div className="fakedoc-pdf-line" style={{width:"60%"}}/>
            <div className="fakedoc-pdf-line" style={{width:"45%"}}/>
            <div className="fakedoc-pdf-line" style={{width:"50%"}}/>
          </div>
          <table className="fakedoc-pdf-table">
            <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Amount</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Rye Mixed Loaf 1kg</td><td>24</td><td>70.80</td></tr>
              <tr><td>2</td><td>Butter Pretzel</td><td>60</td><td>51.00</td></tr>
              <tr><td>3</td><td>Apple Strudel Slice</td><td>18</td><td>49.50</td></tr>
              <tr><td>4</td><td>Wholegrain Loaf 750g</td><td>22</td><td>57.20</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (file.kind === "word") {
    return (
      <div className="fakedoc-word">
        <div className="fakedoc-word-page">
          <div style={{fontSize:14, fontWeight:600, marginBottom:8}}>Order to Millmann Mills Ltd.</div>
          <div className="fakedoc-word-line"/>
          <div className="fakedoc-word-line" style={{width:"80%"}}/>
          <div className="fakedoc-word-line" style={{width:"60%"}}/>
          <div style={{margin:"12px 0", fontSize:11}}>
            Dear Sir or Madam,<br/>
            we kindly request delivery of the following items by <span className="fakedoc-hl">{String(value)}</span>:
          </div>
          <div style={{fontSize:11, marginLeft:16}}>
            • Wheat flour 550, 40 sacks<br/>
            • Rye flour 1150, 20 sacks
          </div>
        </div>
      </div>
    );
  }

  return <div className="prov-doc-empty">Preview not available</div>;
};

/* Intelligence panel ─────────────────────────────────────────────────── */
/* Pre-seeded chat history — a couple of mock Q&A turns so a fresh demo
   looks lived-in instead of empty. (Ingestion lives in the Activity tab.) */
const generateMockIngestHistory = () => [
  {
    role: "user",
    text: "Show me overdue invoices.",
  },
  {
    role: "ai",
    kind: "list",
    text: "2 invoices are overdue:",
    items: [
      { left: "2026-0138 · Café Murnau", right: "€450.68 · 24 days", tone: "bad" },
      { left: "2026-0140 · Sonnenberg",   right: "€212.29 · 19 days", tone: "wait" },
    ],
    link: { table: "invoices", label: "Open in Invoices" },
  },
];

const IntelPanel = ({ data, tables, onPickTable, onJumpToActivity }) => {
  const [chat, setChat] = useState(generateMockIngestHistory);
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const intel = data.INTELLIGENCE;

  // Keep the latest message in view as the conversation grows.
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.length]);

  const ask = (q) => {
    const lower = q.toLowerCase();
    let answer;
    if (lower.includes("overdue") || lower.includes("open") || lower.includes("unpaid")) {
      answer = {
        kind: "list",
        text: "2 invoices are overdue or open:",
        items: [
          { left: "2026-0138 · Café Murnau", right: "€450.68 · 24 days", tone: "bad" },
          { left: "2026-0140 · Sonnenberg Restaurant", right: "€212.29 · 19 days", tone: "wait" },
        ],
        link: { table: "invoices", label: "Open in Invoices" },
      };
    } else if (lower.includes("revenue") || lower.includes("category") || lower.includes("sales")) {
      answer = {
        kind: "bars",
        text: "Revenue by category, last 30 days:",
        bars: [
          { label: "Bread",    value: 4820, pct: 0.62 },
          { label: "Rolls",    value: 2940, pct: 0.38 },
          { label: "Pastry",   value: 3120, pct: 0.40 },
          { label: "Seasonal", value: 1602, pct: 0.21 },
        ],
      };
    } else if (lower.includes("datev") || lower.includes("export")) {
      answer = { kind: "export", text: "DATEV export for March 2026 is ready (142 bookings)." };
    } else if (lower.includes("500") || lower.includes("over")) {
      answer = {
        kind: "list",
        text: "3 invoices over €500:",
        items: [
          { left: "2026-0141 · Hotel Kronprinz", right: "€687.79", tone: "ok" },
          { left: "2026-0138 · Café Murnau",      right: "€450.68", tone: "wait" },
          { left: "2026-0142 · Lindenhof Café",   right: "€304.42", tone: "ok" },
        ],
      };
    } else if (lower.includes("supplier") || lower.includes("expensive")) {
      answer = {
        kind: "text",
        text: "Millmann Mills: +6.4% vs Q1. Wagner Yeast stable. Schmidt Packaging: −2%.",
      };
    } else {
      answer = { kind: "text", text: "I couldn't find a direct answer. Please rephrase your question." };
    }
    setChat(prev => [...prev, { role: "user", text: q }, { role: "ai", ...answer }]);
    setInput("");
  };

  return (
    <div className="intel-panel">
      {/* Hint: ingestion lives in the Activity tab */}
      <button className="intel-activity-hint" onClick={() => onJumpToActivity && onJumpToActivity()}>
        <Icon name="upload" size={13}/>
        <span>Drop documents in the <strong>Activity</strong> tab</span>
        <Icon name="arrow" size={12}/>
      </button>

      <div className="intel-summaries">
        {data.INTELLIGENCE.summaries.map((s, i) => (
          <div key={i} className="intel-sum">
            <div className="intel-sum-label">{s.title}</div>
            <div className="intel-sum-row">
              <div className="intel-sum-value">{s.value}</div>
              <div className={`intel-sum-delta intel-${s.deltaDir}`}>
                <Icon name={s.deltaDir === "up" ? "trend-up" : "trend-dn"} size={11} stroke={1.7}/>
                <span>{s.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="intel-divider"><span>Ask</span></div>

      <div className="intel-chat" ref={chatRef}>
        {chat.length === 0 && (
          <div className="intel-empty">
            <Icon name="sparkle" size={16}/>
            <div>Ask your database in plain language.</div>
          </div>
        )}
        {chat.map((m, i) => (
          <div key={i} className={`intel-msg intel-${m.role}`}>
            {m.role === "user"
              ? <div className="intel-msg-user">{m.text}</div>
              : <div className="intel-msg-ai">
                  <div className="intel-msg-text">{m.text}</div>
                  {(m.kind === "list" || m.kind === "ingest") && m.items && (
                    <div className="intel-list">
                      {m.items.map((it, j) => (
                        <div key={j} className="intel-list-row">
                          <span>{it.left}</span>
                          <span className={`intel-tag intel-tag-${it.tone}`}>{it.right}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.kind === "bars" && (
                    <div className="intel-bars">
                      {m.bars.map((b, j) => (
                        <div key={j} className="intel-bar-row">
                          <div className="intel-bar-label">{b.label}</div>
                          <div className="intel-bar-track"><div className="intel-bar-fill" style={{width: `${b.pct*100}%`}}/></div>
                          <div className="intel-bar-val">{b.value.toLocaleString("de-DE")} €</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.kind === "export" && (
                    <button className="intel-export-cta">
                      <Icon name="download" size={12}/> Download DATEV export
                    </button>
                  )}
                  {m.link && (
                    <button className="intel-msg-link" onClick={() => onPickTable(m.link.table)}>
                      {m.link.label} <Icon name="arrow" size={11}/>
                    </button>
                  )}
                </div>
            }
          </div>
        ))}
      </div>

      <div className="intel-suggest">
        {intel.suggestions.slice(0, 4).map((q, i) => (
          <button key={i} className="intel-chip" onClick={() => ask(q)}>{q}</button>
        ))}
      </div>

      <form className="intel-input" onSubmit={(e) => { e.preventDefault(); if (input.trim()) ask(input.trim()); }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask your database…"
        />
        <button type="submit"><Icon name="arrow" size={14}/></button>
      </form>
    </div>
  );
};

/* Exports panel ─────────────────────────────────────────────────────── */
const ExportsPanel = ({ data }) => (
  <div className="exports-panel">
    <div className="exports-intro">
      Tax-relevant packages and documents. Prepared GoBD-compliant.
    </div>
    {data.INTELLIGENCE.exports.map((x) => (
      <div key={x.id} className="exports-row">
        <div className="exports-row-l">
          <div className="exports-name">{x.name}</div>
          <div className="exports-meta">
            <span>{x.period}</span>
            <span className="exports-meta-dot">·</span>
            <span>{x.lines.toLocaleString("en-US")} {x.lines === 1 ? "file" : "lines"}</span>
            <span className="exports-meta-dot">·</span>
            <span>{x.format}</span>
          </div>
        </div>
        <button className="exports-btn"><Icon name="download" size={12}/></button>
      </div>
    ))}
    <div className="exports-divider"/>
    <div className="exports-foot">
      <div className="exports-foot-h">Tax advisor view</div>
      <div className="exports-foot-t">Your tax advisor sees all HungryDB clients in one dashboard. Monthly packages are delivered automatically.</div>
      <button className="exports-foot-btn">Invite advisor <Icon name="arrow" size={12}/></button>
    </div>
  </div>
);

/* ────────────────────────────────────────────────────────────────────── */
/* App root                                                                */
/* ────────────────────────────────────────────────────────────────────── */
const App = () => {
  const initialPhase = (typeof location !== "undefined" && new URLSearchParams(location.search).get("phase")) || "idle";
  const [phase, setPhase] = useState(initialPhase);  // idle | extracting | ready
  const [tw, setTweak] = useTweaks({ sector: "Bakery" });

  return (
    <div className="app-root">
      {phase === "idle" && (
        <DropZone sector={tw.sector} onDrop={() => setPhase("extracting")}/>
      )}
      {phase === "extracting" && (
        <ExtractionView sector={tw.sector} onDone={() => setPhase("ready")}/>
      )}
      {phase === "ready" && (
        <DatabaseView sector={tw.sector} onReset={() => setPhase("idle")}/>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Sector (auto-detected)"/>
        <TweakRadio
          label="Ontology"
          value={tw.sector}
          onChange={(v) => setTweak("sector", v)}
          options={["Bakery", "Carpentry", "Auto repair"]}
        />
        <TweakSection label="Demo"/>
        <TweakButton label="Reset demo" onClick={() => setPhase("idle")}/>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
