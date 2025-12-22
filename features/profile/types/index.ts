import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  displayNameLower?: string;
  photoURL: string | null;
  role: "user" | "admin";
  createdAt: number; // Milliseconds
  bio?: string;
  
  // Notification preferences
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  notificationToken?: string; // FCM token
  
  // Privacy settings
  profileVisibility?: 'public' | 'private';
  showOnlineStatus?: boolean;
  
  // AI quota tracking
  aiQuotaId?: string; // Reference to user's quota document
  
  // Localization
  language?: string;
  timezone?: string;
  dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY';
}

export interface UserActivityStats {
  threadCount: number;
  commentCount: number;
}
