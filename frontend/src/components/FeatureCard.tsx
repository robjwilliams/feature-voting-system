import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoteButton } from './VoteButton';
import { Feature } from '@/types';

const STATUS_LABELS: Record<Feature['status'], string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
  rejected: 'Rejected',
};

const STATUS_VARIANTS: Record<Feature['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  open: 'default',
  in_progress: 'secondary',
  done: 'outline',
  rejected: 'destructive',
};

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Link href={`/features/${feature.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            <VoteButton
              featureId={feature.id}
              initialVoteCount={feature.vote_count}
              initialHasVoted={feature.has_voted}
              isAuthor={feature.is_author}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-base leading-tight">{feature.title}</h2>
                <Badge variant={STATUS_VARIANTS[feature.status]}>
                  {STATUS_LABELS[feature.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                by {feature.author_username}
              </p>
            </div>
          </div>
        </CardHeader>
        {feature.description && (
          <CardContent className="pt-0 pl-[72px]">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {feature.description}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
