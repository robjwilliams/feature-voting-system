"use client";

interface VoteButtonProps {
  voteCount: number;
  hasVoted: boolean;
  isAuthor: boolean;
  onClick: () => void;
}

export function VoteButton({
  voteCount,
  hasVoted,
  isAuthor,
  onClick,
}: VoteButtonProps) {
  if (isAuthor) {
    return (
      <div
        title="You can't vote on your own feature"
        className="flex flex-col items-center justify-center w-14 h-15 rounded-xl border-2 border-dashed border-gray-200 text-gray-300 cursor-not-allowed select-none shrink-0"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M12 4l8 8H4z" />
        </svg>
        <span className="text-sm font-bold leading-tight tabular-nums mt-0.5">
          {voteCount}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={[
        "flex flex-col items-center justify-center w-14 h-15 rounded-xl border-2",
        "font-bold cursor-pointer select-none shrink-0",
        "transition-all duration-150 active:scale-95",
        hasVoted
          ? "bg-primary border-primary text-white shadow-[0_4px_14px_oklch(0.54_0.24_265/0.35)]"
          : "bg-white border-primary/30 text-primary hover:border-primary hover:shadow-[0_4px_14px_oklch(0.54_0.24_265/0.15)]",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-3.5 h-3.5 transition-transform duration-150 ${hasVoted ? "-translate-y-0.5" : ""}`}
      >
        <path d="M12 4l8 8H4z" />
      </svg>
      <span className="text-sm leading-tight tabular-nums mt-0.5">
        {voteCount}
      </span>
    </button>
  );
}
