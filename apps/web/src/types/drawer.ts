import { TItem } from "./item"

export type GlobalDrawerType =
  | 'update'
  | 'create'

export type GlobalDrawerProps = {
  type?: GlobalDrawerType
  btnLabel?: string
  className?: string
  closeBtnLabel?: string
  description?: string
  descriptionTextClassName?: string
  headerTextClassName?: string
  triggerLabel?: string
  defaultValues: TItem
  onConfirm?: () => void
}

export type GlobalDrawerContextType = {
  openDrawer: (props: GlobalDrawerProps) => void;
  closeDrawer: () => void
}