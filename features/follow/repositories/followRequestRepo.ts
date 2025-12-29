import {
  doc,
  getDoc,

  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  RepoResult,
  ErrorCodes,
  RequestStatus,
} from "../types";

const REQUESTS_COLLECTION = "followRequests";
const INBOX_COLLECTION = "inbox";
const FOLLOWS_COLLECTION = "follows";

/**
 * Generate doc ID for follow request.
 */
function getRequestDocId(fromUid: string, toUid: string): string {
  return `${fromUid}_${toUid}`;
}

/**
 * 1) sendFollowRequest
 * Creates a PENDING follow request and an inbox item for the target user.
 * Returns error if a PENDING request already exists.
 */
export async function sendFollowRequest(
  fromUid: string,
  toUid: string
): Promise<RepoResult<string>> {
  if (fromUid === toUid) {
    return {
      success: false,
      errorCode: ErrorCodes.CANNOT_FOLLOW_SELF,
      errorMessage: "You cannot follow yourself.",
    };
  }

  const requestId = getRequestDocId(fromUid, toUid);
  const requestRef = doc(db, REQUESTS_COLLECTION, requestId);

  // Check for existing PENDING request
  const existing = await getDoc(requestRef);
  if (existing.exists()) {
    const data = existing.data();
    if (data.status === "PENDING") {
      return {
        success: false,
        errorCode: ErrorCodes.DUPLICATE_REQUEST,
        errorMessage: "A pending follow request already exists.",
      };
    }
  }

  // Check if already following
  const followId = getRequestDocId(fromUid, toUid);
  const followRef = doc(db, FOLLOWS_COLLECTION, followId);
  const followSnap = await getDoc(followRef);
  if (followSnap.exists()) {
    return {
      success: false,
      errorCode: ErrorCodes.ALREADY_FOLLOWING,
      errorMessage: "You are already following this user.",
    };
  }

  const batch = writeBatch(db);

  // Create follow request
  batch.set(requestRef, {
    fromUid,
    toUid,
    status: "PENDING" as RequestStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Create inbox item for target user
  const inboxItemRef = doc(collection(db, INBOX_COLLECTION, toUid, "items"));
  batch.set(inboxItemRef, {
    type: "follow_request",
    referenceId: requestId,
    fromUid,
    status: "UNREAD",
    createdAt: serverTimestamp(),
  });

  await batch.commit();

  return { success: true, data: requestId };
}

/**
 * 2) cancelFollowRequest
 * Sets request status to CANCELED (only if PENDING and fromUid matches).
 */
export async function cancelFollowRequest(
  fromUid: string,
  toUid: string
): Promise<RepoResult> {
  const requestId = getRequestDocId(fromUid, toUid);
  const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
  const snap = await getDoc(requestRef);

  if (!snap.exists()) {
    return {
      success: false,
      errorCode: ErrorCodes.REQUEST_NOT_FOUND,
      errorMessage: "Follow request not found.",
    };
  }

  const data = snap.data();
  if (data.fromUid !== fromUid) {
    return {
      success: false,
      errorCode: ErrorCodes.PERMISSION_DENIED,
      errorMessage: "You can only cancel your own requests.",
    };
  }

  if (data.status !== "PENDING") {
    return {
      success: false,
      errorCode: ErrorCodes.INVALID_STATUS,
      errorMessage: "Only pending requests can be canceled.",
    };
  }

  const batch = writeBatch(db);

  // 1. Delete the follow request document
  batch.delete(requestRef);

  // 2. Find and delete the corresponding inbox item for the target user
  const inboxQuery = query(
    collection(db, INBOX_COLLECTION, toUid, "items"),
    where("referenceId", "==", requestId),
    where("type", "==", "follow_request")
  );
  
  const inboxSnap = await getDocs(inboxQuery);
  inboxSnap.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  return { success: true };
}

/**
 * 3) acceptFollowRequest
 * Accepts a PENDING request: creates follow record, updates status to ACCEPTED.
 */
export async function acceptFollowRequest(
  requestId: string,
  toUid: string
): Promise<RepoResult> {
  const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
  const snap = await getDoc(requestRef);

  if (!snap.exists()) {
    return {
      success: false,
      errorCode: ErrorCodes.REQUEST_NOT_FOUND,
      errorMessage: "Follow request not found.",
    };
  }

  const data = snap.data();
  if (data.toUid !== toUid) {
    return {
      success: false,
      errorCode: ErrorCodes.PERMISSION_DENIED,
      errorMessage: "You can only accept requests sent to you.",
    };
  }

  if (data.status !== "PENDING") {
    return {
      success: false,
      errorCode: ErrorCodes.INVALID_STATUS,
      errorMessage: "Only pending requests can be accepted.",
    };
  }

  const batch = writeBatch(db);

  // Update request status
  batch.update(requestRef, {
    status: "ACCEPTED" as RequestStatus,
    updatedAt: serverTimestamp(),
  });

  // Create follow record
  const followId = `${data.fromUid}_${toUid}`;
  const followRef = doc(db, FOLLOWS_COLLECTION, followId);
  batch.set(followRef, {
    followerId: data.fromUid,
    followingId: toUid,
    createdAt: serverTimestamp(),
  });

  // Mark inbox item as READ
  const inboxQuery = query(
    collection(db, INBOX_COLLECTION, toUid, "items"),
    where("referenceId", "==", requestId),
    where("type", "==", "follow_request")
  );
  const inboxSnap = await getDocs(inboxQuery);
  inboxSnap.docs.forEach((doc) => {
    batch.update(doc.ref, { status: "READ" });
  });

  // Update follower's following count
  const followerRef = doc(db, "users", data.fromUid);
  batch.update(followerRef, { followingCount: increment(1) });

  // Update target's followers count
  const followingRef = doc(db, "users", toUid);
  batch.update(followingRef, { followersCount: increment(1) });

  await batch.commit();

  return { success: true };
}

/**
 * 4) declineFollowRequest
 * Sets request status to DECLINED.
 */
export async function declineFollowRequest(
  requestId: string,
  toUid: string
): Promise<RepoResult> {
  const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
  const snap = await getDoc(requestRef);

  if (!snap.exists()) {
    return {
      success: false,
      errorCode: ErrorCodes.REQUEST_NOT_FOUND,
      errorMessage: "Follow request not found.",
    };
  }

  const data = snap.data();
  if (data.toUid !== toUid) {
    return {
      success: false,
      errorCode: ErrorCodes.PERMISSION_DENIED,
      errorMessage: "You can only decline requests sent to you.",
    };
  }

  if (data.status !== "PENDING") {
    return {
      success: false,
      errorCode: ErrorCodes.INVALID_STATUS,
      errorMessage: "Only pending requests can be declined.",
    };
  }

  const batch = writeBatch(db);

  batch.update(requestRef, {
    status: "DECLINED" as RequestStatus,
    updatedAt: serverTimestamp(),
  });

  // Mark inbox item as READ
  const inboxQuery = query(
    collection(db, INBOX_COLLECTION, toUid, "items"),
    where("referenceId", "==", requestId),
    where("type", "==", "follow_request")
  );
  const inboxSnap = await getDocs(inboxQuery);
  inboxSnap.docs.forEach((doc) => {
    batch.update(doc.ref, { status: "READ" });
  });

  await batch.commit();

  return { success: true };
}

/**
 * 5) unfollow
 * Deletes the follow record.
 */
export async function unfollow(
  followerUid: string,
  followingUid: string
): Promise<RepoResult> {
  const followId = `${followerUid}_${followingUid}`;
  const followRef = doc(db, FOLLOWS_COLLECTION, followId);
  const snap = await getDoc(followRef);

  if (!snap.exists()) {
    return {
      success: false,
      errorCode: ErrorCodes.NOT_FOLLOWING,
      errorMessage: "You are not following this user.",
    };
  }

  const batch = writeBatch(db);
  batch.delete(followRef);

  // Update follower's following count
  const followerRef = doc(db, "users", followerUid);
  batch.update(followerRef, { followingCount: increment(-1) });

  // Update target's followers count
  const followingRef = doc(db, "users", followingUid);
  batch.update(followingRef, { followersCount: increment(-1) });

  await batch.commit();

  return { success: true };
}

/**
 * Helper: Get request status between two users.
 */
export async function getRequestStatus(
  fromUid: string,
  toUid: string
): Promise<RequestStatus | null> {
  const requestId = getRequestDocId(fromUid, toUid);
  const requestRef = doc(db, REQUESTS_COLLECTION, requestId);
  const snap = await getDoc(requestRef);

  if (snap.exists()) {
    return snap.data().status as RequestStatus;
  }
  return null;
}

/**
 * Helper: Check if following.
 */
export async function isFollowing(
  followerUid: string,
  followingUid: string
): Promise<boolean> {
  const followId = `${followerUid}_${followingUid}`;
  const followRef = doc(db, FOLLOWS_COLLECTION, followId);
  const snap = await getDoc(followRef);
  return snap.exists();
}
