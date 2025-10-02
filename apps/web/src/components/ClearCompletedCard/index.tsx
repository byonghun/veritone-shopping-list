import { FC } from "react";
import { Button } from "../ui/button";

interface ClearCompletedCardProps {
  onClear: (startNew?: boolean) => Promise<void> | void;
}

const ClearCompletedCard: FC<ClearCompletedCardProps> = ({ onClear }) => {
  return (
    <div
      id="clear-completed-card"
      className="w-full flex flex-col items-center justify-center font-nunito gap-4 h-60 md:gap-6"
    >
      <h3 className="text-lg font-semibold text-primaryFont">All items completed!</h3>
      <p className="card-text text-primaryFont">Clear this list, or start a new one?</p>
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center justify-center gap-3 mt-2">
          <Button onClick={() => onClear()} variant="destructive" className="w-[116px]">
            Clear list
          </Button>
          <Button onClick={() => onClear(true)}>Start new list</Button>
        </div>
      </div>
    </div>
  );
};

export default ClearCompletedCard;
