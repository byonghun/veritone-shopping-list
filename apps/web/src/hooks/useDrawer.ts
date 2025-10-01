import { useContext } from "react";
import { GlobalDrawerContext } from "../providers/GlobalDrawerProvider";

export const useDrawer = () => {
  const context = useContext(GlobalDrawerContext);

  if (!context) throw new Error("useDrawer must be used within the GlobalDrawerProvider");

  return context;
};
