import { useState } from "react";
import { X, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button, Input, Dialog, DialogContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@marlindtako/pioneer-design-system";

const imgPreview = "/modal-preview-1.png";
const imgPreview2 = "/modal-preview-2.png";

interface ImportSpreadsheetModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportSpreadsheetModal({ open, onClose }: ImportSpreadsheetModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  const handleClose = () => {
    onClose();
    // reset step after dialog closes
    setTimeout(() => setStep(1), 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden"
        style={{ width: 864, maxWidth: 864 }}
      >
        {/* Header — same for both steps */}
        <div className="flex items-center px-6 border-b flex-shrink-0" style={{ height: 56 }}>
          <p className="flex-1 text-[18px] font-bold leading-7 text-foreground">Import spreadsheet</p>
          <button
            onClick={handleClose}
            className="flex items-center justify-center rounded-md hover:bg-muted transition-colors size-7 cursor-pointer"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 border-b min-h-0" style={{ height: 577 }}>

          {/* Left — form (content swaps per step) */}
          <div className="flex flex-col gap-4 px-6 py-4 flex-shrink-0 overflow-y-auto" style={{ width: 436 }}>

            {/* Shared label + description */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold text-foreground leading-5">Confirm account and module names</p>
              <p className="text-sm text-muted-foreground leading-5">
                File name will be used for the account name &amp; sheet names for module names.
              </p>
            </div>

            {step === 1 ? (
              <>
                {/* Upload spreadsheet */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-foreground leading-5">Upload spreadsheet</p>
                  <div className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3">
                    <CheckCircle2 size={24} className="flex-shrink-0 text-primary" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-sm font-bold leading-5 text-[#1a7bb2] truncate">Filename.type</p>
                      <p className="text-xs text-muted-foreground leading-4">200KB</p>
                    </div>
                    <button className="flex-shrink-0 hover:text-foreground text-muted-foreground transition-colors cursor-pointer">
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Row start header */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-foreground leading-5">Row start header</p>
                  <Select defaultValue="row2">
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="row1">Row 1</SelectItem>
                      <SelectItem value="row2">Row 2</SelectItem>
                      <SelectItem value="row3">Row 3</SelectItem>
                      <SelectItem value="row4">Row 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                {/* Account name */}
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-foreground leading-5">Account name</p>
                  <Input className="bg-background" placeholder="{get from filename}" />
                </div>

                {/* Module name fields */}
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex flex-col gap-2">
                    <p className="text-sm font-bold text-foreground leading-5">Module name (Sheet {n})</p>
                    <Input className="bg-background" placeholder="{get from sheet name}" />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Right — preview (image swaps per step) */}
          <div className="flex-1 p-4 min-w-0 bg-[#f3f3f3]">
            <div className="w-full h-full rounded-lg overflow-hidden relative">
              <img
                src={step === 1 ? imgPreview : imgPreview2}
                alt="Spreadsheet preview"
                className="absolute inset-0 w-full h-full object-cover object-left-top"
              />
            </div>
          </div>
        </div>

        {/* Footer — changes per step */}
        {step === 1 ? (
          <div className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
            <Button variant="ghost" className="gap-2" onClick={() => setStep(1)}>
              <ArrowLeft size={16} />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleClose}
              >
                Create account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
