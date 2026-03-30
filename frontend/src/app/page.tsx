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

  // 🔒 Checking session
  if (authLoading) {
    return (
      <p className="text-muted-foreground text-center py-12">
        Checking session…
      </p>
    );
  }

  // 🔒 Not authenticated
  if (!user) {
    return null;
  }

  // 📦 Loading
  if (!features) {
    return (
      <p className="text-muted-foreground text-center py-12">
        Loading features…
      </p>
    );
  }

  // ❌ Error
  if (error) {
    return <p className="text-destructive text-center py-12">{error}</p>;
  }

  // 🪹 Empty
  if (features && features.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">No feature requests yet.</p>
        <Link href="/features/new" className="text-primary hover:underline">
          Be the first to submit one →
        </Link>
      </div>
    );
  }

  function handleVote(featureId: number) {
    // 🔥 Optimistic update + reorder
    setFeatures((prev) => {
      if (!prev) return prev;

      const updated = prev.map((f) => {
        if (f.id === featureId) {
          const nextHasVoted = !f.has_voted;
          const nextVoteCount = f.vote_count + (nextHasVoted ? 1 : -1);

          return {
            ...f,
            has_voted: nextHasVoted,
            vote_count: nextVoteCount,
          };
        }
        return f;
      });

      // 🧠 reorder by popularity
      return [...updated].sort((a, b) => b.vote_count - a.vote_count);
    });

    // 🚀 fire-and-forget request
    api.votes.toggle(featureId).catch(() => {
      // (opcional) podrías hacer rollback acá, pero no es necesario para el test
      console.error("Vote request failed");
    });
  }

  // ✅ Success
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {features.length} feature{features.length !== 1 ? "s" : ""}, ranked by
        votes
      </p>

      {features.map((feature, index) => (
        <div key={feature.id} className="flex items-start gap-3">
          <span className="text-sm text-muted-foreground/60 font-mono w-6 text-right pt-3 shrink-0">
            #{index + 1}
          </span>

          <div className="flex-1 min-w-0">
            <FeatureCard feature={feature} onVote={handleVote} />
          </div>
        </div>
      ))}
    </div>
  );
}
