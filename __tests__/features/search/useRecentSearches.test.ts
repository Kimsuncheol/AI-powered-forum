import { renderHook, act } from "@testing-library/react";
import { useRecentSearches } from "@/features/search/hooks/useRecentSearches";

// Storage keys from the hook (need to match)
const STORAGE_KEY = "recent_searches";
const AUTO_SAVE_KEY = "search_auto_save";

describe("useRecentSearches", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize with empty array and auto-save enabled", () => {
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.recentSearches).toEqual([]);
    expect(result.current.isAutoSaveEnabled).toBe(true);
  });

  it("should load initial values from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["react", "jest"]));
    localStorage.setItem(AUTO_SAVE_KEY, "false");

    const { result } = renderHook(() => useRecentSearches());

    expect(result.current.recentSearches).toEqual(["react", "jest"]);
    expect(result.current.isAutoSaveEnabled).toBe(false);
  });

  it("should add a search keyword when auto-save is enabled", () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch("new search");
    });

    expect(result.current.recentSearches).toEqual(["new search"]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(["new search"]);
  });

  it("should not add a search keyword when auto-save is disabled", () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.toggleAutoSave(); // Disable
    });

    expect(result.current.isAutoSaveEnabled).toBe(false);

    act(() => {
      result.current.addSearch("should not save");
    });

    expect(result.current.recentSearches).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("should move existing keyword to front and limit to 5 items", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["1", "2", "3", "4", "5"]));
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch("3"); // Move 3 to front
    });
    expect(result.current.recentSearches).toEqual(["3", "1", "2", "4", "5"]);

    act(() => {
      result.current.addSearch("6"); // Add 6, should drop 5 (wait, it drops the last after filtering)
    });
    // Expected: ["6", "3", "1", "2", "4"] (5 dropped because it was at index 4 after 6 added)
    expect(result.current.recentSearches).toEqual(["6", "3", "1", "2", "4"]);
  });

  it("should remove a specific search", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["a", "b", "c"]));
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.removeSearch("b");
    });

    expect(result.current.recentSearches).toEqual(["a", "c"]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(["a", "c"]);
  });

  it("should clear all searches", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(["a", "b", "c"]));
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.clearSearches();
    });

    expect(result.current.recentSearches).toEqual([]);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("should toggle auto-save and persist it", () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.toggleAutoSave();
    });

    expect(result.current.isAutoSaveEnabled).toBe(false);
    expect(localStorage.getItem(AUTO_SAVE_KEY)).toBe("false");

    act(() => {
      result.current.toggleAutoSave();
    });

    expect(result.current.isAutoSaveEnabled).toBe(true);
    expect(localStorage.getItem(AUTO_SAVE_KEY)).toBe("true");
  });
});
