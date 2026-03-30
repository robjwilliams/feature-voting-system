'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { VoteButton } from '@/components/VoteButton';
import { api } from '@/lib/api';
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

export default function FeatureDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.features
      .get(Number(id))
      .then(setFeature)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-muted-foreground py-12 text-center">Loading…</p>;
  if (error) return <p className="text-destructive py-12 text-center">{error}</p>;
  if (!feature) return null;

  return (
    <div>
      <a href="/" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to all features
      </a>

      <div className="flex items-start gap-4">
        <VoteButton
          featureId={feature.id}
          initialVoteCount={feature.vote_count}
          initialHasVoted={feature.has_voted}
          isAuthor={feature.is_author}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-semibold">{feature.title}</h1>
            <Badge variant={STATUS_VARIANTS[feature.status]}>
              {STATUS_LABELS[feature.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Submitted by {feature.author_username} ·{' '}
            {new Date(feature.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {feature.description && (
        <div className="mt-6 prose prose-sm max-w-none">
          <p className="text-foreground whitespace-pre-wrap">{feature.description}</p>
        </div>
      )}
    </div>
  );
}
