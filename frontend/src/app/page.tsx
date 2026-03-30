'use client';

import { useEffect, useState } from 'react';
import { FeatureCard } from '@/components/FeatureCard';
import { api } from '@/lib/api';
import { Feature } from '@/types';

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.features
      .list()
      .then(setFeatures)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted-foreground text-center py-12">Loading features…</p>;
  }

  if (error) {
    return <p className="text-destructive text-center py-12">{error}</p>;
  }

  if (features.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">No feature requests yet.</p>
        <a href="/features/new" className="text-primary hover:underline">
          Be the first to submit one →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{features.length} feature{features.length !== 1 ? 's' : ''}, ranked by votes</p>
      {features.map((feature, index) => (
        <div key={feature.id} className="flex items-start gap-3">
          <span className="text-sm text-muted-foreground/60 font-mono w-6 text-right pt-3 shrink-0">
            #{index + 1}
          </span>
          <div className="flex-1 min-w-0">
            <FeatureCard feature={feature} />
          </div>
        </div>
      ))}
    </div>
  );
}
