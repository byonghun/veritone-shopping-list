import { FC } from "react";
import { SvgIconProps } from "../../types/icons";
import { cn } from "../../utils";

const HideEyeIcon: FC<SvgIconProps> = ({
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
      aria-label={"login-hide-eye"}
      className={cn("", className)}
    >
      <path d="m19.293 3.293-2.926 2.926A8.521 8.521 0 0 0 12 5c-4.027 0-7.484 2.881-9 7a11.634 11.634 0 0 0 3.015 4.571l-2.722 2.722a1 1 0 1 0 1.414 1.414l16-16a1 1 0 1 0-1.414-1.414zM9.3 13.283A2.934 2.934 0 0 1 9 12a3 3 0 0 1 3-3 2.934 2.934 0 0 1 1.283.3zm10.508-3.677A12.322 12.322 0 0 1 21 12c-1.516 4.119-4.973 7-9 7a8.363 8.363 0 0 1-1.457-.129z" />
    </svg>
  );
};

export default HideEyeIcon;
