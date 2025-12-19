import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Follow } from "../types";

const FOLLOWS_COLLECTION = "follows";
const USERS_COLLECTION = "users";

/**
 * Generate document ID for a follow relationship.
 */
function getFollowDocId(followerId: string, followingId: string): string {
  return `${followerId}_${followingId}`;
}

/**
 * Follow a user.
 * Creates follow edge and updates denormalized counts.
 */
export async function followUser(
  followerId: string,
  followingId: string
): Promise<void> {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself");
  }

  const docId = getFollowDocId(followerId, followingId);
  const followRef = doc(db, FOLLOWS_COLLECTION, docId);

  // Check if already following
  const existing = await getDoc(followRef);
  if (existing.exists()) {
    return; // Already following
  }

  const batch = writeBatch(db);

  // Create follow edge
  batch.set(followRef, {
    followerId,
    followingId,
    createdAt: serverTimestamp(),
  });

  // Update follower's following count
  const followerRef = doc(db, USERS_COLLECTION, followerId);
  batch.update(followerRef, { followingCount: increment(1) });

  // Update target's followers count
  const followingRef = doc(db, USERS_COLLECTION, followingId);
  batch.update(followingRef, { followersCount: increment(1) });

  await batch.commit();
}

/**
 * Unfollow a user.
 * Removes follow edge and updates denormalized counts.
 */
export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<void> {
  const docId = getFollowDocId(followerId, followingId);
  const followRef = doc(db, FOLLOWS_COLLECTION, docId);

  // Check if actually following
  const existing = await getDoc(followRef);
  if (!existing.exists()) {
    return; // Not following
  }

  const batch = writeBatch(db);

  // Delete follow edge
  batch.delete(followRef);

  // Update follower's following count
  const followerRef = doc(db, USERS_COLLECTION, followerId);
  batch.update(followerRef, { followingCount: increment(-1) });

  // Update target's followers count
  const followingRef = doc(db, USERS_COLLECTION, followingId);
  batch.update(followingRef, { followersCount: increment(-1) });

  await batch.commit();
}

/**
 * Check if user A follows user B.
 */
export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const docId = getFollowDocId(followerId, followingId);
  const followRef = doc(db, FOLLOWS_COLLECTION, docId);
  const snap = await getDoc(followRef);
  return snap.exists();
}

/**
 * Get list of users that a user follows.
 */
export async function getFollowing(
  userId: string,
  maxResults: number = 30
): Promise<string[]> {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where("followerId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => (d.data() as Follow).followingId);
}

/**
 * Get list of users that follow a user.
 */
export async function getFollowers(
  userId: string,
  maxResults: number = 30
): Promise<string[]> {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where("followingId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => (d.data() as Follow).followerId);
}
