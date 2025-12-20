import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CommentItem from "@/features/thread/components/CommentItem";
import { getReplies, createComment } from "@/features/thread/api/commentRepo";
import { useAuth } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore";

jest.mock("@/features/thread/api/commentRepo");
jest.mock("@/context/AuthContext");

describe("CommentItem", () => {
  const mockComment = {
    id: "c1",
    threadId: "t1",
    body: "Parent comment",
    authorId: "u1",
    userDisplayName: "User One",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    parentId: null,
    replyCount: 2,
  };

  const mockReply = {
    id: "r1",
    threadId: "t1",
    body: "Reply comment",
    authorId: "u2",
    userDisplayName: "User Two",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    parentId: "c1",
    replyCount: 0,
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "u2", displayName: "User Two" } });
    (getReplies as jest.Mock).mockResolvedValue([mockReply]);
  });

  it("renders comment content", () => {
    render(<CommentItem comment={mockComment} threadId="t1" />);
    expect(screen.getByText("Parent comment")).toBeInTheDocument();
    expect(screen.getByText("User One")).toBeInTheDocument();
  });

  it("toggles replies", async () => {
    render(<CommentItem comment={mockComment} threadId="t1" />);
    
    const viewButton = screen.getByText("View 2 Replies");
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(getReplies).toHaveBeenCalledWith("c1");
      expect(screen.getByText("Reply comment")).toBeInTheDocument();
    });
  });

  it("opens reply form", () => {
    render(<CommentItem comment={mockComment} threadId="t1" />);
    
    const replyButton = screen.getByText("Reply");
    fireEvent.click(replyButton);
    
    // Check for placeholder containing display username
    expect(screen.getByPlaceholderText(/Reply to User One/)).toBeInTheDocument();
  });
});
