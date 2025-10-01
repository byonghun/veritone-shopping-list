import * as React from "react";
import { cn } from "../../utils";

type InputProps = React.ComponentPropsWithoutRef<"input">;
type InputRef = React.ElementRef<"input">;

const Input = React.forwardRef<InputRef, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      className={cn(
        "focus-visible:border-brand focus-visible:outline-none w-full border border-drawerBorderGray rounded-[4px] h-[52px] max-w-[504px] text-base font-nunito text-primaryFont px-3 placeholder:text-placeholderGray",
        className,
      )}
      {...props}
    />
  );
});

export { Input };
