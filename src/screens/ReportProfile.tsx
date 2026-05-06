import {
  ArrowLeft,
  ListFilter,
  ArrowDownUp,
  Share2,
  RefreshCw,
  EllipsisVertical,
  FolderInput,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Button,
  BadgeStatus,
  Checkbox,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@marlindtako/pioneer-design-system";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FolderPickerModal } from "@/components/FolderPickerModal";

// ── Types (mirrored from Reports.tsx) ─────────────────────────────────────────

export type ReportType = "bar" | "line" | "donut" | "table" | "kpi" | "horizontal-bar";

export interface Report {
  id: string;
  name: string;
  reportType: ReportType;
  type: string;
  source: string;
  createdAt: string;
  lastModified: string;
  createdBy: string;
  folderId: string | null;
}

// ── Mock asset records ─────────────────────────────────────────────────────────

interface AssetRecord {
  id: string;
  assetId: string;
  name: string;
  status: "overdue" | "active" | "maintenance" | "available" | "retired";
  location: string;
  createdAt: string;
  lastUpdatedAt: string;
}

type StatusConfig = {
  label: string;
  type: "red" | "green" | "orange" | "blue" | "neutral";
};

const STATUS_CONFIG: Record<AssetRecord["status"], StatusConfig> = {
  overdue:     { label: "Overdue",        type: "red"     },
  active:      { label: "Active",         type: "green"   },
  maintenance: { label: "In maintenance", type: "orange"  },
  available:   { label: "Available",      type: "blue"    },
  retired:     { label: "Retired",        type: "neutral" },
};

const ASSET_RECORDS: AssetRecord[] = [
  { id: "1",  assetId: "A-00001", name: "MacBook Pro 14-inch",         status: "active",      location: "Sydney HQ — Floor 3",     createdAt: "01-10-2025", lastUpdatedAt: "15-10-2025" },
  { id: "2",  assetId: "A-00002", name: "Dell UltraSharp Monitor 27\"", status: "overdue",     location: "Melbourne Office — Desk 4", createdAt: "01-10-2025", lastUpdatedAt: "18-10-2025" },
  { id: "3",  assetId: "A-00003", name: "HP LaserJet Pro M404dn",       status: "maintenance", location: "Brisbane Branch — IT Room",  createdAt: "02-10-2025", lastUpdatedAt: "20-10-2025" },
  { id: "4",  assetId: "A-00004", name: "iPad Pro 12.9\" M2",           status: "available",   location: "Perth Office — Store",       createdAt: "03-10-2025", lastUpdatedAt: "21-10-2025" },
  { id: "5",  assetId: "A-00005", name: "Cisco IP Phone 8841",          status: "active",      location: "Sydney HQ — Floor 1",        createdAt: "03-10-2025", lastUpdatedAt: "21-10-2025" },
  { id: "6",  assetId: "A-00006", name: "Logitech MX Keys Keyboard",    status: "overdue",     location: "Melbourne Office — Desk 7",  createdAt: "04-10-2025", lastUpdatedAt: "22-10-2025" },
  { id: "7",  assetId: "A-00007", name: "Sony WH-1000XM5 Headset",      status: "active",      location: "Sydney HQ — Floor 2",        createdAt: "04-10-2025", lastUpdatedAt: "22-10-2025" },
  { id: "8",  assetId: "A-00008", name: "Microsoft Surface Pro 9",      status: "maintenance", location: "Adelaide Branch — Desk 2",   createdAt: "05-10-2025", lastUpdatedAt: "23-10-2025" },
  { id: "9",  assetId: "A-00009", name: "Epson WorkForce Pro Scanner",   status: "available",   location: "Perth Office — Floor 2",     createdAt: "06-10-2025", lastUpdatedAt: "24-10-2025" },
  { id: "10", assetId: "A-00010", name: "LG 34\" UltraWide Monitor",     status: "retired",     location: "Sydney HQ — Storage",        createdAt: "06-10-2025", lastUpdatedAt: "24-10-2025" },
  { id: "11", assetId: "A-00011", name: "Apple Magic Trackpad 3",        status: "active",      location: "Brisbane Branch — Desk 3",   createdAt: "07-10-2025", lastUpdatedAt: "25-10-2025" },
  { id: "12", assetId: "A-00012", name: "Docking Station — CalDigit TS4",status: "overdue",     location: "Melbourne Office — Desk 1",  createdAt: "08-10-2025", lastUpdatedAt: "25-10-2025" },
  { id: "13", assetId: "A-00013", name: "Canon PIXMA TR8620 Printer",    status: "maintenance", location: "Sydney HQ — Floor 4",        createdAt: "09-10-2025", lastUpdatedAt: "26-10-2025" },
  { id: "14", assetId: "A-00014", name: "Jabra Evolve2 85 Headset",      status: "available",   location: "Perth Office — Store",       createdAt: "10-10-2025", lastUpdatedAt: "27-10-2025" },
  { id: "15", assetId: "A-00015", name: "Samsung Galaxy Tab S9",         status: "active",      location: "Adelaide Branch — Desk 5",   createdAt: "11-10-2025", lastUpdatedAt: "28-10-2025" },
  { id: "16", assetId: "A-00016", name: "Lenovo ThinkPad X1 Carbon",     status: "active",      location: "Sydney HQ — Floor 2",        createdAt: "12-10-2025", lastUpdatedAt: "29-10-2025" },
  { id: "17", assetId: "A-00017", name: "Zebra ZT411 Label Printer",     status: "overdue",     location: "Brisbane Branch — Warehouse",createdAt: "13-10-2025", lastUpdatedAt: "30-10-2025" },
  { id: "18", assetId: "A-00018", name: "Polycom Studio X50",            status: "active",      location: "Melbourne Office — Conf A",  createdAt: "14-10-2025", lastUpdatedAt: "31-10-2025" },
  { id: "19", assetId: "A-00019", name: "Anker PowerConf C300 Webcam",   status: "available",   location: "Sydney HQ — Floor 3",        createdAt: "15-10-2025", lastUpdatedAt: "01-11-2025" },
  { id: "20", assetId: "A-00020", name: "Motorola Solutions TC57 Scanner",status: "maintenance", location: "Perth Office — Warehouse",   createdAt: "16-10-2025", lastUpdatedAt: "02-11-2025" },
];

// ── Chart visualizations ──────────────────────────────────────────────────────


function BarChartViz() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const data = [
    { label: "Active",         values: [68, 72, 65, 80, 75, 90, 88, 78, 92, 85], color: "#00A991" },
    { label: "In maintenance", values: [12, 10, 15, 8,  12, 7,  9,  14, 8,  11], color: "#DE8D14" },
    { label: "Overdue",        values: [20, 18, 20, 12, 13, 3,  3,  8,  0,  4],  color: "#A90018" },
  ];
  const max = 100;
  const barW = 14;
  const gap = 6;
  const groupW = data.length * barW + (data.length - 1) * gap;
  const chartH = 220;
  const svgW = months.length * (groupW + 28);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        {data.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg width={svgW} height={chartH + 40} className="block">
          {[0, 25, 50, 75, 100].map((v) => {
            const y = chartH - (v / max) * chartH;
            return (
              <g key={v}>
                <line x1={0} x2={svgW} y1={y} y2={y} stroke="#e5e5e5" strokeWidth={1} />
                <text x={0} y={y - 3} fontSize={10} fill="#737373">{v}</text>
              </g>
            );
          })}
          {months.map((month, mi) => {
            const groupX = mi * (groupW + 28) + 20;
            return (
              <g key={month}>
                {data.map((series, si) => {
                  const val = series.values[mi];
                  const bh = (val / max) * chartH;
                  const x = groupX + si * (barW + gap);
                  const y = chartH - bh;
                  return <rect key={si} x={x} y={y} width={barW} height={bh} fill={series.color} rx={2} />;
                })}
                <text x={groupX + groupW / 2} y={chartH + 20} fontSize={11} fill="#737373" textAnchor="middle">{month}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function HorizontalBarChartViz() {
  const categories = [
    { label: "Sydney HQ",       value: 342, color: "#00A991" },
    { label: "Melbourne Office", value: 198, color: "#006CA9" },
    { label: "Brisbane Branch",  value: 157, color: "#55376D" },
    { label: "Perth Office",     value: 124, color: "#DE8D14" },
    { label: "Adelaide Branch",  value: 89,  color: "#A90018" },
    { label: "Remote / WFH",     value: 75,  color: "#737373" },
  ];
  const max = 400; const barH = 28; const gap = 16;
  const svgW = 600; const labelW = 160; const trackW = svgW - labelW - 60;
  const svgH = categories.length * (barH + gap);
  return (
    <svg width={svgW} height={svgH + 20} className="block w-full max-w-2xl">
      {categories.map((cat, i) => {
        const y = i * (barH + gap);
        const bw = (cat.value / max) * trackW;
        return (
          <g key={cat.label}>
            <text x={0} y={y + barH / 2 + 4} fontSize={12} fill="#0a0a0a" dominantBaseline="middle">{cat.label}</text>
            <rect x={labelW} y={y} width={trackW} height={barH} fill="#f5f5f5" rx={4} />
            <rect x={labelW} y={y} width={bw} height={barH} fill={cat.color} rx={4} />
            <text x={labelW + bw + 8} y={y + barH / 2 + 1} fontSize={12} fill="#737373" dominantBaseline="middle">{cat.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChartViz() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const series = [
    { label: "2025", values: [52, 65, 58, 72, 68, 85, 90, 78, 95, 88], color: "#00A991" },
    { label: "2024", values: [40, 48, 55, 60, 58, 62, 70, 65, 72, 68], color: "#006CA9" },
  ];
  const chartW = 600; const chartH = 200; const padX = 40; const padY = 20;
  const innerW = chartW - padX * 2; const innerH = chartH - padY * 2; const maxVal = 100;
  const getX = (i: number) => padX + (i / (months.length - 1)) * innerW;
  const getY = (v: number) => padY + innerH - (v / maxVal) * innerH;
  const toPath = (values: number[]) => values.map((v, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(v)}`).join(" ");
  const toArea = (values: number[]) => toPath(values) + ` L ${getX(values.length - 1)} ${padY + innerH} L ${getX(0)} ${padY + innerH} Z`;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        {series.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ background: s.color }} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
      <svg width={chartW} height={chartH + 30} className="block w-full max-w-2xl">
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={padX} x2={padX + innerW} y1={getY(v)} y2={getY(v)} stroke="#e5e5e5" strokeWidth={1} />
            <text x={padX - 6} y={getY(v) + 4} fontSize={10} fill="#737373" textAnchor="end">{v}</text>
          </g>
        ))}
        {series.map((s) => <path key={s.label + "-area"} d={toArea(s.values)} fill={s.color} fillOpacity={0.08} />)}
        {series.map((s) => <path key={s.label + "-line"} d={toPath(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />)}
        {series.map((s) => s.values.map((v, i) => (
          <circle key={`${s.label}-${i}`} cx={getX(i)} cy={getY(v)} r={3.5} fill="white" stroke={s.color} strokeWidth={2} />
        )))}
        {months.map((m, i) => <text key={m} x={getX(i)} y={chartH + 14} fontSize={11} fill="#737373" textAnchor="middle">{m}</text>)}
      </svg>
    </div>
  );
}

function DonutChartViz() {
  const segments = [
    { label: "Active",         value: 48, color: "#00A991" },
    { label: "Available",      value: 22, color: "#006CA9" },
    { label: "In maintenance", value: 16, color: "#DE8D14" },
    { label: "Overdue",        value: 9,  color: "#A90018" },
    { label: "Retired",        value: 5,  color: "#e5e5e5" },
  ];
  const total = segments.reduce((s, d) => s + d.value, 0);
  const cx = 110; const cy = 110; const r = 80; const ir = 52;
  let cumAngle = -Math.PI / 2;
  const slices = segments.map((seg) => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const start = cumAngle; const end = cumAngle + angle; cumAngle = end;
    const x1 = cx + r * Math.cos(start); const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);   const y2 = cy + r * Math.sin(end);
    const ix1 = cx + ir * Math.cos(start); const iy1 = cy + ir * Math.sin(start);
    const ix2 = cx + ir * Math.cos(end);   const iy2 = cy + ir * Math.sin(end);
    const large = angle > Math.PI ? 1 : 0;
    return { ...seg, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${large} 0 ${ix1} ${iy1} Z` };
  });
  return (
    <div className="flex items-center gap-12">
      <svg width={220} height={220}>
        {slices.map((s) => <path key={s.label} d={s.d} fill={s.color} stroke="white" strokeWidth={2} />)}
        <text x={cx} y={cy - 8} fontSize={24} fontWeight={700} fill="#0a0a0a" textAnchor="middle">{total}%</text>
        <text x={cx} y={cy + 14} fontSize={12} fill="#737373" textAnchor="middle">Total</text>
      </svg>
      <div className="flex flex-col gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between gap-8 min-w-[180px]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
              <span className="text-sm text-foreground">{seg.label}</span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KPIViz() {
  const kpis = [
    { label: "Total asset value",  value: "$4,821,340", change: +12.4, trend: [42, 38, 45, 52, 48, 56, 61, 58, 67, 72], color: "#00A991" },
    { label: "Assets overdue",     value: "247",        change: -8.3,  trend: [30, 34, 28, 32, 26, 29, 25, 28, 24, 22], color: "#A90018" },
    { label: "Avg. asset age",     value: "3.2 yrs",    change: +2.1,  trend: [2.8, 2.9, 2.9, 3.0, 3.0, 3.1, 3.1, 3.1, 3.2, 3.2], color: "#006CA9" },
    { label: "Maintenance spend",  value: "$182,400",   change: +5.7,  trend: [60, 65, 58, 72, 68, 75, 70, 78, 80, 85], color: "#DE8D14" },
  ];
  const sparkline = (values: number[], color: string) => {
    const w = 80; const h = 32;
    const min = Math.min(...values); const max = Math.max(...values); const range = max - min || 1;
    const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`);
    return <svg width={w} height={h} className="block"><polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" /></svg>;
  };
  return (
    <div className="grid grid-cols-2 gap-6 max-w-2xl">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="flex flex-col gap-2 bg-white border border-border rounded-xl p-5">
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-1 text-xs font-medium", kpi.change >= 0 ? "text-[#00A93D]" : "text-[#A90018]")}>
              {kpi.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {kpi.change >= 0 ? "+" : ""}{kpi.change}% vs last period
            </div>
            {sparkline(kpi.trend, kpi.color)}
          </div>
        </div>
      ))}
    </div>
  );
}

function TableViz({ records, selected, onToggle, onToggleAll, allSelected, someSelected }: {
  records: AssetRecord[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
}) {
  return (
    <Table className="table-fixed">
      <colgroup>
        <col className="w-10" />
        <col className="w-[110px]" />
        <col className="w-[240px]" />
        <col className="w-[160px]" />
        <col className="w-[200px]" />
        <col className="w-[130px]" />
        <col className="w-[150px]" />
        <col className="w-12" />
      </colgroup>
      <TableHeader>
        <TableRow>
          <th
            className="h-10 px-2 text-left align-middle border-b border-border bg-muted cursor-pointer select-none"
            onClick={onToggleAll}
          >
            <div className="flex items-center justify-center h-full">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={onToggleAll}
              />
            </div>
          </th>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Last updated at</TableHead>
          <TableHead showText={false} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => {
          const cfg = STATUS_CONFIG[record.status];
          return (
            <tr
              key={record.id}
              className={cn(
                "group border-b border-border transition-colors hover:bg-muted/40",
                selected.has(record.id) && "bg-[#00a991]/5"
              )}
            >
              <td className="h-14 w-10 p-2 align-middle border-b border-border">
                <div className="flex items-center justify-center h-full">
                  <Checkbox checked={selected.has(record.id)} onCheckedChange={() => onToggle(record.id)} />
                </div>
              </td>
              <TableCell className="font-mono text-xs text-muted-foreground">{record.assetId}</TableCell>
              <TableCell className="truncate max-w-0 font-medium">{record.name}</TableCell>
              <td className="h-14 p-2 align-middle border-b border-border">
                <div className="flex items-center h-full">
                  <BadgeStatus type={cfg.type}>{cfg.label}</BadgeStatus>
                </div>
              </td>
              <TableCell className="truncate max-w-0 text-muted-foreground">{record.location}</TableCell>
              <TableCell className="text-muted-foreground">{record.createdAt}</TableCell>
              <TableCell className="text-muted-foreground">{record.lastUpdatedAt}</TableCell>
              <td className="h-14 w-12 p-2 align-middle border-b border-border">
                <div className="flex items-center justify-center h-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        <EllipsisVertical size={14} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View asset</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export row</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ── Report Profile screen ──────────────────────────────────────────────────────

interface FolderOption {
  id: string;
  name: string;
  reportCount: number;
}

interface ReportProfileProps {
  report: Report;
  onBack: () => void;
  folders?: FolderOption[];
  onFolderAssign?: (folderId: string) => void;
}

export function ReportProfile({ report, onBack, folders = [], onFolderAssign }: ReportProfileProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [folderPickerOpen, setFolderPickerOpen] = useState(false);

  const folderMode = report.folderId ? "move" : "add";
  const isTable = report.reportType === "table";
  const records = ASSET_RECORDS;
  const allSelected = selected.size === records.length && records.length > 0;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(records.map((r) => r.id)));
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const vizTitle: Record<ReportType, string> = {
    table:          "Asset records",
    bar:            "Assets by status — monthly breakdown",
    "horizontal-bar": "Asset count by location",
    line:           "Asset activity trend over time",
    donut:          "Asset status distribution",
    kpi:            "Key performance indicators",
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-border">
        <div className="flex items-start justify-between px-6 pt-5 pb-4 gap-4">
          {/* Left: back + title + source */}
          <div className="flex flex-col gap-1 min-w-0">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <h1 className="text-[18px] font-bold leading-7 text-foreground truncate">{report.name}</h1>
            <p className="text-sm text-muted-foreground leading-5">{report.source}</p>
          </div>
          {/* Right: icon buttons + Re-run */}
          <div className="flex items-center gap-2 flex-shrink-0 pt-6">
            <Button variant="outline" size="icon"><ListFilter size={16} /></Button>
            <Button variant="outline" size="icon"><ArrowDownUp size={16} /></Button>
            <Button variant="outline" size="icon"><Share2 size={16} /></Button>
            <Button className="gap-2">
              <RefreshCw size={16} />
              Re-run
            </Button>
          </div>
        </div>
      </div>

      {/* ── Count row ── */}
      <div className="flex items-center px-6 h-14 border-b border-border flex-shrink-0">
        {selected.size === 0 ? (
          <p className="text-sm font-medium text-foreground">
            {isTable ? `${records.length.toLocaleString()} Records` : vizTitle[report.reportType]}
          </p>
        ) : (
          <>
            <span className="text-sm text-foreground flex-1">{selected.size} selected</span>
            <div className="flex items-center gap-2">
              <Button variant="link" size="sm" className="h-auto p-0 text-[#006CA9] hover:text-[#005a8e]" onClick={() => setSelected(new Set(records.map((r) => r.id)))}>Select all</Button>
              <Button variant="link" size="sm" className="h-auto p-0 text-[#006CA9] hover:text-[#005a8e]" onClick={() => setSelected(new Set())}>Deselect all</Button>
            </div>
          </>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        {report.reportType === "table" && (
          <TableViz
            records={records}
            selected={selected}
            onToggle={toggleRow}
            onToggleAll={toggleAll}
            allSelected={allSelected}
            someSelected={someSelected}
          />
        )}

        {report.reportType !== "table" && (
          <div className="px-6 py-8">
            {report.reportType === "bar"            && <BarChartViz />}
            {report.reportType === "horizontal-bar" && <HorizontalBarChartViz />}
            {report.reportType === "line"           && <LineChartViz />}
            {report.reportType === "donut"          && <DonutChartViz />}
            {report.reportType === "kpi"            && <KPIViz />}
          </div>
        )}
      </div>
    </div>
  );
}
