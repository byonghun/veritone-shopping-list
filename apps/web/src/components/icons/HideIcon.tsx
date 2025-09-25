import { FC } from "react";
import { SvgIconProps } from "../../types/icons";

const HideIcon: FC<SvgIconProps> = ({
  width = "24",
  height = "24",
  fill = "none",
  fillColor = "#555F7C",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={fill}
    >
      <path
        d="M5.59 7.41L10.18 12L5.59 16.59L7 18L13 12L7 6L5.59 7.41ZM16 6H18V18H16V6Z"
        fill={fillColor}
      />
    </svg>
  );
};

export default HideIcon;
