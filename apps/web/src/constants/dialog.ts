import { GlobalDialogProps } from "../types/dialog";

export const DEFAULT_GLOBAL_DIALOG_PROPS: GlobalDialogProps = {
  type: "delete",
  title: "Delete Item?",
  description: "Are you sure you want to delete this item? This can not be undone.",
  onConfirm: () => {},
};
