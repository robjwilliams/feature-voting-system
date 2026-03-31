import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeatureCard } from '@/components/FeatureCard';
import { Feature } from '@/types';

const mockFeature: Feature = {
  id: 1,
  title: 'Dark mode support',
  description: 'Allow users to switch to a dark theme.',
  author_username: 'alice',
  vote_count: 4,
  has_voted: false,
  is_author: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('FeatureCard', () => {
  it('renders the feature title', () => {
    render(<FeatureCard feature={mockFeature} onVote={vi.fn()} />);
    expect(screen.getByText('Dark mode support')).toBeInTheDocument();
  });

  it('renders the author username', () => {
    render(<FeatureCard feature={mockFeature} onVote={vi.fn()} />);
    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<FeatureCard feature={mockFeature} onVote={vi.fn()} />);
    expect(screen.getByText('Allow users to switch to a dark theme.')).toBeInTheDocument();
  });

  it('does not render a description paragraph when description is empty', () => {
    render(<FeatureCard feature={{ ...mockFeature, description: '' }} onVote={vi.fn()} />);
    expect(screen.queryByText('Allow users to switch to a dark theme.')).toBeNull();
  });

  it('calls onVote with the correct feature id when vote button is clicked', async () => {
    const onVote = vi.fn();
    render(<FeatureCard feature={mockFeature} onVote={onVote} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onVote).toHaveBeenCalledWith(1);
  });
});
