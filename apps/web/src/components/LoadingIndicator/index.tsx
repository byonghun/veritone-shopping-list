import React, { FC } from "react";
import { cn } from "../../utils";

interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ className, ...props }) => {
  return (
    <div
      role="status"
      aria-label="Loading Indicator"
      className={cn(
        "w-[92px] h-[92px] rounded-full border-[3px] border-white animate-spin border-t-brand mt-[110px]",
        className,
      )}
      {...props}
    />
  );
};

export default LoadingIndicator;
