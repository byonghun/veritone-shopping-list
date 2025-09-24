import { useContext } from "react";
import { GlobalDialogContext } from "../components/providers/GlobalDialogProvider";

export const useDialog = () => {
  const context = useContext(GlobalDialogContext);

  if (!context)
    throw new Error("useDialog must be used within the GlobalDialogProvider");

  return context;
};
