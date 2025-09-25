import * as React from "react";

import { cn } from "../../utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "focus-visible:border-brand focus-visible:ring-brand/50 focus-visible:ring-[1px]",
        "w-full border border-drawerBorderGray rounded-md h-[52px] max-w-[504px] text-base font-nunito text-primaryFont pl-3 placeholder:text-placeholderGray",
        className
      )}
      {...props}
    />
  );
}

export { Input };
