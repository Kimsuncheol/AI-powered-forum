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
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Comment } from "../types";

export interface GetCommentFeedOptions {
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
  filters?: {
    authorId?: string;
    threadId?: string;
  };
}

export interface GetCommentFeedResult {
  comments: Comment[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

const COMMENTS_COLLECTION = "comments";

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

    if (cursor) {
      q = query(q, startAfter(cursor));
    }

    const snapshot = await getDocs(q);
    
    const comments: Comment[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        threadId: data.threadId || "",
        body: data.body || "",
        authorId: data.authorId || "",
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
      };
    });

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
