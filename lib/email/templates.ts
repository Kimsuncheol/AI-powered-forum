/**
 * Email Templates for AI Forum Notifications
 */

const FORUM_NAME = "AI Forum";
const PRIMARY_COLOR = "#1976d2";

/**
 * Base HTML template wrapper
 */
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${FORUM_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${PRIMARY_COLOR}; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${FORUM_NAME}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; text-align: center; color: #666666; font-size: 12px; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 8px 0;">You received this email because you have notifications enabled.</p>
              <p style="margin: 0;">To manage your notification preferences, visit your <a href="#" style="color: ${PRIMARY_COLOR};">Settings</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Follow Request Email Template
 */
export function followRequestEmailTemplate(fromUserName: string): { subject: string; text: string; html: string } {
  const subject = `${fromUserName} wants to follow you on ${FORUM_NAME}`;
  
  const text = `
${fromUserName} has sent you a follow request.

Log in to ${FORUM_NAME} to accept or decline this request.

Visit your inbox to manage follow requests.
  `.trim();

  const html = baseTemplate(`
    <h2 style="margin: 0 0 16px 0; color: #333333; font-size: 20px;">New Follow Request</h2>
    <p style="margin: 0 0 24px 0; color: #555555; font-size: 16px; line-height: 1.5;">
      <strong style="color: ${PRIMARY_COLOR};">${fromUserName}</strong> wants to follow you.
    </p>
    <p style="margin: 0 0 24px 0; color: #555555; font-size: 14px; line-height: 1.5;">
      Accept their request to let them see your posts and activity.
    </p>
    <a href="#" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      View Request
    </a>
  `);

  return { subject, text, html };
}

/**
 * Like Notification Email Template
 */
export function likeNotificationEmailTemplate(
  likerName: string,
  threadTitle: string
): { subject: string; text: string; html: string } {
  const subject = `${likerName} liked your post on ${FORUM_NAME}`;
  
  const text = `
${likerName} liked your post "${threadTitle}".

Log in to ${FORUM_NAME} to see your post.
  `.trim();

  const html = baseTemplate(`
    <h2 style="margin: 0 0 16px 0; color: #333333; font-size: 20px;">Someone Liked Your Post! ❤️</h2>
    <p style="margin: 0 0 24px 0; color: #555555; font-size: 16px; line-height: 1.5;">
      <strong style="color: ${PRIMARY_COLOR};">${likerName}</strong> liked your post:
    </p>
    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; border-left: 4px solid ${PRIMARY_COLOR}; margin-bottom: 24px;">
      <p style="margin: 0; color: #333333; font-size: 14px; font-weight: 500;">"${threadTitle}"</p>
    </div>
    <a href="#" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      View Post
    </a>
  `);

  return { subject, text, html };
}

/**
 * Comment Notification Email Template
 */
export function commentNotificationEmailTemplate(
  commenterName: string,
  threadTitle: string,
  commentPreview: string
): { subject: string; text: string; html: string } {
  const subject = `${commenterName} commented on your post`;
  
  const text = `
${commenterName} commented on your post "${threadTitle}":

"${commentPreview}"

Log in to ${FORUM_NAME} to respond.
  `.trim();

  const html = baseTemplate(`
    <h2 style="margin: 0 0 16px 0; color: #333333; font-size: 20px;">New Comment on Your Post 💬</h2>
    <p style="margin: 0 0 16px 0; color: #555555; font-size: 16px; line-height: 1.5;">
      <strong style="color: ${PRIMARY_COLOR};">${commenterName}</strong> commented on:
    </p>
    <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; border-left: 4px solid ${PRIMARY_COLOR}; margin-bottom: 16px;">
      <p style="margin: 0 0 8px 0; color: #666666; font-size: 12px; text-transform: uppercase;">Post</p>
      <p style="margin: 0; color: #333333; font-size: 14px; font-weight: 500;">"${threadTitle}"</p>
    </div>
    <div style="background-color: #e3f2fd; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; color: #666666; font-size: 12px; text-transform: uppercase;">Comment</p>
      <p style="margin: 0; color: #333333; font-size: 14px; font-style: italic;">"${commentPreview}"</p>
    </div>
    <a href="#" style="display: inline-block; background-color: ${PRIMARY_COLOR}; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
      View Comment
    </a>
  `);

  return { subject, text, html };
}
