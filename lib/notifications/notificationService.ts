/**
 * Notification Service
 * Handles email notification logic with user preference checks
 */

import {
  triggerEmailNotification,
  getFollowRequestEmailContent,
  getLikeEmailContent,
  getCommentEmailContent,
} from "@/lib/email/emailTrigger";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Check if user has email notifications enabled
 */
async function getUserEmailPreference(userId: string): Promise<{ enabled: boolean; email: string | null }> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      return { enabled: false, email: null };
    }
    const data = userDoc.data();
    return {
      enabled: data.emailNotifications !== false, // Default to true
      email: data.email || null,
    };
  } catch (error) {
    console.error("Error fetching user email preference:", error);
    return { enabled: false, email: null };
  }
}

/**
 * Send follow request notification email
 */
export async function notifyFollowRequest(
  targetUserId: string,
  fromUserName: string
): Promise<void> {
  try {
    const { enabled, email } = await getUserEmailPreference(targetUserId);
    if (!enabled || !email) return;

    const { subject, text, html } = getFollowRequestEmailContent(fromUserName);
    await triggerEmailNotification({ to: email, subject, text, html });
  } catch (error) {
    console.error("Failed to send follow request notification:", error);
  }
}

/**
 * Send like notification email
 */
export async function notifyLike(
  threadAuthorId: string,
  likerName: string,
  threadTitle: string
): Promise<void> {
  try {
    const { enabled, email } = await getUserEmailPreference(threadAuthorId);
    if (!enabled || !email) return;

    const { subject, text, html } = getLikeEmailContent(likerName, threadTitle);
    await triggerEmailNotification({ to: email, subject, text, html });
  } catch (error) {
    console.error("Failed to send like notification:", error);
  }
}

/**
 * Send comment notification email
 */
export async function notifyComment(
  threadAuthorId: string,
  commenterName: string,
  threadTitle: string,
  commentText: string
): Promise<void> {
  try {
    const { enabled, email } = await getUserEmailPreference(threadAuthorId);
    if (!enabled || !email) return;

    const { subject, text, html } = getCommentEmailContent(commenterName, threadTitle, commentText);
    await triggerEmailNotification({ to: email, subject, text, html });
  } catch (error) {
    console.error("Failed to send comment notification:", error);
  }
}
