import { getThreadFeed } from "@/features/thread/api/threadFeedRepo";
import { Thread } from "@/features/thread/types";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export const threadService = {
  getThreads: async (
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    sortBy: "latest" | "popular" = "latest"
  ) => {
    // Adapter: Map old service signature to new repo signature
    // Note: sortBy is not yet supported in the new repo (defaults to latest), but ignoring for now to fix consistency
    const result = await getThreadFeed({
      pageSize: 10,
      cursor: lastDoc || null,
    });
    
    return {
      threads: result.threads,
      lastDoc: result.nextCursor,
    };
  },

  seedData: async () => {
    // We can keep using the old seed function from the DB layer since it just writes data
    // import dynamically or keep the old import just for this method if strictly needed.
    // For now, let's assume the DB layer seed is compatible (it writes fields).
    const { seedMockThreads } = await import("@/lib/db/threads");
    return seedMockThreads();
  },
};

export type { Thread };
