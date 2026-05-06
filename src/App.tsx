import { useState } from "react";
import { FileBarChart2, Plus } from "lucide-react";
import { Button } from "@marlindtako/pioneer-design-system";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { ReportBuilderModal } from "./components/ReportBuilderModal";
import "./index.css";

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <Sidebar activeScreen="reports" />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav crumbs={[{ label: "Reports" }]} />

        <main className="flex-1 overflow-auto bg-background">
          {/* Page header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h1 className="text-lg font-bold text-foreground leading-6">Reports</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Build and schedule custom reports across your asset data.</p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="gap-1.5">
              <Plus size={16} /> Create report
            </Button>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center gap-4 mt-24 text-center px-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-muted">
              <FileBarChart2 size={26} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No reports yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Create your first report to visualize asset data with charts, tables, and scheduled email delivery.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(true)} className="gap-1.5 mt-1">
              <Plus size={14} /> Create report
            </Button>
          </div>
        </main>
      </div>

      <ReportBuilderModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

export default App;
