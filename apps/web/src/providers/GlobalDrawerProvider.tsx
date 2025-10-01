import { FC, ReactNode, createContext, useMemo, useState } from "react";

import ItemForm from "../components/ItemForm";
import { DEFAULT_GLOBAL_DRAWER_PROPS } from "../constants/drawer";
import HideIcon from "../components/Icons/HideIcon";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import { GlobalDrawerContextType, GlobalDrawerProps } from "../types/drawer";

export const GlobalDrawerContext =
  createContext<GlobalDrawerContextType | null>(null);

interface GlobalDrawerProviderProps {
  children: ReactNode;
}

const GlobalDrawerProvider: FC<GlobalDrawerProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [drawerProps, setDrawerProps] = useState<GlobalDrawerProps>(
    DEFAULT_GLOBAL_DRAWER_PROPS
  );

  const {
    type,
    description = "Add your new item below",
    descriptionTextClassName,
    defaultValues,
    onConfirm,
  } = drawerProps;

  const formKey = useMemo(() => {
    const idPart = defaultValues?.id ?? "newId";
    const modePart = type ?? "none";
    return `${modePart}:${idPart}`;
  }, [type, defaultValues?.id]);

  const openDrawer = (props: GlobalDrawerProps) => {
    setDrawerProps({ ...props });
    setOpen(true);
  };

  const closeDrawer = () => setOpen(false);

  return (
    <GlobalDrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerContent
          className="overflow-visible"
          onOpenAutoFocus={(e) => {
            // Note: this stops Radix’s default target and focuses on the content container
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
        >
          <div className="flex flex-col h-full bg-white">
            <DrawerHeader className="bg-drawerHeaderBg w-full h-16 pl-[30px] border-b-[0.5px] border-drawerBorderGray">
              <div className="w-full h-full flex items-center justify-between">
                <DrawerTitle className="text-secondaryFont font-dosis">
                  SHOPPING LIST
                </DrawerTitle>
                <button
                  onClick={closeDrawer}
                  className="w-[70px] h-full hover:opacity-80"
                >
                  <div className="pl-10">
                    <HideIcon />
                  </div>
                </button>
              </div>
            </DrawerHeader>
            <ItemForm
              key={formKey}
              type={type}
              description={description}
              descriptionTextClassName={descriptionTextClassName}
              defaultValues={defaultValues}
              onConfirm={onConfirm}
              onClose={closeDrawer}
              selectOpen={selectOpen}
              setSelectOpen={setSelectOpen}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </GlobalDrawerContext.Provider>
  );
};

export default GlobalDrawerProvider;
