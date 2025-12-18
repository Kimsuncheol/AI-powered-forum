import { Timestamp } from "firebase/firestore";

export interface Thread {
  id: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  tagIds: string[];
  categoryId: string;
}

export interface Comment {
  id: string;
  threadId: string;
  body: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
