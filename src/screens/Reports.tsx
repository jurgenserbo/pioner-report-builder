import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  BarChart2,
  BarChartHorizontal,
  LineChart,
  PieChart,
  Table2,
  Percent,
  ListFilter,
  ArrowDownUp,
  ArrowLeft,
  Folder,
  MoreVertical,
  MoreHorizontal,
  EllipsisVertical,
  FolderPlus,
  FolderInput,
  Trash2,
  CirclePlus,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreateReportModal, type ReportConfig } from "@/components/CreateReportModal";
import type { Crumb } from "@/components/TopNav";
import { FolderPickerModal } from "@/components/FolderPickerModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ReportProfile } from "@/screens/ReportProfile";

// ── Types ─────────────────────────────────────────────────────────────────────

type ReportType = "bar" | "line" | "donut" | "table" | "kpi" | "horizontal-bar";
type Tab = "all" | "mine" | "shared";

interface Folder {
  id: string;
  name: string;
  description: string;
}

interface Report {
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

// ── Mock data ─────────────────────────────────────────────────────────────────

const FOLDERS: Folder[] = [
  { id: "f1",  name: "Traffic and engagement statistics", description: "Overview of site performance metrics"          },
  { id: "f2",  name: "Monthly sales overview",            description: "Analysis of sales trends and forecasts"        },
  { id: "f3",  name: "User satisfaction surveys",         description: "Insights collected from customer feedback"     },
  { id: "f4",  name: "New product rollout",               description: "Details and timelines for upcoming launches"   },
  { id: "f5",  name: "Asset depreciation reports",        description: "Tracks value loss across all asset categories" },
  { id: "f6",  name: "Maintenance cost analysis",         description: "Breakdown of repair and upkeep spending"       },
  { id: "f7",  name: "Inventory turnover metrics",        description: "Measures how quickly stock moves in and out"   },
  { id: "f8",  name: "Compliance audit results",          description: "Audit outcomes and pass rates by department"   },
  { id: "f9",  name: "Fleet utilisation reports",         description: "Vehicle usage rates and downtime summaries"    },
  { id: "f10", name: "Employee equipment assignments",    description: "Current and historical device assignments"     },
  { id: "f11", name: "Checkout and return trends",        description: "Patterns in asset lending and return times"    },
  { id: "f12", name: "Q4 2025 performance summary",       description: "End-of-quarter rollup across all modules"      },
];

const REPORTS: Report[] = [
  { id: "r1",  name: "Assets by Status",                        reportType: "bar",            type: "Depreciation", source: "Acme Corp / Assets / Equipment",           createdAt: "01-10-2025 12:24 AM", lastModified: "01-10-2025 12:24 AM", createdBy: "Jurgen Serbo",    folderId: "f1" },
  { id: "r2",  name: "Asset condition breakdown",               reportType: "line",           type: "Depreciation", source: "Acme Corp / Assets / Vehicles",             createdAt: "01-10-2025 12:24 AM", lastModified: "01-10-2025 12:24 AM", createdBy: "Jurgen Serbo",    folderId: "f1" },
  { id: "r3",  name: "Total Asset Value",                       reportType: "donut",          type: "Depreciation", source: "Pioneer / Assets / Equipment",              createdAt: "01-10-2025 12:24 AM", lastModified: "01-10-2025 12:24 AM", createdBy: "Alice Kim",       folderId: "f2" },
  { id: "r4",  name: "Asset by location",                       reportType: "table",          type: "Form",         source: "Acme Corp / Assets / Asset Intake Form",    createdAt: "01-10-2025 12:24 AM", lastModified: "01-10-2025 12:24 AM", createdBy: "Alice Kim",       folderId: "f2" },
  { id: "r5",  name: "Audit completion log",                    reportType: "kpi",            type: "Depreciation", source: "Pioneer / Maintenance / Equipment",         createdAt: "01-10-2025 12:24 AM", lastModified: "01-10-2025 12:24 AM", createdBy: "Bob Martinez",    folderId: "f2" },
  { id: "r6",  name: "Depreciation overview",                   reportType: "horizontal-bar", type: "Audit",        source: "Acme Corp / Assets / Q1 2025 Audit",        createdAt: "01-10-2025 12:25 AM", lastModified: "01-10-2025 12:25 AM", createdBy: "Jurgen Serbo",    folderId: "f3" },
  { id: "r7",  name: "Inspection submissions",                  reportType: "table",          type: "Audit",        source: "Pioneer / Assets / Annual Audit",           createdAt: "01-10-2025 12:26 AM", lastModified: "01-10-2025 12:26 AM", createdBy: "Carol Pham",      folderId: "f3" },
  { id: "r8",  name: "Biannual customer satisfaction survey",   reportType: "bar",            type: "Depreciation", source: "Demo Account / Inventory / Assets",         createdAt: "01-10-2025 12:29 AM", lastModified: "01-10-2025 12:29 AM", createdBy: "Bob Martinez",    folderId: "f4" },
  { id: "r9",  name: "Monthly checkout trends",                 reportType: "line",           type: "Form",         source: "Acme Corp / Assets / Checkout Form",        createdAt: "02-10-2025 09:10 AM", lastModified: "02-10-2025 09:10 AM", createdBy: "Alice Kim",       folderId: "f4" },
  { id: "r10", name: "Fleet utilisation by department",         reportType: "horizontal-bar", type: "Depreciation", source: "Acme Corp / Assets / Vehicles",             createdAt: "02-10-2025 10:32 AM", lastModified: "03-10-2025 08:00 AM", createdBy: "Jurgen Serbo",    folderId: "f5" },
  { id: "r11", name: "Overdue returns summary",                 reportType: "kpi",            type: "Audit",        source: "Pioneer / Assets / Q2 2025 Audit",          createdAt: "03-10-2025 11:15 AM", lastModified: "03-10-2025 11:15 AM", createdBy: "Carol Pham",      folderId: "f5" },
  { id: "r12", name: "Asset status breakdown — Q3",             reportType: "donut",          type: "Depreciation", source: "Demo Account / Assets / Equipment",         createdAt: "04-10-2025 02:00 PM", lastModified: "04-10-2025 02:00 PM", createdBy: "David Lee",       folderId: "f6" },
  { id: "r13", name: "Maintenance cost by category",            reportType: "bar",            type: "Form",         source: "Acme Corp / Maintenance / Inspection Form", createdAt: "05-10-2025 08:45 AM", lastModified: "05-10-2025 08:45 AM", createdBy: "Jurgen Serbo",    folderId: "f6" },
  { id: "r14", name: "Audit pass rate over time",               reportType: "line",           type: "Audit",        source: "Pioneer / Assets / Annual Audit",           createdAt: "06-10-2025 03:20 PM", lastModified: "06-10-2025 03:20 PM", createdBy: "Alice Kim",       folderId: "f7" },
  { id: "r15", name: "Top 10 locations by asset count",         reportType: "horizontal-bar", type: "Depreciation", source: "Demo Account / Assets / Assets",            createdAt: "07-10-2025 01:00 PM", lastModified: "07-10-2025 01:00 PM", createdBy: "Bob Martinez",    folderId: "f8" },
  { id: "r16", name: "Current asset value by category",         reportType: "table",          type: "Depreciation", source: "Acme Corp / Inventory / Assets",            createdAt: "08-10-2025 09:00 AM", lastModified: "08-10-2025 09:00 AM", createdBy: "David Lee",       folderId: "f9"  },
  { id: "r17", name: "Scheduled maintenance tracker",           reportType: "table",          type: "Form",         source: "Pioneer / Maintenance / Inspection Form",   createdAt: "09-10-2025 10:10 AM", lastModified: "10-10-2025 08:30 AM", createdBy: "Carol Pham",      folderId: "f9"  },
  { id: "r18", name: "Asset acquisition spend — YTD",           reportType: "kpi",            type: "Depreciation", source: "Acme Corp / Assets / Equipment",            createdAt: "10-10-2025 11:55 AM", lastModified: "10-10-2025 11:55 AM", createdBy: "Jurgen Serbo",    folderId: "f10" },
  { id: "r19", name: "Condition distribution snapshot",         reportType: "donut",          type: "Audit",        source: "Demo Account / Assets / Q1 2025 Audit",    createdAt: "11-10-2025 04:00 PM", lastModified: "11-10-2025 04:00 PM", createdBy: "Alice Kim",       folderId: "f11" },
  { id: "r20", name: "Weekly inspection completion rate",       reportType: "line",           type: "Audit",        source: "Pioneer / Assets / Annual Audit",           createdAt: "12-10-2025 07:30 AM", lastModified: "12-10-2025 07:30 AM", createdBy: "Bob Martinez",    folderId: "f11" },
  { id: "r21", name: "Q4 sales performance summary",            reportType: "bar",            type: "Depreciation", source: "Acme Corp / Assets / Equipment",            createdAt: "13-10-2025 08:00 AM", lastModified: "13-10-2025 08:00 AM", createdBy: "Jurgen Serbo",    folderId: "f12" },
  { id: "r22", name: "Asset lifecycle overview",                reportType: "line",           type: "Depreciation", source: "Pioneer / Assets / Equipment",              createdAt: "14-10-2025 09:15 AM", lastModified: "14-10-2025 09:15 AM", createdBy: "Alice Kim",       folderId: "f12" },
  { id: "r23", name: "Department budget allocation",            reportType: "donut",          type: "Form",         source: "Demo Account / Assets / Asset Intake Form", createdAt: "15-10-2025 10:30 AM", lastModified: "15-10-2025 10:30 AM", createdBy: "David Lee",       folderId: null },
  { id: "r24", name: "Quarterly maintenance costs",             reportType: "horizontal-bar", type: "Depreciation", source: "Acme Corp / Maintenance / Inspection Form", createdAt: "16-10-2025 11:00 AM", lastModified: "16-10-2025 11:00 AM", createdBy: "Carol Pham",      folderId: null },
  { id: "r25", name: "IT equipment status",                     reportType: "table",          type: "Audit",        source: "Pioneer / Assets / Annual Audit",           createdAt: "17-10-2025 02:45 PM", lastModified: "17-10-2025 02:45 PM", createdBy: "Bob Martinez",    folderId: null },
  { id: "r26", name: "Vendor contract renewals",                reportType: "kpi",            type: "Form",         source: "Acme Corp / Assets / Checkout Form",        createdAt: "18-10-2025 03:20 PM", lastModified: "18-10-2025 03:20 PM", createdBy: "Jurgen Serbo",    folderId: null },
  { id: "r27", name: "Annual asset disposal report",            reportType: "bar",            type: "Depreciation", source: "Demo Account / Inventory / Assets",         createdAt: "19-10-2025 08:10 AM", lastModified: "19-10-2025 08:10 AM", createdBy: "Alice Kim",       folderId: null },
  { id: "r28", name: "Downtime frequency by asset type",        reportType: "line",           type: "Audit",        source: "Pioneer / Assets / Q2 2025 Audit",          createdAt: "20-10-2025 09:00 AM", lastModified: "20-10-2025 09:00 AM", createdBy: "David Lee",       folderId: null },
  { id: "r29", name: "Open work orders summary",                reportType: "table",          type: "Form",         source: "Acme Corp / Maintenance / Inspection Form", createdAt: "20-10-2025 11:20 AM", lastModified: "21-10-2025 08:00 AM", createdBy: "Carol Pham",      folderId: null },
  { id: "r30", name: "Asset check-out rate by location",        reportType: "horizontal-bar", type: "Form",         source: "Demo Account / Assets / Checkout Form",     createdAt: "21-10-2025 01:15 PM", lastModified: "21-10-2025 01:15 PM", createdBy: "Bob Martinez",    folderId: null },
  { id: "r31", name: "Replacement cost forecast",               reportType: "kpi",            type: "Depreciation", source: "Acme Corp / Assets / Equipment",            createdAt: "22-10-2025 10:00 AM", lastModified: "22-10-2025 10:00 AM", createdBy: "Jurgen Serbo",    folderId: null },
  { id: "r32", name: "Asset utilisation by department",         reportType: "donut",          type: "Depreciation", source: "Pioneer / Assets / Equipment",              createdAt: "22-10-2025 02:30 PM", lastModified: "23-10-2025 09:00 AM", createdBy: "Alice Kim",       folderId: null },
  { id: "r33", name: "Pending audits by module",                reportType: "bar",            type: "Audit",        source: "Demo Account / Assets / Q1 2025 Audit",    createdAt: "23-10-2025 08:45 AM", lastModified: "23-10-2025 08:45 AM", createdBy: "David Lee",       folderId: null },
  { id: "r34", name: "Inventory shrinkage report",              reportType: "line",           type: "Depreciation", source: "Acme Corp / Inventory / Assets",            createdAt: "24-10-2025 12:00 PM", lastModified: "24-10-2025 12:00 PM", createdBy: "Carol Pham",      folderId: null },
  { id: "r35", name: "Employee asset compliance score",         reportType: "kpi",            type: "Audit",        source: "Pioneer / Assets / Annual Audit",           createdAt: "25-10-2025 03:10 PM", lastModified: "25-10-2025 03:10 PM", createdBy: "Bob Martinez",    folderId: null },
];

// ── Source label maps ─────────────────────────────────────────────────────────

const ACCOUNT_LABELS:    Record<string, string> = { acme: "Acme Corp", pioneer: "Pioneer", demo: "Demo Account" };
const MODULE_LABELS:     Record<string, string> = { assets: "Assets", inventory: "Inventory", maintenance: "Maintenance" };
const COLLECTION_LABELS: Record<string, string> = { assets: "Assets", equipment: "Equipment", vehicles: "Vehicles" };
const FORM_LABELS:       Record<string, string> = { intake: "Asset intake form", inspection: "Inspection form", checkout: "Checkout form" };
const AUDIT_LABELS:      Record<string, string> = { q1: "Q1 2025 Audit", q2: "Q2 2025 Audit", annual: "Annual audit" };
const SAVED_VIEW_LABELS: Record<string, string> = { overdue: "Overdue assets", available: "Available assets", maintenance: "Maintenance queue" };

// ── Report type → BadgeStatus config ─────────────────────────────────────────

const REPORT_TYPE_CONFIG: Record<ReportType, {
  label: string;
  icon: React.ElementType;
  type: "blue" | "green" | "orange" | "neutral" | "red" | "purple";
}> = {
  bar:              { label: "Bar chart",             icon: BarChart2,          type: "blue" },
  line:             { label: "Line chart",            icon: LineChart,          type: "green" },
  donut:            { label: "Donut chart",           icon: PieChart,           type: "orange" },
  table:            { label: "Table",                 icon: Table2,             type: "neutral" },
  kpi:              { label: "KPI",                   icon: Percent,            type: "red" },
  "horizontal-bar": { label: "Horizontal bar chart",  icon: BarChartHorizontal, type: "purple" },
};

function ReportTypeBadge({ reportType }: { reportType: ReportType }) {
  const { label, icon: Icon, type } = REPORT_TYPE_CONFIG[reportType];
  return (
    <BadgeStatus type={type} leftIcon={<Icon size={12} />}>
      {label}
    </BadgeStatus>
  );
}

// ── Droppable folder card ─────────────────────────────────────────────────────

// ── Shared folder card body ───────────────────────────────────────────────────

function FolderCardBody({ folder, reportCount }: { folder: Folder; reportCount: number }) {
  return (
    <div className="pt-[14px] pb-4 px-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-[8px] bg-[#d9e9f2] flex items-center justify-center flex-shrink-0">
            <Folder size={20} className="text-foreground" />
          </div>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {reportCount} Reports
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Move</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-bold text-foreground leading-6">{folder.name}</p>
        <p className="text-xs text-muted-foreground leading-4">{folder.description}</p>
      </div>
    </div>
  );
}

function DroppableFolderCard({ folder, reportCount, isDragging, onClick }: {
  folder: Folder;
  reportCount: number;
  isDragging: boolean;
  onClick?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: folder.id });
  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-[305px] bg-white border rounded-2xl overflow-hidden transition-colors duration-150",
        isOver ? "border-[#00A991] bg-[#00A991]/5" : isDragging ? "border-[#00A991]/30" : "border-border hover:shadow-sm cursor-pointer"
      )}
    >
      <FolderCardBody folder={folder} reportCount={reportCount} />
    </div>
  );
}

// ── Draggable report row ───────────────────────────────────────────────────────

function DraggableReportRow({
  report,
  isSelected,
  selectedCount,
  onToggle,
  onClick,
  onDelete,
}: {
  report: Report;
  isSelected: boolean;
  selectedCount: number;
  onToggle: () => void;
  onClick: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: report.id });

  return (
    <tr
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "group border-b border-border transition-colors cursor-grab active:cursor-grabbing",
        isSelected && "bg-[#00a991]/5",
        isDragging && "opacity-40"
      )}
    >
      {/* Checkbox cell */}
      <td className="h-14 w-10 p-2 align-middle border-b border-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center h-full">
          <Checkbox checked={isSelected} onCheckedChange={onToggle} />
        </div>
      </td>
      <TableCell className="truncate max-w-0">{report.name}</TableCell>
      <td className="h-14 p-2 align-middle border-b border-border">
        <div className="flex items-center h-full">
          <ReportTypeBadge reportType={report.reportType} />
        </div>
      </td>
      <TableCell>{report.type}</TableCell>
      <TableCell className="truncate max-w-0">{report.source}</TableCell>
      <TableCell>{report.createdAt}</TableCell>
      <TableCell>{report.lastModified}</TableCell>
      <td className="h-14 w-12 p-2 align-middle border-b border-border">
        <div className="flex items-center justify-center h-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openFolderPicker("add", [report.id])}>Move to folder</DropdownMenuItem>
              <DropdownMenuItem>Schedule</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onSelect={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

// ── Drag overlay pill ─────────────────────────────────────────────────────────

function DragPill({ name, count }: { name: string; count: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-white border border-border text-foreground text-xs font-medium px-2.5 py-1.5 rounded-md shadow-md cursor-grabbing max-w-[200px] truncate">
      {count > 1 ? `${count} reports` : name}
    </div>
  );
}

// ── Reports screen ────────────────────────────────────────────────────────────

interface ReportsProps {
  onCreateReport?: () => void;
  onCrumbsChange?: (crumbs: Crumb[]) => void;
}

export function Reports({ onCreateReport, onCrumbsChange }: ReportsProps) {
  const [tab, setTab] = useState<Tab>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [folders, setFolders] = useState<Folder[]>(FOLDERS);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<{ reports: Report[]; folders: Folder[] } | null>(null);
  const [foldersView, setFoldersView] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [folderNavSource, setFolderNavSource] = useState<"main" | "gallery">("main");
  const [folderSelected, setFolderSelected] = useState<Set<string>>(new Set());
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportNavSource, setReportNavSource] = useState<"main" | "folder">("main");

  function openReport(report: Report, source: "main" | "folder") {
    setSelectedReport(report);
    setReportNavSource(source);
  }

  function closeReport() {
    setSelectedReport(null);
  }

  // ── Breadcrumb sync ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!onCrumbsChange) return;

    if (selectedReport) {
      const crumbs: Crumb[] = [
        { label: "Reports", onClick: () => { setSelectedReport(null); setSelectedFolder(null); setFoldersView(false); } },
      ];
      if (selectedFolder) {
        if (folderNavSource === "gallery") {
          crumbs.push({ label: "All folders", onClick: () => { setSelectedReport(null); setFoldersView(true); } });
        }
        crumbs.push({ label: selectedFolder.name, onClick: () => setSelectedReport(null) });
      }
      crumbs.push({ label: selectedReport.name });
      onCrumbsChange(crumbs);
      return;
    }

    if (selectedFolder) {
      const crumbs: Crumb[] = [
        { label: "Reports", onClick: () => { setSelectedFolder(null); setFoldersView(false); } },
      ];
      if (folderNavSource === "gallery") {
        crumbs.push({ label: "All folders", onClick: () => { setSelectedFolder(null); setFoldersView(true); } });
      }
      crumbs.push({ label: selectedFolder.name });
      onCrumbsChange(crumbs);
      return;
    }

    if (foldersView) {
      onCrumbsChange([
        { label: "Reports", onClick: () => setFoldersView(false) },
        { label: "All folders" },
      ]);
      return;
    }

    onCrumbsChange([{ label: "Reports" }]);
  }, [selectedReport, selectedFolder, foldersView, folderNavSource, onCrumbsChange]);

  // ── Folder picker modal state ────────────────────────────────────────────────

  const [folderPickerOpen, setFolderPickerOpen] = useState(false);
  const [folderPickerMode, setFolderPickerMode] = useState<"add" | "move">("move");
  // IDs of reports being moved/added via the picker
  const [folderPickerReportIds, setFolderPickerReportIds] = useState<string[]>([]);
  // The folder these reports currently live in (for greying out in move mode)
  const [folderPickerCurrentFolder, setFolderPickerCurrentFolder] = useState<string | null>(null);

  function openFolderPicker(
    mode: "add" | "move",
    reportIds: string[],
    currentFolderId: string | null = null
  ) {
    setFolderPickerMode(mode);
    setFolderPickerReportIds(reportIds);
    setFolderPickerCurrentFolder(currentFolderId);
    setFolderPickerOpen(true);
  }

  function handleFolderPickerConfirm(targetFolderId: string) {
    const snapshot = { reports, folders };
    setUndoSnapshot(snapshot);
    setReports((prev) =>
      prev.map((r) => folderPickerReportIds.includes(r.id) ? { ...r, folderId: targetFolderId } : r)
    );
    setSelected(new Set());
    setFolderSelected(new Set());

    const folderName = folders.find((f) => f.id === targetFolderId)?.name ?? "folder";
    const label = folderPickerReportIds.length > 1
      ? `${folderPickerReportIds.length} reports`
      : (reports.find((r) => r.id === folderPickerReportIds[0])?.name ?? "Report");
    const verb = folderPickerMode === "add" ? "added to" : "moved to";
    toast.success(`"${label}" ${verb} "${folderName}"`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => { setReports(snapshot.reports); setFolders(snapshot.folders); setUndoSnapshot(null); },
      },
    });
  }

  // ── Delete state ────────────────────────────────────────────────────────────

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteReportIds, setDeleteReportIds] = useState<string[]>([]);

  function openDeleteModal(ids: string[]) {
    setDeleteReportIds(ids);
    setDeleteModalOpen(true);
  }

  function handleDeleteConfirm() {
    const names = deleteReportIds
      .map((id) => reports.find((r) => r.id === id)?.name ?? "Report")
      .join(", ");
    setReports((prev) => prev.filter((r) => !deleteReportIds.includes(r.id)));
    setSelected((prev) => { const next = new Set(prev); deleteReportIds.forEach((id) => next.delete(id)); return next; });
    setFolderSelected((prev) => { const next = new Set(prev); deleteReportIds.forEach((id) => next.delete(id)); return next; });
    const label = deleteReportIds.length === 1 ? `"${names}"` : `${deleteReportIds.length} reports`;
    toast.success(`${label} deleted successfully.`);
  }

  // Folder items enriched with live report counts (used by FolderPickerModal)
  const folderPickerItems = folders.map((f) => ({
    ...f,
    reportCount: reports.filter((r) => r.folderId === f.id).length,
  }));

  function openFolder(folder: Folder, source: "main" | "gallery") {
    setSelectedFolder(folder);
    setFolderNavSource(source);
    setFolderSelected(new Set());
  }

  function closeFolder() {
    setSelectedFolder(null);
    if (folderNavSource === "gallery") setFoldersView(true);
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "all",    label: "All reports" },
    { id: "mine",   label: "My reports" },
    { id: "shared", label: "Shared with me" },
  ];

  const unfiledReports = reports.filter((r) => r.folderId === null);
  const filteredReports = tab === "all" ? unfiledReports : unfiledReports.slice(0, 4);
  const allSelected = selected.size === filteredReports.length && filteredReports.length > 0;
  const someSelected = selected.size > 0 && !allSelected;
  const activeDragReport = reports.find((r) => r.id === activeDragId) ?? null;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredReports.map((r) => r.id)));
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveDragId(active.id as string);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveDragId(null);
    if (!over) return;

    const folderId = over.id as string;
    const draggedId = active.id as string;
    const idsToMove = selected.has(draggedId) && selected.size > 1 ? Array.from(selected) : [draggedId];

    const snapshot = { reports, folders };
    setUndoSnapshot(snapshot);
    setReports((prev) => prev.map((r) => idsToMove.includes(r.id) ? { ...r, folderId } : r));
    setSelected(new Set());

    const folderName = folders.find((f) => f.id === folderId)?.name ?? "folder";
    const label = idsToMove.length > 1 ? `${idsToMove.length} reports` : (activeDragReport?.name ?? "Report");
    toast.success(`${label} moved to "${folderName}"`, {
      duration: 5000,
      action: { label: "Undo", onClick: () => { setReports(snapshot.reports); setFolders(snapshot.folders); setUndoSnapshot(null); } },
    });
  }

  function buildSource(config: ReportConfig): string {
    const account = ACCOUNT_LABELS[config.account] || config.account;
    const module  = MODULE_LABELS[config.module]   || config.module;
    let collection = "";
    if      (config.dataSource === "collection")  collection = COLLECTION_LABELS[config.collection] || config.collection;
    else if (config.dataSource === "form")        collection = FORM_LABELS[config.form]             || config.form;
    else if (config.dataSource === "audit")       collection = AUDIT_LABELS[config.audit]           || config.audit;
    else if (config.dataSource === "saved-view")  collection = SAVED_VIEW_LABELS[config.savedView]  || config.savedView;
    return [account, module, collection].filter(Boolean).join(" / ");
  }

  function handleSaveReport(config: ReportConfig) {
    const newReport: Report = {
      id: crypto.randomUUID(),
      name: config.reportName || "Untitled report",
      reportType: (config.reportType as ReportType) || "table",
      type: config.dataSource === "form" ? "Form" : config.dataSource === "audit" ? "Audit" : "Depreciation",
      source: buildSource(config),
      createdAt: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) + " 12:00 AM",
      lastModified: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) + " 12:00 AM",
      createdBy: "Jurgen Serbo",
      folderId: null,
    };
    const snapshot = { reports, folders };
    setUndoSnapshot(snapshot);
    setReports((prev) => [newReport, ...prev]);
    toast.success(`"${newReport.name}" was created successfully.`, {
      duration: 5000,
      action: { label: "Undo", onClick: () => { setReports(snapshot.reports); setFolders(snapshot.folders); setUndoSnapshot(null); } },
    });
    onCreateReport?.();
  }

  // ── Report profile view ─────────────────────────────────────────────────────

  if (selectedReport) {
    return (
      <ReportProfile
        report={selectedReport}
        onBack={closeReport}
      />
    );
  }

  // ── Folder detail view ──────────────────────────────────────────────────────

  if (selectedFolder) {
    const folderReports = reports.filter((r) => r.folderId === selectedFolder.id);
    const folderAllSelected = folderSelected.size === folderReports.length && folderReports.length > 0;
    const folderSomeSelected = folderSelected.size > 0 && !folderAllSelected;

    function toggleFolderAll() {
      if (folderAllSelected) setFolderSelected(new Set());
      else setFolderSelected(new Set(folderReports.map((r) => r.id)));
    }

    function toggleFolderRow(id: string) {
      setFolderSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }

    return (
      <div className="flex flex-col h-full bg-white overflow-hidden">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-white border-b border-border">
          <div className="flex items-start justify-between px-6 pt-5 pb-4 gap-4">
            {/* Left: back + title + subtitle */}
            <div className="flex flex-col gap-1 min-w-0">
              <button
                onClick={closeFolder}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <h1 className="text-[18px] font-bold leading-7 text-foreground">{selectedFolder.name}</h1>
              <p className="text-sm text-muted-foreground leading-5">{selectedFolder.description}</p>
            </div>
            {/* Right: action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0 pt-6">
              <Button variant="outline" size="icon"><ListFilter size={16} /></Button>
              <Button variant="outline" size="icon"><ArrowDownUp size={16} /></Button>
              <Button className="gap-2" onClick={() => setModalOpen(true)}>
                Add report
                <CirclePlus size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* ── Count / bulk row ── */}
        <div className="flex items-center px-6 h-14 border-b border-border flex-shrink-0">
          {folderSelected.size === 0 ? (
            <p className="text-sm font-medium text-foreground">{folderReports.length.toLocaleString()} Reports</p>
          ) : (
            <>
              <span className="text-sm text-foreground flex-1">{folderSelected.size} selected</span>
              <div className="flex items-center gap-2">
                <Button variant="link" size="sm" className="h-auto p-0 text-[#006CA9] hover:text-[#005a8e]" onClick={() => setFolderSelected(new Set(folderReports.map((r) => r.id)))}>Select all</Button>
                <Button variant="link" size="sm" className="h-auto p-0 text-[#006CA9] hover:text-[#005a8e]" onClick={() => setFolderSelected(new Set())}>Deselect all</Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openFolderPicker("move", Array.from(folderSelected), selectedFolder?.id ?? null)}><FolderInput size={14} /> Move to folder</Button>
                <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => openDeleteModal(Array.from(folderSelected))}><Trash2 size={14} /> Delete</Button>
              </div>
            </>
          )}
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-y-auto">
          {folderReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Folder size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No reports in this folder</p>
              <p className="text-xs text-muted-foreground mt-1">Drag reports from the main view or create a new one.</p>
            </div>
          ) : (
            <Table className="table-fixed">
              <colgroup>
                <col className="w-10" />
                <col className="w-[220px]" />
                <col className="w-[180px]" />
                <col className="w-[120px]" />
                <col className="w-[200px]" />
                <col className="w-[160px]" />
                <col className="w-[160px]" />
                <col className="w-[140px]" />
                <col className="w-[72px]" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <th className="h-10 px-2 text-left align-middle border-b border-border bg-muted cursor-pointer select-none" onClick={toggleFolderAll}>
                    <div className="flex items-center justify-center h-full">
                      <Checkbox checked={folderAllSelected ? true : folderSomeSelected ? "indeterminate" : false} onCheckedChange={toggleFolderAll} />
                    </div>
                  </th>
                  <TableHead className="truncate">Name</TableHead>
                  <TableHead>Report type</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="truncate">Source</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Last updated at</TableHead>
                  <TableHead>Created by</TableHead>
                  <TableHead showText={false} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {folderReports.map((report) => (
                  <tr key={report.id} onClick={() => openReport(report, "folder")} className={cn("group border-b border-border transition-colors hover:bg-muted/40 cursor-pointer", folderSelected.has(report.id) && "bg-[#00a991]/5")}>
                    <td className="h-14 w-10 p-2 align-middle border-b border-border" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center h-full">
                        <Checkbox checked={folderSelected.has(report.id)} onCheckedChange={() => toggleFolderRow(report.id)} />
                      </div>
                    </td>
                    <TableCell className="truncate max-w-0">{report.name}</TableCell>
                    <td className="h-14 p-2 align-middle border-b border-border">
                      <div className="flex items-center h-full"><ReportTypeBadge reportType={report.reportType} /></div>
                    </td>
                    <TableCell>{report.type}</TableCell>
                    <TableCell className="truncate max-w-0">{report.source}</TableCell>
                    <TableCell>{report.createdAt}</TableCell>
                    <TableCell>{report.lastModified}</TableCell>
                    <TableCell>{report.createdBy}</TableCell>
                    <td className="h-14 w-[72px] p-2 align-middle border-b border-border">
                      <div className="flex items-center justify-center h-full">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                              <EllipsisVertical size={14} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => openFolderPicker("move", [report.id], selectedFolder?.id ?? null)}>Move to folder</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => { const snap = { reports, folders }; setUndoSnapshot(snap); setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, folderId: null } : r)); toast.success(`"${report.name}" removed from folder`, { duration: 5000, action: { label: "Undo", onClick: () => { setReports(snap.reports); setFolders(snap.folders); setUndoSnapshot(null); } } }); }}>Remove from folder</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onSelect={() => openDeleteModal([report.id])}>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <CreateReportModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveReport} />
        <FolderPickerModal
          open={folderPickerOpen}
          onClose={() => setFolderPickerOpen(false)}
          mode={folderPickerMode}
          reportCount={folderPickerReportIds.length}
          folders={folderPickerItems}
          currentFolderId={folderPickerCurrentFolder}
          onConfirm={handleFolderPickerConfirm}
        />
        <DeleteConfirmModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          reportNames={deleteReportIds.map((id) => reports.find((r) => r.id === id)?.name ?? "Report")}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    );
  }

  if (foldersView) {
    return (
      <div className="flex flex-col h-full bg-white overflow-hidden">
        {/* Folders gallery header */}
        <div className="sticky top-0 z-10 bg-white">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFoldersView(false)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Reports
              </button>
              <span className="text-muted-foreground/40">/</span>
              <h1 className="text-[18px] font-bold leading-7 text-foreground">All folders</h1>
            </div>
            <Button className="gap-2">
              <FolderPlus size={16} />
              Add folder
            </Button>
          </div>
          <div className="h-px bg-border" />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="text-sm text-muted-foreground mb-4">{folders.length} folders</p>
          <div className="grid grid-cols-4 gap-4">
            {folders.map((folder) => {
              const count = reports.filter((r) => r.folderId === folder.id).length;
              return (
                <div
                  key={folder.id}
                  onClick={() => openFolder(folder, "gallery")}
                  className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <FolderCardBody folder={folder} reportCount={count} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="sticky top-0 z-10 bg-white">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[18px] font-bold leading-7 text-foreground">Reports</h1>
            <p className="text-sm font-normal text-muted-foreground leading-5">
              Build, run, and schedule reports across your asset data.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ListFilter size={16} />
            </Button>
            <Button variant="outline" size="icon">
              <ArrowDownUp size={16} />
            </Button>
            <Button variant="outline" className="gap-2">
              <FolderPlus size={16} />
              Add folder
            </Button>
            <Button className="gap-2" onClick={() => setModalOpen(true)}>
              Add report
              <CirclePlus size={16} />
            </Button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="border-b border-border px-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
            <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="h-10 px-2 rounded-none bg-transparent shadow-none text-sm font-normal text-foreground border-b-2 border-transparent -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-[#00a991] data-[state=active]:text-[#00a991]"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Folders ── */}
        <div className="px-6 py-6 border-b border-border flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{folders.length} Folders</span>
            <Button variant="link" className="h-auto p-0 text-sm text-[#006CA9] hover:text-[#005a8e]" onClick={() => setFoldersView(true)}>
              View all
            </Button>
          </div>
          <div className="flex gap-4 hover-scrollbar pb-2">
            {folders.map((folder) => (
              <DroppableFolderCard
                key={folder.id}
                folder={folder}
                reportCount={reports.filter((r) => r.folderId === folder.id).length}
                isDragging={!!activeDragId}
                onClick={() => openFolder(folder, "main")}
              />
            ))}
          </div>
        </div>

        {/* ── Reports table ── */}
        <div className="px-6 py-6 flex flex-col gap-3">
          <div className="flex items-center justify-between h-8">
            {selected.size === 0 ? (
              <p className="text-sm font-medium text-foreground">{unfiledReports.length.toLocaleString()} Reports</p>
            ) : (
              <>
                <span className="text-sm text-foreground">{selected.size} selected</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-[#006CA9] hover:text-[#005a8e]"
                    onClick={() => setSelected(new Set(filteredReports.map((r) => r.id)))}
                  >
                    Select all
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-[#006CA9] hover:text-[#005a8e]"
                    onClick={() => setSelected(new Set())}
                  >
                    Deselect all
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openFolderPicker("add", Array.from(selected))}>
                    <FolderPlus size={14} /> Add to folder
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openFolderPicker("move", Array.from(selected))}>
                    <FolderInput size={14} /> Move to folder
                  </Button>
                  <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => openDeleteModal(Array.from(selected))}>
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-10" />
                <col className="w-[260px]" />
                <col className="w-[180px]" />
                <col className="w-[140px]" />
                <col className="w-[220px]" />
                <col className="w-[170px]" />
                <col className="w-[170px]" />
                <col className="w-12" />
              </colgroup>
              <TableHeader>
                <TableRow>
                  {/* Checkbox header — plain th to support controlled state */}
                  <th
                    className="h-10 px-2 text-left align-middle border-b border-border bg-muted cursor-pointer select-none"
                    onClick={toggleAll}
                  >
                    <div className="flex items-center justify-center h-full">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        onCheckedChange={toggleAll}
                      />
                    </div>
                  </th>
                  <TableHead className="truncate">Name</TableHead>
                  <TableHead>Report type</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="truncate">Source</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Last modified</TableHead>
                  <TableHead showText={false} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <DraggableReportRow
                    key={report.id}
                    report={report}
                    isSelected={selected.has(report.id)}
                    selectedCount={selected.size}
                    onToggle={() => toggleRow(report.id)}
                    onClick={() => openReport(report, "main")}
                    onDelete={() => openDeleteModal([report.id])}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </div>{/* end scrollable */}

      <CreateReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveReport}
      />
      <FolderPickerModal
        open={folderPickerOpen}
        onClose={() => setFolderPickerOpen(false)}
        mode={folderPickerMode}
        reportCount={folderPickerReportIds.length}
        folders={folderPickerItems}
        currentFolderId={folderPickerCurrentFolder}
        onConfirm={handleFolderPickerConfirm}
      />
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        reportNames={deleteReportIds.map((id) => reports.find((r) => r.id === id)?.name ?? "Report")}
        onConfirm={handleDeleteConfirm}
      />

      <DragOverlay dropAnimation={null}>
        {activeDragReport && (
          <DragPill
            name={activeDragReport.name}
            count={selected.has(activeDragReport.id) && selected.size > 1 ? selected.size : 1}
          />
        )}
      </DragOverlay>
    </div>
    </DndContext>
  );
}
