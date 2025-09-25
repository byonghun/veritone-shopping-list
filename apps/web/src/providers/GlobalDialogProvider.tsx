import { FC, ReactNode, createContext,  useState } from "react";

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
    triggerLabel,
    onConfirm,
  } = dialogProps;

  const openDialog = (props: GlobalDialogProps) => {
    setOpen(true);
    setDialogProps({ ...props });
  };

  const closeDialog = () => setOpen(false);

  const onClick = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <GlobalDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn("bg-white", className)}
          showCloseButton={!onConfirm}
          onOpenAutoFocus={(e) => e.preventDefault()}
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
            <DialogClose asChild>
              <Button variant="secondary" className="hover:opacity-80">
                {closeBtnLabel}
              </Button>
            </DialogClose>
            <Button variant="default" onClick={onClick}>
              {btnLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GlobalDialogContext.Provider>
  );
};

export default GlobalDialogProvider;