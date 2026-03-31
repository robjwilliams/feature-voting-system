export interface AuthUser {
  id: number;
  username: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  author_username: string;
  vote_count: number;
  has_voted: boolean;
  is_author: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFeatureInput {
  title: string;
  description: string;
}

export interface VoteResponse {
  voted: boolean;
  vote_count: number;
}
