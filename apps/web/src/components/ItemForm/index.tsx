import { FC } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ItemDTO, ItemSchema, type ItemFormInput, type ItemFormOutput } from "@app/shared";
import { zodResolver } from "@hookform/resolvers/zod";

import { DEFAULT_ITEM, MAX_DESCRIPTION } from "../../constants/drawer";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { DrawerClose, DrawerDescription, DrawerFooter } from "../../components/ui/drawer";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { GlobalDrawerType } from "../../types/drawer";
import { cn } from "../../utils";

interface ItemFormProps {
  descriptionTextClassName?: string;
  selectOpen: boolean;
  setSelectOpen: (open: boolean) => void;
  onClose: () => void;
  type?: GlobalDrawerType;
  defaultValues: ItemDTO;
  onConfirm?: (data: ItemFormOutput) => Promise<void> | void;
}

const ItemForm: FC<ItemFormProps> = ({
  type,
  descriptionTextClassName,
  defaultValues = DEFAULT_ITEM,
  onConfirm,
  onClose,
  selectOpen,
  setSelectOpen,
}) => {
  const isUpdateMode = type === "update";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    watch,
    reset,
  } = useForm<ItemFormInput, undefined, ItemFormOutput>({
    resolver: zodResolver(ItemSchema),
    mode: "onChange",
    defaultValues,
  });

  const descriptionValue = watch("description") ?? "";
  const quantityValue = watch("quantity") as number | undefined;

  const clearForm = () => {
    if (isUpdateMode) {
      return reset({
        ...defaultValues,
        description: defaultValues.description ?? "",
      });
    }
    return reset(DEFAULT_ITEM);
  };

  const onSubmit: SubmitHandler<ItemFormOutput> = async (data) => {
    clearForm();
    onClose();
    onConfirm?.({
      ...data,
      quantity: data.quantity ?? 1,
      purchased: data.purchased ?? false,
    });
  };

  return (
    <>
      <div className="pl-[30px] pt-7 pr-6 flex-1">
        <div className="flex flex-col font-nunito font-normal mb-4">
          <h2 className="text-lg leading-6 text-primaryFont">
            {isUpdateMode ? "Edit an item" : "Add an Item"}
          </h2>
          <div className="flex items-center justify-between">
            <DrawerDescription
              className={cn(
                "text-base leading-[22px] text-secondaryFont mt-2",
                descriptionTextClassName,
              )}
            >
              {isUpdateMode ? "Edit your item below" : "Add your new item below"}
            </DrawerDescription>
            {isDirty && (
              <button
                data-testid="clear-form-btn"
                onClick={clearForm}
                className="font-medium text-xs hover:opacity-80 text-primaryFont"
              >
                Clear Form
              </button>
            )}
          </div>
        </div>

        <form id="item-form" className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input id="item-name" placeholder="Item Name" {...register("itemName")} />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-600">{errors.itemName.message}</p>
            )}
          </div>

          <div>
            <div className="relative h-[140px]">
              <Textarea
                id="item-description"
                placeholder="Description"
                className="resize-none"
                {...register("description")}
              />
              <span
                className={cn(
                  "text-xs absolute bottom-3 right-3",
                  descriptionValue.length > MAX_DESCRIPTION ? "text-red-600" : "text-secondaryFont",
                )}
                aria-live="polite"
              >
                {descriptionValue.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {isUpdateMode && (
            <div className="flex items-center justify-between mt-4 z-[1]">
              <Controller
                control={control}
                name="purchased"
                render={({ field: { value, onChange } }) => (
                  <div className="flex gap-4 h-6 items-center">
                    <Checkbox
                      id="item-purchased"
                      name="item-purchased"
                      checked={value}
                      onCheckedChange={(checked) => onChange(Boolean(checked))}
                      aria-invalid={!!errors.purchased || undefined}
                    />
                    <label
                      htmlFor="item-purchased"
                      className={cn(
                        "text-placeholderGray text-base leading-[22px] font-nunito",
                        value && "text-primaryFont",
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

      <DrawerFooter className="bg-white w-full flex">
        <div className="flex gap-4 w-full justify-end pr-2 font-nunito mb-2">
          <DrawerClose asChild>
            <Button variant="secondary" className="h-9 font-normal hover:opacity-80">
              Cancel
            </Button>
          </DrawerClose>

          <Button
            variant="default"
            className={cn("h-9 font-normal w-[85px]", isUpdateMode && "w-[100px]")}
            form="item-form"
            type="submit"
            disabled={isSubmitting || !isValid || (!isDirty && isUpdateMode)}
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
    </>
  );
};

export default ItemForm;
