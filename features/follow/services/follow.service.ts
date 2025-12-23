import {
  getFollowers as getFollowersIds,
  getFollowing as getFollowingIds,
  getFollowingPaginated,
} from "../repositories/followRepo";
import { DocumentSnapshot } from "firebase/firestore";
import { userProfileRepo } from "@/features/profile/repositories/userProfileRepo";
import { UserProfile } from "@/features/profile/types";

export const followService = {
  /**
   * Get list of UserProfiles that user follows.
   */
  getFollowingUsers: async (userId: string): Promise<UserProfile[]> => {
    try {
      // 1. Get IDs
      const followingIds = await getFollowingIds(userId, 50); // Get up to 50 for now

      if (followingIds.length === 0) {
        return [];
      }

      // 2. Fetch profiles
      // Ideally we use a 'where-in' query, but limiting to 10 at a time.
      // For simplicity/robustness in MVP, we can fetch them in parallel if list is small,
      // or batch fetch. FireStore 'in' supports max 10.
      // Let's implement individual fetches for now, or Promise.all.
      
      const profiles = await Promise.all(
        followingIds.map((id) => userProfileRepo.getUserProfile(id))
      );

      // Filter out nulls (deleted users)
      return profiles.filter((p): p is UserProfile => p !== null);
    } catch (error) {
      console.error("Error fetching following users:", error);
      throw error;
    }
  },

  /**
   * Get list of UserProfiles that user follows (paginated).
   */
  getFollowingUsersPaginated: async (
    userId: string,
    pageSize: number,
    lastDoc: DocumentSnapshot | null
  ): Promise<{ users: UserProfile[]; lastDoc: DocumentSnapshot | null }> => {
    try {
      // 1. Get IDs and next cursor
      const { uids, lastDoc: nextLastDoc } = await getFollowingPaginated(
        userId,
        pageSize,
        lastDoc
      );

      if (uids.length === 0) {
        return { users: [], lastDoc: nextLastDoc };
      }

      // 2. Fetch profiles
      const profiles = await Promise.all(
        uids.map((id) => userProfileRepo.getUserProfile(id))
      );

      // Filter out nulls
      const validProfiles = profiles.filter((p): p is UserProfile => p !== null);
      
      return { users: validProfiles, lastDoc: nextLastDoc };
    } catch (error) {
      console.error("Error fetching following users paginated:", error);
      throw error;
    }
  },

  /**
   * Get list of UserProfiles that follow the user.
   */
  getFollowersUsers: async (userId: string): Promise<UserProfile[]> => {
    try {
      // 1. Get IDs
      const followerIds = await getFollowersIds(userId, 50);

      if (followerIds.length === 0) {
        return [];
      }

      // 2. Fetch profiles
      const profiles = await Promise.all(
        followerIds.map((id) => userProfileRepo.getUserProfile(id))
      );

      return profiles.filter((p): p is UserProfile => p !== null);
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw error;
    }
  },
};
