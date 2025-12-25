/**
 * Client-side email notification trigger
 * Calls the email API with user preference checks
 */

interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Trigger an email notification (client-side)
 */
export async function triggerEmailNotification(payload: EmailPayload): Promise<boolean> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Failed to send email notification");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error triggering email notification:", error);
    return false;
  }
}

/**
 * Generate follow request email content
 */
export function getFollowRequestEmailContent(fromUserName: string) {
  const subject = `${fromUserName} wants to follow you on AI Forum`;
  const text = `${fromUserName} has sent you a follow request. Log in to AI Forum to accept or decline.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1976d2; color: white; padding: 20px; text-align: center;">
        <h1>AI Forum</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2>New Follow Request</h2>
        <p><strong>${fromUserName}</strong> wants to follow you.</p>
        <p>Log in to your inbox to accept or decline this request.</p>
      </div>
    </div>
  `;
  return { subject, text, html };
}

/**
 * Generate like notification email content
 */
export function getLikeEmailContent(likerName: string, threadTitle: string) {
  const subject = `${likerName} liked your post`;
  const text = `${likerName} liked your post "${threadTitle}" on AI Forum.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1976d2; color: white; padding: 20px; text-align: center;">
        <h1>AI Forum</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2>Someone Liked Your Post! ❤️</h2>
        <p><strong>${likerName}</strong> liked your post:</p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #1976d2;">
          ${threadTitle}
        </blockquote>
      </div>
    </div>
  `;
  return { subject, text, html };
}

/**
 * Generate comment notification email content
 */
export function getCommentEmailContent(commenterName: string, threadTitle: string, commentText: string) {
  const subject = `${commenterName} commented on your post`;
  const preview = commentText.length > 100 ? commentText.substring(0, 100) + "..." : commentText;
  const text = `${commenterName} commented on "${threadTitle}": "${preview}"`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1976d2; color: white; padding: 20px; text-align: center;">
        <h1>AI Forum</h1>
      </div>
      <div style="padding: 30px; background: #fff;">
        <h2>New Comment on Your Post 💬</h2>
        <p><strong>${commenterName}</strong> commented on:</p>
        <blockquote style="background: #f5f5f5; padding: 15px; border-left: 4px solid #1976d2;">
          ${threadTitle}
        </blockquote>
        <p style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
          "${preview}"
        </p>
      </div>
    </div>
  `;
  return { subject, text, html };
}
