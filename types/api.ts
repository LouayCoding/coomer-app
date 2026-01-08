export type Service = 'onlyfans' | 'fansly' | 'patreon' | 'fanbox' | 'subscribestar';

export interface FileAttachment {
  name: string;
  path: string;
}

export interface Post {
  id: string;
  user: string;
  service: Service;
  title: string;
  content: string;
  published: string;
  file?: FileAttachment;
  attachments?: FileAttachment[];
  videoDuration?: number; // Duration in seconds (client-side only)
}

export interface Creator {
  id: string;
  public_id?: string;
  name: string;
  service: Service;
  indexed: number;
  updated: number;
  favorited: number;
}

export interface PostsParams {
  offset?: number;
  q?: string;
  service?: Service;
}

export interface CreatorPostsParams {
  service: Service;
  id: string;
  offset?: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
