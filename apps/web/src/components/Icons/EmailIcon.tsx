import { FC } from "react";
import { SvgIconProps } from "../../types/icons";
import { cn } from "../../utils";

const EmailIcon: FC<SvgIconProps> = ({
  width = "26",
  height = "20",
  fill = "#D5DFE9",
  fillColor = "#555F7C",
  className = "",
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      width={width}
      height={height}
      role="img"
      aria-label={"login-email"}
      className={cn("", className)}
    >
      <g>
        <path fill={fillColor} d="M47 9v28a4.025 4.025 0 0 1-1.17 2.83L28 22l-.28-.43z" />
        <path
          fill={fillColor}
          d="M45.83 39.83A4.025 4.025 0 0 1 43 41H5a4.025 4.025 0 0 1-2.83-1.17L20 22l.25-.39L24 24l3.72-2.43.28.43z"
        />
        <path
          fill={fillColor}
          d="M20.25 21.61 20 22 2.17 39.83A4.025 4.025 0 0 1 1 37V11a3.944 3.944 0 0 1 .18-1.19L2 10z"
        />
        <path
          fill={fillColor}
          d="M47 9 27.72 21.57 24 24l-3.75-2.39L2 10l-.82-.19A4 4 0 0 1 5 7h37c4 0 5 2 5 2z"
        />
      </g>

      {/* Stroke outlines (same brand color) */}
      <path
        fill="none"
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M42 7H5a4 4 0 0 0-3.82 2.81A3.944 3.944 0 0 0 1 11v26a3.995 3.995 0 0 0 4 4h38a3.995 3.995 0 0 0 4-4V9L27.72 21.57 24 24l-3.75-2.39L2 10"
      />
      <path
        fill="none"
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M39 33 28 22M9 33l11-11"
      />
    </svg>
  );
};

export default EmailIcon;
