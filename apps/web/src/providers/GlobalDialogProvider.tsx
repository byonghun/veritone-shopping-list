import { FC, ReactNode, createContext, useMemo, useState } from "react";

import { DEFAULT_GLOBAL_DIALOG_PROPS } from "../constants/dialog";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { GlobalDialogContextType, GlobalDialogProps } from "../types/dialog";
import { cn } from "../utils";

export const GlobalDialogContext =
  createContext<GlobalDialogContextType | null>(null);

interface GlobalDialogProviderProps {
  children: ReactNode;
}

const GlobalDialogProvider: FC<GlobalDialogProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<GlobalDialogProps>(
    DEFAULT_GLOBAL_DIALOG_PROPS
  );

  const {
    title,
    type,
    btnLabel = "Delete",
    className,
    closeBtnLabel = "Cancel",
    description,
    descriptionTextClassName,
    headerTextClassName,
    onConfirm,
  } = dialogProps;
  const isErrorType = useMemo(() => type === "error", [type]);

  const openDialog = (props: GlobalDialogProps) => {
    setOpen(true);
    setDialogProps({ ...props });
  };

  const closeDialog = () => setOpen(false);

  const onClick = () => {
    setOpen(false);
    onConfirm && onConfirm();
  };

  return (
    <GlobalDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn("bg-white", className)}
          showCloseButton={!onConfirm}
          onOpenAutoFocus={(e) => {
            // Note: this stops Radix’s default target and focuses on the content container
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
        >
          <DialogHeader>
            <DialogTitle
              className={cn("flex items-center", headerTextClassName)}
            >
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className={descriptionTextClassName}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            {!isErrorType && <DialogClose asChild>
              <Button variant="secondary" className="hover:opacity-80">
                {closeBtnLabel}
              </Button>
            </DialogClose>}
            <Button
              variant="default"
              onClick={onClick}
              className={cn(isErrorType && "bg-red-600")}
            >
              {btnLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlobalDialogContext.Provider>
  );
};

export default GlobalDialogProvider;
