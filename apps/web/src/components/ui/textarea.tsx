import * as React from "react";

import { cn } from "../../utils";

type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;
type TextareaRef = React.ElementRef<"textarea">;

const Textarea = React.forwardRef<TextareaRef, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "focus-visible:border-brand focus-visible:outline-none w-full border border-drawerBorderGray rounded-[4px] h-[140px] max-w-[504px] text-base font-nunito text-primaryFont px-3 pt-3 placeholder:text-placeholderGray",
        className,
      )}
      {...props}
    />
  );
});

export { Textarea };
