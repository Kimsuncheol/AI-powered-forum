import { render, screen, fireEvent } from "@testing-library/react";
import { ConnectionsPage } from "@/features/follow/components/ConnectionsPage";
import { UserProfile } from "@/features/profile/types";

// Mock hooks
jest.mock("@/features/follow/hooks/useFollowers", () => ({
  useFollowers: () => ({
    followers: [
      { uid: "1", displayName: "Alice", role: "user" },
      { uid: "2", displayName: "Bob", role: "user" },
    ] as UserProfile[],
    loading: false,
  }),
}));

jest.mock("@/features/follow/hooks/useFollowing", () => ({
  useFollowing: () => ({
    following: [
      { uid: "3", displayName: "Charlie", role: "user" },
    ] as UserProfile[],
    loading: false,
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock UserList to avoid deep rendering loop issues and simplify
jest.mock("@/features/follow/components/UserList", () => ({
  UserList: ({ users }: { users: UserProfile[] }) => (
    <div data-testid="user-list">
      {users.map((u) => (
        <div key={u.uid}>{u.displayName}</div>
      ))}
    </div>
  ),
}));

describe("ConnectionsPage", () => {
  it("renders tabs and default followers list", () => {
    render(<ConnectionsPage userId="123" />);
    
    expect(screen.getByText(/Followers/)).toBeInTheDocument();
    expect(screen.getByText(/Following/)).toBeInTheDocument();
    
    // Check for followers
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  it("switches tabs to following", () => {
    render(<ConnectionsPage userId="123" />);
    
    const followingTab = screen.getByText(/Following/);
    fireEvent.click(followingTab);
    
    // Check for following
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("filters users via search", () => {
    render(<ConnectionsPage userId="123" />);
    
    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "ali" } });
    
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });
});
