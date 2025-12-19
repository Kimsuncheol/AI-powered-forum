import { Thread } from "@/features/thread/types";
import { UserProfile } from "@/features/profile/types";
import { searchThreads as searchThreadsRepo } from "@/features/thread/search/repositories/threadSearchRepo";
import { searchUsers as searchUsersRepo } from "@/features/profile/search/repositories/userSearchRepo";

const THREAD_LIMIT = 50;
const USER_LIMIT = 50;

function normalizeKeyword(keyword: string): string {
  return keyword.trim().toLowerCase();
}

export async function searchThreads(keyword: string): Promise<Thread[]> {
  const normalized = normalizeKeyword(keyword);
  if (!normalized) {
    return [];
  }

  const result = await searchThreadsRepo(normalized, THREAD_LIMIT, null);
  return result.threads;
}

export async function searchUsers(keyword: string): Promise<UserProfile[]> {
  const normalized = normalizeKeyword(keyword);
  if (!normalized) {
    return [];
  }

  const result = await searchUsersRepo(normalized, USER_LIMIT, null);
  return result.users;
}
