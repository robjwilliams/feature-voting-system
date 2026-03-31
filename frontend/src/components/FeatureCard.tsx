import { VoteButton } from "./VoteButton";
import { Feature } from "@/types";

const STATUS_CONFIG: Record<
  Feature["status"],
  { label: string; bg: string; text: string; dot: string }
> = {
  open: {
    label: "Open",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-400",
  },
  in_progress: {
    label: "In Progress",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  done: {
    label: "Done",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-400",
  },
};

interface FeatureCardProps {
  feature: Feature;
  onVote: (featureId: number) => void;
}

export function FeatureCard({ feature, onVote }: FeatureCardProps) {
  const status = STATUS_CONFIG[feature.status];

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
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          by{" "}
          <span className="font-medium text-foreground/70">
            {feature.author_username}
          </span>
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
