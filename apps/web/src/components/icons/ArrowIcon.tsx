import { FC } from 'react'

import { SvgIconProps } from "../../types/icons";

const ArrowIcon: FC<SvgIconProps> = ({
  width = "10",
  height = "5",
  fill = "none",
  fillColor = "#555F7C",
  className = ""
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 10 5"
      fill={fill}
      className={className}
    >
      <path d="M0 0L5 5L10 0H0Z" fill={fillColor} />
    </svg>
  );
};

export default ArrowIcon