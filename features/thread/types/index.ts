import { Timestamp } from "firebase/firestore";

export interface Thread {
  id: string;
  title: string;
  titleLower?: string;
  titleTokens?: string[];
  body: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tagIds: string[];
  categoryId: string;
  type: 'text' | 'markdown' | 'link' | 'video' | 'audio';
  linkUrl?: string;
  mediaUrl?: string;
  imageUrls?: string[];
}

export interface ThreadCreateInput {
  title: string;
  body: string;
  categoryId: string;
  tagIds?: string[];
  type: 'text' | 'markdown' | 'link' | 'video' | 'audio';
  linkUrl?: string;
  mediaUrl?: string;
  imageUrls?: string[];
}

export interface Comment {
  id: string;
  threadId: string;
  body: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
