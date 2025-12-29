import React from "react";
import { render, screen } from "@testing-library/react";
import { ChatRoomList } from "@/features/chat/components/ChatRoomList";
import { useChatRooms } from "@/features/chat/hooks/useChatRooms";
import { Timestamp } from "firebase/firestore";

// Mock the hooks
jest.mock("@/features/chat/hooks/useChatRooms");

describe("ChatRoomList", () => {
  const mockOnSelectRoom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton when loading", () => {
    (useChatRooms as jest.Mock).mockReturnValue({
      rooms: [],
      loading: true,
      error: null,
    });

    render(<ChatRoomList onSelectRoom={mockOnSelectRoom} />);
    // Check for skeleton elements
    const skeletons = document.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders error state when error occurs", () => {
    (useChatRooms as jest.Mock).mockReturnValue({
      rooms: [],
      loading: false,
      error: "Failed to load chats",
    });

    render(<ChatRoomList onSelectRoom={mockOnSelectRoom} />);
    expect(screen.getByText("Failed to load chats")).toBeInTheDocument();
  });

  it("renders empty state when no rooms", () => {
    (useChatRooms as jest.Mock).mockReturnValue({
      rooms: [],
      loading: false,
      error: null,
    });

    render(<ChatRoomList onSelectRoom={mockOnSelectRoom} />);
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
    expect(
      screen.getByText("Start chatting with other users to see your conversations here.")
    ).toBeInTheDocument();
  });

  it("renders list of rooms", () => {
    const mockRooms = [
      {
        id: "room-1",
        participants: ["user-1", "user-2"],
        lastMessage: "Hello",
        lastMessageAt: Timestamp.fromDate(new Date()),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        participantName: "Alice",
      },
      {
        id: "room-2",
        participants: ["user-1", "user-3"],
        lastMessage: "Hi there",
        lastMessageAt: Timestamp.fromDate(new Date()),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        participantName: "Bob",
      },
    ];

    (useChatRooms as jest.Mock).mockReturnValue({
      rooms: mockRooms,
      loading: false,
      error: null,
    });

    render(<ChatRoomList onSelectRoom={mockOnSelectRoom} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });
});
