import { FC } from "react";

import { AMOUNT_LIMIT } from "../constants/drawer";
import ArrowIcon from "../icons/ArrowIcon";
import { cn } from "../../utils";

interface CustomSelectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: number | undefined;
  onClick: (value: number) => void;
}

const Select: FC<CustomSelectProps> = ({
  open,
  onOpenChange,
  value,
  onClick,
}) => {
  return (
    <div className="relative">
      <button
        onBlur={() => onOpenChange(false)}
        className={cn(
          "focus-visible:outline-none focus-visible:border-brand",
          "w-full border border-drawerBorderGray rounded-md h-[52px] max-w-[504px]",
          "text-base font-nunito px-3 text-placeholderGray flex justify-between items-center",
          "active:border-brand transition-colors",
          open && "border-brand border",
          value && "text-primaryFont"
        )}
        onClick={(e) => {
          e.preventDefault();

          onOpenChange(!open);
        }}
      >
        <p>{`${value ?? "How Many?"}`}</p>
        <ArrowIcon
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      <div
        role="listbox"
        className={cn(
          "absolute left-0 right-0 top-full w-full rounded-[4px] bg-white shadow-dropdown z-20",
          "origin-top transition duration-200 ease-out will-change-[transform,opacity]",
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        {[...Array(AMOUNT_LIMIT).keys()].map((number) => {
          const value = ++number;

          return (
            <div
              key={value}
              className="flex items-center h-10 hover:bg-drawerHeaderBg text-primaryFont leading-5 font-normal pl-3 font-nunito"
              onClick={() => onClick(value)}
            >
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Select;
