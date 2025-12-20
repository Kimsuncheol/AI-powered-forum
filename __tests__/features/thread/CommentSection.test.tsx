import { render, screen, waitFor } from "@testing-library/react";
import CommentSection from "@/features/thread/components/CommentSection";
import { getCommentsForThread, createComment } from "@/features/thread/api/commentRepo";
import { useAuth } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore";

// Mock dependencies
jest.mock("@/features/thread/api/commentRepo");
jest.mock("@/context/AuthContext");

describe("CommentSection", () => {
  const mockComments = [
    {
      id: "c1",
      threadId: "t1",
      body: "Test comment",
      authorId: "u1",
      userDisplayName: "User One",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      parentId: null,
      replyCount: 0,
    },
  ];

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "u1", displayName: "User One" } });
    (getCommentsForThread as jest.Mock).mockResolvedValue(mockComments);
  });

  it("renders comments", async () => {
    render(<CommentSection threadId="t1" />);
    
    expect(screen.getByText("Comments")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Test comment")).toBeInTheDocument();
    });
  });

  it("shows login message when logged out", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    (getCommentsForThread as jest.Mock).mockResolvedValue([]);
    
    render(<CommentSection threadId="t1" />);
    
    await waitFor(() => {
       expect(screen.getByText("Please sign in to comment.")).toBeInTheDocument();
    });
  });
});
