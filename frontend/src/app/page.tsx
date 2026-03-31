"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { api } from "@/lib/api";
import { Feature } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      api.features
        .list()
        .then((data) => {
          setFeatures(data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <p className="text-muted-foreground text-center py-12 text-sm">
        Checking session…
      </p>
    );
  }

  if (!user) {
    return null;
  }

  if (!features) {
    return (
      <p className="text-muted-foreground text-center py-12 text-sm">
        Loading features…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-center py-12 text-sm">{error}</p>
    );
  }

  if (features.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4 text-sm">
          No feature requests yet.
        </p>
        <Link
          href="/features/new"
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Be the first to submit one →
        </Link>
      </div>
    );
  }

  function handleVote(featureId: number) {
    setFeatures((prev) => {
      if (!prev) return prev;

      const updated = prev.map((f) => {
        if (f.id === featureId) {
          const nextHasVoted = !f.has_voted;
          const nextVoteCount = f.vote_count + (nextHasVoted ? 1 : -1);
          return { ...f, has_voted: nextHasVoted, vote_count: nextVoteCount };
        }
        return f;
      });

      return [...updated].sort((a, b) => b.vote_count - a.vote_count);
    });

    api.votes.toggle(featureId).catch(() => {
      console.error("Vote request failed");
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Feature Requests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {features.length} request{features.length !== 1 ? "s" : ""}, ranked by votes
          </p>
        </div>
        <Link
          href="/features/new"
          className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="text-base leading-none">+</span>
          Submit a feature
        </Link>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className="animate-in-feature"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <FeatureCard feature={feature} onVote={handleVote} />
          </div>
        ))}
      </div>
    </div>
  );
}
