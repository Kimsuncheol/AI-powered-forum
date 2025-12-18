import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Thread } from "../types";

export interface GetThreadFeedOptions {
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface GetThreadFeedResult {
  threads: Thread[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

const THREADS_COLLECTION = "threads";

export async function getThreadFeed({
  pageSize = 20,
  cursor,
}: GetThreadFeedOptions = {}): Promise<GetThreadFeedResult> {
  try {
    const threadsRef = collection(db, THREADS_COLLECTION);
    
    let q = query(
      threadsRef,
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (cursor) {
      q = query(q, startAfter(cursor));
    }

    const snapshot = await getDocs(q);
    
    const threads: Thread[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        body: data.body || "",
        authorId: data.authorId || "",
        // Handle potentially missing or raw timestamps gracefully if needed, 
        // but assuming strict adherence to type here.
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : Timestamp.now(),
        tagIds: Array.isArray(data.tagIds) ? data.tagIds : [],
        categoryId: data.categoryId || "",
      };
    });

    const nextCursor = snapshot.docs.length === pageSize ? snapshot.docs[snapshot.docs.length - 1] : null;
    const hasMore = snapshot.docs.length === pageSize;

    return {
      threads,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching thread feed:", error);
    // Return safe empty state rather than crashing
    return {
      threads: [],
      nextCursor: null,
      hasMore: false,
    };
  }
}
