import { Button } from "../components/ui/button";
import { DEFAULT_ITEM } from "../constants/drawer";
import { useDialog } from "../hooks/useDialog";
import { useDrawer } from "../hooks/useDrawer";

const ItemsPage = () => {
  const { openDialog, closeDialog } = useDialog();
  const { openDrawer } = useDrawer();

  const onDialogOpen = () => {
    openDialog({
      type: 'alert',
      title: "Delete Item?",
      description: "Are you sure you want to delete this item? This can not be undone.",
      onConfirm: () => closeDialog()
    })
  }

  const onDrawerOpen = () => {
    openDrawer({ type: "create", defaultValues: DEFAULT_ITEM, onConfirm: () => {} });
  };

  return (
    <div className="pointer-events-auto">
      <Button
        variant="default"
        className="cursor-pointer"
        onClick={onDialogOpen}
      >
        Open
      </Button>
      <Button
        variant="default"
        onClick={onDrawerOpen}
      >
        Drawer
      </Button>
    </div>
  );
};

export default ItemsPage;
