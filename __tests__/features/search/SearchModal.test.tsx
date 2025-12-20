import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchModal from "@/features/search/components/SearchModal";
import { useSearch } from "@/features/search/hooks/useSearch";
import { useRecentSearches } from "@/features/search/hooks/useRecentSearches";
import { useRouter } from "next/navigation";

// Mocks
jest.mock("@/features/search/hooks/useSearch");
jest.mock("@/features/search/hooks/useRecentSearches");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("SearchModal", () => {
  const mockOnClose = jest.fn();
  const mockPush = jest.fn();
  const mockSearch = jest.fn();
  const mockAddSearch = jest.fn();
  const mockRemoveSearch = jest.fn();
  const mockToggleAutoSave = jest.fn();
  const mockClearSearches = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearch as jest.Mock).mockReturnValue({
      threads: [],
      loading: false,
      search: mockSearch,
    });
    // Default mock implementation
    (useRecentSearches as jest.Mock).mockReturnValue({
      recentSearches: ["react", "typescript"],
      isAutoSaveEnabled: true,
      addSearch: mockAddSearch,
      removeSearch: mockRemoveSearch,
      toggleAutoSave: mockToggleAutoSave,
      clearSearches: mockClearSearches,
    });
  });

  it("renders when open", () => {
    render(<SearchModal open={true} onClose={mockOnClose} />);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("shows recent searches when input is empty", () => {
    render(<SearchModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("Recent Searches")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("triggers search on typing", async () => {
    render(<SearchModal open={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "test" } });

    // Wait for debounce
    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith("test", "threads");
    });
  });

  it("navigates on matching suggestion click", () => {
    (useSearch as jest.Mock).mockReturnValue({
      threads: [{ id: "1", title: "Test Thread", content: "Content" }],
      loading: false,
      search: mockSearch,
    });

    render(<SearchModal open={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "Test" } });

    const suggestion = screen.getByText("Test Thread");
    fireEvent.click(suggestion);

    expect(mockAddSearch).toHaveBeenCalledWith("Test Thread");
    expect(mockPush).toHaveBeenCalledWith("/search?q=Test%20Thread&tab=threads");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("navigates on enter key", () => {
    render(<SearchModal open={true} onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "query" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockAddSearch).toHaveBeenCalledWith("query");
    expect(mockPush).toHaveBeenCalledWith("/search?q=query&tab=threads");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("removes recent search", () => {
    render(<SearchModal open={true} onClose={mockOnClose} />);
    const deleteButtons = screen.getAllByLabelText("delete");
    fireEvent.click(deleteButtons[0]);
    expect(mockRemoveSearch).toHaveBeenCalledWith("react");
  });

  it("clears all searches", () => {
    render(<SearchModal open={true} onClose={mockOnClose} />);
    const clearButton = screen.getByRole("button", { name: /clear all/i });
    fireEvent.click(clearButton);
    expect(mockClearSearches).toHaveBeenCalled();
  });

  it("toggles auto-save", () => {
    render(<SearchModal open={true} onClose={mockOnClose} />);
    const toggle = screen.getByRole("switch", { name: /auto-save search history/i }); 
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);
    expect(mockToggleAutoSave).toHaveBeenCalled();
  });

  it("renders with auto-save disabled", () => {
    (useRecentSearches as jest.Mock).mockReturnValue({
      recentSearches: [],
      isAutoSaveEnabled: false,
      addSearch: mockAddSearch,
      removeSearch: mockRemoveSearch,
      toggleAutoSave: mockToggleAutoSave,
      clearSearches: mockClearSearches,
    });

    render(<SearchModal open={true} onClose={mockOnClose} />);
    const toggle = screen.getByRole("switch", { name: /auto-save search history/i });
    expect(toggle).not.toBeChecked();
  });
});
