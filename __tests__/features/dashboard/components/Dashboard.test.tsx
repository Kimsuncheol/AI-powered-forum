import { render, screen } from "@testing-library/react";
import Dashboard from "@/features/dashboard/components/Dashboard";

jest.mock("@/features/thread/hooks/useInfiniteThreadFeed", () => ({
  useInfiniteThreadFeed: () => ({
    threads: [
      { id: "1", title: "Post 1", content: "Content 1" },
    ],
    loadingInitial: false,
    loadingMore: false,
    error: null,
    hasMore: false,
    loadInitial: jest.fn(),
    loadMore: jest.fn(),
  }),
}));

// Mock ThreadFeed child
jest.mock("@/features/dashboard/components/ThreadFeed", () => ({
  __esModule: true,
  default: ({ threads }: any) => (
    <div data-testid="thread-feed">
      {threads.map((t: any) => (
        <div key={t.id}>{t.title}</div>
      ))}
    </div>
  ),
}));

// Mock FollowingUserAvatars
jest.mock("@/features/dashboard/components/FollowingUserAvatars", () => ({
  __esModule: true,
  default: () => <div data-testid="following-avatars">Following Users</div>,
}));

describe("Dashboard", () => {
  it("renders FollowingUserAvatars component", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("following-avatars")).toBeInTheDocument();
  });

  it("renders ThreadFeed with data", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("thread-feed")).toBeInTheDocument();
    expect(screen.getByText("Post 1")).toBeInTheDocument();
  });
});
