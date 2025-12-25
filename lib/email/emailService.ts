/**
 * Email Service for sending notifications
 * This runs on the server-side (API routes)
 */

import {
  followRequestEmailTemplate,
  likeNotificationEmailTemplate,
  commentNotificationEmailTemplate,
} from "./templates";

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send an email via the API route
 */
async function sendEmail(params: SendEmailParams): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Send follow request notification email
 */
export async function sendFollowRequestEmail(
  toEmail: string,
  fromUserName: string
): Promise<boolean> {
  const { subject, text, html } = followRequestEmailTemplate(fromUserName);
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Send like notification email
 */
export async function sendLikeNotificationEmail(
  toEmail: string,
  likerName: string,
  threadTitle: string
): Promise<boolean> {
  const { subject, text, html } = likeNotificationEmailTemplate(likerName, threadTitle);
  return sendEmail({ to: toEmail, subject, text, html });
}

/**
 * Send comment notification email
 */
export async function sendCommentNotificationEmail(
  toEmail: string,
  commenterName: string,
  threadTitle: string,
  commentPreview: string
): Promise<boolean> {
  const { subject, text, html } = commentNotificationEmailTemplate(
    commenterName,
    threadTitle,
    commentPreview.length > 100 ? commentPreview.substring(0, 100) + "..." : commentPreview
  );
  return sendEmail({ to: toEmail, subject, text, html });
}
