import { useState } from "react";
import { Button } from "@marlindtako/pioneer-design-system";
import { ReportBuilderModal } from "./components/ReportBuilderModal";
import "./index.css";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Button onClick={() => setOpen(true)}>Open Report Builder</Button>
      <ReportBuilderModal open={open} onOpenChange={setOpen} />
    </div>
  );
}

export default App;
