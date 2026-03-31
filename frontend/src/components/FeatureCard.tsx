import { VoteButton } from "./VoteButton";
import { Feature } from "@/types";

interface FeatureCardProps {
  feature: Feature;
  onVote: (featureId: number) => void;
}

export function FeatureCard({ feature, onVote }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-4 bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <VoteButton
        voteCount={feature.vote_count}
        hasVoted={feature.has_voted}
        isAuthor={feature.is_author}
        onClick={() => onVote(feature.id)}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-semibold text-[15px] leading-snug text-foreground">
            {feature.title}
          </h2>
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          by{" "}
          {feature.is_author ? (
            <span className="font-medium text-green-600">YOU</span>
          ) : (
            <span className="font-medium text-foreground/70">
              {feature.author_username}
            </span>
          )}
        </p>

        {feature.description && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
            {feature.description}
          </p>
        )}
      </div>
    </div>
  );
}
