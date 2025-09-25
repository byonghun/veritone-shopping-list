import { Button } from "../components/ui/button";
import { useDrawer } from "../hooks/useDrawer";

const HomePage = () => {
  const { openDrawer, closeDrawer } = useDrawer();

  const onDialogOpen = () => {
    openDrawer({
      type: 'create',
      onConfirm: () => closeDrawer()
    })
  }

  return (
    <div className="w-full">
      <div className="mt-4 h-96 md:mt-[110px] md:mx-auto md:w-[614px] md:h-[290px] border border-borderGray rounded-[5px] flex items-center justify-center">
        <div className="font-nunito w-[250px] flex flex-col items-center gap-4 lg:mb-6">
          <p className="font-normal text-textGray leading-6 text-[18px]">
            Your shopping list is empty :(
          </p>
          <Button variant="default" onClick={onDialogOpen}>
            Add your first item
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
