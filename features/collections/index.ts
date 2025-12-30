export { useBookmark } from "./hooks/useBookmark";
export { 
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
  toggleBookmark,
} from "./repositories/collectionsRepository";
export type { BookmarkedThread, BookmarkInput } from "./types";
