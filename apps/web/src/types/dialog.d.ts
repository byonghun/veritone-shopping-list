export type GlobalDialogType =
  | 'delete'
  | 'alert'
  | 'error'

export type GlobalDialogProps = {
  type: GlobalDialogType
  title: string
  btnLabel?: string
  className?: string
  closeBtnLabel?: string
  description: string
  descriptionTextClassName?: string
  headerTextClassName?: string
  triggerLabel?: string
  onConfirm?: () => void
}

export type GlobalDialogContextType = {
  openDialog: (props: GlobalDialogProps) => void;
  closeDialog: () => void
}