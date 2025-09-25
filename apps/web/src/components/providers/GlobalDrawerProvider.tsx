import { FC, ReactNode, createContext, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DEFAULT_GLOBAL_DRAWER_PROPS } from "../constants/drawer";
import HideIcon from "../icons/HideIcon";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Input } from "../ui/input";
import Select from "../ui/select";
import { Textarea } from "../ui/textarea";
import { ItemSchema, ItemFormInput, ItemFormOutput } from "../../schemas/item";
import { GlobalDrawerContextType, GlobalDrawerProps } from "../../types/drawer";
import { cn } from "../../utils";

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
  } = drawerProps;

  const isUpdateMode = type === "update";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    watch,
    reset,
  } = useForm<ItemFormInput, any, ItemFormOutput>({
    resolver: zodResolver(ItemSchema),
    mode: "onChange",
    defaultValues: {
      itemName: "",
      description: "",
      quantity: undefined,
      purchased: false,
    },
  });

  const descriptionValue = watch("description") ?? "";
  const maxDescription = 100;
  const quantityValue = watch("quantity") as number | undefined;

  const clearForm = () =>
    reset({
      itemName: "",
      description: "",
      quantity: undefined,
      purchased: false,
    });

  const onSubmit: SubmitHandler<ItemFormOutput> = async (data) => {
    // API Call
    console.log({ data });
    clearForm();
    setOpen(false);
  };

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
          <div className="h-full bg-white">
            <DrawerHeader className="bg-drawerHeaderBg w-full h-16 pl-[30px] pr-6 border-b-[0.5px] border-drawerBorderGray">
              <div className="w-full h-full flex items-center justify-between">
                <DrawerTitle className="text-descriptionGray font-dosis">
                  SHOPPING LIST
                </DrawerTitle>
                <button onClick={closeDrawer}>
                  <HideIcon className="hover:opacity-80" />
                </button>
              </div>
            </DrawerHeader>
            <div className="pl-[30px] pt-7 pr-6">
              <div className="flex flex-col font-nunito font-normal mb-4">
                <h2 className="text-lg leading-6">Add an Item</h2>
                <div className="flex items-center justify-between">
                  <DrawerDescription
                    className={cn(
                      "text-base leading-[22px] text-descriptionGray mt-2",
                      descriptionTextClassName
                    )}
                  >
                    {description}
                  </DrawerDescription>
                  {isDirty && (
                    <button onClick={clearForm} className="font-medium text-xs hover:opacity-80 text-primaryFont">
                      Clear Form
                    </button>
                  )}
                </div>
              </div>
              <form
                id="item-form"
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <Input
                    id="item-name"
                    placeholder="Item Name"
                    {...register("itemName")}
                  />
                  {errors.itemName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.itemName.message}
                    </p>
                  )}
                </div>
                <div>
                  <div className="relative h-[140px]">
                    <Textarea
                      id="item-description"
                      placeholder="Description"
                      {...register("description")}
                    />
                    <span
                      className={cn(
                        "text-xs absolute bottom-3 right-3",
                        descriptionValue.length > maxDescription
                          ? "text-red-600"
                          : "text-descriptionGray"
                      )}
                      aria-live="polite"
                    >
                      {descriptionValue.length}/{maxDescription}
                    </span>
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div>
                  <Controller
                    control={control}
                    name="quantity"
                    render={({ field }) => (
                      <Select
                        open={selectOpen}
                        onOpenChange={setSelectOpen}
                        onClick={(value: number) => {
                          field.onChange(value);
                          setSelectOpen(false);
                        }}
                        value={quantityValue}
                      />
                    )}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
                {isUpdateMode && (
                  <div className="flex items-center justify-between mt-4 z-[1]">
                    <Controller
                      control={control}
                      name="purchased"
                      render={({ field: { value, onChange, onBlur, ref } }) => (
                        <div className="flex gap-4 h-6 items-center">
                          <Checkbox
                            id="item-purchased"
                            name="item-purchased"
                            checked={value}
                            onCheckedChange={(checked) =>
                              onChange(Boolean(checked))
                            }
                            aria-invalid={!!errors.purchased || undefined}
                          />
                          <label
                            htmlFor="item-purchased"
                            className={cn(
                              "text-placeholderGray text-base leading-[22px] font-nunito",
                              value && "text-primaryFont"
                            )}
                          >
                            Purchased
                          </label>
                        </div>
                      )}
                    />
                  </div>
                )}
              </form>
            </div>
          </div>
          <DrawerFooter className="bg-white w-full flex">
            <div className="flex gap-4 w-[cacl(163px_+_1rem)] justify-end pr-2 font-nunito">
              <DrawerClose asChild>
                <Button variant="secondary" className="h-9 font-normal">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                variant="default"
                className={cn(
                  "h-9 font-normal w-[85px]",
                  isUpdateMode && "w-[100px]"
                )}
                form="item-form"
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting
                  ? isUpdateMode
                    ? "Updating..."
                    : "Saving..."
                  : isUpdateMode
                  ? "Save Item"
                  : "Add Task"}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </GlobalDrawerContext.Provider>
  );
};

export default GlobalDrawerProvider;