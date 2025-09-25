import * as React from "react"

import { cn } from "../../utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "focus-visible:border-brand focus-visible:ring-brand/50 focus-visible:ring-[1px]",
        "w-full border border-drawerBorderGray rounded-md h-[140px] max-w-[504px] text-base font-nunito text-primaryFont pl-3 pt-3 placeholder:text-placeholderGray",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
