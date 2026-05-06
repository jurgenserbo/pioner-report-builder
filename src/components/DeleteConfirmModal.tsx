import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@marlindtako/pioneer-design-system";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  reportNames: string[];
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  open,
  onClose,
  reportNames,
  onConfirm,
}: DeleteConfirmModalProps) {
  const count = reportNames.length;
  const title = count === 1 ? "Delete report" : `Delete ${count} reports`;
  const description =
    count === 1
      ? `"${reportNames[0]}" will be permanently deleted. This action cannot be undone.`
      : `${count} reports will be permanently deleted. This action cannot be undone.`;

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[440px] max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>{description}</DialogDescription>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirm}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
