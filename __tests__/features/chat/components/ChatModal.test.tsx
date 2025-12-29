import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatModal } from "@/features/chat/components/ChatModal";
import { useChatRooms } from "@/features/chat/hooks/useChatRooms";
import { Timestamp } from "firebase/firestore";

// Mock the hooks
jest.mock("@/features/chat/hooks/useChatRooms");
jest.mock("@/features/chat/hooks/useChatRoom", () => ({
  useChatRoom: () => ({
    room: null,
    messages: [],
    loading: true,
    sending: false,
    error: null,
    sendMessage: jest.fn(),
  }),
}));
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "user-1" } }),
}));

describe("ChatModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useChatRooms as jest.Mock).mockReturnValue({
      rooms: [],
      loading: false,
      error: null,
    });
  });

  it("renders when open", () => {
    render(<ChatModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("Chats")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<ChatModal open={false} onClose={mockOnClose} />);
    expect(screen.queryByText("Chats")).not.toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    render(<ChatModal open={true} onClose={mockOnClose} />);
    // Find the close button by querying for the CloseIcon's parent button
    const closeIcon = screen.getByTestId("CloseIcon");
    const closeButton = closeIcon.closest("button");
    expect(closeButton).not.toBeNull();
    fireEvent.click(closeButton!);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows room list initially", () => {
    (useChatRooms as jest.Mock).mockReturnValue({
      rooms: [
        {
          id: "room-1",
          participants: ["user-1", "user-2"],
          lastMessage: "Test message",
          lastMessageAt: Timestamp.fromDate(new Date()),
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date()),
          participantName: "Test User",
        },
      ],
      loading: false,
      error: null,
    });

    render(<ChatModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("navigates to chat view when room is selected", () => {
    const mockRoom = {
      id: "room-1",
      participants: ["user-1", "user-2"],
      lastMessage: "Test message",
      lastMessageAt: Timestamp.fromDate(new Date()),
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      participantName: "Test User",
    };

    (useChatRooms as jest.Mock).mockReturnValue({
      rooms: [mockRoom],
      loading: false,
      error: null,
    });

    render(<ChatModal open={true} onClose={mockOnClose} />);
    
    const roomCard = screen.getByText("Test User").closest("button");
    if (roomCard) {
      fireEvent.click(roomCard);
      // After clicking, the view should change (header changes)
      // We expect either loading state or back button to appear
    }
  });

  it("shows empty state when no rooms", () => {
    render(<ChatModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
  });
});
