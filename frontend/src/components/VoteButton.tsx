"use client";

import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

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
        className="flex flex-col items-center justify-center min-w-[52px] py-2 px-3 rounded-md border border-dashed border-muted-foreground/30 text-muted-foreground/50 cursor-not-allowed select-none"
      >
        <ChevronUp className="h-4 w-4" />
        <span className="text-sm font-semibold">{voteCount}</span>
      </div>
    );
  }

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      disabled={isAuthor}
      className="flex flex-col items-center h-auto py-2 px-3 min-w-[52px]"
    >
      <ChevronUp className="h-4 w-4" />
      <span className="text-sm font-semibold">{voteCount}</span>
    </Button>
  );
}
