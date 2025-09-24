export type GlobalDialogType =
  | 'update'
  | 'delete'
  | 'alert'
  | 'error'

export type GlobalDialogProps = {
  title: string
  type: GlobalDialogType
  btnLabel?: string
  className?: string
  closeBtnLabel?: string
  description?: string
  descriptionTextClassName?: string
  headerTextClassName?: string
  triggerLabel?: string
  onConfirm?: () => void
}

export type GlobalDialogContextType = {
  openDialog: (props: GlobalDialogProps) => void;
  closeDialog: () => void
}