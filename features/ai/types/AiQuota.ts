export interface AiQuota {
  userId: string;
  image: {
    used: number;
    limit: number;
    resetDate: number; // Timestamp in milliseconds
  };
  video: {
    used: number;
    limit: number;
    resetDate: number;
  };
  music: {
    used: number;
    limit: number;
    resetDate: number;
  };
  text: {
    used: number;
    limit: number;
    resetDate: number;
  };
}

export type AiFeatureType = 'image' | 'video' | 'music' | 'text';

export interface AiUsageRecord {
  id: string;
  userId: string;
  featureType: AiFeatureType;
  timestamp: number;
  prompt?: string;
  resultUrl?: string;
}

// Default monthly limits
export const DEFAULT_AI_LIMITS = {
  image: 10,
  video: 5,
  music: 5,
  text: 50,
} as const;
