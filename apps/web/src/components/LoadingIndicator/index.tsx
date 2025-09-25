import React from "react";
import { cn } from "../../utils";

type LoadingIndicatorProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

export default function LoadingIndicator({
  className,
  ...props
}: LoadingIndicatorProps) {
  return (
    <div
      role="status"
      aria-label="Loading Indicator"
      className={cn(
        "w-[92px] h-[92px] rounded-full border-[3px] border-white animate-spin border-t-brand",
        className
      )}
      {...props}
    />
  );
}
