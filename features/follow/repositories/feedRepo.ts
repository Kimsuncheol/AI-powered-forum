import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Thread } from "@/features/thread/types";

const FOLLOWS_COLLECTION = "follows";
const THREADS_COLLECTION = "threads";

// Firestore IN query limit
const MAX_IN_QUERY_SIZE = 30;

export interface FeedPage {
  threads: Thread[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

/**
 * Get list of UIDs that the viewer is following.
 */
export async function getFollowingUids(viewerUid: string): Promise<string[]> {
  const q = query(
    collection(db, FOLLOWS_COLLECTION),
    where("followerUid", "==", viewerUid)
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data().followingUid as string);
}

/**
 * Fetch threads from followed users with cursor pagination.
 */
export async function fetchFollowingFeed(params: {
  followingUids: string[];
  cursor?: DocumentSnapshot | null;
  pageSize?: number;
}): Promise<FeedPage> {
  const { followingUids, cursor = null, pageSize = 10 } = params;

  // Empty following list
  if (followingUids.length === 0) {
    return { threads: [], lastDoc: null, hasMore: false };
  }

  // Firestore IN limit
  const limitedUids = followingUids.slice(0, MAX_IN_QUERY_SIZE);

  let q = query(
    collection(db, THREADS_COLLECTION),
    where("authorId", "in", limitedUids),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (cursor) {
    q = query(q, startAfter(cursor));
  }

  const snap = await getDocs(q);

  const threads: Thread[] = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "",
      body: data.body || "",
      authorId: data.authorId || "",
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
      tagIds: Array.isArray(data.tagIds) ? data.tagIds : [],
      categoryId: data.categoryId || "",
    };
  });

  const lastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
  const hasMore = snap.docs.length === pageSize;

  return { threads, lastDoc, hasMore };
}
