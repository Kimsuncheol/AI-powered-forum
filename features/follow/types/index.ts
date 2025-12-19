import { Timestamp } from "firebase/firestore";

// --- Follow Request Status ---
export type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELED";

// --- Follow Request Document ---
export interface FollowRequest {
  id: string;
  fromUid: string;
  toUid: string;
  status: RequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// --- Inbox Item Document ---
export type InboxItemType = "follow_request";
export type InboxItemStatus = "UNREAD" | "READ";

export interface InboxItem {
  id: string;
  type: InboxItemType;
  referenceId: string; // e.g., followRequest id
  fromUid: string;
  status: InboxItemStatus;
  createdAt: Timestamp;
}

// --- Follow Document ---
export interface Follow {
  id: string;
  followerUid: string;
  followingUid: string;
  createdAt: Timestamp;
}

// --- Result Types for Friendly Errors ---
export interface RepoResult<T = void> {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorMessage?: string;
}

export const ErrorCodes = {
  DUPLICATE_REQUEST: "DUPLICATE_REQUEST",
  REQUEST_NOT_FOUND: "REQUEST_NOT_FOUND",
  INVALID_STATUS: "INVALID_STATUS",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  ALREADY_FOLLOWING: "ALREADY_FOLLOWING",
  NOT_FOLLOWING: "NOT_FOLLOWING",
  CANNOT_FOLLOW_SELF: "CANNOT_FOLLOW_SELF",
} as const;
