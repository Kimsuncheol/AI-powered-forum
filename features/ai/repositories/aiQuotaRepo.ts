import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AiQuota, AiFeatureType } from "../types/AiQuota";
import { DEFAULT_AI_LIMITS } from "../types/AiQuota";

const QUOTAS_COLLECTION = "aiQuotas";

/**
 * Get or create AI quota document for a user
 */
export async function getUserQuota(userId: string): Promise<AiQuota> {
  const quotaRef = doc(db, QUOTAS_COLLECTION, userId);
  const quotaSnap = await getDoc(quotaRef);

  if (quotaSnap.exists()) {
    return quotaSnap.data() as AiQuota;
  }

  // Create new quota document with default limits
  const now = Date.now();
  const nextMonth = getNextMonthTimestamp(now);
  
  const newQuota: AiQuota = {
    userId,
    image: {
      used: 0,
      limit: DEFAULT_AI_LIMITS.image,
      resetDate: nextMonth,
    },
    video: {
      used: 0,
      limit: DEFAULT_AI_LIMITS.video,
      resetDate: nextMonth,
    },
    music: {
      used: 0,
      limit: DEFAULT_AI_LIMITS.music,
      resetDate: nextMonth,
    },
    text: {
      used: 0,
      limit: DEFAULT_AI_LIMITS.text,
      resetDate: nextMonth,
    },
  };

  await setDoc(quotaRef, newQuota);
  return newQuota;
}

/**
 * Increment usage for a specific AI feature type
 */
export async function incrementUsage(
  userId: string,
  featureType: AiFeatureType
): Promise<void> {
  const quotaRef = doc(db, QUOTAS_COLLECTION, userId);
  const quota = await getUserQuota(userId);

  // Check if we need to reset quota (new month)
  const now = Date.now();
  const featureQuota = quota[featureType];
  
  if (now >= featureQuota.resetDate) {
    // Reset quota for new month
    const nextMonth = getNextMonthTimestamp(now);
    await updateDoc(quotaRef, {
      [`${featureType}.used`]: 1,
      [`${featureType}.resetDate`]: nextMonth,
    });
  } else {
    // Increment usage
    await updateDoc(quotaRef, {
      [`${featureType}.used`]: featureQuota.used + 1,
    });
  }
}

/**
 * Check if user has quota remaining for a feature
 */
export async function checkQuotaAvailable(
  userId: string,
  featureType: AiFeatureType
): Promise<{ available: boolean; remaining: number; limit: number }> {
  const quota = await getUserQuota(userId);
  const featureQuota = quota[featureType];
  
  // Check if quota needs reset
  const now = Date.now();
  if (now >= featureQuota.resetDate) {
    return {
      available: true,
      remaining: featureQuota.limit,
      limit: featureQuota.limit,
    };
  }

  const remaining = featureQuota.limit - featureQuota.used;
  return {
    available: remaining > 0,
    remaining: Math.max(0, remaining),
    limit: featureQuota.limit,
  };
}

/**
 * Reset monthly quota for a user (called automatically or manually)
 */
export async function resetMonthlyQuota(userId: string): Promise<void> {
  const quotaRef = doc(db, QUOTAS_COLLECTION, userId);
  const nextMonth = getNextMonthTimestamp(Date.now());

  await updateDoc(quotaRef, {
    "image.used": 0,
    "image.resetDate": nextMonth,
    "video.used": 0,
    "video.resetDate": nextMonth,
    "music.used": 0,
    "music.resetDate": nextMonth,
    "text.used": 0,
    "text.resetDate": nextMonth,
  });
}

/**
 * Helper to get timestamp for the 1st of next month
 */
function getNextMonthTimestamp(currentTimestamp: number): number {
  const date = new Date(currentTimestamp);
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
