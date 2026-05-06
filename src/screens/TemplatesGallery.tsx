import { Search, ArrowLeft } from "lucide-react";
import { Button, Input } from "@marlindtako/pioneer-design-system";

// Fresh asset URLs from Figma (valid ~7 days from session)
const imgIT       = "https://www.figma.com/api/mcp/asset/f46941f3-acc6-444f-bdf4-512f82ed3b86";
const imgHealthcare = "https://www.figma.com/api/mcp/asset/a848ddc2-accf-46a8-b6c0-6dc35f0d0cff";
const imgEducation  = "https://www.figma.com/api/mcp/asset/f08f1039-3c1c-496b-899f-5eceec22d721";
const imgManufacturing = "https://www.figma.com/api/mcp/asset/20a93437-01a7-4c51-9d7e-92fab33f907a";
const imgIT2        = "https://www.figma.com/api/mcp/asset/27df1eaf-b354-412d-bc91-d068f86ac4e2";
const imgHealthcare2 = "https://www.figma.com/api/mcp/asset/26ca166c-f9f8-48a8-8965-4a75e2c71855";
const imgEducation2  = "https://www.figma.com/api/mcp/asset/72b3c6a2-4037-4b11-a127-b30a41d1c2de"; // reuses row-2 assets
const imgManufacturing2 = "https://www.figma.com/api/mcp/asset/20a93437-01a7-4c51-9d7e-92fab33f907a";

export interface TemplateCard {
  id: string;
  title: string;
  description: string;
  image: string;
  cardBg: string;
  badges: Array<{ label: string; bg: string }>;
}

const templates: TemplateCard[] = [
  {
    id: "it-asset",
    title: "IT Asset Management",
    description: "Track hardware, software licenses, and devices. Automate assignments, maintenance alerts, and full lifecycle reporting.",
    image: imgIT,
    cardBg: "#f4f2f6",
    badges: [
      { label: "IT", bg: "#e7f2f7" },
      { label: "Technology", bg: "#e7f2f7" },
    ],
  },
  {
    id: "fleet",
    title: "Fleet Management",
    description: "Track vehicles, monitor mileage, schedule maintenance, manage registrations, and log driver assignments in one place.",
    image: imgHealthcare,
    cardBg: "#d9f2ef",
    badges: [
      { label: "Fleet", bg: "#d9f2ef" },
      { label: "Operations", bg: "#fdf2c2" },
    ],
  },
  {
    id: "medical",
    title: "Medical Equipment Tracker",
    description: "Maintain compliance with full audit trails, track device locations, service history, and certifications for all medical assets.",
    image: imgEducation,
    cardBg: "#fff7ed",
    badges: [
      { label: "Healthcare", bg: "#f0e7f4" },
      { label: "Compliance", bg: "#fef2f6" },
    ],
  },
  {
    id: "fixed-assets",
    title: "Fixed Asset Management",
    description: "Track depreciation, manage disposals, run audits, and maintain accurate financial records for all company-owned assets.",
    image: imgManufacturing,
    cardBg: "#f2d9dc",
    badges: [
      { label: "Finance", bg: "#fbf8d0" },
      { label: "Accounting", bg: "#fdf2c2" },
    ],
  },
  {
    id: "tool-crib",
    title: "Tool Crib Management",
    description: "Manage tool check-out and check-in, track locations and maintenance history, and prevent loss with barcode scanning.",
    image: imgIT2,
    cardBg: "#d9e9f2",
    badges: [
      { label: "Operations", bg: "#fdf2c2" },
      { label: "Manufacturing", bg: "#f8e0b9" },
    ],
  },
  {
    id: "facilities",
    title: "Facilities & Maintenance",
    description: "Manage work orders, preventive maintenance schedules, and facility assets to keep your operations running smoothly.",
    image: imgHealthcare2,
    cardBg: "#f2d9dc",
    badges: [
      { label: "Facilities", bg: "#f0e7f4" },
      { label: "CMMS", bg: "#f8e0b9" },
    ],
  },
  {
    id: "employee-assets",
    title: "Employee Equipment",
    description: "Track equipment assigned to employees, manage onboarding and offboarding asset kits, and reduce unaccounted losses.",
    image: imgEducation2,
    cardBg: "#f5f5f5",
    badges: [
      { label: "HR", bg: "#fef2f6" },
      { label: "Operations", bg: "#fdf2c2" },
    ],
  },
  {
    id: "construction",
    title: "Construction Equipment",
    description: "Track heavy equipment and tools across job sites. Monitor utilization, schedule maintenance, and manage certifications.",
    image: imgManufacturing2,
    cardBg: "#fff7ed",
    badges: [
      { label: "Construction", bg: "#f8e0b9" },
      { label: "Operations", bg: "#fdf2c2" },
    ],
  },
];

interface TemplatesGalleryProps {
  onSelectTemplate: (template: TemplateCard) => void;
  onBack: () => void;
}

export function TemplatesGallery({ onSelectTemplate, onBack }: TemplatesGalleryProps) {
  return (
    <div className="flex-1 overflow-hidden bg-background" style={{ padding: "16px 48px 48px 48px" }}>
      {/* White card — fills height, flex column so header is sticky and grid scrolls */}
      <div className="bg-card rounded-lg overflow-hidden flex flex-col h-full">

        {/* Sticky header — Back button + title + subtitle + search */}
        <div
          className="flex flex-col gap-6 flex-shrink-0"
          style={{ paddingTop: 24, paddingLeft: 112, paddingRight: 112, paddingBottom: 24 }}
        >
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-2 text-xs font-normal h-8"
              onClick={onBack}
            >
              <ArrowLeft size={14} />
              Back
            </Button>

            <h1 className="text-[30px] font-bold leading-[36px] text-foreground">
              Template library
            </h1>

            <p className="text-sm font-medium text-muted-foreground leading-5">
              Browse ready to use templates to quickly set up and manage your workflows.
            </p>
          </div>

          <div className="relative w-full">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              placeholder="Search for templates"
              className="pl-9 bg-background text-sm text-muted-foreground"
            />
          </div>
        </div>

        {/* Scrollable template grid */}
        <div
          className="flex-1 overflow-auto"
          style={{ paddingLeft: 112, paddingRight: 112, paddingBottom: 96 }}
        >
          <div className="flex flex-col gap-12 w-full">
            {[templates.slice(0, 4), templates.slice(4, 8)].map((row, ri) => (
              <div key={ri} className="flex gap-6 items-start w-full">
                {row.map((t) => (
                  <TemplateCardItem key={t.id} template={t} onClick={() => onSelectTemplate(t)} />
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function TemplateCardItem({ template, onClick }: { template: TemplateCard; onClick: () => void }) {
  return (
    <button
      className="group flex flex-1 flex-col gap-4 items-start text-left min-w-0 focus:outline-none cursor-pointer"
      onClick={onClick}
    >
      {/* Colored outer container */}
      <div
        className="w-full flex-shrink-0 flex flex-col rounded-[14px] p-2 overflow-hidden transition-shadow duration-200 group-hover:shadow-md"
        style={{ background: template.cardBg, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
      >
        {/* White inner image card */}
        <div
          className="w-full rounded-md overflow-hidden bg-white"
          style={{ height: 160, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
        >
          <img
            alt={template.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={template.image}
          />
        </div>
      </div>

      {/* Title + description */}
      <div className="flex flex-col gap-2 items-start w-full">
        <p className="text-base font-bold text-foreground leading-6 group-hover:text-secondary transition-colors duration-150">
          {template.title}
        </p>
        <p className="text-sm font-medium text-muted-foreground leading-5">
          {template.description}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 items-center">
        {template.badges.map((b) => (
          <span
            key={b.label}
            className="flex items-center justify-center px-2 h-8 text-sm font-medium text-foreground rounded-md whitespace-nowrap"
            style={{ background: b.bg }}
          >
            {b.label}
          </span>
        ))}
      </div>
    </button>
  );
}
