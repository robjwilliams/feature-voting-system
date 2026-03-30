'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { ChevronUp } from 'lucide-react';

interface VoteButtonProps {
  featureId: number;
  initialVoteCount: number;
  initialHasVoted: boolean;
  isAuthor: boolean;
}

export function VoteButton({ featureId, initialVoteCount, initialHasVoted, isAuthor }: VoteButtonProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [loading, setLoading] = useState(false);

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (loading || isAuthor) return;

    const nextVoted = !hasVoted;
    const nextCount = nextVoted ? voteCount + 1 : voteCount - 1;
    setHasVoted(nextVoted);
    setVoteCount(nextCount);
    setLoading(true);

    try {
      const result = await api.votes.toggle(featureId);
      setVoteCount(result.vote_count);
      setHasVoted(result.voted);
    } catch {
      setHasVoted(hasVoted);
      setVoteCount(voteCount);
    } finally {
      setLoading(false);
    }
  }

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
      variant={hasVoted ? 'default' : 'outline'}
      size="sm"
      onClick={handleVote}
      disabled={loading}
      className="flex flex-col items-center h-auto py-2 px-3 min-w-[52px]"
    >
      <ChevronUp className="h-4 w-4" />
      <span className="text-sm font-semibold">{voteCount}</span>
    </Button>
  );
}
