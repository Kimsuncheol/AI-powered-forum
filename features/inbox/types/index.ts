import { Timestamp } from "firebase/firestore";
import { InboxItemType, InboxItemStatus } from "@/features/follow/types";

// Re-export from follow types for convenience
export type { InboxItemType, InboxItemStatus } from "@/features/follow/types";

// Enriched inbox item for UI (with requester profile info)
export interface InboxItem {
  id: string;
  type: InboxItemType;
  referenceId: string;
  fromUid: string;
  status: InboxItemStatus;
  createdAt: Timestamp;
  // Enriched fields (populated by hooks/components)
  requesterName?: string;
  requesterAvatar?: string;
}
