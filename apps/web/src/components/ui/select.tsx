import { FC, useId, useMemo, useRef, useEffect } from "react";

import { AMOUNT_LIMIT } from "../../constants/drawer";
import ArrowIcon from "../Icons/ArrowIcon";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();
  const options = useMemo(
    () => Array.from({ length: AMOUNT_LIMIT }, (_, i) => i + 1),
    []
  );

  useEffect(() => {
    if (!open) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [open, onOpenChange]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onBlur={() => onOpenChange(false)}
        className={cn(
          "focus-visible:outline-none focus-visible:border-brand",
          "w-full border border-drawerBorderGray rounded-md h-[52px] max-w-[504px]",
          "text-base font-nunito px-3 text-placeholderGray flex justify-between items-center",
          "active:border-brand transition-colors z-50",
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
        id={listboxId}
        role="listbox"
        className={cn(
          "absolute left-0 right-0 top-full w-full rounded-[4px] bg-white shadow-dropdown z-20",
          "origin-top transition duration-200 ease-out will-change-[transform,opacity] mt-[1px]",
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-1 scale-95 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        {options.map((option) => {
          const selected = value === option;

          return (
            <div
              key={option}
              role="option"
              aria-selected={selected}
              tabIndex={-1}
              className="flex items-center h-10 hover:bg-drawerBorderGray/30 text-primaryFont leading-5 font-normal pl-3 font-nunito"
              onPointerDown={(e) => {
                e.preventDefault();
                onClick(option);
                onOpenChange(false);
              }}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Select };
