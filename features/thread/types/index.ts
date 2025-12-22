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
  location?: LocationData;
  commentsCount?: number;
  isNSFW?: boolean;
  likesCount?: number;
  userVote?: 'up' | 'down' | null;
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
  isNSFW?: boolean;
  location?: LocationData;
}

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  name?: string;
  placeId?: string;
}

export interface Comment {
  id: string;
  threadId: string;
  body: string;
  authorId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  parentId?: string | null;
  replyCount?: number;
  userDisplayName?: string;
  userPhotoURL?: string;
}
