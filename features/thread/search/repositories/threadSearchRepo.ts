import {
  collection,
  endAt,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Thread } from "../../types";
import { buildTitleTokens, normalizeTitleForSearch } from "../utils/titleSearch";

const THREADS_COLLECTION = "threads";

export interface ThreadSearchCursor {
  titleLower: string;
  id: string;
}

export interface ThreadSearchResult {
  threads: Thread[];
  nextCursor: ThreadSearchCursor | null;
}

function normalizeQuery(queryText: string): string {
  return normalizeTitleForSearch(queryText);
}

function takeKeywordTokens(queryText: string): string[] {
  return buildTitleTokens(queryText).slice(0, 10);
}

/**
 * MVP Firestore search strategy:
 * - Single-token queries use prefix search on `titleLower` with startAt/endAt.
 * - Multi-token queries use `array-contains-any` on `titleTokens` (no cursor).
 * This keeps the approach consistent with Firestore constraints and avoids full-text search.
 *
 * Phase 2 note:
 * Replace this repo with a hosted search engine (Algolia/Meilisearch/Typesense)
 * and move tokenization/indexing into the search provider for true full-text.
 */
export async function searchThreads(
  queryText: string,
  pageSize: number = 20,
  cursor: ThreadSearchCursor | null = null
): Promise<ThreadSearchResult> {
  const normalized = normalizeQuery(queryText);
  if (!normalized) {
    return { threads: [], nextCursor: null };
  }

  const tokens = takeKeywordTokens(queryText);
  const threadsRef = collection(db, THREADS_COLLECTION);

  if (tokens.length > 1) {
    const tokensQuery = query(
      threadsRef,
      where("titleTokens", "array-contains-any", tokens),
      firestoreLimit(pageSize)
    );
    const snapshot = await getDocs(tokensQuery);
    const threads = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Thread, "id">;
      return { id: doc.id, ...data };
    });
    return { threads, nextCursor: null };
  }

  const rangeEnd = `${normalized}\uf8ff`;
  const prefixQuery = cursor
    ? query(
        threadsRef,
        orderBy("titleLower"),
        orderBy("__name__"),
        startAfter(cursor.titleLower, cursor.id),
        endAt(rangeEnd),
        firestoreLimit(pageSize)
      )
    : query(
        threadsRef,
        orderBy("titleLower"),
        orderBy("__name__"),
        startAt(normalized),
        endAt(rangeEnd),
        firestoreLimit(pageSize)
      );

  const snapshot = await getDocs(prefixQuery);
  const threads = snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Thread, "id">;
    return { id: doc.id, ...data };
  });

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  const nextCursor = lastDoc
    ? { titleLower: (lastDoc.data() as Thread).titleLower || normalized, id: lastDoc.id }
    : null;

  return { threads, nextCursor: threads.length === pageSize ? nextCursor : null };
}
