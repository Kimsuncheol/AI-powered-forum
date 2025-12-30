import { Timestamp } from "firebase/firestore";

export interface BookmarkedThread {
  id: string;
  threadId: string;
  userId: string;
  createdAt: Timestamp;
  threadTitle: string;
  threadAuthorId: string;
}

export interface BookmarkInput {
  threadId: string;
  threadTitle: string;
  threadAuthorId: string;
}
