import { CircleOff } from "lucide-react";

interface Props {
  error: string;
  onRetry: () => void;
}

export const AnswerError = ({ error, onRetry }: Props) => {
  return (
    <div className="flex flex-col items-center justify-between p-4 border rounded-lg bg-white shadow-md">
      <CircleOff
        className="w-6 h-6 text-red-500"
        aria-hidden="true"
        aria-label="Error icon"
      />
      <div className="flex-grow mt-2">
        <p className="text-lg font-semibold text-gray-800">{error}</p>
      </div>
      <button className="btn btn-primary mt-4" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
};
