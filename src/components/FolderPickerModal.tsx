import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@marlindtako/pioneer-design-system";

interface FolderItem {
  id: string;
  name: string;
  reportCount: number;
}

interface FolderPickerModalProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "move";
  reportCount: number;
  folders: FolderItem[];
  currentFolderId?: string | null;
  onConfirm: (folderId: string) => void;
}

export function FolderPickerModal({
  open,
  onClose,
  mode,
  reportCount,
  folders,
  currentFolderId,
  onConfirm,
}: FolderPickerModalProps) {
  const [selectedId, setSelectedId] = useState("");

  const title   = mode === "add" ? "Add to folder" : "Move to folder";
  const confirm = mode === "add" ? "Add"            : "Move";
  const subtitle =
    reportCount === 1
      ? "Select a destination folder for this report."
      : `Select a destination folder for ${reportCount} reports.`;

  const options = folders.filter((f) => f.id !== currentFolderId);

  function handleConfirm() {
    if (!selectedId) return;
    onConfirm(selectedId);
    handleClose();
  }

  function handleClose() {
    setSelectedId("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="w-[440px] max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>{subtitle}</DialogDescription>

        <div className="py-2">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Folder
          </label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a folder…" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[176px] overflow-y-auto">
              {options.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name} ({f.reportCount} reports)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button disabled={!selectedId} onClick={handleConfirm}>{confirm}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
