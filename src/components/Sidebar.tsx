import { useState, useRef } from "react";
import {
  Home, Blocks, Wrench, FileBarChart2, Sparkles, Settings, Bell,
  Calendar, LayoutDashboard, ClipboardCheck, QrCode,
  Activity, Upload, Bookmark, ClipboardList, User, Settings2, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROFILE = { name: "Jurgen Serbo", initials: "JS" };

// ── Shared styles ─────────────────────────────────────────────────────────────

const navBtnCls =
  "flex items-center justify-center rounded-lg w-9 h-9 transition-all duration-150 cursor-pointer hover:bg-white/15 active:bg-white/25 text-white/70 hover:text-white outline-none";

const menuCls =
  "absolute left-[calc(100%+8px)] bg-white border border-border rounded-lg shadow-md py-1 z-50 min-w-[240px] animate-in fade-in-0 slide-in-from-left-2 duration-150";

const menuItemCls =
  "flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted cursor-pointer rounded-sm transition-colors";

const menuLabelCls =
  "px-3 py-1.5 text-xs font-semibold text-muted-foreground";

// ── Menu helpers ──────────────────────────────────────────────────────────────

function MenuLabel({ children }: { children: React.ReactNode }) {
  return <div className={menuLabelCls}>{children}</div>;
}

function MenuItem({ icon: Icon, children, className }: {
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(menuItemCls, className)}>
      {Icon && <Icon size={14} className="text-muted-foreground flex-shrink-0" />}
      {children}
    </div>
  );
}

function MenuSeparator() {
  return <div className="my-1 h-px bg-border" />;
}

// ── Submenu item with nested panel ────────────────────────────────────────────

function SubMenuItem({ icon: Icon, label, children }: {
  icon?: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  return (
    <div
      className="relative"
      onMouseEnter={() => { clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => setOpen(false), 100); }}
    >
      <div className={cn(menuItemCls, "justify-between")}>
        <span className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-muted-foreground flex-shrink-0" />}
          {label}
        </span>
        <ChevronRight size={14} className="text-muted-foreground" />
      </div>
      {open && (
        <div className="absolute left-full top-0 ml-1 bg-white border border-border rounded-lg shadow-md py-1 z-50 min-w-[200px] animate-in fade-in-0 slide-in-from-left-2 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Nav item with hover menu ──────────────────────────────────────────────────

function NavItem({ icon: Icon, active = false, onClick, title, menu, menuAlign = "top" }: {
  icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
  title: string;
  menu?: React.ReactNode;
  menuAlign?: "top" | "bottom";
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  return (
    <div
      className="relative"
      onMouseEnter={() => { clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => setOpen(false), 100); }}
    >
      <button
        title={title}
        onClick={onClick}
        className={cn(
          "flex items-center justify-center rounded-lg w-9 h-9 transition-all duration-150 cursor-pointer outline-none",
          active
            ? "bg-[#00a991] text-white"
            : open
              ? "bg-white/15 text-white"
              : "hover:bg-white/15 active:bg-white/25 text-white/70 hover:text-white"
        )}
      >
        <Icon size={20} />
      </button>

      {menu && open && (
        <div
          className={cn(menuCls, menuAlign === "bottom" ? "bottom-0 top-auto" : "top-0")}
          style={{ width: 240 }}
        >
          {menu}
        </div>
      )}
    </div>
  );
}

// ── Profile item ──────────────────────────────────────────────────────────────

function ProfileItem({ menu }: { menu: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  return (
    <div
      className="relative"
      onMouseEnter={() => { clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => setOpen(false), 100); }}
    >
      <button
        title={PROFILE.name}
        className="flex items-center justify-center rounded-lg w-9 h-9 cursor-pointer outline-none hover:ring-2 hover:ring-white/40 transition-all duration-150 bg-[#55376D] flex-shrink-0"
      >
        <span className="text-xs font-semibold text-white leading-none">{PROFILE.initials}</span>
      </button>

      {open && (
        <div className={cn(menuCls, "bottom-0 top-auto")} style={{ width: 240 }}>
          {menu}
        </div>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface SidebarProps {
  activeScreen?: string;
  onNavigate?: (screen: string) => void;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export function Sidebar({ activeScreen, onNavigate }: SidebarProps) {
  return (
    <aside
      data-name="Global_Navigation"
      className="flex flex-col items-center justify-between py-4 flex-shrink-0 overflow-visible"
      style={{
        width: 56,
        minHeight: "100vh",
        position: "relative",
        zIndex: 30,
        backgroundImage:
          "linear-gradient(179.9999999999999deg, rgba(0,0,0,0) 46.635%, rgba(0,0,0,0.4) 100%), linear-gradient(90deg, rgb(64,30,90) 0%, rgb(64,30,90) 100%)",
      }}
    >
      {/* Top nav */}
      <div className="flex flex-col items-start gap-3">
        <button title="Home" className={navBtnCls}><Home size={20} /></button>

        <NavItem icon={Blocks} title="Modules" menu={
          <>
            <MenuLabel>Recent</MenuLabel>
            <MenuItem icon={Blocks}>Assets</MenuItem>
            <MenuItem icon={ClipboardList}>Check-in Form</MenuItem>
            <MenuItem icon={Bookmark}>Maintenance Requests</MenuItem>
            <MenuItem icon={Blocks}>Employees</MenuItem>
            <MenuItem icon={ClipboardList}>Vendor Onboarding</MenuItem>
            <MenuItem icon={Blocks}>IT Equipment</MenuItem>
          </>
        } />

        <NavItem icon={Wrench} title="Tools" menu={
          <>
            <MenuLabel>Tools</MenuLabel>
            <MenuItem icon={Calendar}>Calendar</MenuItem>
            <MenuItem icon={LayoutDashboard}>Dashboard</MenuItem>
            <MenuItem icon={ClipboardCheck}>Audits</MenuItem>
            <MenuItem icon={QrCode}>Barcode designer</MenuItem>
          </>
        } />

        <NavItem
          icon={FileBarChart2}
          title="Reports"
          active={activeScreen === "reports"}
          onClick={() => onNavigate?.("reports")}
          menu={
            <>
              <MenuLabel>Reporting</MenuLabel>
              <div onClick={() => onNavigate?.("reports")}>
                <MenuItem icon={FileBarChart2}>Reports</MenuItem>
              </div>
              <SubMenuItem icon={Activity} label="Activity stream">
                <MenuItem>Configuration logs</MenuItem>
                <MenuItem>Import logs</MenuItem>
                <MenuItem>Record logs</MenuItem>
                <MenuItem>Form logs</MenuItem>
                <MenuItem>Agent logs</MenuItem>
                <MenuItem>Offline sync logs</MenuItem>
              </SubMenuItem>
              <SubMenuItem icon={Upload} label="Imports">
                <MenuItem>History</MenuItem>
                <MenuItem>Templates</MenuItem>
              </SubMenuItem>
            </>
          }
        />

        <NavItem icon={Sparkles} title="AI" />
      </div>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex flex-col items-start gap-3">
          <button title="Settings" className={navBtnCls}><Settings size={20} /></button>
          <button title="Notifications" className={`relative ${navBtnCls}`}>
            <Bell size={20} />
            <span className="absolute rounded-full bg-red-500" style={{ width: 8, height: 8, top: 6, right: 6 }} />
          </button>
        </div>

        <ProfileItem menu={
          <>
            <div className="px-3 py-2 flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">{PROFILE.name}</p>
              <p className="text-xs text-muted-foreground">jurgen@assetpanda.com</p>
            </div>
            <MenuSeparator />
            <MenuItem icon={User}>Manage profile</MenuItem>
            <MenuItem icon={Settings2}>App preferences</MenuItem>
            <MenuSeparator />
            <MenuItem icon={LogOut} className="text-destructive [&>svg]:text-destructive">Sign Out</MenuItem>
          </>
        } />
      </div>
    </aside>
  );
}
