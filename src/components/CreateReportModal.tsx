import { useState } from "react";
import { X, Check, Trash2, Blocks, FilePenLine, PackageSearch, Bookmark, BarChart2, BarChartHorizontal, LineChart, PieChart, Table2 } from "lucide-react";
import {
  Button,
  BadgeStatus,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  Switch,
  Label,
  Separator,
} from "@marlindtako/pioneer-design-system";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@marlindtako/pioneer-design-system";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

type DataSource = "collection" | "form" | "audit" | "saved-view";

type ReportType =
  | "table"
  | "bar"
  | "horizontal-bar"
  | "line"
  | "donut"
  | "kpi";

interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface ReportConfig {
  reportName: string;
  account: string;
  module: string;
  collection: string;
  form: string;
  audit: string;
  savedView: string;
  dataSource: DataSource | "";
  reportType: ReportType | "";
  xField: string;
  xSplitBy: string;
  yType: string;
  yCountType: string;
  granularity: string;
  limitResults: string;
  sortOrder: string;
  showLegend: boolean;
  groupOther: boolean;
  showDataLabels: boolean;
  showDataTable: boolean;
  filters: FilterRow[];
}

// ── Validation ─────────────────────────────────────────────────────────────────

type ValidationErrors = Record<string, string>;

function validateStep1(config: ReportConfig): ValidationErrors {
  const e: ValidationErrors = {};
  if (!config.account)    e.account    = "Required";
  if (!config.module)     e.module     = "Required";
  if (!config.reportName) e.reportName = "Required";
  if (!config.dataSource) e.dataSource = "Select a data source";
  else {
    if (config.dataSource === "collection" && !config.collection) e.collection = "Required";
    if (config.dataSource === "form"       && !config.form)       e.form       = "Required";
    if (config.dataSource === "audit"      && !config.audit)      e.audit      = "Required";
    if (config.dataSource === "saved-view" && !config.savedView)  e.savedView  = "Required";
  }
  if (!config.reportType) e.reportType = "Select a report type";
  return e;
}

function validateStep2(config: ReportConfig): ValidationErrors {
  const e: ValidationErrors = {};
  const t = config.reportType;
  if (t === "bar" || t === "horizontal-bar" || t === "line" || t === "donut") {
    if (!config.xField) e.xField = "Required";
    if (!config.yType)  e.yType  = "Required";
  }
  if (t === "kpi") {
    if (!config.yType) e.yType = "Required";
    if (config.yType && config.yType !== "count" && !config.xField) e.xField = "Required";
  }
  return e;
}

// ── Inline error helper ────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

// ── Data source options ───────────────────────────────────────────────────────

const DATA_SOURCES: { id: DataSource; title: string; description: string; icon: React.ElementType }[] = [
  { id: "collection", title: "Collection", description: "Report on any asset collection", icon: Blocks },
  { id: "form",       title: "Form",       description: "Report on form submissions",     icon: FilePenLine },
  { id: "audit",      title: "Audit",      description: "Report on audit activity",       icon: PackageSearch },
  { id: "saved-view", title: "Saved view", description: "Start from an existing saved view", icon: Bookmark },
];

// ── Report type options ───────────────────────────────────────────────────────

type TagColor = "blue" | "green" | "orange" | "red" | "neutral" | "purple";

const REPORT_TYPES: {
  id: ReportType;
  icon: React.ElementType;
  title: string;
  description: string;
  tags: { label: string; type: TagColor }[];
}[] = [
  {
    id: "table",
    icon: Table2,
    title: "Table",
    description:
      "The foundation. Every report starts as a table — it's what saved views already are and what every export produces.",
    tags: [
      { label: "Asset register",   type: "neutral" },
      { label: "Maintenance log",  type: "blue"    },
      { label: "Checkout history", type: "green"   },
      { label: "Audit trail",      type: "orange"  },
    ],
  },
  {
    id: "bar",
    icon: BarChart2,
    title: "Bar chart",
    description:
      "Comparing categories. Assets by status, by location, by department — the workhorse of any \"how many per X\" question.",
    tags: [
      { label: "Assets by status",   type: "blue"    },
      { label: "Assets by location", type: "green"   },
      { label: "By department",      type: "orange"  },
      { label: "Condition overview", type: "neutral" },
    ],
  },
  {
    id: "horizontal-bar",
    icon: BarChartHorizontal,
    title: "Horizontal bar",
    description:
      "When you have many categories with long labels — 10+ locations, 15+ departments. Labels stay readable on the left axis.",
    tags: [
      { label: "Top locations",     type: "blue"   },
      { label: "Dept. utilisation", type: "green"  },
      { label: "Vendor ranking",    type: "orange" },
      { label: "Category breakdown", type: "purple" },
    ],
  },
  {
    id: "line",
    icon: LineChart,
    title: "Line chart",
    description:
      "Anything tracked over time — checkout trends, depreciation curves, maintenance frequency, audit completion over months.",
    tags: [
      { label: "Checkout trends",      type: "blue"    },
      { label: "Depreciation curve",   type: "orange"  },
      { label: "Audit completion",     type: "green"   },
      { label: "Maintenance frequency", type: "neutral" },
    ],
  },
  {
    id: "donut",
    icon: PieChart,
    title: "Donut",
    description:
      "What share of your fleet is available vs checked out vs damaged? Part-to-whole at a glance — one snapshot in time.",
    tags: [
      { label: "Status split",   type: "blue"   },
      { label: "Condition mix",  type: "green"  },
      { label: "Location share", type: "orange" },
      { label: "Dept. share",    type: "purple" },
    ],
  },
  {
    id: "kpi",
    icon: LineChart,
    title: "KPI / Single score",
    description:
      "A headline number at a glance — the first thing a stakeholder sees in a scheduled email or dashboard widget.",
    tags: [
      { label: "Total asset count", type: "neutral" },
      { label: "Overdue returns",   type: "red"     },
      { label: "Audit pass rate",   type: "green"   },
      { label: "Total asset value", type: "orange"  },
    ],
  },
];

// ── Preview helpers ───────────────────────────────────────────────────────────

const FIELD_SAMPLE_VALUES: Record<string, string[]> = {
  status:           ["Available", "Checked Out", "Damaged", "Maintenance"],
  location:         ["Warehouse A", "Site B", "HQ", "Remote Office"],
  department:       ["IT", "Operations", "Finance", "HR"],
  category:         ["Electronics", "Furniture", "Vehicles", "Tools"],
  condition:        ["Excellent", "Good", "Fair", "Poor"],
  assigned_to:      ["Alice K.", "Bob M.", "Carol P.", "David L."],
  created_at:       ["Jan", "Feb", "Mar", "Apr"],
  checkout_date:    ["Jan", "Feb", "Mar", "Apr"],
  audit_date:       ["Jan", "Feb", "Mar", "Apr"],
  maintenance_date: ["Jan", "Feb", "Mar", "Apr"],
};

const FIELD_LABEL: Record<string, string> = {
  status: "Status", location: "Location", department: "Department",
  category: "Asset Category", condition: "Condition", assigned_to: "Assigned To",
  name: "Name", created_at: "Created Date", updated_at: "Last Updated",
  checkout_date: "Checkout Date", return_date: "Return Date",
  audit_date: "Audit Date", maintenance_date: "Maintenance Date",
};

const METRIC_LABEL: Record<string, string> = {
  count: "Count", count_unique: "Unique Count",
  sum: "Sum", average: "Average", min: "Min", max: "Max",
};

const GRANULARITY_LABELS: Record<string, string[]> = {
  day:     ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  week:    ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
  month:   ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  quarter: ["Q1 24", "Q2 24", "Q3 24", "Q4 24", "Q1 25"],
  year:    ["2021", "2022", "2023", "2024", "2025"],
};

const SAMPLE_BAR_VALUES   = [142, 89, 213, 67, 178, 134];
const SAMPLE_LINE_VALUES  = [45, 62, 58, 78, 71, 88, 82, 95, 87, 103, 96, 112];
const DONUT_COLORS        = ["#00A991", "#55376D", "#006CA9", "#DE8D14"];
const DONUT_RAW           = [142, 89, 213, 67];

function getFieldLabel(f: string) { return FIELD_LABEL[f] || f; }
function getFieldValues(f: string) { return FIELD_SAMPLE_VALUES[f] || ["Group A", "Group B", "Group C", "Group D"]; }

// ── Preview shell ─────────────────────────────────────────────────────────────

function PreviewShell({ config, children }: { config: ReportConfig; children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <p className="text-sm font-semibold text-foreground">{config.reportName || "Report preview"}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Sample data · {config.dataSource || "data source"}
        </p>
      </div>
      <div className="flex-1 overflow-auto p-4 min-h-0">{children}</div>
      <div className="px-4 py-2 border-t border-border bg-muted/30 flex-shrink-0">
        <p className="text-[10px] text-muted-foreground">Preview based on sample data</p>
      </div>
    </div>
  );
}

// ── Table preview ─────────────────────────────────────────────────────────────

const TABLE_COLUMNS: Record<string, { key: string; label: string }[]> = {
  collection: [
    { key: "name", label: "Asset name" }, { key: "status", label: "Status" },
    { key: "location", label: "Location" }, { key: "dept", label: "Dept." },
    { key: "created", label: "Created" },
  ],
  form: [
    { key: "form", label: "Form" }, { key: "by", label: "Submitted by" },
    { key: "date", label: "Date" }, { key: "status", label: "Status" },
    { key: "module", label: "Module" },
  ],
  audit: [
    { key: "asset", label: "Asset" }, { key: "auditor", label: "Auditor" },
    { key: "date", label: "Audit date" }, { key: "result", label: "Result" },
    { key: "score", label: "Score" },
  ],
  "saved-view": [
    { key: "name", label: "Asset name" }, { key: "status", label: "Status" },
    { key: "location", label: "Location" }, { key: "seen", label: "Last seen" },
    { key: "assigned", label: "Assigned to" },
  ],
};

const TABLE_ROWS: Record<string, string[][]> = {
  collection: [
    ['Laptop Pro 15"', "Available",   "Warehouse A", "IT",         "12/01/2025"],
    ["Forklift #04",   "Checked Out", "Site B",      "Operations", "10/03/2024"],
    ["Office Chair X", "Available",   "HQ",          "Facilities", "05/06/2024"],
    ["Server Rack 3",  "Maintenance", "Data Centre", "IT",         "01/09/2023"],
    ["Van — Fleet 12", "Damaged",     "Depot",       "Operations", "22/11/2023"],
  ],
  form: [
    ["Asset Intake", "Alice K.",  "23/04/2025", "Submitted", "Assets"],
    ["Inspection",   "Bob M.",    "22/04/2025", "Pending",   "Maintenance"],
    ["Checkout",     "Carol P.",  "21/04/2025", "Approved",  "Assets"],
    ["Inspection",   "David L.",  "20/04/2025", "Submitted", "Assets"],
    ["Asset Intake", "Eve R.",    "19/04/2025", "Rejected",  "Assets"],
  ],
  audit: [
    ['Laptop Pro 15"', "Alice K.", "23/04/2025", "Pass", "98%"],
    ["Forklift #04",   "Bob M.",   "22/04/2025", "Fail", "42%"],
    ["Server Rack 3",  "Carol P.", "21/04/2025", "Pass", "91%"],
    ["Office Chair X", "David L.", "20/04/2025", "Pass", "87%"],
    ["Van — Fleet 12", "Eve R.",   "19/04/2025", "Fail", "55%"],
  ],
  "saved-view": [
    ['Laptop Pro 15"', "Available",   "Warehouse A", "2 hrs ago",  "Alice K."],
    ["Forklift #04",   "Checked Out", "Site B",      "1 day ago",  "Bob M."],
    ["Server Rack 3",  "Maintenance", "Data Centre", "3 days ago", "Carol P."],
    ["Office Chair X", "Available",   "HQ",          "5 min ago",  "—"],
    ["Van — Fleet 12", "Damaged",     "Depot",       "1 week ago", "David L."],
  ],
};

const STATUS_COLORS: Record<string, string> = {
  Available:    "text-[#00a991] bg-[#00a991]/10",
  "Checked Out":"text-[#006CA9] bg-[#006CA9]/10",
  Damaged:      "text-[#A90018] bg-[#A90018]/10",
  Maintenance:  "text-[#DE8D14] bg-[#DE8D14]/10",
  Pass:         "text-[#00a991] bg-[#00a991]/10",
  Fail:         "text-[#A90018] bg-[#A90018]/10",
  Submitted:    "text-[#006CA9] bg-[#006CA9]/10",
  Pending:      "text-[#DE8D14] bg-[#DE8D14]/10",
  Approved:     "text-[#00a991] bg-[#00a991]/10",
  Rejected:     "text-[#A90018] bg-[#A90018]/10",
};

function TablePreview({ config }: { config: ReportConfig }) {
  const src = (config.dataSource || "collection") as keyof typeof TABLE_COLUMNS;
  const columns = TABLE_COLUMNS[src] ?? TABLE_COLUMNS.collection;
  const rows    = TABLE_ROWS[src]    ?? TABLE_ROWS.collection;

  const sorted = config.xField
    ? [...rows].sort((a, b) => {
        const i = columns.findIndex((c) => c.key === config.xField);
        if (i < 0) return 0;
        return config.sortOrder === "desc"
          ? b[i].localeCompare(a[i])
          : a[i].localeCompare(b[i]);
      })
    : rows;

  return (
    <PreviewShell config={config}>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className={cn("text-left px-2 py-1.5 font-medium whitespace-nowrap", config.xField === col.key ? "text-foreground" : "text-muted-foreground")}>
                  {col.label}{config.xField === col.key ? (config.sortOrder === "desc" ? " ↓" : " ↑") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i} className="border-b border-border/40">
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1.5 whitespace-nowrap">
                    {STATUS_COLORS[cell]
                      ? <span className={cn("px-1.5 py-0.5 rounded-full text-[10px] font-medium", STATUS_COLORS[cell])}>{cell}</span>
                      : <span className="text-foreground">{cell}</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {config.showDataTable && (
            <tfoot>
              <tr className="border-t border-border bg-muted/30">
                <td className="px-2 py-1.5 font-medium text-[11px]" colSpan={columns.length}>
                  Total: {sorted.length} records
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </PreviewShell>
  );
}

// ── Bar / Horizontal bar preview ──────────────────────────────────────────────

function BarPreview({ config, horizontal }: { config: ReportConfig; horizontal?: boolean }) {
  const field   = config.xField || "status";
  const labels  = getFieldValues(field).slice(0, 6);
  const values  = labels.map((_, i) => SAMPLE_BAR_VALUES[i % SAMPLE_BAR_VALUES.length]);
  const sorted  = config.sortOrder === "asc"
    ? [...labels.map((l, i) => ({ l, v: values[i] }))].sort((a, b) => a.v - b.v)
    : [...labels.map((l, i) => ({ l, v: values[i] }))].sort((a, b) => b.v - a.v);
  const max     = Math.max(...sorted.map((s) => s.v));
  const metric  = METRIC_LABEL[config.yType] ?? "Count";

  if (horizontal) {
    return (
      <PreviewShell config={config}>
        <div className="flex flex-col gap-2">
          {sorted.map(({ l, v }) => (
            <div key={l} className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground w-20 text-right truncate flex-shrink-0">{l}</span>
              <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
                <div className="h-full bg-[#00A991] rounded-sm transition-all" style={{ width: `${(v / max) * 100}%` }} />
              </div>
              {config.showDataLabels && <span className="text-[10px] text-muted-foreground w-8 flex-shrink-0">{v}</span>}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">{metric} by {getFieldLabel(field)}</p>
      </PreviewShell>
    );
  }

  return (
    <PreviewShell config={config}>
      <div className="flex flex-col h-48">
        <div className="flex items-end gap-1 flex-1 relative pb-5">
          {[max, Math.round(max * 0.5), 0].map((v, i) => (
            <div key={i} className="absolute left-0 right-0 flex items-center gap-1" style={{ bottom: `calc(${(v / max) * 100}% + 20px - ${(v / max) * 20}px)` }}>
              <span className="text-[9px] text-muted-foreground w-6 text-right flex-shrink-0">{v}</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>
          ))}
          <div className="flex items-end gap-1 flex-1 pl-8 h-full">
            {sorted.map(({ l, v }) => (
              <div key={l} className="flex-1 flex flex-col items-center gap-1">
                {config.showDataLabels && <span className="text-[9px] text-muted-foreground">{v}</span>}
                <div className="w-full rounded-t-sm bg-[#00A991]" style={{ height: `${(v / max) * 110}px` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-1 pl-8">
          {sorted.map(({ l }) => (
            <div key={l} className="flex-1 flex justify-center">
              <span className="text-[9px] text-muted-foreground text-center leading-tight">{l.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">{metric} by {getFieldLabel(field)}</p>
    </PreviewShell>
  );
}

// ── Line chart preview ────────────────────────────────────────────────────────

function LinePreview({ config }: { config: ReportConfig }) {
  const gran   = config.granularity || "month";
  const labels = GRANULARITY_LABELS[gran] ?? GRANULARITY_LABELS.month;
  const values = SAMPLE_LINE_VALUES.slice(0, labels.length);
  const minV   = Math.min(...values);
  const maxV   = Math.max(...values);
  const metric = METRIC_LABEL[config.yType] ?? "Count";
  const dateField = getFieldLabel(config.xField || "created_at");

  const W = 280, H = 110, pL = 28, pR = 8, pT = 8, pB = 20;
  const cW = W - pL - pR, cH = H - pT - pB;
  const pts = values.map((v, i) => ({
    x: pL + (i / Math.max(values.length - 1, 1)) * cW,
    y: pT + ((maxV - v) / (maxV - minV || 1)) * cH,
  }));

  const linePath = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cx   = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`;
  }, "");

  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${pT + cH} L ${pts[0].x} ${pT + cH} Z`;

  const labelIndices = [0, Math.floor(labels.length / 2), labels.length - 1];

  return (
    <PreviewShell config={config}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {[0, 0.5, 1].map((pct) => (
          <g key={pct}>
            <line x1={pL} x2={W - pR} y1={pT + pct * cH} y2={pT + pct * cH} stroke="#e5e5e5" strokeWidth="1" />
            <text x={pL - 3} y={pT + pct * cH + 3} textAnchor="end" fontSize="8" fill="#a3a3a3">
              {Math.round(maxV - pct * (maxV - minV))}
            </text>
          </g>
        ))}
        {config.showDataTable && <path d={areaPath} fill="#00A991" fillOpacity="0.1" />}
        <path d={linePath} fill="none" stroke="#00A991" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {config.showDataLabels && pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#00A991" />
        ))}
        {labelIndices.map((idx) => (
          <text key={idx} x={pts[idx]?.x ?? 0} y={H} textAnchor="middle" fontSize="8" fill="#a3a3a3">
            {labels[idx]}
          </text>
        ))}
      </svg>
      <p className="text-[10px] text-muted-foreground mt-1">{metric} over {dateField.toLowerCase()}</p>
    </PreviewShell>
  );
}

// ── Donut preview ─────────────────────────────────────────────────────────────

function DonutPreview({ config }: { config: ReportConfig }) {
  const field   = config.xField || "status";
  const labels  = getFieldValues(field).slice(0, 4);
  const total   = DONUT_RAW.reduce((a, b) => a + b, 0);
  const measure = METRIC_LABEL[config.yType] ?? "Count";

  const cx = 70, cy = 70, r = 52, ir = 28;
  let angle = -Math.PI / 2;
  const segments = labels.map((label, i) => {
    const pct      = DONUT_RAW[i] / total;
    const sweep    = pct * 2 * Math.PI * 0.999; // avoid full-circle edge case
    const end      = angle + sweep;
    const x1 = cx + r * Math.cos(angle),  y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(end),    y2 = cy + r * Math.sin(end);
    const ix1= cx + ir * Math.cos(angle), iy1= cy + ir * Math.sin(angle);
    const ix2= cx + ir * Math.cos(end),   iy2= cy + ir * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z`;
    angle = end;
    return { d, color: DONUT_COLORS[i], label, pct };
  });

  return (
    <PreviewShell config={config}>
      <div className="flex items-center gap-4">
        <svg width="140" height="140" viewBox="0 0 140 140" className="flex-shrink-0">
          {segments.map((seg, i) => <path key={i} d={seg.d} fill={seg.color} />)}
          <text x="70" y="67" textAnchor="middle" fontSize="9" fill="#737373">Total</text>
          <text x="70" y="80" textAnchor="middle" fontSize="13" fontWeight="600" fill="#0a0a0a">{total}</text>
        </svg>
        <div className="flex flex-col gap-1.5">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-[11px] text-foreground">{seg.label}</span>
              {config.showDataLabels && (
                <span className="text-[10px] text-muted-foreground">({Math.round(seg.pct * 100)}%)</span>
              )}
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground mt-1">{measure} by {getFieldLabel(field)}</p>
        </div>
      </div>
    </PreviewShell>
  );
}

// ── KPI preview ───────────────────────────────────────────────────────────────

const COMP_LABELS: Record<string, string> = {
  prev_week: "vs last week", prev_month: "vs last month",
  prev_quarter: "vs last quarter", prev_year: "vs last year",
};

function KpiPreview({ config }: { config: ReportConfig }) {
  const metric    = METRIC_LABEL[config.yType] ?? "—";
  const field     = config.xField ? getFieldLabel(config.xField) : "";
  const hasComp   = config.xSplitBy && config.xSplitBy !== "none";
  const compLabel = COMP_LABELS[config.xSplitBy] ?? "";

  return (
    <PreviewShell config={config}>
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs text-muted-foreground mb-1">
            {config.yType ? `${metric}${field ? ` of ${field}` : ""}` : "Select a calculation to preview"}
          </p>
          <p className="text-5xl font-bold text-foreground leading-none">2,847</p>
          {hasComp && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-sm font-semibold text-[#00A991]">↑ 12.4%</span>
              <span className="text-xs text-muted-foreground">{compLabel}</span>
            </div>
          )}
          {config.limitResults && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Target: {config.limitResults}</span>
              <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-[#00A991] rounded-full w-[72%]" />
              </div>
              <span className="text-[10px] text-muted-foreground">72%</span>
            </div>
          )}
        </div>
        {config.showLegend && hasComp && (
          <svg width="100%" height="36" viewBox="0 0 240 36">
            <polyline
              points="0,30 40,24 80,27 120,14 160,18 200,9 240,12"
              fill="none" stroke="#00A991" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </PreviewShell>
  );
}

// ── Route to the right preview ────────────────────────────────────────────────

function ReportPreview({ config }: { config: ReportConfig }) {
  switch (config.reportType) {
    case "table":          return <TablePreview config={config} />;
    case "bar":            return <BarPreview   config={config} />;
    case "horizontal-bar": return <BarPreview   config={config} horizontal />;
    case "line":           return <LinePreview  config={config} />;
    case "donut":          return <DonutPreview config={config} />;
    case "kpi":            return <KpiPreview   config={config} />;
    default:               return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8 bg-white rounded-lg border border-border">
        <p className="text-sm font-medium text-foreground">Select a report type</p>
        <p className="text-xs text-muted-foreground mt-1">Go back to step 1 and choose how to visualize your data.</p>
      </div>
    );
  }
}

// ── Step indicator ────────────────────────────────────────────────────────────

function StepTabs({
  step,
  onStepChange,
  config,
  maxReachedStep,
}: {
  step: Step;
  onStepChange: (s: Step) => void;
  config: ReportConfig;
  maxReachedStep: Step;
}) {
  const tabs: { label: string; step: Step }[] = [
    { label: "Source & type", step: 1 },
    { label: "Configure", step: 2 },
    { label: "Filters", step: 3 },
  ];

  const isEnabled = (t: Step) => maxReachedStep >= t;

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
      {tabs.map((t) => {
        const done = t.step < step;
        const active = t.step === step;
        const enabled = isEnabled(t.step);
        return (
          <button
            key={t.step}
            onClick={() => enabled && onStepChange(t.step)}
            disabled={!enabled}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              active && "bg-white shadow-sm text-foreground",
              !active && enabled && "text-muted-foreground hover:text-foreground",
              !active && !enabled && "text-muted-foreground/40 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                (active || done) ? "bg-[#00A991] text-white" : "bg-muted-foreground/20 text-muted-foreground"
              )}
            >
              {done ? <Check size={10} /> : t.step}
            </div>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Step 1: Source & Type ─────────────────────────────────────────────────────

function Step1({
  config,
  onChange,
  onStepChange,
  maxReachedStep,
  errors,
}: {
  config: ReportConfig;
  onChange: (patch: Partial<ReportConfig>) => void;
  onStepChange: (s: Step) => void;
  maxReachedStep: Step;
  errors: ValidationErrors;
}) {
  return (
    <div className="flex flex-1 min-h-0">
      {/* Left panel */}
      <div className="w-[440px] flex-shrink-0 border-r border-border overflow-y-auto">
        <div className="p-6 flex flex-col gap-6">
          <StepTabs step={1} onStepChange={onStepChange} config={config} maxReachedStep={maxReachedStep} />

          {/* Fields */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <Label className="w-[130px] text-sm font-medium flex-shrink-0 pt-2.5">Account <span className="text-destructive">*</span></Label>
              <div className="flex-1">
                <Select value={config.account} onValueChange={(v) => onChange({ account: v })}>
                  <SelectTrigger className={cn("w-full", errors.account && "border-destructive")}>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corp</SelectItem>
                    <SelectItem value="pioneer">Pioneer</SelectItem>
                    <SelectItem value="demo">Demo Account</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.account} />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Label className="w-[130px] text-sm font-medium flex-shrink-0 pt-2.5">Module <span className="text-destructive">*</span></Label>
              <div className="flex-1">
                <Select value={config.module} onValueChange={(v) => onChange({ module: v })}>
                  <SelectTrigger className={cn("w-full", errors.module && "border-destructive")}>
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assets">Assets</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.module} />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Label className="w-[130px] text-sm font-medium flex-shrink-0 pt-2.5">Report name <span className="text-destructive">*</span></Label>
              <div className="flex-1">
                <Input
                  placeholder="Enter report name"
                  className={cn("w-full", errors.reportName && "border-destructive")}
                  value={config.reportName}
                  onChange={(e) => onChange({ reportName: e.target.value })}
                />
                <FieldError message={errors.reportName} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Data source */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Data source <span className="text-destructive">*</span></p>
              <p className="text-xs text-muted-foreground mt-0.5">Where should this report pull data from.</p>
            </div>
            <div className="flex flex-col gap-2">
              {DATA_SOURCES.map((src) => {
                const SrcIcon = src.icon;
                const selected = config.dataSource === src.id;
                return (
                  <button
                    key={src.id}
                    onClick={() => onChange({ dataSource: src.id })}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                      selected
                        ? "border-[#00A991] bg-[#00A991]/5"
                        : "border-border hover:border-muted-foreground/40 hover:bg-muted/50"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", selected ? "bg-[#00A991]/10" : "bg-muted")}>
                      <SrcIcon size={16} className={selected ? "text-[#00A991]" : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{src.title}</p>
                      <p className="text-xs text-muted-foreground">{src.description}</p>
                    </div>
                    {selected && <Check size={16} className="text-[#00A991] flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.dataSource} />
          </div>

          {config.dataSource === "collection" && (
            <div className="flex items-start gap-4">
              <Label className="w-[130px] text-sm font-medium flex-shrink-0 pt-2.5">Collection <span className="text-destructive">*</span></Label>
              <div className="flex-1">
                <Select value={config.collection} onValueChange={(v) => onChange({ collection: v })}>
                  <SelectTrigger className={cn("w-full", errors.collection && "border-destructive")}>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assets">Assets</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.collection} />
              </div>
            </div>
          )}
          {config.dataSource === "form" && (
            <div className="flex items-start gap-4">
              <Label className="w-[130px] text-sm font-medium flex-shrink-0 pt-2.5">Form <span className="text-destructive">*</span></Label>
              <div className="flex-1">
                <Select value={config.form} onValueChange={(v) => onChange({ form: v })}>
                  <SelectTrigger className={cn("w-full", errors.form && "border-destructive")}>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intake">Asset intake form</SelectItem>
                    <SelectItem value="inspection">Inspection form</SelectItem>
                    <SelectItem value="checkout">Checkout form</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.form} />
              </div>
            </div>
          )}
          {config.dataSource === "audit" && (
            <div className="flex items-start gap-4">
              <Label className="w-[130px] text-sm font-medium flex-shrink-0 pt-2.5">Audit <span className="text-destructive">*</span></Label>
              <div className="flex-1">
                <Select value={config.audit} onValueChange={(v) => onChange({ audit: v })}>
                  <SelectTrigger className={cn("w-full", errors.audit && "border-destructive")}>
                    <SelectValue placeholder="Select audit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1">Q1 2025 Audit</SelectItem>
                    <SelectItem value="q2">Q2 2025 Audit</SelectItem>
                    <SelectItem value="annual">Annual audit</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.audit} />
              </div>
            </div>
          )}
          {config.dataSource === "saved-view" && (
            <div className="flex items-start gap-4">
              <Label className="w-[130px] text-sm font-medium flex-shrink-0 pt-2.5">Saved view <span className="text-destructive">*</span></Label>
              <div className="flex-1">
                <Select value={config.savedView} onValueChange={(v) => onChange({ savedView: v })}>
                  <SelectTrigger className={cn("w-full", errors.savedView && "border-destructive")}>
                    <SelectValue placeholder="Select saved view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overdue">Overdue assets</SelectItem>
                    <SelectItem value="available">Available assets</SelectItem>
                    <SelectItem value="maintenance">Maintenance queue</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.savedView} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <p className="text-sm font-semibold text-foreground">Report type <span className="text-destructive">*</span></p>
          <p className="text-xs text-muted-foreground mt-0.5">Choose how to visualize your data.</p>
          {errors.reportType && <p className="text-xs text-destructive mt-1">{errors.reportType}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {REPORT_TYPES.map((rt) => {
            const Icon = rt.icon;
            const selected = config.reportType === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => onChange({ reportType: rt.id })}
                className={cn(
                  "flex flex-col p-4 rounded-lg border text-left transition-colors",
                  selected
                    ? "border-[#00A991] bg-[#00A991]/5"
                    : "border-border hover:border-muted-foreground/40 hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center mb-3",
                    selected ? "bg-[#00A991]/10" : "bg-muted"
                  )}
                >
                  <Icon size={20} className={selected ? "text-[#00A991]" : "text-muted-foreground"} />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{rt.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rt.description}</p>
                <div className="flex flex-wrap gap-1">
                  {rt.tags.map((tag) => (
                    <BadgeStatus key={tag.label} type={tag.type}>{tag.label}</BadgeStatus>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Configure (per report type) ───────────────────────────────────────

type ConfigProps = {
  config: ReportConfig;
  onChange: (patch: Partial<ReportConfig>) => void;
  errors: ValidationErrors;
};

function TableConfigure({ config, onChange }: ConfigProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Sorting</p>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Sort by</Label>
          <Select value={config.xField} onValueChange={(v) => onChange({ xField: v })}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Default order" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="created_at">Created date</SelectItem>
              <SelectItem value="updated_at">Last updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Sort order</Label>
          <Select value={config.sortOrder} onValueChange={(v) => onChange({ sortOrder: v })}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Ascending" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending (A → Z)</SelectItem>
              <SelectItem value="desc">Descending (Z → A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Display</p>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Row limit</Label>
          <Input className="flex-1" placeholder="No limit" value={config.limitResults} onChange={(e) => onChange({ limitResults: e.target.value })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show totals row</Label>
          <Switch checked={config.showDataTable} onCheckedChange={(v) => onChange({ showDataTable: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Enable row grouping</Label>
          <Switch checked={config.groupOther} onCheckedChange={(v) => onChange({ groupOther: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Freeze header row</Label>
          <Switch checked={config.showLegend} onCheckedChange={(v) => onChange({ showLegend: v })} />
        </div>
      </div>
    </div>
  );
}

function BarConfigure({ config, onChange, errors }: ConfigProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">X-axis</p>
        <div className="flex items-start gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Group by <span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Select value={config.xField} onValueChange={(v) => onChange({ xField: v })}>
              <SelectTrigger className={cn("w-full", errors.xField && "border-destructive")}><SelectValue placeholder="Select field" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="category">Asset category</SelectItem>
                <SelectItem value="condition">Condition</SelectItem>
                <SelectItem value="assigned_to">Assigned to</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.xField} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Split by</Label>
          <Select value={config.xSplitBy} onValueChange={(v) => onChange({ xSplitBy: v })}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="condition">Condition</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Y-axis</p>
        <div className="flex items-start gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Metric <span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Select value={config.yType} onValueChange={(v) => onChange({ yType: v })}>
              <SelectTrigger className={cn("w-full", errors.yType && "border-destructive")}><SelectValue placeholder="Select metric" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="count">Count of records</SelectItem>
                <SelectItem value="count_unique">Count unique values</SelectItem>
                <SelectItem value="sum">Sum of field</SelectItem>
                <SelectItem value="average">Average of field</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.yType} />
          </div>
        </div>
        {(config.yType === "sum" || config.yType === "average") && (
          <div className="flex items-center gap-4">
            <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Field</Label>
            <Select value={config.yCountType} onValueChange={(v) => onChange({ yCountType: v })}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Select field" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase_value">Purchase value</SelectItem>
                <SelectItem value="current_value">Current value</SelectItem>
                <SelectItem value="depreciation">Depreciation amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Display</p>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Max bars</Label>
          <Input className="flex-1" placeholder="e.g. 10" value={config.limitResults} onChange={(e) => onChange({ limitResults: e.target.value })} />
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Sort order</Label>
          <Select value={config.sortOrder} onValueChange={(v) => onChange({ sortOrder: v })}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Descending" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending (highest first)</SelectItem>
              <SelectItem value="asc">Ascending (lowest first)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show legend</Label>
          <Switch checked={config.showLegend} onCheckedChange={(v) => onChange({ showLegend: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show data labels on bars</Label>
          <Switch checked={config.showDataLabels} onCheckedChange={(v) => onChange({ showDataLabels: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show data table below</Label>
          <Switch checked={config.showDataTable} onCheckedChange={(v) => onChange({ showDataTable: v })} />
        </div>
      </div>
    </div>
  );
}

function LineConfigure({ config, onChange, errors }: ConfigProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">X-axis (time)</p>
        <div className="flex items-start gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Date field <span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Select value={config.xField} onValueChange={(v) => onChange({ xField: v })}>
              <SelectTrigger className={cn("w-full", errors.xField && "border-destructive")}><SelectValue placeholder="Select date field" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Created date</SelectItem>
                <SelectItem value="updated_at">Last updated</SelectItem>
                <SelectItem value="checkout_date">Checkout date</SelectItem>
                <SelectItem value="return_date">Return date</SelectItem>
                <SelectItem value="audit_date">Audit date</SelectItem>
                <SelectItem value="maintenance_date">Maintenance date</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.xField} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Granularity</Label>
          <Select value={config.granularity} onValueChange={(v) => onChange({ granularity: v })}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Monthly" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Series (split by)</Label>
          <Select value={config.xSplitBy} onValueChange={(v) => onChange({ xSplitBy: v })}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="None" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (single line)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="department">Department</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Y-axis</p>
        <div className="flex items-start gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Metric <span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Select value={config.yType} onValueChange={(v) => onChange({ yType: v })}>
              <SelectTrigger className={cn("w-full", errors.yType && "border-destructive")}><SelectValue placeholder="Select metric" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="count">Count of records</SelectItem>
                <SelectItem value="sum">Sum of field</SelectItem>
                <SelectItem value="average">Average of field</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.yType} />
          </div>
        </div>
        {(config.yType === "sum" || config.yType === "average") && (
          <div className="flex items-center gap-4">
            <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Field</Label>
            <Select value={config.yCountType} onValueChange={(v) => onChange({ yCountType: v })}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Select field" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase_value">Purchase value</SelectItem>
                <SelectItem value="current_value">Current value</SelectItem>
                <SelectItem value="depreciation">Depreciation amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Display</p>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show data points</Label>
          <Switch checked={config.showDataLabels} onCheckedChange={(v) => onChange({ showDataLabels: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Fill area under line</Label>
          <Switch checked={config.showDataTable} onCheckedChange={(v) => onChange({ showDataTable: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show legend</Label>
          <Switch checked={config.showLegend} onCheckedChange={(v) => onChange({ showLegend: v })} />
        </div>
      </div>
    </div>
  );
}

function DonutConfigure({ config, onChange, errors }: ConfigProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Segments</p>
        <div className="flex items-start gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Segment by <span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Select value={config.xField} onValueChange={(v) => onChange({ xField: v })}>
              <SelectTrigger className={cn("w-full", errors.xField && "border-destructive")}><SelectValue placeholder="Select field" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="condition">Condition</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="category">Asset category</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.xField} />
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Measure <span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Select value={config.yType} onValueChange={(v) => onChange({ yType: v })}>
              <SelectTrigger className={cn("w-full", errors.yType && "border-destructive")}><SelectValue placeholder="Select measure" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="count">Count of records</SelectItem>
                <SelectItem value="sum">Sum of field</SelectItem>
                <SelectItem value="average">Average of field</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.yType} />
          </div>
        </div>
        {(config.yType === "sum" || config.yType === "average") && (
          <div className="flex items-center gap-4">
            <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Field</Label>
            <Select value={config.yCountType} onValueChange={(v) => onChange({ yCountType: v })}>
              <SelectTrigger className="flex-1"><SelectValue placeholder="Select field" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase_value">Purchase value</SelectItem>
                <SelectItem value="current_value">Current value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Max segments</Label>
          <Input className="flex-1" placeholder="e.g. 6" value={config.limitResults} onChange={(e) => onChange({ limitResults: e.target.value })} />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Display</p>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Group remainder as "Other"</Label>
          <Switch checked={config.groupOther} onCheckedChange={(v) => onChange({ groupOther: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show percentages</Label>
          <Switch checked={config.showDataLabels} onCheckedChange={(v) => onChange({ showDataLabels: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show legend</Label>
          <Switch checked={config.showLegend} onCheckedChange={(v) => onChange({ showLegend: v })} />
        </div>
      </div>
    </div>
  );
}

function KpiConfigure({ config, onChange, errors }: ConfigProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Metric</p>
        <div className="flex items-start gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Calculation <span className="text-destructive">*</span></Label>
          <div className="flex-1">
            <Select value={config.yType} onValueChange={(v) => onChange({ yType: v, xField: "" })}>
              <SelectTrigger className={cn("w-full", errors.yType && "border-destructive")}><SelectValue placeholder="Select calculation" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="count">Count of records</SelectItem>
                <SelectItem value="count_unique">Count unique values</SelectItem>
                <SelectItem value="sum">Sum of field</SelectItem>
                <SelectItem value="average">Average of field</SelectItem>
                <SelectItem value="min">Minimum of field</SelectItem>
                <SelectItem value="max">Maximum of field</SelectItem>
              </SelectContent>
            </Select>
            <FieldError message={errors.yType} />
          </div>
        </div>
        {config.yType && config.yType !== "count" && config.yType !== "count_unique" && (
          <div className="flex items-start gap-4">
            <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0 pt-2.5">Field <span className="text-destructive">*</span></Label>
            <div className="flex-1">
              <Select value={config.xField} onValueChange={(v) => onChange({ xField: v })}>
                <SelectTrigger className={cn("w-full", errors.xField && "border-destructive")}><SelectValue placeholder="Select field" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase_value">Purchase value</SelectItem>
                  <SelectItem value="current_value">Current value</SelectItem>
                  <SelectItem value="depreciation">Depreciation amount</SelectItem>
                  <SelectItem value="days_overdue">Days overdue</SelectItem>
                  <SelectItem value="maintenance_cost">Maintenance cost</SelectItem>
                </SelectContent>
              </Select>
              <FieldError message={errors.xField} />
            </div>
          </div>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-foreground">Comparison</p>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Compare to</Label>
          <Select value={config.xSplitBy} onValueChange={(v) => onChange({ xSplitBy: v })}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="No comparison" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No comparison</SelectItem>
              <SelectItem value="prev_week">Previous week</SelectItem>
              <SelectItem value="prev_month">Previous month</SelectItem>
              <SelectItem value="prev_quarter">Previous quarter</SelectItem>
              <SelectItem value="prev_year">Previous year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Label className="w-[130px] text-sm text-muted-foreground flex-shrink-0">Target value</Label>
          <Input className="flex-1" placeholder="Optional goal" value={config.limitResults} onChange={(e) => onChange({ limitResults: e.target.value })} />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Show trend indicator</Label>
          <Switch checked={config.showLegend} onCheckedChange={(v) => onChange({ showLegend: v })} />
        </div>
      </div>
    </div>
  );
}

function Step2({
  config,
  onChange,
  onStepChange,
  maxReachedStep,
  errors,
}: {
  config: ReportConfig;
  onChange: (patch: Partial<ReportConfig>) => void;
  onStepChange: (s: Step) => void;
  maxReachedStep: Step;
  errors: ValidationErrors;
}) {
  const configPanel = (() => {
    switch (config.reportType) {
      case "table":          return <TableConfigure config={config} onChange={onChange} errors={errors} />;
      case "bar":            return <BarConfigure   config={config} onChange={onChange} errors={errors} />;
      case "horizontal-bar": return <BarConfigure   config={config} onChange={onChange} errors={errors} />;
      case "line":           return <LineConfigure  config={config} onChange={onChange} errors={errors} />;
      case "donut":          return <DonutConfigure config={config} onChange={onChange} errors={errors} />;
      case "kpi":            return <KpiConfigure   config={config} onChange={onChange} errors={errors} />;
      default:               return null;
    }
  })();

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left panel */}
      <div className="w-[440px] flex-shrink-0 border-r border-border overflow-y-auto">
        <div className="p-6 flex flex-col gap-6">
          <StepTabs step={2} onStepChange={onStepChange} config={config} maxReachedStep={maxReachedStep} />
          {configPanel}
        </div>
      </div>

      {/* Right panel — chart preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <ReportPreview config={config} />
      </div>
    </div>
  );
}

// ── Filter field options (per data source) ────────────────────────────────────

const FILTER_FIELDS: Record<string, { value: string; label: string }[]> = {
  collection: [
    { value: "status",      label: "Status" },
    { value: "location",    label: "Location" },
    { value: "department",  label: "Department" },
    { value: "category",    label: "Asset category" },
    { value: "condition",   label: "Condition" },
    { value: "assigned_to", label: "Assigned to" },
    { value: "created_at",  label: "Created date" },
    { value: "updated_at",  label: "Last updated" },
  ],
  form: [
    { value: "form_name",    label: "Form name" },
    { value: "submitted_by", label: "Submitted by" },
    { value: "status",       label: "Status" },
    { value: "submitted_at", label: "Date submitted" },
    { value: "module",       label: "Module" },
  ],
  audit: [
    { value: "asset",       label: "Asset" },
    { value: "auditor",     label: "Auditor" },
    { value: "result",      label: "Result" },
    { value: "score",       label: "Score" },
    { value: "audit_date",  label: "Audit date" },
  ],
  "saved-view": [
    { value: "status",      label: "Status" },
    { value: "location",    label: "Location" },
    { value: "assigned_to", label: "Assigned to" },
    { value: "last_seen",   label: "Last seen" },
  ],
};

const FILTER_OPERATORS = [
  { value: "eq",           label: "equals" },
  { value: "neq",          label: "not equals" },
  { value: "contains",     label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "gt",           label: "greater than" },
  { value: "lt",           label: "less than" },
  { value: "is_empty",     label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
];

// ── Step 3: Filters ───────────────────────────────────────────────────────────

function Step3({
  config,
  onChange,
  onStepChange,
  maxReachedStep,
}: {
  config: ReportConfig;
  onChange: (patch: Partial<ReportConfig>) => void;
  onStepChange: (s: Step) => void;
  maxReachedStep: Step;
  errors: ValidationErrors;
}) {
  function addFilter() {
    onChange({
      filters: [
        ...config.filters,
        { id: crypto.randomUUID(), field: "", operator: "", value: "" },
      ],
    });
  }

  function updateFilter(id: string, patch: Partial<FilterRow>) {
    onChange({
      filters: config.filters.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    });
  }

  function removeFilter(id: string) {
    onChange({ filters: config.filters.filter((f) => f.id !== id) });
  }

  const fieldOptions =
    FILTER_FIELDS[config.dataSource as string] ?? FILTER_FIELDS.collection;

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left panel */}
      <div className="w-[440px] flex-shrink-0 border-r border-border overflow-y-auto">
        <div className="p-6 flex flex-col gap-4">
          <StepTabs step={3} onStepChange={onStepChange} config={config} maxReachedStep={maxReachedStep} />

          <div className="flex flex-col gap-2">
            {/* Column header row */}
            <div className="flex gap-2">
              {["Field name", "Operator", "Value"].map((h) => (
                <div key={h} className="flex-1 bg-muted rounded-[6px] px-2.5 py-2">
                  <p className="text-xs font-bold text-foreground">{h}</p>
                </div>
              ))}
              {/* spacer for X button column */}
              <div className="w-6 flex-shrink-0" />
            </div>

            {/* Filter rows */}
            {config.filters.map((filter) => (
              <div key={filter.id} className="flex gap-2 items-center group">
                <div className="flex-1">
                  <Select
                    value={filter.field}
                    onValueChange={(v) => updateFilter(filter.id, { field: v })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select
                    value={filter.operator}
                    onValueChange={(v) => updateFilter(filter.id, { operator: v })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {FILTER_OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Input value"
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  />
                </div>
                {config.filters.length > 1 && (
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="w-6 flex-shrink-0 flex items-center justify-center p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                {config.filters.length === 1 && <div className="w-6 flex-shrink-0" />}
              </div>
            ))}

            <Button variant="outline" size="sm" className="w-fit mt-1" onClick={addFilter}>
              Add more
            </Button>
          </div>
        </div>
      </div>

      {/* Right panel — chart preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <ReportPreview config={config} />
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface CreateReportModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: ReportConfig) => void;
}

function makeDefaultConfig(): ReportConfig {
  return {
  reportName: "",
  account: "",
  module: "",
  collection: "",
  form: "",
  audit: "",
  savedView: "",
  dataSource: "",
  reportType: "",
  xField: "",
  xSplitBy: "",
  yType: "",
  yCountType: "",
  granularity: "",
  limitResults: "",
  sortOrder: "",
  showLegend: true,
  groupOther: false,
  showDataLabels: false,
  showDataTable: false,
  filters: [{ id: crypto.randomUUID(), field: "", operator: "", value: "" }],
  };
}

export function CreateReportModal({ open, onClose, onSave }: CreateReportModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<Step>(1);
  const [config, setConfig] = useState<ReportConfig>(makeDefaultConfig());
  const [showErrors, setShowErrors] = useState(false);

  const currentErrors =
    step === 1 ? validateStep1(config) :
    step === 2 ? validateStep2(config) : {};
  const activeErrors = showErrors ? currentErrors : {};
  const hasErrors = Object.keys(currentErrors).length > 0;

  function handleChange(patch: Partial<ReportConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function handleClose() {
    setStep(1);
    setMaxReachedStep(1);
    setShowErrors(false);
    setConfig(makeDefaultConfig());
    onClose();
  }

  function handleNext() {
    if (hasErrors) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    const next = (step + 1) as Step;
    setStep(next);
    setMaxReachedStep((prev) => (next > prev ? next : prev));
  }

  function handleSave() {
    onSave(config);
    handleClose();
  }

  const stepTitle = step === 1 ? "Create report" : step === 2 ? "Configure" : "Filters";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-[calc(100vw-48px)] max-w-[1162px] h-[calc(100vh-80px)] max-h-[850px]">
        <DialogHeader bordered>
          <DialogTitle>{stepTitle}</DialogTitle>
        </DialogHeader>

        <DialogBody className="flex flex-1 min-h-0 overflow-hidden p-0">
          {step === 1 && <Step1 config={config} onChange={handleChange} onStepChange={setStep} maxReachedStep={maxReachedStep} errors={activeErrors} />}
          {step === 2 && <Step2 config={config} onChange={handleChange} onStepChange={setStep} maxReachedStep={maxReachedStep} errors={activeErrors} />}
          {step === 3 && <Step3 config={config} onChange={handleChange} onStepChange={setStep} maxReachedStep={maxReachedStep} errors={activeErrors} />}
        </DialogBody>

        <DialogFooter bordered className="flex items-center justify-between px-6">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={() => { setShowErrors(false); setStep((s) => (s - 1) as Step); }}>
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            {step < 3 ? (
              <Button onClick={handleNext} disabled={showErrors && hasErrors}>Next</Button>
            ) : (
              <Button onClick={handleSave}>Create</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
