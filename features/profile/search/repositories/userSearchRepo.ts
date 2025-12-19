import {
  collection,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "../../types";

const USERS_COLLECTION = "users";

export interface UserSearchCursor {
  displayNameLower: string;
  id: string;
}

export interface UserSearchResult {
  users: UserProfile[];
  nextCursor: UserSearchCursor | null;
}

function normalizeQuery(queryText: string): string {
  return queryText.trim().toLowerCase();
}

export async function searchUsers(
  queryText: string,
  pageSize: number = 20,
  cursor: UserSearchCursor | null = null
): Promise<UserSearchResult> {
  const normalized = normalizeQuery(queryText);
  if (!normalized) {
    return { users: [], nextCursor: null };
  }

  const rangeEnd = `${normalized}\uf8ff`;
  const usersRef = collection(db, USERS_COLLECTION);

  const usersQuery = cursor
    ? query(
        usersRef,
        where("displayNameLower", ">=", normalized),
        where("displayNameLower", "<=", rangeEnd),
        orderBy("displayNameLower"),
        orderBy("__name__"),
        startAfter(cursor.displayNameLower, cursor.id),
        firestoreLimit(pageSize)
      )
    : query(
        usersRef,
        where("displayNameLower", ">=", normalized),
        where("displayNameLower", "<=", rangeEnd),
        orderBy("displayNameLower"),
        orderBy("__name__"),
        firestoreLimit(pageSize)
      );

  const snapshot = await getDocs(usersQuery);
  const users = snapshot.docs.map((doc) => {
    const data = doc.data() as UserProfile;
    return { ...data, uid: data.uid ?? doc.id };
  });

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  const nextCursor = lastDoc
    ? {
        displayNameLower:
          (lastDoc.data() as UserProfile).displayNameLower || normalized,
        id: lastDoc.id,
      }
    : null;

  return { users, nextCursor: users.length === pageSize ? nextCursor : null };
}
