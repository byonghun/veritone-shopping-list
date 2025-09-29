import { FC } from "react";

interface ErrorCardProps {
  onClick: () => void;
  errorMessage: string;
}

const ErrorCard: FC<ErrorCardProps> = ({ onClick, errorMessage }) => {
  return (
    <div className="rounded border border-red-200 bg-red-50 p-4 flex flex-col items-center md:w-[614px] h-[290px] md:mx-auto md:mt-[110px] justify-center">
      <p className="font-medium text-red-700">Failed to load items.</p>
      <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-2 inline-flex items-center rounded px-3 py-1.5 text-sm border border-red-300 hover:bg-red-300 transition-colors"
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorCard;
