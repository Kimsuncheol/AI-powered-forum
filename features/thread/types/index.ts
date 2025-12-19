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
}

export interface ThreadCreateInput {
  title: string;
  body: string;
  categoryId: string;
  tagIds?: string[];
}

export interface Comment {
  id: string;
  threadId: string;
  body: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
