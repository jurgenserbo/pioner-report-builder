export interface TemplateCard {
  id: string;
  title: string;
  description: string;
  categories: string[];
  bgColor: string;
  textColor: string;
}

export interface ModuleRow {
  name: string;
  modules: number;
  collections: number;
  savedViews: number;
  users: number;
  forms: number;
  automations: number;
  integrations: number;
  helpDesk: number;
}

export const templates: TemplateCard[] = [
  {
    id: "it-asset",
    title: "IT Asset Management",
    description: "Track and manage all your IT hardware and software assets across the organization.",
    categories: ["IT", "Assets"],
    bgColor: "#dbeafe",
    textColor: "#1e40af",
  },
  {
    id: "healthcare",
    title: "Healthcare Equipment Tracker",
    description: "Monitor medical devices, maintenance schedules, and compliance requirements.",
    categories: ["Healthcare", "Equipment"],
    bgColor: "#dcfce7",
    textColor: "#166534",
  },
  {
    id: "education",
    title: "Education Asset Manager",
    description: "Manage school computers, furniture, and educational materials across campuses.",
    categories: ["Education", "Assets"],
    bgColor: "#fef9c3",
    textColor: "#854d0e",
  },
  {
    id: "manufacturing",
    title: "Manufacturing Inventory",
    description: "Track raw materials, finished goods, and production equipment on the floor.",
    categories: ["Manufacturing", "Inventory"],
    bgColor: "#fef3c7",
    textColor: "#92400e",
  },
  {
    id: "nonprofit",
    title: "Non Profit Grant Tracker",
    description: "Manage grants, donors, and organizational assets for non-profit operations.",
    categories: ["Non Profit", "Help desk"],
    bgColor: "#f3e8ff",
    textColor: "#6b21a8",
  },
  {
    id: "facilities",
    title: "Facilities Management",
    description: "Track office equipment, maintenance requests, and building assets efficiently.",
    categories: ["Facilities", "Maintenance"],
    bgColor: "#e0f2fe",
    textColor: "#0369a1",
  },
  {
    id: "fleet",
    title: "Fleet Management",
    description: "Monitor vehicles, fuel usage, maintenance records, and driver assignments.",
    categories: ["Fleet", "Vehicles"],
    bgColor: "#fce7f3",
    textColor: "#9d174d",
  },
  {
    id: "retail",
    title: "Retail Inventory",
    description: "Track product inventory, POS equipment, and store assets across locations.",
    categories: ["Retail", "Inventory"],
    bgColor: "#ecfdf5",
    textColor: "#064e3b",
  },
];

export const moduleRows: ModuleRow[] = [
  {
    name: "Asset tracking",
    modules: 4,
    collections: 12,
    savedViews: 8,
    users: 24,
    forms: 6,
    automations: 3,
    integrations: 2,
    helpDesk: 1,
  },
  {
    name: "Asset tracking",
    modules: 2,
    collections: 8,
    savedViews: 5,
    users: 16,
    forms: 4,
    automations: 2,
    integrations: 1,
    helpDesk: 0,
  },
  {
    name: "Asset tracking",
    modules: 6,
    collections: 20,
    savedViews: 12,
    users: 48,
    forms: 10,
    automations: 5,
    integrations: 4,
    helpDesk: 2,
  },
  {
    name: "Asset tracking",
    modules: 3,
    collections: 9,
    savedViews: 6,
    users: 18,
    forms: 5,
    automations: 2,
    integrations: 2,
    helpDesk: 1,
  },
  {
    name: "CMMS",
    modules: 5,
    collections: 15,
    savedViews: 10,
    users: 30,
    forms: 8,
    automations: 4,
    integrations: 3,
    helpDesk: 2,
  },
  {
    name: "Vendors",
    modules: 2,
    collections: 6,
    savedViews: 4,
    users: 12,
    forms: 3,
    automations: 1,
    integrations: 2,
    helpDesk: 0,
  },
  {
    name: "Requests",
    modules: 1,
    collections: 4,
    savedViews: 3,
    users: 8,
    forms: 2,
    automations: 1,
    integrations: 1,
    helpDesk: 1,
  },
];
