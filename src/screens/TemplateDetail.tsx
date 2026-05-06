import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TemplateCard } from "./TemplatesGallery";

const accounts = [
  { id: 1, name: "Meridian Health Systems",   role: "Admin",  active: true  },
  { id: 2, name: "Pacific Distribution Co.",  role: "Admin",  active: false },
  { id: 3, name: "Northgate Manufacturing",   role: "Viewer", active: false },
  { id: 4, name: "Summit Logistics Group",    role: "Admin",  active: false },
];

interface TemplateDetailProps {
  template: TemplateCard;
  onBack: () => void;
  onUseTemplate: () => void;
}

const sidePanelSections = [
  {
    title: "Collections",
    subtitle: "Record management",
    items: ["Assets", "Warehouse", "People", "Location", "Categories"],
    activeItem: "Assets",
  },
  {
    title: "Saved views",
    subtitle: "Filter records from collections",
    items: ["Grouping", "Asset status damaged", "Assigned to John Doe"],
    activeItem: null,
  },
  {
    title: "Forms",
    subtitle: "Update and create records",
    items: ["Maintenance request", "Checkout", "Check in", "Part request"],
    activeItem: null,
  },
  {
    title: "Automations",
    subtitle: "Update and create records",
    items: ["Send email notification", "At a scheduled time", "Update status", "When integration runs"],
    activeItem: null,
  },
];

const assetRows = [
  { id: "000000000003", equipmentId: "3", serialNumber: "", modelNumber: "CAT 390F L", purchaseDate: "03-15-2019", purchasePrice: "$485,000.00", currentLocation: "Denver, CO - Site 7" },
  { id: "000000000002", equipmentId: "2", serialNumber: "", modelNumber: "CAT 320D",   purchaseDate: "03-15-2019", purchasePrice: "$185,000.00", currentLocation: "Denver, CO - Site B" },
  { id: "000000000001", equipmentId: "1", serialNumber: "", modelNumber: "CAT 320D",   purchaseDate: "03-15-2019", purchasePrice: "$85,000.00",  currentLocation: "Site A - Downtown Proj" },
];

export function TemplateDetail({ template: _template, onBack, onUseTemplate }: TemplateDetailProps) {
  return (
    <div className="flex-1 overflow-hidden bg-background" style={{ padding: "16px 48px 48px 48px" }}>
      <div className="bg-card rounded-lg overflow-hidden flex flex-col h-full">
        <div
          className="flex flex-col gap-6 items-center w-full overflow-auto"
          style={{ paddingTop: 24, paddingBottom: 96, paddingLeft: 112, paddingRight: 112 }}
        >
          {/* Header */}
          <div className="flex gap-12 items-center w-full" style={{ maxWidth: 1200 }}>
            {/* Left: back + title */}
            <div className="flex flex-1 flex-row items-center self-stretch">
              <div className="flex flex-1 flex-col gap-2 items-start min-w-0">
                {/* Back button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit gap-2 text-xs font-normal h-8"
                  onClick={onBack}
                >
                  <ArrowLeft size={14} />
                  Back
                </Button>

                {/* Title + badge */}
                <div className="flex gap-2 items-center w-full">
                  <h1
                    className="text-[30px] font-bold text-foreground whitespace-nowrap flex-shrink-0"
                    style={{ lineHeight: "36px" }}
                  >
                    IT Asset Management
                  </h1>
                  <div className="flex flex-wrap gap-2 items-center flex-shrink-0">
                    <span
                      className="flex items-center justify-center px-2 h-8 text-sm font-medium text-foreground rounded-md whitespace-nowrap"
                      style={{ background: "#e7f2f7" }}
                    >
                      IT
                    </span>
                    <span
                      className="flex items-center justify-center px-2 h-8 text-sm font-medium text-foreground rounded-md whitespace-nowrap"
                      style={{ background: "#e7f2f7" }}
                    >
                      Technology
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-medium text-muted-foreground leading-5">
                  Track hardware, software licenses, and devices. Automate assignments, maintenance alerts, and full lifecycle reporting.
                </p>
              </div>
            </div>

            {/* Right: account switcher + use template */}
            <div className="flex gap-2 items-center flex-shrink-0">
              <TooltipProvider delayDuration={300}>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <span className="whitespace-nowrap">Meridian Health Systems</span>
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Switch accounts</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-medium">Your accounts</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {accounts.map((account) => (
                      <DropdownMenuItem
                        key={account.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span className="flex-1 text-sm text-foreground">{account.name}</span>
                        {account.active && (
                          <Check size={14} className="flex-shrink-0 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipProvider>

              <Button
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onUseTemplate}
              >
                Use template
              </Button>
            </div>
          </div>

          {/* Main content: side panel + table — wrapped in Card */}
          <Card
            className="flex items-start w-full overflow-hidden"
            style={{ maxWidth: 1200, height: 920 }}
          >
            {/* Side panel */}
            <div
              className="flex flex-col gap-2 items-start overflow-y-auto overflow-x-hidden p-2 self-stretch flex-shrink-0"
              style={{ width: 300, background: "#f4f2f6" }}
            >
              {sidePanelSections.map((section) => (
                <Card
                  key={section.title}
                  className="flex flex-col items-start w-full overflow-hidden flex-shrink-0"
                >
                  {/* Section header */}
                  <div className="flex flex-col items-center justify-center w-full px-4 py-3 flex-shrink-0 border-b">
                    <p className="text-sm font-bold text-foreground w-full leading-5">{section.title}</p>
                    <p className="text-xs text-muted-foreground w-full leading-4">{section.subtitle}</p>
                  </div>
                  {/* Items */}
                  <div className="flex flex-col items-start w-full">
                    {section.items.map((item) => {
                      const isActive = item === section.activeItem;
                      return (
                        <div
                          key={item}
                          className="flex items-center overflow-hidden w-full px-4 flex-shrink-0 transition-colors duration-100 hover:bg-muted cursor-pointer border-b last:border-b-0"
                          style={{
                            height: 40,
                            background: isActive ? "hsl(var(--muted))" : undefined,
                          }}
                        >
                          <span className="flex-1 text-xs text-foreground leading-4 min-w-0">{item}</span>
                          {isActive && (
                            <Check size={16} className="flex-shrink-0 text-foreground" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>

            {/* Right: table panel */}
            <div className="flex flex-1 flex-col items-start self-stretch min-w-0">
              {/* Table header */}
              <div className="flex flex-col gap-1 items-start justify-center w-full px-6 py-6 flex-shrink-0 border-b">
                <h2 className="text-[18px] font-bold text-foreground whitespace-nowrap leading-7">
                  Assets collection
                </h2>
                <p className="text-xs text-muted-foreground leading-4">
                  A collection is a fundamental organizational structure used to group and manage related data within the asset management platform.
                </p>
              </div>

              {/* Table */}
              <div className="overflow-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted">
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">ID</TableHead>
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">Equipment ID</TableHead>
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">Serial Number</TableHead>
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">Model Number</TableHead>
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">Purchase Date</TableHead>
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">Purchase Price</TableHead>
                      <TableHead className="text-xs font-bold text-foreground h-10 px-4">Current Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/40 cursor-pointer">
                        <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.id}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.equipmentId}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.serialNumber}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.modelNumber}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.purchaseDate}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.purchasePrice}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{row.currentLocation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
