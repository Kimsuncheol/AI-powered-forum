import { getThreads, seedMockThreads, Thread } from "@/lib/db/threads";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export const threadService = {
  getThreads: async (
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    sortBy: "latest" | "popular" = "latest"
  ) => {
    return getThreads(lastDoc, sortBy);
  },

  seedData: async () => {
    return seedMockThreads();
  },
};

export type { Thread };
