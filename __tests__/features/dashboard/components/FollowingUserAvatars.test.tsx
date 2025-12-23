import { render, screen, waitFor } from "@testing-library/react";
import FollowingUserAvatars from "@/features/dashboard/components/FollowingUserAvatars";
import { useAuth } from "@/context/AuthContext";
import { useInfiniteFollowingUsers } from "@/features/follow/hooks/useInfiniteFollowingUsers";
import { UserProfile } from "@/features/profile/types";

// Mock dependencies
jest.mock("@/context/AuthContext");
jest.mock("@/features/follow/hooks/useInfiniteFollowingUsers");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseInfiniteFollowingUsers = useInfiniteFollowingUsers as jest.MockedFunction<
  typeof useInfiniteFollowingUsers
>;

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

global.IntersectionObserver = MockIntersectionObserver as any;

const mockUser = {
  uid: "test-user-123",
  email: "test@example.com",
} as any;

const createMockProfile = (id: string, name: string): UserProfile => ({
  uid: id,
  email: `${id}@example.com`,
  displayName: name,
  displayNameLower: name.toLowerCase(),
  photoURL: null,
  role: "user",
  createdAt: 1234567890,
  bio: `Bio for ${name}`,
});

describe("FollowingUserAvatars", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeletons when loading initial users", () => {
    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: [],
      loading: true,
      loadingMore: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
    });

    const { container } = render(<FollowingUserAvatars />);
    
    // Should show skeleton loaders (MUI Skeleton components have class MuiSkeleton-root)
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders nothing when no following users exist", () => {
    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: [],
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
    });

    const { container } = render(<FollowingUserAvatars />);
    
    // Component should return null for empty state
    expect(container.firstChild).toBeNull();
  });

  it("renders following users with avatars", () => {
    const mockUsers = [
      createMockProfile("user1", "Alice"),
      createMockProfile("user2", "Bob"),
      createMockProfile("user3", "Charlie"),
    ];

    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: mockUsers,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
    });

    render(<FollowingUserAvatars />);
    
    // Check for "Following" title
    expect(screen.getByText("Following")).toBeInTheDocument();
    
    // Check for user names (first name only)
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("renders avatars with profile links", () => {
    const mockUsers = [createMockProfile("user1", "Alice")];

    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: mockUsers,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
    });

    render(<FollowingUserAvatars />);
    
    // Check that links to profile exist
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/profile/user1");
  });

  it("shows loading skeleton when loading more users", () => {
    const mockUsers = [
      createMockProfile("user1", "Alice"),
      createMockProfile("user2", "Bob"),
    ];

    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: mockUsers,
      loading: false,
      loadingMore: true,
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
    });

    const { container } = render(<FollowingUserAvatars />);
    
    // Should show users and a loading skeleton at the end
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    
    // Check for skeleton (loadingMore state) by MUI class name
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("calls loadMore when last element is observed", async () => {
    const mockLoadMore = jest.fn();
    const mockUsers = [
      createMockProfile("user1", "Alice"),
      createMockProfile("user2", "Bob"),
    ];

    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: mockUsers,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: true,
      loadMore: mockLoadMore,
    });

    // Mock IntersectionObserver for this specific test
    const mockCallback = jest.fn();
    const mockObserve = jest.fn((node) => {
      // Simulate intersection immediately
      setTimeout(() => mockCallback([{ isIntersecting: true }]), 0);
    });
    
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
      mockCallback.mockImplementation(callback);
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: jest.fn(() => []),
      };
    }) as any;

    render(<FollowingUserAvatars />);
    
    // Wait for intersection observer to trigger
    await waitFor(() => {
      expect(mockLoadMore).toHaveBeenCalled();
    });
  });

  it("does not render when user is not logged in", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    } as any);

    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: [],
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
    });

    const { container } = render(<FollowingUserAvatars />);
    
    // Component should return null when no user
    expect(container.firstChild).toBeNull();
  });

  it("displays first name only from displayName", () => {
    const mockUsers = [
      createMockProfile("user1", "Alice Johnson"),
      createMockProfile("user2", "Bob Smith Jr"),
    ];

    mockUseInfiniteFollowingUsers.mockReturnValue({
      users: mockUsers,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: false,
      loadMore: jest.fn(),
    });

    render(<FollowingUserAvatars />);
    
    // Should show only first name
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Johnson")).not.toBeInTheDocument();
    expect(screen.queryByText("Smith")).not.toBeInTheDocument();
  });
});
