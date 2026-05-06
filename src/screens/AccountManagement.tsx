import { useState } from "react";
import { FileText, Wrench, DollarSign, ArrowLeftRight, Plus, EllipsisVertical, GripVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ImportSpreadsheetModal } from "@/components/ImportSpreadsheetModal";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Asset Panda PRO logo — SVG parts served from /public/logo/
function AssetPandaProLogo() {
  return (
    <div className="relative flex-shrink-0" style={{ width: 73, height: 32 }}>
      <div className="absolute" style={{ top: "5.39%", right: "68.08%", bottom: "14.85%", left: 0 }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v7.svg" />
      </div>
      <div className="absolute" style={{ top: "22.37%", right: "69.41%", bottom: "16.37%", left: "2.91%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v8.svg" />
      </div>
      <div className="absolute" style={{ top: "23.02%", right: "69.8%", bottom: "20.34%", left: "11.86%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v9.svg" />
      </div>
      <div className="absolute" style={{ top: "6.86%", right: "69.86%", bottom: "74.15%", left: "18.74%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v10.svg" />
      </div>
      <div className="absolute" style={{ top: "23.32%", right: "91.93%", bottom: "62.72%", left: "0.34%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v11.svg" />
      </div>
      <div className="absolute" style={{ top: "36.27%", right: "84.86%", bottom: "52.45%", left: "12.51%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v12.svg" />
      </div>
      <div className="absolute" style={{ top: "43.72%", right: "94.28%", bottom: "42.99%", left: "3.87%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v13.svg" />
      </div>
      <div className="absolute" style={{ top: "32.74%", right: "78.86%", bottom: "45.62%", left: "11.78%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v14.svg" />
      </div>
      <div className="absolute" style={{ top: "40.52%", right: "89.45%", bottom: "40.86%", left: "3.4%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/vg.svg" />
      </div>
      <div className="absolute" style={{ top: "35.5%", right: "86.76%", bottom: "16.97%", left: "3.03%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v15.svg" />
      </div>
      <div className="absolute" style={{ top: "62.19%", right: "88.89%", bottom: "33.86%", left: "7.37%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v16.svg" />
      </div>
      <div className="absolute" style={{ top: "46.54%", right: "90.09%", bottom: "48.74%", left: "7.33%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/lpupil.svg" />
      </div>
      <div className="absolute" style={{ top: "42.35%", right: "80.03%", bottom: "53.18%", left: "17.44%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/rpupil.svg" />
      </div>
      <div className="absolute" style={{ top: "36.23%", right: "2.59%", bottom: "14.01%", left: "34.59%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/ap-group1.svg" />
      </div>
      <div className="absolute" style={{ top: 0, right: "8.03%", bottom: "64%", left: "35.54%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/ap-group2.svg" />
      </div>
      <div className="absolute" style={{ top: "43.03%", right: "-0.35%", bottom: "50.33%", left: "97.4%" }}>
        <img alt="" className="absolute block max-w-none size-full" src="/logo/v17.svg" />
      </div>
      <p
        className="absolute font-semibold whitespace-nowrap"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "5.298px",
          color: "#55376d",
          top: "80.33%",
          right: "0.8%",
          bottom: "0.92%",
          left: "81.39%",
          lineHeight: "normal",
        }}
      >
        PRO
      </p>
    </div>
  );
}

interface ModuleData {
  id: string;
  name: string;
  subName: string;
  iconBg: string;
  Icon: LucideIcon;
  counts: number[];
}

interface GroupData {
  id: string;
  name: string;
  modules: ModuleData[];
}

interface AccountManagementProps {
  onViewTemplates: () => void;
}

const TABLE_COLS = ["Collections", "Saved views", "Users", "Forms", "Automations", "Integrations", "Help desk"];

const initialGroups: GroupData[] = [
  {
    id: "meridian",
    name: "Meridian Health Systems",
    modules: [
      { id: "it-equipment",    name: "IT Equipment",      subName: "Asset tracking",    iconBg: "#d9e9f2", Icon: FileText,       counts: [34, 12, 18, 9,  4, 3, 72] },
      { id: "office-furniture",name: "Office Furniture",  subName: "Asset tracking",    iconBg: "#d9e9f2", Icon: FileText,       counts: [18, 6,  14, 5,  2, 1, 31] },
      { id: "fleet-vehicles",  name: "Fleet Vehicles",    subName: "Asset tracking",    iconBg: "#d9e9f2", Icon: FileText,       counts: [9,  4,  8,  7,  3, 2, 14] },
      { id: "medical-devices", name: "Medical Devices",   subName: "Asset tracking",    iconBg: "#d9e9f2", Icon: FileText,       counts: [52, 17, 24, 15, 6, 4, 88] },
      { id: "facilities",      name: "Facilities",        subName: "CMMS",              iconBg: "#f4f2f6", Icon: Wrench,         counts: [7,  5,  11, 4,  2, 1, 19] },
      { id: "approved-vendors",name: "Approved Vendors",  subName: "Vendor management", iconBg: "#d9f2ef", Icon: DollarSign,     counts: [23, 8,  6,  11, 3, 2, 0]  },
      { id: "maintenance",     name: "Maintenance",       subName: "Requests",          iconBg: "#fff7ed", Icon: ArrowLeftRight, counts: [15, 7,  5,  18, 4, 2, 0]  },
    ],
  },
  {
    id: "pacific",
    name: "Pacific Distribution Co.",
    modules: [
      { id: "warehouse-equipment", name: "Warehouse Equipment", subName: "Asset tracking", iconBg: "#d9e9f2", Icon: FileText, counts: [41, 9,  22, 13, 5, 3, 60] },
      { id: "forklifts",           name: "Forklifts & Loaders", subName: "Asset tracking", iconBg: "#d9e9f2", Icon: FileText, counts: [12, 4,  8,  6,  2, 1, 27] },
      { id: "dock-equipment",      name: "Dock Equipment",      subName: "CMMS",           iconBg: "#f4f2f6", Icon: Wrench,  counts: [6,  3,  9,  3,  1, 0, 11] },
    ],
  },
];

// ── Drag overlay styles ──────────────────────────────────────────────────────

const overlayRowStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 8,
  boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.10)",
  transform: "rotate(1.5deg) scale(1.02)",
  opacity: 0.97,
  display: "flex",
  alignItems: "center",
  minHeight: 56,
};

const overlayCardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 8,
  boxShadow: "0 24px 48px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.10)",
  transform: "rotate(0.75deg) scale(1.01)",
  opacity: 0.97,
  overflow: "hidden",
};

function ModuleRowOverlay({ mod, helpDeskEnabled }: { mod: ModuleData; helpDeskEnabled: boolean }) {
  return (
    <div style={overlayRowStyle}>
      <div className="w-[32px] flex items-center justify-center pl-1 flex-shrink-0">
        <GripVertical size={14} className="text-muted-foreground" />
      </div>
      <div className="w-[52px] p-2 flex-shrink-0">
        <div className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: mod.iconBg }}>
          <mod.Icon size={16} className="text-foreground" />
        </div>
      </div>
      <div className="flex flex-col flex-1 py-2 min-w-0">
        <span className="font-semibold text-base leading-6 text-primary">{mod.name}</span>
        <span className="text-sm font-medium text-muted-foreground leading-5">{mod.subName}</span>
      </div>
      {mod.counts.slice(0, -1).map((count, i) => (
        <div key={i} className="w-[88px] text-center text-xs font-medium text-primary flex-shrink-0">{count}</div>
      ))}
      <div className="w-[88px] flex flex-col items-center justify-center gap-0.5 flex-shrink-0">
        <span className="text-xs font-medium text-[#1a7bb2]">{helpDeskEnabled ? "Disable" : "Enable"}</span>
        {helpDeskEnabled && <span className="text-xs font-medium text-[#1a7bb2]">Manage</span>}
      </div>
      <div className="w-[52px] flex-shrink-0" />
    </div>
  );
}

function AccountGroupOverlay({ group }: { group: GroupData }) {
  return (
    <div style={overlayCardStyle}>
      <div className="flex items-center border-b px-3" style={{ height: 64 }}>
        <GripVertical size={14} className="text-muted-foreground mr-2 flex-shrink-0" />
        <p className="flex-1 font-semibold text-lg leading-7 text-foreground">{group.name}</p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="pointer-events-none">
            Add module <Plus size={14} />
          </Button>
        </div>
      </div>
      <div className="px-4 py-3 text-xs text-muted-foreground">
        {group.modules.length} modules
      </div>
    </div>
  );
}

// ── Sortable module row ──────────────────────────────────────────────────────

function SortableModuleRow({ mod, isLast, helpDeskEnabled, onToggleHelpDesk }: { mod: ModuleData; isLast: boolean; helpDeskEnabled: boolean; onToggleHelpDesk: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: mod.id });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: "relative",
        zIndex: isDragging ? 1 : undefined,
      }}
      className="hover:bg-muted/30 transition-colors duration-100 group"
    >
      {/* Grip handle */}
      <TableCell className="w-[32px] p-0 pl-1">
        <button
          {...attributes}
          {...listeners}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing flex items-center justify-center rounded p-1 hover:bg-muted"
        >
          <GripVertical size={14} className="text-muted-foreground" />
        </button>
      </TableCell>

      {/* Icon cell */}
      <TableCell className="w-[52px] p-2">
        <div
          className="flex items-center justify-center rounded flex-shrink-0"
          style={{ width: 32, height: 32, background: mod.iconBg }}
        >
          <mod.Icon size={16} className="text-foreground" />
        </div>
      </TableCell>

      {/* Module name cell */}
      <TableCell className="py-2 px-0">
        <div className="flex flex-col">
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-base leading-6 text-[#1a7bb2] hover:text-[#1264a3] justify-start w-fit"
          >
            {mod.name}
          </Button>
          <span className="text-sm font-medium text-muted-foreground leading-5">{mod.subName}</span>
        </div>
      </TableCell>

      {/* Count cells */}
      {mod.counts.map((count, i) => (
        <TableCell key={i} className="relative w-[88px] p-0">
          {i === 0 && (
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
              style={{ width: 1, height: "50%", background: "#e5e5e5" }}
            />
          )}
          {i === TABLE_COLS.length - 1 ? (
            <div
              className="w-full flex flex-col items-center justify-center gap-0.5"
              style={{ minHeight: 56, height: "100%" }}
            >
              <Button
                variant="link"
                className="p-0 h-auto text-xs font-medium text-[#1a7bb2] hover:text-[#1264a3]"
                onClick={(e) => { e.stopPropagation(); onToggleHelpDesk(); }}
              >
                {helpDeskEnabled ? "Disable" : "Enable"}
              </Button>
              {helpDeskEnabled && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs font-medium text-[#1a7bb2] hover:text-[#1264a3]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Manage
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="ghost"
              className="w-full rounded-none text-xs font-medium text-[#1a7bb2] hover:bg-muted hover:text-[#1264a3] hover:underline"
              style={{ minHeight: 56, height: "100%" }}
              title={`${count} ${TABLE_COLS[i]}`}
            >
              {count}
            </Button>
          )}
          {i < TABLE_COLS.length - 1 && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
              style={{ width: 1, height: "50%", background: "#e5e5e5" }}
            />
          )}
        </TableCell>
      ))}

      {/* Actions cell */}
      <TableCell className="w-[52px] p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical size={16} className="text-muted-foreground" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

// ── Account group with sortable modules ─────────────────────────────────────

interface AccountGroupProps {
  group: GroupData;
  dragHandleListeners: ReturnType<typeof useSortable>["listeners"];
  dragHandleAttributes: ReturnType<typeof useSortable>["attributes"];
  onModulesReorder: (groupId: string, newModules: ModuleData[]) => void;
  hasModuleChanges: boolean;
  onResetModules: (groupId: string) => void;
  helpDeskEnabled: Record<string, boolean>;
  onToggleHelpDesk: (moduleId: string) => void;
}

function AccountGroup({ group, dragHandleListeners, dragHandleAttributes, onModulesReorder, hasModuleChanges, onResetModules, helpDeskEnabled, onToggleHelpDesk }: AccountGroupProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const activeModule = group.modules.find((m) => m.id === activeModuleId) ?? null;

  function handleModuleDragStart(event: DragStartEvent) {
    setActiveModuleId(String(event.active.id));
  }

  function handleModuleDragEnd(event: DragEndEvent) {
    setActiveModuleId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = group.modules.findIndex((m) => m.id === active.id);
      const newIndex = group.modules.findIndex((m) => m.id === over.id);
      onModulesReorder(group.id, arrayMove(group.modules, oldIndex, newIndex));
    }
  }

  return (
    <Card className="w-full overflow-hidden border-0 group">
      {/* Account header row */}
      <div className="flex items-center border-b" style={{ height: 64, paddingLeft: 4, paddingRight: 24 }}>
        <button
          {...dragHandleListeners}
          {...dragHandleAttributes}
          className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing flex items-center justify-center rounded p-1 hover:bg-muted mr-1 flex-shrink-0"
        >
          <GripVertical size={14} className="text-muted-foreground" />
        </button>
        <p className="flex-1 font-semibold text-lg leading-7 text-foreground">{group.name}</p>
        <div className="flex items-center gap-2">
          {hasModuleChanges && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[#1a7bb2] hover:text-[#1264a3] hover:bg-[#e7f2f7]"
              onClick={() => onResetModules(group.id)}
            >
              Reset
            </Button>
          )}
          <Button variant="outline">
            Add module
            <Plus size={16} />
          </Button>
          <Button variant="ghost" size="icon">
            <EllipsisVertical size={16} />
          </Button>
        </div>
      </div>

      {/* Table */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleModuleDragStart} onDragEnd={handleModuleDragEnd}>
        <SortableContext items={group.modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent cursor-default">
                {/* Grip col */}
                <TableHead className="w-[32px] p-0" />
                {/* Icon col + Modules label merged */}
                <TableHead colSpan={2} className="relative py-3 px-2 text-xs font-medium text-muted-foreground h-12">
                  Modules
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    style={{ width: 1, height: "50%", background: "#e5e5e5" }}
                  />
                </TableHead>
                {/* Count column headers */}
                {TABLE_COLS.map((col, i) => (
                  <TableHead
                    key={col}
                    className="relative w-[88px] text-center px-1 py-3 text-xs font-medium text-muted-foreground h-12 leading-4 whitespace-nowrap"
                  >
                    {col}
                    {i < TABLE_COLS.length - 1 && (
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        style={{ width: 1, height: "50%", background: "#e5e5e5" }}
                      />
                    )}
                  </TableHead>
                ))}
                {/* Actions col */}
                <TableHead className="w-[52px] p-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.modules.map((mod, mi) => (
                <SortableModuleRow
                  key={mod.id}
                  mod={mod}
                  isLast={mi === group.modules.length - 1}
                  helpDeskEnabled={helpDeskEnabled[mod.id] ?? false}
                  onToggleHelpDesk={() => onToggleHelpDesk(mod.id)}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
        <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeModule && <ModuleRowOverlay mod={activeModule} helpDeskEnabled={helpDeskEnabled[activeModule.id] ?? false} />}
        </DragOverlay>
      </DndContext>
    </Card>
  );
}

// ── Sortable account group wrapper ───────────────────────────────────────────

function SortableAccountGroup({
  group,
  onModulesReorder,
  hasModuleChanges,
  onResetModules,
  helpDeskEnabled,
  onToggleHelpDesk,
}: {
  group: GroupData;
  onModulesReorder: (groupId: string, newModules: ModuleData[]) => void;
  hasModuleChanges: boolean;
  onResetModules: (groupId: string) => void;
  helpDeskEnabled: Record<string, boolean>;
  onToggleHelpDesk: (moduleId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: group.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <AccountGroup
        group={group}
        dragHandleListeners={listeners}
        dragHandleAttributes={attributes}
        onModulesReorder={onModulesReorder}
        hasModuleChanges={hasModuleChanges}
        onResetModules={onResetModules}
        helpDeskEnabled={helpDeskEnabled}
        onToggleHelpDesk={onToggleHelpDesk}
      />
    </div>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export function AccountManagement({ onViewTemplates }: AccountManagementProps) {
  const [importOpen, setImportOpen] = useState(false);
  const [groups, setGroups] = useState<GroupData[]>(initialGroups);
  const [helpDeskEnabled, setHelpDeskEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialGroups.flatMap((g) => g.modules.map((m) => [m.id, m.counts[6] > 0])))
  );

  function handleToggleHelpDesk(moduleId: string) {
    setHelpDeskEnabled((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  }
  const originalGroupIds = useState<string[]>(() => initialGroups.map((g) => g.id))[0];
  const originalModuleIds = useState<Record<string, string[]>>(
    () => Object.fromEntries(initialGroups.map((g) => [g.id, g.modules.map((m) => m.id)]))
  )[0];

  const accountsReordered = groups.some((g, i) => g.id !== originalGroupIds[i]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? null;

  const sensors = useSensors(useSensor(PointerSensor));

  function handleAccountDragStart(event: DragStartEvent) {
    setActiveGroupId(String(event.active.id));
  }

  function handleAccountDragEnd(event: DragEndEvent) {
    setActiveGroupId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      setGroups(arrayMove(groups, oldIndex, newIndex));
    }
  }

  function handleResetAccounts() {
    setGroups((prev) =>
      [...prev].sort((a, b) => originalGroupIds.indexOf(a.id) - originalGroupIds.indexOf(b.id))
    );
  }

  function handleModulesReorder(groupId: string, newModules: ModuleData[]) {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, modules: newModules } : g))
    );
  }

  function handleResetModules(groupId: string) {
    const originalIds = originalModuleIds[groupId];
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const sorted = [...g.modules].sort(
          (a, b) => originalIds.indexOf(a.id) - originalIds.indexOf(b.id)
        );
        return { ...g, modules: sorted };
      })
    );
  }

  function groupHasModuleChanges(group: GroupData) {
    const original = originalModuleIds[group.id];
    return group.modules.some((m, i) => m.id !== original[i]);
  }

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div
        className="mx-auto w-full flex flex-col gap-4"
        style={{ maxWidth: 1440, padding: "16px 24px 24px 24px" }}
      >
        {/* Account management header card */}
        <Card className="border-0">
          <CardContent className="p-6 flex flex-col gap-4">
            {/* Org name + logo */}
            <div className="flex items-center gap-4 w-full">
              <AssetPandaProLogo />
              <p className="flex-1 font-semibold text-lg leading-normal text-foreground min-w-0">
                Meridian Health Systems
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                {accountsReordered && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#1a7bb2] hover:text-[#1264a3] hover:bg-[#e7f2f7]"
                    onClick={handleResetAccounts}
                  >
                    Reset
                  </Button>
                )}
                <Button>
                  Add account
                  <Plus size={16} />
                </Button>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical size={16} />
                </Button>
              </div>
            </div>

            {/* 4 action cards */}
            <div className="flex w-full" style={{ gap: 10 }}>
              {/* Spreadsheet */}
              <Card className="flex-1 transition-shadow duration-150 hover:shadow-md">
                <CardContent className="px-6 py-4 flex flex-col gap-4 items-start">
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm font-bold leading-5 text-foreground">Spreadsheet</p>
                    <p className="text-xs font-normal leading-4 text-muted-foreground">
                      Use a CSV file to import your data and create an account.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setImportOpen(true)}>Import</Button>
                </CardContent>
              </Card>

              {/* Templates */}
              <Card className="flex-1 transition-shadow duration-150 hover:shadow-md">
                <CardContent className="px-6 py-4 flex flex-col gap-4 items-start">
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm font-bold leading-5 text-foreground">Templates</p>
                    <p className="text-xs font-normal leading-4 text-muted-foreground">
                      Pick from a variety of industry specific templates to create an account.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={onViewTemplates}>View</Button>
                </CardContent>
              </Card>

              {/* UrsaAI account builder */}
              <Card className="flex-1 transition-shadow duration-150 hover:shadow-md">
                <CardContent className="px-6 py-4 flex flex-col gap-4 items-start">
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm font-bold leading-5 text-foreground">
                      Ursa<span className="text-[9px] font-bold align-super">AI</span> account builder
                    </p>
                    <p className="text-xs font-normal leading-4 text-muted-foreground">
                      Use AI to automatically build an account based on your business.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">Use</Button>
                </CardContent>
              </Card>

              {/* Migrate from 1.0 */}
              <Card className="flex-1 transition-shadow duration-150 hover:shadow-md">
                <CardContent className="px-6 py-4 flex flex-col gap-4 items-start">
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm font-bold leading-5 text-foreground">Migrate from 1.0</p>
                    <p className="text-xs font-normal leading-4 text-muted-foreground">
                      If you have an account with us you can test out migration.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">Migrate</Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Account groups — sortable */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleAccountDragStart} onDragEnd={handleAccountDragEnd}>
          <SortableContext items={groups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4 w-full">
              {groups.map((group) => (
                <SortableAccountGroup
                  key={group.id}
                  group={group}
                  onModulesReorder={handleModulesReorder}
                  hasModuleChanges={groupHasModuleChanges(group)}
                  onResetModules={handleResetModules}
                  helpDeskEnabled={helpDeskEnabled}
                  onToggleHelpDesk={handleToggleHelpDesk}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
            {activeGroup && <AccountGroupOverlay group={activeGroup} />}
          </DragOverlay>
        </DndContext>
      </div>

      <ImportSpreadsheetModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
