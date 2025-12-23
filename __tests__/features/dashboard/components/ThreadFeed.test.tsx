import { render, screen, fireEvent } from "@testing-library/react";
import ThreadFeed from "@/features/dashboard/components/ThreadFeed";
import { Thread } from "@/features/dashboard/api/thread.service";

// Mock ThreadItem to simplify
jest.mock("@/features/dashboard/components/ThreadItem", () => ({
  __esModule: true,
  default: ({ thread }: { thread: Thread }) => (
    <div data-testid={`thread-${thread.id}`}>
      <h2>{thread.title}</h2>
      <p>{thread.content}</p>
    </div>
  ),
}));

// Mock Sentinel
jest.mock("@/components/InfiniteScrollSentinel", () => ({
  __esModule: true,
  default: ({ hasMore, onLoadMore }: any) => (
    <button onClick={onLoadMore} disabled={!hasMore}>
      {hasMore ? "Load More" : "No More"}
    </button>
  ),
}));

const mockThreads: Thread[] = [
  {
    id: "1",
    authorId: "alice",
    authorName: "Alice",
    title: "Alice Markdown",
    content: "# Header",
    createdAt: 1000,
  } as Thread,
  {
    id: "2",
    authorId: "bob",
    authorName: "Bob",
    title: "Bob Plain",
    content: "Plain text",
    createdAt: 2000,
  } as Thread,
];

describe("ThreadFeed", () => {
  it("renders loading state", () => {
    render(
      <ThreadFeed
        threads={[]}
        loading={true}
        loadingMore={false}
        error={null}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <ThreadFeed
        threads={[]}
        loading={false}
        loadingMore={false}
        error="Something went wrong"
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <ThreadFeed
        threads={[]}
        loading={false}
        loadingMore={false}
        error={null}
        hasMore={false}
        onLoadMore={jest.fn()}
      />
    );
    expect(screen.getByText("No threads found yet.")).toBeInTheDocument();
  });

  it("renders list of threads", () => {
    render(
      <ThreadFeed
        threads={mockThreads}
        loading={false}
        loadingMore={false}
        error={null}
        hasMore={true}
        onLoadMore={jest.fn()}
      />
    );

    expect(screen.getByTestId("thread-1")).toBeInTheDocument();
    expect(screen.getByText("Alice Markdown")).toBeInTheDocument();
    expect(screen.getByTestId("thread-2")).toBeInTheDocument();
    expect(screen.getByText("Bob Plain")).toBeInTheDocument();
  });

  it("calls onLoadMore when sentinel triggered", () => {
    const mockLoadMore = jest.fn();
    render(
      <ThreadFeed
        threads={mockThreads}
        loading={false}
        loadingMore={false}
        error={null}
        hasMore={true}
        onLoadMore={mockLoadMore}
      />
    );

    fireEvent.click(screen.getByText("Load More"));
    expect(mockLoadMore).toHaveBeenCalled();
  });
});
