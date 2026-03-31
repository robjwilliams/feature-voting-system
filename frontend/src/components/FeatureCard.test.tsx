import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FeatureCard } from "./FeatureCard";
import { Feature } from "@/types";

const baseFeature: Feature = {
  id: 1,
  title: "Dark mode",
  description: "Add dark mode support",
  author_username: "alice",
  vote_count: 5,
  has_voted: false,
  is_author: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("FeatureCard", () => {
  it("shows 'by YOU' in green when is_author is true", () => {
    render(
      <FeatureCard
        feature={{ ...baseFeature, is_author: true }}
        onVote={vi.fn()}
      />
    );
    const youLabel = screen.getByText("YOU");
    expect(youLabel).toBeInTheDocument();
    expect(youLabel.className).toMatch(/text-green/);
  });

  it("shows 'by [username]' when is_author is false", () => {
    render(<FeatureCard feature={baseFeature} onVote={vi.fn()} />);
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(screen.queryByText("YOU")).not.toBeInTheDocument();
  });
});
