import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InboxItem } from "../types";

const INBOX_COLLECTION = "inbox";

/**
 * Get all UNREAD inbox items for a user.
 */
export async function getUnreadInboxItems(userId: string): Promise<InboxItem[]> {
  const q = query(
    collection(db, INBOX_COLLECTION, userId, "items"),
    where("status", "==", "UNREAD"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      referenceId: data.referenceId,
      fromUid: data.fromUid,
      status: data.status,
      createdAt: data.createdAt as Timestamp,
    } as InboxItem;
  });
}

/**
 * Get all inbox items for a user (including READ).
 */
export async function getAllInboxItems(userId: string): Promise<InboxItem[]> {
  const q = query(
    collection(db, INBOX_COLLECTION, userId, "items"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      type: data.type,
      referenceId: data.referenceId,
      fromUid: data.fromUid,
      status: data.status,
      createdAt: data.createdAt as Timestamp,
    } as InboxItem;
  });
}
