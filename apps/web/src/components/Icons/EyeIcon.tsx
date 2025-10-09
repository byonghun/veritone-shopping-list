import { FC } from "react";
import { SvgIconProps } from "../../types/icons";
import { cn } from "../../utils";

const EyeIcon: FC<SvgIconProps> = ({
  width = "26",
  height = "20",
  fillColor = "#555F7C",
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill={fillColor}
      role="img"
      aria-label={"login-eye"}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <path d="M12 5c-4.027 0-7.484 2.881-9 7 1.516 4.119 4.973 7 9 7s7.484-2.881 9-7c-1.516-4.119-4.973-7-9-7zm0 10a3 3 0 1 1 3-3 3 3 0 0 1-3 3z" />
    </svg>
  );
};

export default EyeIcon;
