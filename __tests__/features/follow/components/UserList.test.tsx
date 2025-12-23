import { render, screen } from "@testing-library/react";
import { UserList } from "@/features/follow/components/UserList";
import { UserListItem } from "@/features/follow/components/UserListItem";
import { UserProfile } from "@/features/profile/types";

// Mock FollowButton to simplify tests
jest.mock("@/features/follow/components/FollowButton", () => ({
  FollowButton: () => <button>Follow</button>,
}));

const mockUser: UserProfile = {
  uid: "123",
  email: "test@example.com",
  displayName: "Test User",
  displayNameLower: "test user",
  photoURL: null,
  role: "user",
  createdAt: 1234567890,
  bio: "Hello world",
};

describe("UserListItem", () => {
  it("renders user information correctly", () => {
    render(<UserListItem user={mockUser} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders FollowButton", () => {
    render(<UserListItem user={mockUser} />);
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });
});

describe("UserList", () => {
  it("renders loading spinner when loading is true", () => {
    render(<UserList users={[]} loading={true} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders empty message when users array is empty", () => {
    render(<UserList users={[]} loading={false} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders list of users", () => {
    const users = [
      { ...mockUser, uid: "1", displayName: "User One" },
      { ...mockUser, uid: "2", displayName: "User Two" },
    ];
    render(<UserList users={users} loading={false} />);
    expect(screen.getByText("User One")).toBeInTheDocument();
    expect(screen.getByText("User Two")).toBeInTheDocument();
  });
});
