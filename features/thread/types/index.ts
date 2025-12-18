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
