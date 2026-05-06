import { Search, ChevronDown } from "lucide-react";

export interface Crumb {
  label: string;
  onClick?: () => void;
}

export function TopNav({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <header className="flex items-center justify-between px-4 flex-shrink-0 w-full" style={{ height: 56 }}>
      {/* Breadcrumb pill */}
      <div className="flex gap-2 items-center flex-shrink-0">
        <div
          className="flex h-[33px] items-center px-3 rounded-lg flex-shrink-0"
          style={{
            background: "white",
            boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.08), 0px 2px 2px 0px rgba(80,68,225,0.06)",
          }}
        >
          <div className="flex items-center gap-1">
            {crumbs.map((crumb, i) => {
              const isActive = i === crumbs.length - 1;
              return (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-xs text-[#aaa] select-none">/</span>}
                  {isActive ? (
                    <span className="text-xs font-medium leading-normal whitespace-nowrap" style={{ color: "#007666" }}>
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      onClick={crumb.onClick}
                      className="text-xs font-medium leading-normal whitespace-nowrap text-foreground hover:text-[#007666] transition-colors"
                    >
                      {crumb.label}
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: search bar */}
      <div className="flex items-start justify-end flex-shrink-0" style={{ width: 434 }}>
        <div className="flex items-start justify-end w-full">
          <div
            className="flex gap-2 items-center px-2 self-stretch flex-shrink-0 transition-colors duration-150 hover:bg-[#f0f0f0] cursor-pointer"
            style={{
              width: 146,
              background: "#fafafa",
              border: "1px solid #e5e5e5",
              borderRight: "none",
              borderRadius: "8px 0 0 8px",
            }}
          >
            <span className="flex-1 text-xs font-medium text-[#1a1a1a] overflow-hidden text-ellipsis whitespace-nowrap">
              Current page
            </span>
            <ChevronDown size={16} className="flex-shrink-0 text-[#1a1a1a]" />
          </div>
          <div
            className="flex flex-1 gap-0 items-center min-w-0 px-2 transition-shadow duration-150 hover:shadow-sm cursor-text"
            style={{
              height: 40,
              background: "#fafafa",
              border: "1px solid #e5e5e5",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div className="flex flex-1 gap-2 items-center min-w-0">
              <Search size={16} className="flex-shrink-0 text-[#737373]" />
              <span className="flex-1 font-normal text-[14px] text-[#999] truncate">Search...</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
