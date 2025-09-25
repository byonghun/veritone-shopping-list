import { TItem, TItemPost } from "./item"

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
  defaultValues: TItem | TItemPost
  onConfirm: (data: TItemPost | TItemPost) => void
}

export type GlobalDrawerContextType = {
  openDrawer: (props: GlobalDrawerProps) => void;
  closeDrawer: () => void
}