import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VoteButton } from '@/components/VoteButton';

describe('VoteButton — author state', () => {
  it('does not render a button element', () => {
    render(<VoteButton voteCount={5} hasVoted={false} isAuthor onClick={vi.fn()} />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders the vote count', () => {
    render(<VoteButton voteCount={5} hasVoted={false} isAuthor onClick={vi.fn()} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows the cannot-vote tooltip', () => {
    render(<VoteButton voteCount={5} hasVoted={false} isAuthor onClick={vi.fn()} />);
    expect(screen.getByTitle("You can't vote on your own feature")).toBeInTheDocument();
  });
});

describe('VoteButton — unvoted state', () => {
  it('renders a clickable button', () => {
    render(<VoteButton voteCount={3} hasVoted={false} isAuthor={false} onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders the vote count', () => {
    render(<VoteButton voteCount={3} hasVoted={false} isAuthor={false} onClick={vi.fn()} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<VoteButton voteCount={3} hasVoted={false} isAuthor={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('VoteButton — voted state', () => {
  it('renders a button', () => {
    render(<VoteButton voteCount={7} hasVoted isAuthor={false} onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<VoteButton voteCount={7} hasVoted isAuthor={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
