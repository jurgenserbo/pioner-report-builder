import { useState, useCallback } from "react";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { TopNav, type Crumb } from "@/components/TopNav";
import { UrsaAIPanel } from "@/components/UrsaAIPanel";
import { AccountManagement } from "@/screens/AccountManagement";
import { TemplatesGallery } from "@/screens/TemplatesGallery";
import type { TemplateCard } from "@/screens/TemplatesGallery";
import { TemplateDetail } from "@/screens/TemplateDetail";
import { BuildingAccount } from "@/screens/BuildingAccount";
import { Reports } from "@/screens/Reports";
import {
  AccountManagementSkeleton,
  TemplatesGallerySkeleton,
  TemplateDetailSkeleton,
} from "@/screens/SkeletonScreens";

type Screen = "account-management" | "templates-gallery" | "template-detail" | "building-account" | "reports";

const LOADING_DURATION = 700;

export default function App() {
  const [screen, setScreen] = useState<Screen>("account-management");
  const [loadingScreen, setLoadingScreen] = useState<Screen | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateCard | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [reportsCrumbs, setReportsCrumbs] = useState<Crumb[]>([{ label: "Reports" }]);

  const navigate = useCallback((next: Screen, beforeSwitch?: () => void) => {
    setLoadingScreen(next);
    setTimeout(() => {
      beforeSwitch?.();
      setScreen(next);
      setLoadingScreen(null);
    }, LOADING_DURATION);
  }, []);

  const handleSelectTemplate = (template: TemplateCard) => {
    navigate("template-detail", () => setSelectedTemplate(template));
  };

  const showNav = screen !== "building-account" && loadingScreen !== "building-account";

  const navigateToReports = useCallback(() => {
    navigate("reports");
  }, [navigate]);

  const activeScreen = loadingScreen ?? screen;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {showNav && <Sidebar onToggleAI={() => setAiPanelOpen((v) => !v)} aiOpen={aiPanelOpen} onNavigateReports={navigateToReports} activeScreen={screen} />}
      {showNav && <UrsaAIPanel open={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {showNav && (
          <TopNav
            crumbs={screen === "reports"
              ? reportsCrumbs
              : [{ label: "Account management" }]
            }
          />
        )}

        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Skeleton loaders — shown during navigation */}
          {loadingScreen === "account-management" && <AccountManagementSkeleton />}
          {loadingScreen === "templates-gallery"   && <TemplatesGallerySkeleton />}
          {loadingScreen === "template-detail"     && <TemplateDetailSkeleton />}

          {/* Real screens — hidden while loading */}
          {!loadingScreen && screen === "account-management" && (
            <AccountManagement onViewTemplates={() => navigate("templates-gallery")} />
          )}
          {!loadingScreen && screen === "templates-gallery" && (
            <TemplatesGallery
              onSelectTemplate={handleSelectTemplate}
              onBack={() => navigate("account-management")}
            />
          )}
          {!loadingScreen && screen === "template-detail" && selectedTemplate && (
            <TemplateDetail
              template={selectedTemplate}
              onBack={() => navigate("templates-gallery")}
              onUseTemplate={() => navigate("building-account")}
            />
          )}
          {!loadingScreen && screen === "building-account" && (
            <BuildingAccount onComplete={() => navigate("account-management")} />
          )}
          {!loadingScreen && screen === "reports" && (
            <div className="flex-1 overflow-hidden p-4 bg-[#F2F5F8]">
              <div className="h-full rounded-xl border border-border shadow-sm overflow-hidden">
                <Reports onCrumbsChange={setReportsCrumbs} />
              </div>
            </div>
          )}
        </main>
      </div>
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          classNames: {
            toast: "!bg-white !text-foreground !border-border !shadow-lg",
            description: "!text-muted-foreground",
            actionButton: "!bg-primary !text-primary-foreground !rounded-md !text-xs !font-medium",
            cancelButton: "!bg-muted !text-muted-foreground",
          },
        }}
      />
    </div>
  );
}
