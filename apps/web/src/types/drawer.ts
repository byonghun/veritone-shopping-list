import type { ItemDTO, ItemFormOutput } from "@app/shared";

export type GlobalDrawerType = "update" | "create";

export type GlobalDrawerProps = {
  type?: GlobalDrawerType;
  btnLabel?: string;
  className?: string;
  closeBtnLabel?: string;
  descriptionTextClassName?: string;
  headerTextClassName?: string;
  triggerLabel?: string;
  defaultValues: ItemDTO;
  onConfirm: (data: ItemFormOutput) => void;
};

export type GlobalDrawerContextType = {
  openDrawer: (props: GlobalDrawerProps) => void;
  closeDrawer: () => void;
};
