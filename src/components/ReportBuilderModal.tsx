import { useState } from "react";
import {
  X, ArrowLeft, ArrowRight, Check,
  Table2, BarChart2, BarChartHorizontal, PieChart, LineChart,
  Hash, Plus, Trash2, CalendarDays, Search, ArrowUp, ArrowDown,
  Mail, Users, Lock, Globe, type LucideIcon,
} from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  BadgeStatus,
  ScrollArea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  BarChartInteractive,
  LineChartInteractive,
  PieChartInteractive,
  KPIChart,
  TableChart,
  Checkbox,
  Field,
  RadioGroup,
  RadioGroupItem,
} from "@marlindtako/pioneer-design-system";

// ── Types ────────────────────────────────────────────────────────────────────

type SourceType = "collection" | "saved-view" | "form" | "audit-log";
type ReportType = "table" | "bar" | "horizontal-bar" | "donut" | "line" | "kpi";
type AggType = "count" | "sum" | "avg" | "min" | "max";
type Visibility = "private" | "team" | "org";
type BadgeColor = "blue" | "teal" | "amber" | "green" | "red" | "purple";

interface FilterRow {
  id: string;
  field: string;
  operator: string;
  value: string;
  required: boolean;
}

interface ChartConfig {
  xAxisField?: string;
  aggregation?: AggType;
  aggregationField?: string;
  sortOrder?: string;
  showLegend?: boolean;
  maxGroups?: number;
  dateField?: string;
  granularity?: string;
  lineMetric?: AggType;
  lineMetricField?: string;
  multiSeries?: boolean;
  splitBy?: string;
  kpiLabel?: string;
  kpiMetric?: AggType;
  kpiField?: string;
}

interface ReportTypeSpec {
  id: ReportType;
  category: string;
  label: string;
  description: string;
  tags: { label: string; color: BadgeColor }[];
  icon: LucideIcon;
  Thumbnail: React.FC;
}

// ── Source data ───────────────────────────────────────────────────────────────

const SOURCE_ITEMS: Record<SourceType, string[]> = {
  "collection":  ["IT Equipment", "Fleet Vehicles", "Office Furniture", "Medical Devices", "Facilities"],
  "saved-view":  ["Overdue Assets", "Checked-Out Laptops", "Pending Inspections", "Active Fleet"],
  "form":        ["Inspection Form", "Maintenance Request", "Damage Report", "Transfer Form"],
  "audit-log":   ["All Activity", "Check-in / Check-out", "Field Changes", "User Activity"],
};

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  "collection": "Collection",
  "saved-view": "Saved view",
  "form":       "Form",
  "audit-log":  "Audit log",
};

// ── BadgeStatus color mapping ─────────────────────────────────────────────────

const BADGE_TYPE_MAP: Record<BadgeColor, "neutral" | "blue" | "green" | "orange" | "red" | "purple"> = {
  blue:   "blue",
  teal:   "blue",
  amber:  "orange",
  green:  "green",
  red:    "red",
  purple: "purple",
};

// ── Static SVG Thumbnails ─────────────────────────────────────────────────────

function TableThumb() {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="4" y="4" width="192" height="18" rx="3" fill="#e5e5e5"/>
      <rect x="10" y="9" width="30" height="8" rx="2" fill="#a3a3a3"/>
      <rect x="54" y="9" width="40" height="8" rx="2" fill="#a3a3a3"/>
      <rect x="108" y="9" width="34" height="8" rx="2" fill="#a3a3a3"/>
      <rect x="156" y="9" width="36" height="8" rx="2" fill="#a3a3a3"/>
      <rect x="4" y="26" width="192" height="18" rx="3" fill="#f5f5f5"/>
      <rect x="10" y="31" width="26" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="54" y="31" width="34" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="108" y="31" width="28" height="8" rx="2" fill="#ef4444" opacity="0.6"/>
      <rect x="156" y="31" width="30" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="4" y="48" width="192" height="18" rx="3" fill="#f5f5f5"/>
      <rect x="10" y="53" width="26" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="54" y="53" width="34" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="108" y="53" width="28" height="8" rx="2" fill="#00a991" opacity="0.6"/>
      <rect x="156" y="53" width="30" height="8" rx="2" fill="#d4d4d4"/>
    </svg>
  );
}
function BarThumb() {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="16" y="20" width="32" height="52" rx="3" fill="#00a991" opacity="0.75"/>
      <rect x="60" y="8" width="32" height="64" rx="3" fill="#00a991" opacity="0.85"/>
      <rect x="104" y="34" width="32" height="38" rx="3" fill="#00a991" opacity="0.65"/>
      <rect x="148" y="16" width="32" height="56" rx="3" fill="#00a991" opacity="0.80"/>
      <line x1="8" y1="74" x2="192" y2="74" stroke="#e5e5e5" strokeWidth="1.5"/>
    </svg>
  );
}
function HorizontalBarThumb() {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="4" y="6" width="24" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="4" y="22" width="24" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="4" y="38" width="24" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="4" y="54" width="24" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="4" y="70" width="24" height="8" rx="2" fill="#d4d4d4"/>
      <rect x="34" y="6" width="130" height="8" rx="2" fill="#00a991" opacity="0.80"/>
      <rect x="34" y="22" width="100" height="8" rx="2" fill="#00a991" opacity="0.70"/>
      <rect x="34" y="38" width="78" height="8" rx="2" fill="#00a991" opacity="0.60"/>
      <rect x="34" y="54" width="54" height="8" rx="2" fill="#00a991" opacity="0.55"/>
      <rect x="34" y="70" width="38" height="8" rx="2" fill="#00a991" opacity="0.50"/>
    </svg>
  );
}
function DonutThumb() {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="40" r="34" stroke="#e5e5e5" strokeWidth="14" fill="none"/>
      <circle cx="100" cy="40" r="34" stroke="#00a991" strokeWidth="14" fill="none" strokeDasharray="107 107" strokeDashoffset="0" strokeLinecap="round"/>
      <circle cx="100" cy="40" r="34" stroke="#55376d" strokeWidth="14" fill="none" strokeDasharray="64 150" strokeDashoffset="-107" strokeLinecap="round" opacity="0.7"/>
      <circle cx="100" cy="40" r="34" stroke="#f59e0b" strokeWidth="14" fill="none" strokeDasharray="40 174" strokeDashoffset="-171" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}
function LineThumb() {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <polyline points="8,62 48,50 88,38 120,30 152,20 192,12" stroke="#00a991" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="8,70 48,65 88,60 120,56 152,52 192,46" stroke="#55376d" strokeWidth="2" fill="none" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <line x1="8" y1="74" x2="192" y2="74" stroke="#e5e5e5" strokeWidth="1"/>
    </svg>
  );
}
function KPIThumb() {
  return (
    <div className="flex items-center justify-center gap-5 w-full h-full">
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-red-500 leading-none">6</span>
        <span className="text-[9px] text-muted-foreground mt-1 leading-none">Overdue</span>
      </div>
      <div className="w-px h-8 bg-border flex-shrink-0" />
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-primary leading-none">87%</span>
        <span className="text-[9px] text-muted-foreground mt-1 leading-none">On time</span>
      </div>
      <div className="w-px h-8 bg-border flex-shrink-0" />
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-foreground leading-none">142</span>
        <span className="text-[9px] text-muted-foreground mt-1 leading-none">Total</span>
      </div>
    </div>
  );
}

// ── Report types ──────────────────────────────────────────────────────────────

const REPORT_TYPES: ReportTypeSpec[] = [
  {
    id: "table",
    category: "DEFAULT — ALWAYS AVAILABLE",
    label: "Table",
    description: "The foundation. Every report starts as a table — it's what saved views already are and what every export produces.",
    tags: [
      { label: "Checkout lists",   color: "blue" },
      { label: "Audit records",    color: "green" },
      { label: "Asset registers",  color: "amber" },
      { label: "Overdue tracking", color: "blue" },
    ],
    icon: Table2,
    Thumbnail: TableThumb,
  },
  {
    id: "bar",
    category: "MOST REQUESTED",
    label: "Bar chart",
    description: "Comparing categories. Assets by status, by location, by department. The workhorse for any 'show me counts across X' question.",
    tags: [
      { label: "Assets by status",    color: "blue" },
      { label: "Count by location",   color: "blue" },
      { label: "Count by department", color: "teal" },
      { label: "Site comparison",     color: "red"  },
    ],
    icon: BarChart2,
    Thumbnail: BarThumb,
  },
  {
    id: "donut",
    category: "COMPOSITION SNAPSHOTS",
    label: "Donut",
    description: "What percentage of your fleet is available vs checked out vs damaged? Simple share of a whole — one snapshot.",
    tags: [
      { label: "Status breakdown",  color: "blue"  },
      { label: "Value by category", color: "amber" },
      { label: "Condition mix",     color: "green" },
    ],
    icon: PieChart,
    Thumbnail: DonutThumb,
  },
  {
    id: "line",
    category: "TRENDS OVER TIME",
    label: "Line chart",
    description: "Anything tracked over time. Checkout trends, depreciation curves, maintenance frequency, audit completion over months.",
    tags: [
      { label: "Depreciation curves", color: "amber" },
      { label: "Checkout trends",     color: "blue"  },
      { label: "Audit cadence",       color: "green" },
    ],
    icon: LineChart,
    Thumbnail: LineThumb,
  },
  {
    id: "kpi",
    category: "AT-A-GLANCE METRICS",
    label: "KPI / single score",
    description: "Summary numbers above every report. The first thing a stakeholder sees in a scheduled email — overdue count, audit %, total value.",
    tags: [
      { label: "Scheduled emails",   color: "red"   },
      { label: "Dashboard headers",  color: "blue"  },
      { label: "Value totals",       color: "amber" },
    ],
    icon: Hash,
    Thumbnail: KPIThumb,
  },
  {
    id: "horizontal-bar",
    category: "LONG CATEGORY LISTS",
    label: "Horizontal bar",
    description: "When you have many categories with long labels — 10+ locations, 15+ departments. Labels stay readable on the left axis.",
    tags: [
      { label: "Assets per location",  color: "blue"  },
      { label: "Overdue by assignee",  color: "blue"  },
      { label: "Audits by site",       color: "green" },
    ],
    icon: BarChartHorizontal,
    Thumbnail: HorizontalBarThumb,
  },
];

// ── StepIndicator ─────────────────────────────────────────────────────────────

const STEP_LABELS = ["Source & type", "Configure", "Filters", "Schedule & save"];

function StepIndicator({ current, onNavigate }: { current: number; onNavigate: (n: number) => void }) {
  return (
    <div className="flex items-center gap-4">
      {[1, 2, 3, 4].map((n) => {
        const done = n < current;
        const active = n === current;
        const reachable = n <= current;
        return (
          <div key={n} className="flex items-center gap-2">
            <button
              type="button"
              onClick={reachable ? () => onNavigate(n) : undefined}
              className={`flex items-center gap-2 ${reachable ? "cursor-pointer group" : "cursor-default"}`}
            >
              <div
                className={`flex items-center justify-center rounded-full text-xs font-bold transition-colors
                  ${done ? "bg-primary text-white group-hover:bg-primary/80" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                style={{ width: 22, height: 22 }}
              >
                {done ? <Check size={12} /> : n}
              </div>
              <span className={`text-xs font-medium transition-colors ${active ? "text-foreground" : done ? "text-muted-foreground group-hover:text-foreground" : "text-muted-foreground"}`}>
                {STEP_LABELS[n - 1]}
              </span>
            </button>
            {n < 4 && <div className="w-6 h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

// ── PreviewPane ───────────────────────────────────────────────────────────────

function PreviewPane({ reportType, reportName, sourceItem, config }: {
  reportType: ReportType | "";
  reportName: string;
  sourceItem: string;
  config: ChartConfig;
}) {
  const typeInfo = REPORT_TYPES.find((t) => t.id === reportType);
  const title = reportName || "Untitled report";
  const subtitle = sourceItem || undefined;

  function renderChart() {
    switch (reportType) {
      case "table":
        return <TableChart type="count" title={title} subtitle={subtitle} collection={sourceItem || undefined} />;
      case "bar":
        return <BarChartInteractive type="vertical" title={title} subtitle={subtitle} showLegend={config.showLegend} collection={sourceItem || undefined} />;
      case "horizontal-bar":
        return <BarChartInteractive type="horizontal" title={title} subtitle={subtitle} collection={sourceItem || undefined} />;
      case "donut":
        return <PieChartInteractive type="donut" title={title} subtitle={subtitle} showLegend={config.showLegend} collection={sourceItem || undefined} />;
      case "line":
        return <LineChartInteractive type={config.multiSeries ? "interactive" : "smooth"} title={title} subtitle={subtitle} showLegend={config.multiSeries} collection={sourceItem || undefined} />;
      case "kpi":
        return <KPIChart title={config.kpiLabel || title} subtitle={subtitle} value="142" trend="12%" type="up" showChart collection={sourceItem || undefined} />;
      default:
        return null;
    }
  }

  const chart = renderChart();

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-white overflow-hidden">
      {!chart && (
        <div className="flex-1 flex items-center justify-center bg-muted/20 p-8">
          <div className="flex flex-col items-center gap-3 text-center px-8">
            <div className="flex items-center justify-center rounded-xl bg-muted w-12 h-12">
              <Table2 size={22} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground leading-5">Preview will appear here</p>
            <p className="text-xs text-muted-foreground/70 leading-4">Select a report type to see a preview.</p>
          </div>
        </div>
      )}
      {chart && (
        <div className="flex-1 overflow-auto">
          {typeInfo && (
            <div className="flex items-center justify-end px-5 pt-3">
              <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {typeInfo.label}
              </span>
            </div>
          )}
          {chart}
        </div>
      )}
    </div>
  );
}

// ── Step 1: Source & Type ─────────────────────────────────────────────────────

function StepSourceAndType({
  reportName, setReportName,
  sourceType, setSourceType,
  sourceItem, setSourceItem,
  reportType, setReportType,
}: {
  reportName: string; setReportName: (v: string) => void;
  sourceType: SourceType | ""; setSourceType: (v: SourceType) => void;
  sourceItem: string; setSourceItem: (v: string) => void;
  reportType: ReportType | ""; setReportType: (v: ReportType) => void;
}) {
  return (
    <div className="flex h-full">
      {/* Left panel: name + source */}
      <div className="flex flex-col overflow-y-auto px-6 py-5 flex-shrink-0 border-r border-border gap-6" style={{ width: 440 }}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-foreground leading-5">Report name</p>
          <Input
            placeholder="e.g. Overdue assets by department"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-foreground leading-5">Data source</p>
            <p className="text-xs text-muted-foreground leading-4 mt-0.5">Select what your report is based on.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-foreground leading-5">Source type</p>
            <Select
              value={sourceType}
              onValueChange={(v) => { setSourceType(v as SourceType); setSourceItem(""); }}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select source type…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collection">Collection</SelectItem>
                <SelectItem value="saved-view">Saved view</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="audit-log">Audit log</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sourceType !== "" && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-foreground leading-5">
                {SOURCE_TYPE_LABELS[sourceType]}
              </p>
              <Select value={sourceItem} onValueChange={setSourceItem}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Search or select…" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCE_ITEMS[sourceType].map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {sourceType === "saved-view" && sourceItem && (
            <p className="text-xs text-muted-foreground leading-4">
              Filters from "{sourceItem}" will be pre-populated in Step 3.
            </p>
          )}
        </div>
      </div>

      {/* Right panel: report type cards */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-foreground leading-5">Report type</p>
            <p className="text-xs text-muted-foreground leading-4 mt-0.5">Choose how to visualize your data.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {REPORT_TYPES.map(({ id, label, description, icon: Icon, tags }) => {
              const selected = reportType === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setReportType(id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer
                    ${selected ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-white hover:border-muted-foreground/40 hover:shadow-sm"}`}
                >
                  <div className={`flex items-center justify-center rounded-lg w-9 h-9 flex-shrink-0
                    ${selected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-foreground leading-5">{label}</p>
                      {selected && <Check size={14} className="text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-4">{description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tags.map((tag) => (
                        <BadgeStatus key={tag.label} type={BADGE_TYPE_MAP[tag.color]}>
                          {tag.label}
                        </BadgeStatus>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Configure ─────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "date" | "dropdown" | "person" | "location" | "currency" | "boolean" | "barcode";
interface FieldDef { id: string; name: string; type: FieldType; }
interface FieldGroup { name: string; fields: FieldDef[]; }

const FIELD_GROUPS: FieldGroup[] = [
  { name: "Core", fields: [
    { id: "name",        name: "Name",          type: "text" },
    { id: "asset_tag",   name: "Asset tag",     type: "barcode" },
    { id: "serial",      name: "Serial number", type: "text" },
    { id: "description", name: "Description",   type: "text" },
    { id: "status",      name: "Status",        type: "dropdown" },
    { id: "condition",   name: "Condition",     type: "dropdown" },
    { id: "category",    name: "Category",      type: "dropdown" },
    { id: "model",       name: "Model number",  type: "text" },
    { id: "manufacturer",name: "Manufacturer",  type: "text" },
  ]},
  { name: "Assignment", fields: [
    { id: "assigned_to",      name: "Assigned to",     type: "person" },
    { id: "department",       name: "Department",       type: "dropdown" },
    { id: "location",         name: "Location",         type: "location" },
    { id: "building",         name: "Building",         type: "text" },
    { id: "room",             name: "Room / floor",     type: "text" },
    { id: "checked_out_date", name: "Checked out date", type: "date" },
    { id: "due_date",         name: "Due date",         type: "date" },
    { id: "checked_out_by",   name: "Checked out by",   type: "person" },
  ]},
  { name: "Purchase & financials", fields: [
    { id: "purchase_date",       name: "Purchase date",       type: "date" },
    { id: "purchase_price",      name: "Purchase price",      type: "currency" },
    { id: "vendor",              name: "Vendor",              type: "text" },
    { id: "po_number",           name: "PO number",           type: "text" },
    { id: "book_value",          name: "Book value",          type: "currency" },
    { id: "depreciation_method", name: "Depreciation method", type: "dropdown" },
    { id: "salvage_value",       name: "Salvage value",       type: "currency" },
    { id: "useful_life",         name: "Useful life (years)", type: "number" },
    { id: "invoice_number",      name: "Invoice number",      type: "text" },
  ]},
  { name: "Warranty & service", fields: [
    { id: "warranty_exp",      name: "Warranty expiration", type: "date" },
    { id: "warranty_provider", name: "Warranty provider",   type: "text" },
    { id: "service_contract",  name: "Service contract",    type: "dropdown" },
    { id: "last_service_date", name: "Last service date",   type: "date" },
    { id: "next_service_date", name: "Next service date",   type: "date" },
    { id: "support_contact",   name: "Support contact",     type: "person" },
    { id: "warranty_notes",    name: "Warranty notes",      type: "text" },
  ]},
  { name: "Audit & compliance", fields: [
    { id: "last_audit_date",   name: "Last audit date",    type: "date" },
    { id: "last_audited_by",   name: "Last audited by",    type: "person" },
    { id: "audit_notes",       name: "Audit notes",        type: "text" },
    { id: "compliance_status", name: "Compliance status",  type: "dropdown" },
    { id: "insurance_policy",  name: "Insurance policy",   type: "text" },
    { id: "disposal_date",     name: "Disposal date",      type: "date" },
    { id: "disposal_reason",   name: "Disposal reason",    type: "dropdown" },
  ]},
  { name: "Technical specs", fields: [
    { id: "os",           name: "Operating system",   type: "dropdown" },
    { id: "os_version",   name: "OS version",         type: "text" },
    { id: "ram",          name: "RAM (GB)",            type: "number" },
    { id: "storage",      name: "Storage (GB)",        type: "number" },
    { id: "screen_size",  name: "Screen size",         type: "text" },
    { id: "cpu",          name: "Processor",           type: "text" },
    { id: "mdm_enrolled", name: "MDM enrolled",        type: "boolean" },
    { id: "encrypted",    name: "Encryption enabled",  type: "boolean" },
    { id: "last_login",   name: "Last login user",     type: "person" },
    { id: "ip_address",   name: "IP address",          type: "text" },
    { id: "mac_address",  name: "MAC address",         type: "text" },
  ]},
];

const ALL_FIELDS = FIELD_GROUPS.flatMap((g) => g.fields);
const CATEGORICAL_FIELDS = ALL_FIELDS.filter((f) => ["dropdown", "location", "person"].includes(f.type)).map((f) => f.name);
const DATE_FIELDS         = ALL_FIELDS.filter((f) => f.type === "date").map((f) => f.name);
const NUMERIC_FIELDS      = ALL_FIELDS.filter((f) => ["number", "currency"].includes(f.type)).map((f) => f.name);
const AVAILABLE_FIELDS    = ALL_FIELDS.map((f) => f.name);

const SMART_COLUMNS = [
  { id: "days-overdue",     label: "Days overdue",          requiredField: "Due date" },
  { id: "days-checked-out", label: "Days since checkout",   requiredField: "Checked out date" },
  { id: "days-last-audit",  label: "Days since last audit", requiredField: "Last audit date" },
  { id: "asset-age",        label: "Asset age",             requiredField: "Purchase date" },
  { id: "remaining-warranty",label: "Remaining warranty",   requiredField: "Warranty expiration" },
];

const DEFAULT_COLUMNS = ["name", "status", "location", "assigned_to"];

function StepConfigure({
  reportType,
  selectedColumns, setSelectedColumns,
  config, setConfig,
}: {
  reportType: ReportType | "";
  selectedColumns: string[];
  setSelectedColumns: (v: string[]) => void;
  config: ChartConfig;
  setConfig: (v: ChartConfig) => void;
}) {
  const [search, setSearch] = useState("");
  const [smartCols, setSmartCols] = useState<string[]>([]);

  const isTable = reportType === "table" || reportType === "";
  const isBar   = reportType === "bar" || reportType === "horizontal-bar";
  const isDonut = reportType === "donut";
  const isLine  = reportType === "line";
  const isKPI   = reportType === "kpi";

  const filteredGroups = FIELD_GROUPS.map((g) => ({
    ...g,
    fields: g.fields.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
  })).filter((g) => g.fields.length > 0);

  function toggleColumn(id: string) {
    setSelectedColumns(
      selectedColumns.includes(id)
        ? selectedColumns.filter((c) => c !== id)
        : [...selectedColumns, id],
    );
  }

  function toggleSmart(id: string) {
    setSmartCols(smartCols.includes(id) ? smartCols.filter((c) => c !== id) : [...smartCols, id]);
  }

  return (
    <div className="flex h-full gap-0">
      {/* Column picker (table only) */}
      {isTable && (
        <div className="flex flex-col border-r border-border" style={{ width: 280 }}>
          <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <p className="text-sm font-bold text-foreground mb-2">Columns</p>
            <Input
              placeholder="Search fields…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leadingIcon={<Search size={14} />}
              showLeadingIcon
            />
          </div>
          <ScrollArea className="flex-1">
            <div className="px-4 pb-4 flex flex-col gap-4">
              {filteredGroups.map((group) => (
                <div key={group.name}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{group.name}</p>
                  <div className="flex flex-col gap-1">
                    {group.fields.map((f) => (
                      <label key={f.id} className="flex items-center gap-2.5 cursor-pointer py-0.5 hover:text-foreground">
                        <Checkbox
                          checked={selectedColumns.includes(f.id)}
                          onCheckedChange={() => toggleColumn(f.id)}
                        />
                        <span className="text-xs text-foreground leading-4">{f.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {SMART_COLUMNS.length > 0 && search === "" && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Smart columns</p>
                  <div className="flex flex-col gap-1">
                    {SMART_COLUMNS.map((sc) => (
                      <label key={sc.id} className="flex items-center gap-2.5 cursor-pointer py-0.5">
                        <Checkbox
                          checked={smartCols.includes(sc.id)}
                          onCheckedChange={() => toggleSmart(sc.id)}
                        />
                        <span className="text-xs text-foreground leading-4">{sc.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chart config */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

        {/* Bar / Horizontal bar config */}
        {isBar && (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Group by (X axis)</p>
              <Select value={config.xAxisField ?? ""} onValueChange={(v) => setConfig({ ...config, xAxisField: v })}>
                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select field…" /></SelectTrigger>
                <SelectContent>
                  {CATEGORICAL_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Aggregation (Y axis)</p>
              <Select value={config.aggregation ?? "count"} onValueChange={(v) => setConfig({ ...config, aggregation: v as AggType })}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count of assets</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                  <SelectItem value="min">Min</SelectItem>
                  <SelectItem value="max">Max</SelectItem>
                </SelectContent>
              </Select>
              {config.aggregation && config.aggregation !== "count" && (
                <Select value={config.aggregationField ?? ""} onValueChange={(v) => setConfig({ ...config, aggregationField: v })}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select numeric field…" /></SelectTrigger>
                  <SelectContent>
                    {NUMERIC_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Sort order</p>
              <Select value={config.sortOrder ?? "value-desc"} onValueChange={(v) => setConfig({ ...config, sortOrder: v })}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="value-desc">Value — high to low</SelectItem>
                  <SelectItem value="value-asc">Value — low to high</SelectItem>
                  <SelectItem value="label-asc">Label — A to Z</SelectItem>
                  <SelectItem value="label-desc">Label — Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Show legend</p>
                <p className="text-xs text-muted-foreground">Display a color legend below the chart</p>
              </div>
              <Switch checked={config.showLegend ?? false} onCheckedChange={(v) => setConfig({ ...config, showLegend: v })} />
            </div>
          </>
        )}

        {/* Donut config */}
        {isDonut && (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Segment by</p>
              <Select value={config.xAxisField ?? ""} onValueChange={(v) => setConfig({ ...config, xAxisField: v })}>
                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select field…" /></SelectTrigger>
                <SelectContent>
                  {CATEGORICAL_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Show legend</p>
                <p className="text-xs text-muted-foreground">Display a color legend below the chart</p>
              </div>
              <Switch checked={config.showLegend ?? true} onCheckedChange={(v) => setConfig({ ...config, showLegend: v })} />
            </div>
          </>
        )}

        {/* Line chart config */}
        {isLine && (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Date field</p>
              <Select value={config.dateField ?? ""} onValueChange={(v) => setConfig({ ...config, dateField: v })}>
                <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select date field…" /></SelectTrigger>
                <SelectContent>
                  {DATE_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Granularity</p>
              <Select value={config.granularity ?? "month"} onValueChange={(v) => setConfig({ ...config, granularity: v })}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Metric</p>
              <Select value={config.lineMetric ?? "count"} onValueChange={(v) => setConfig({ ...config, lineMetric: v as AggType })}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count of assets</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                </SelectContent>
              </Select>
              {config.lineMetric && config.lineMetric !== "count" && (
                <Select value={config.lineMetricField ?? ""} onValueChange={(v) => setConfig({ ...config, lineMetricField: v })}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select numeric field…" /></SelectTrigger>
                  <SelectContent>
                    {NUMERIC_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Multi-series</p>
                <p className="text-xs text-muted-foreground">Add a second breakdown dimension</p>
              </div>
              <Switch checked={config.multiSeries ?? false} onCheckedChange={(v) => setConfig({ ...config, multiSeries: v })} />
            </div>
            {config.multiSeries && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold">Split by</p>
                <Select value={config.splitBy ?? ""} onValueChange={(v) => setConfig({ ...config, splitBy: v })}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select field…" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORICAL_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {/* KPI config */}
        {isKPI && (
          <>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">KPI label</p>
              <Input
                placeholder="e.g. Total active assets"
                value={config.kpiLabel ?? ""}
                onChange={(e) => setConfig({ ...config, kpiLabel: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold">Metric</p>
              <Select value={config.kpiMetric ?? "count"} onValueChange={(v) => setConfig({ ...config, kpiMetric: v as AggType })}>
                <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count of assets</SelectItem>
                  <SelectItem value="sum">Sum</SelectItem>
                  <SelectItem value="avg">Average</SelectItem>
                  <SelectItem value="min">Min</SelectItem>
                  <SelectItem value="max">Max</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.kpiMetric && config.kpiMetric !== "count" && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold">Field</p>
                <Select value={config.kpiField ?? ""} onValueChange={(v) => setConfig({ ...config, kpiField: v })}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Select numeric field…" /></SelectTrigger>
                  <SelectContent>
                    {NUMERIC_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {/* Table column order */}
        {isTable && selectedColumns.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold">Column order</p>
            <div className="flex flex-col gap-1 border border-border rounded-lg overflow-hidden">
              {selectedColumns.map((colId, i) => {
                const field = ALL_FIELDS.find((f) => f.id === colId);
                return (
                  <div key={colId} className="flex items-center gap-2 px-3 py-2 bg-white border-b border-border last:border-0">
                    <div className="flex flex-col gap-0.5 mr-1">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => {
                          const cols = [...selectedColumns];
                          [cols[i - 1], cols[i]] = [cols[i], cols[i - 1]];
                          setSelectedColumns(cols);
                        }}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        disabled={i === selectedColumns.length - 1}
                        onClick={() => {
                          const cols = [...selectedColumns];
                          [cols[i + 1], cols[i]] = [cols[i], cols[i + 1]];
                          setSelectedColumns(cols);
                        }}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <span className="text-xs text-foreground flex-1">{field?.name ?? colId}</span>
                    <button
                      type="button"
                      onClick={() => toggleColumn(colId)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isBar && !isDonut && !isLine && !isKPI && !isTable && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Select a report type in Step 1 to configure it.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Step 3: Filters ───────────────────────────────────────────────────────────

const OPERATOR_OPTIONS: Record<string, string[]> = {
  text:     ["is", "is not", "contains", "does not contain", "is empty", "is not empty"],
  number:   ["=", "≠", ">", "≥", "<", "≤", "is empty", "is not empty"],
  date:     ["is", "is before", "is after", "is between", "is empty", "is not empty"],
  dropdown: ["is", "is not", "is any of", "is none of"],
  person:   ["is", "is not", "is me"],
  boolean:  ["is true", "is false"],
  default:  ["is", "is not", "contains"],
};

function getOperators(fieldId: string) {
  const field = ALL_FIELDS.find((f) => f.id === fieldId || f.name === fieldId);
  if (!field) return OPERATOR_OPTIONS.default;
  return OPERATOR_OPTIONS[field.type] ?? OPERATOR_OPTIONS.default;
}

function StepFilters({
  filters, setFilters,
}: {
  filters: FilterRow[];
  setFilters: (v: FilterRow[]) => void;
}) {
  function addFilter() {
    setFilters([...filters, { id: crypto.randomUUID(), field: "", operator: "", value: "", required: false }]);
  }

  function updateFilter(id: string, patch: Partial<FilterRow>) {
    setFilters(filters.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }

  function removeFilter(id: string) {
    setFilters(filters.filter((f) => f.id !== id));
  }

  return (
    <div className="flex flex-col h-full px-6 py-5 gap-4">
      <div>
        <p className="text-sm font-bold text-foreground">Filters</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Narrow the data included in this report. Filters marked "required" are locked for end users.
        </p>
      </div>

      {filters.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
          <div className="flex items-center justify-center rounded-xl bg-muted w-12 h-12">
            <Search size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No filters yet</p>
          <p className="text-xs text-muted-foreground/70">Click "Add filter" to narrow down your report data.</p>
        </div>
      )}

      {filters.length > 0 && (
        <div className="flex flex-col gap-2">
          {filters.map((filter) => {
            const operators = getOperators(filter.field);
            const needsValue = !["is empty", "is not empty", "is true", "is false", "is me"].includes(filter.operator);
            return (
              <div key={filter.id} className="flex items-center gap-2 p-3 rounded-lg border border-border bg-white">
                <Select value={filter.field} onValueChange={(v) => updateFilter(filter.id, { field: v, operator: "", value: "" })}>
                  <SelectTrigger className="w-40 bg-muted/30 text-xs"><SelectValue placeholder="Field…" /></SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={filter.operator} onValueChange={(v) => updateFilter(filter.id, { operator: v, value: "" })}>
                  <SelectTrigger className="w-40 bg-muted/30 text-xs"><SelectValue placeholder="Operator…" /></SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => <SelectItem key={op} value={op}>{op}</SelectItem>)}
                  </SelectContent>
                </Select>

                {needsValue && (
                  <Input
                    className="flex-1 text-xs bg-muted/30"
                    placeholder="Value…"
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  />
                )}

                <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                  <span className="text-xs text-muted-foreground">Required</span>
                  <Switch
                    checked={filter.required}
                    onCheckedChange={(v) => updateFilter(filter.id, { required: v })}
                  />
                </div>

                <button type="button" onClick={() => removeFilter(filter.id)} className="text-muted-foreground hover:text-destructive ml-1">
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addFilter} className="self-start gap-1.5">
        <Plus size={14} /> Add filter
      </Button>
    </div>
  );
}

// ── Step 4: Schedule & Save ───────────────────────────────────────────────────

const VISIBILITY_OPTIONS: { id: Visibility; label: string; description: string; icon: LucideIcon }[] = [
  { id: "private", label: "Private",      description: "Only you can see this report",              icon: Lock  },
  { id: "team",    label: "Team",         description: "Visible to members of your team",           icon: Users },
  { id: "org",     label: "Organization", description: "Visible to everyone in your organization",  icon: Globe },
];

function StepScheduleAndSave({
  reportName,
  visibility, setVisibility,
  scheduleEnabled, setScheduleEnabled,
  scheduleFrequency, setScheduleFrequency,
  scheduleDay, setScheduleDay,
  scheduleTime, setScheduleTime,
  recipients, setRecipients,
  recipientInput, setRecipientInput,
}: {
  reportName: string;
  visibility: Visibility; setVisibility: (v: Visibility) => void;
  scheduleEnabled: boolean; setScheduleEnabled: (v: boolean) => void;
  scheduleFrequency: string; setScheduleFrequency: (v: string) => void;
  scheduleDay: string; setScheduleDay: (v: string) => void;
  scheduleTime: string; setScheduleTime: (v: string) => void;
  recipients: string[]; setRecipients: (v: string[]) => void;
  recipientInput: string; setRecipientInput: (v: string) => void;
}) {
  function addRecipient(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && recipientInput.trim()) {
      e.preventDefault();
      if (!recipients.includes(recipientInput.trim())) {
        setRecipients([...recipients, recipientInput.trim()]);
      }
      setRecipientInput("");
    }
  }

  return (
    <div className="flex h-full">
      {/* Left: save options */}
      <div className="flex flex-col overflow-y-auto px-6 py-5 flex-shrink-0 border-r border-border gap-6" style={{ width: 420 }}>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-foreground">Report name</p>
            <p className="text-xs text-muted-foreground mt-0.5">{reportName || "Untitled report"}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-bold text-foreground mb-3">Visibility</p>
            <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as Visibility)} className="flex flex-col gap-2">
              {VISIBILITY_OPTIONS.map(({ id, label, description, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${visibility === id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"}`}
                >
                  <RadioGroupItem value={id} />
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
                    ${visibility === id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Right: schedule */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Scheduled delivery</p>
            <p className="text-xs text-muted-foreground mt-0.5">Automatically email this report on a recurring schedule.</p>
          </div>
          <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
        </div>

        {scheduleEnabled && (
          <>
            <Separator />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold">Frequency</p>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {scheduleFrequency === "weekly" && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold">Day of week</p>
                  <Select value={scheduleDay} onValueChange={setScheduleDay}>
                    <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d) => (
                        <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {scheduleFrequency === "monthly" && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold">Day of month</p>
                  <Select value={scheduleDay} onValueChange={setScheduleDay}>
                    <SelectTrigger className="w-full bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                      <SelectItem value="last">Last day of month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold">Time</p>
                <Select value={scheduleTime} onValueChange={setScheduleTime}>
                  <SelectTrigger className="w-full bg-white">
                    <CalendarDays size={14} className="text-muted-foreground mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["6:00 AM","7:00 AM","8:00 AM","9:00 AM","12:00 PM","3:00 PM","5:00 PM","6:00 PM","9:00 PM"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold">Recipients</p>
                <p className="text-xs text-muted-foreground">Press Enter or comma to add an email.</p>
                <div className="min-h-[80px] rounded-lg border border-border bg-white p-2 flex flex-wrap gap-1.5">
                  {recipients.map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                      <Mail size={10} className="text-muted-foreground" />
                      {r}
                      <button type="button" onClick={() => setRecipients(recipients.filter((x) => x !== r))} className="text-muted-foreground hover:text-foreground">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[140px] outline-none text-xs placeholder:text-muted-foreground bg-transparent"
                    placeholder="Add email address…"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={addRecipient}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

interface ReportBuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportBuilderModal({ open, onOpenChange }: ReportBuilderModalProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [reportName, setReportName]   = useState("");
  const [sourceType, setSourceType]   = useState<SourceType | "">("");
  const [sourceItem, setSourceItem]   = useState("");
  const [reportType, setReportType]   = useState<ReportType | "">("");

  // Step 2
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_COLUMNS);
  const [chartConfig, setChartConfig]         = useState<ChartConfig>({});

  // Step 3
  const [filters, setFilters] = useState<FilterRow[]>([]);

  // Step 4
  const [visibility, setVisibility]               = useState<Visibility>("private");
  const [scheduleEnabled, setScheduleEnabled]     = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly");
  const [scheduleDay, setScheduleDay]             = useState("monday");
  const [scheduleTime, setScheduleTime]           = useState("8:00 AM");
  const [recipients, setRecipients]               = useState<string[]>([]);
  const [recipientInput, setRecipientInput]       = useState("");

  function canProceed() {
    if (step === 1) return reportName.trim() !== "" && sourceType !== "" && sourceItem !== "" && reportType !== "";
    return true;
  }

  function handleSave() {
    onOpenChange(false);
  }

  const showPreview = step === 1 || step === 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden flex flex-col"
        style={{ maxWidth: showPreview ? 1100 : 860, width: "95vw", height: "88vh", maxHeight: 720 }}
      >
        <DialogHeader bordered className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold">Report builder</DialogTitle>
            <StepIndicator current={step} onNavigate={(n) => n <= step && setStep(n)} />
          </div>
        </DialogHeader>

        <DialogBody className="flex-1 overflow-hidden p-0">
          <div className="flex h-full">
            {/* Main content */}
            <div className="flex-1 overflow-hidden">
              {step === 1 && (
                <StepSourceAndType
                  reportName={reportName} setReportName={setReportName}
                  sourceType={sourceType} setSourceType={setSourceType}
                  sourceItem={sourceItem} setSourceItem={setSourceItem}
                  reportType={reportType} setReportType={setReportType}
                />
              )}
              {step === 2 && (
                <StepConfigure
                  reportType={reportType}
                  selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns}
                  config={chartConfig} setConfig={setChartConfig}
                />
              )}
              {step === 3 && (
                <StepFilters filters={filters} setFilters={setFilters} />
              )}
              {step === 4 && (
                <StepScheduleAndSave
                  reportName={reportName}
                  visibility={visibility} setVisibility={setVisibility}
                  scheduleEnabled={scheduleEnabled} setScheduleEnabled={setScheduleEnabled}
                  scheduleFrequency={scheduleFrequency} setScheduleFrequency={setScheduleFrequency}
                  scheduleDay={scheduleDay} setScheduleDay={setScheduleDay}
                  scheduleTime={scheduleTime} setScheduleTime={setScheduleTime}
                  recipients={recipients} setRecipients={setRecipients}
                  recipientInput={recipientInput} setRecipientInput={setRecipientInput}
                />
              )}
            </div>

            {/* Live preview pane (steps 1 & 2 only) */}
            {showPreview && (
              <div className="w-80 flex-shrink-0 border-l border-border p-4 overflow-hidden flex flex-col gap-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex-shrink-0">Preview</p>
                <div className="flex-1 overflow-hidden">
                  <PreviewPane
                    reportType={reportType}
                    reportName={reportName}
                    sourceItem={sourceItem}
                    config={chartConfig}
                  />
                </div>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter bordered className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (step > 1 ? setStep(step - 1) : onOpenChange(false))}
              className="gap-1.5"
            >
              {step > 1 ? <><ArrowLeft size={14} /> Back</> : "Cancel"}
            </Button>

            {step < 4 ? (
              <Button
                size="sm"
                disabled={!canProceed()}
                onClick={() => setStep(step + 1)}
                className="gap-1.5"
              >
                Next <ArrowRight size={14} />
              </Button>
            ) : (
              <Button size="sm" onClick={handleSave} className="gap-1.5">
                <Check size={14} /> Save report
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
