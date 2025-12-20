import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Comment } from "../types";

export interface GetCommentFeedOptions {
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
  filters?: {
    authorId?: string;
    threadId?: string;
    parentId?: string | null;
  };
}

export interface GetCommentFeedResult {
  comments: Comment[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

const COMMENTS_COLLECTION = "comments";

// Helper to convert doc to Comment
const docToComment = (doc: QueryDocumentSnapshot<DocumentData>): Comment => {
  const data = doc.data();
  return {
    id: doc.id,
    threadId: data.threadId || "",
    body: data.body || "",
    authorId: data.authorId || "",
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
    parentId: data.parentId || null,
    replyCount: data.replyCount || 0,
    userDisplayName: data.userDisplayName,
    userPhotoURL: data.userPhotoURL,
  };
};

export async function createComment(
  commentData: Omit<Comment, "id" | "createdAt" | "updatedAt" | "replyCount">
): Promise<Comment> {
  const commentsRef = collection(db, COMMENTS_COLLECTION);
  const now = serverTimestamp();
  
  const docRef = await addDoc(commentsRef, {
    ...commentData,
    replyCount: 0,
    createdAt: now,
    updatedAt: now,
  });

  // If this is a reply, increment parent's replyCount
  if (commentData.parentId) {
    const parentRef = doc(db, COMMENTS_COLLECTION, commentData.parentId);
    await updateDoc(parentRef, {
      replyCount: increment(1)
    });
  }

  // Optionally increment thread's comment count (requires threadRepo access or separate logic)
  const threadRef = doc(db, "threads", commentData.threadId);
   // We try to update it, but ignore if it fails (e.g. permission or not exists in this context)
  try {
      await updateDoc(threadRef, {
          commentsCount: increment(1)
      });
  } catch (e) {
      console.warn("Could not update thread comment count", e);
  }

  // Return the new comment (approximate createdAt for UI until refresh)
  return {
    id: docRef.id,
    ...commentData,
    replyCount: 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export async function getCommentsForThread(threadId: string): Promise<Comment[]> {
  const commentsRef = collection(db, COMMENTS_COLLECTION);
  // Fetch top-level comments (parentId == null)
  const q = query(
    commentsRef,
    where("threadId", "==", threadId),
    where("parentId", "==", null),
    orderBy("createdAt", "desc")
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToComment);
}

export async function getReplies(parentId: string): Promise<Comment[]> {
    const commentsRef = collection(db, COMMENTS_COLLECTION);
    const q = query(
        commentsRef,
        where("parentId", "==", parentId),
        orderBy("createdAt", "asc") // Replies usually chronological
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToComment);
}

export async function getCommentFeed({
  pageSize = 20,
  cursor,
  filters,
}: GetCommentFeedOptions = {}): Promise<GetCommentFeedResult> {
  try {
    const commentsRef = collection(db, COMMENTS_COLLECTION);
    
    let q = query(
      commentsRef,
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (filters?.authorId) {
      q = query(q, where("authorId", "==", filters.authorId));
    }
    
    if (filters?.threadId) {
      q = query(q, where("threadId", "==", filters.threadId));
    }

    // Explicitly handle parentId filter if provided (e.g. fetching replies with pagination, though simpler API exists)
    // Note: Firestore requires composite index for equality + inequality/sort
    if (filters?.parentId !== undefined) {
         q = query(q, where("parentId", "==", filters.parentId));
    }

    if (cursor) {
      q = query(q, startAfter(cursor));
    }

    const snapshot = await getDocs(q);
    const comments: Comment[] = snapshot.docs.map(docToComment);

    const nextCursor = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1] : null;
    const hasMore = snapshot.docs.length === pageSize;

    return {
      comments,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching comment feed:", error);
    return {
      comments: [],
      nextCursor: null,
      hasMore: false,
    };
  }
}
