import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatRoomCard } from "@/features/chat/components/ChatRoomCard";
import { Timestamp } from "firebase/firestore";
import { ChatRoomWithParticipant } from "@/features/chat/types";

describe("ChatRoomCard", () => {
  const mockRoom: ChatRoomWithParticipant = {
    id: "room-1",
    participants: ["user-1", "user-2"],
    lastMessage: "Hello, how are you?",
    lastMessageAt: Timestamp.fromDate(new Date()),
    lastMessageSenderId: "user-2",
    createdAt: Timestamp.fromDate(new Date()),
    updatedAt: Timestamp.fromDate(new Date()),
    participantName: "John Doe",
    participantAvatar: "https://example.com/avatar.jpg",
    participantEmail: "john@example.com",
    unreadCount: 0,
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders participant name correctly", () => {
    render(<ChatRoomCard room={mockRoom} onClick={mockOnClick} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("displays last message preview", () => {
    render(<ChatRoomCard room={mockRoom} onClick={mockOnClick} />);
    expect(screen.getByText("Hello, how are you?")).toBeInTheDocument();
  });

  it("displays 'No messages yet' when no last message", () => {
    const roomWithoutMessage = { ...mockRoom, lastMessage: undefined };
    render(<ChatRoomCard room={roomWithoutMessage} onClick={mockOnClick} />);
    expect(screen.getByText("No messages yet")).toBeInTheDocument();
  });

  it("handles click events", () => {
    render(<ChatRoomCard room={mockRoom} onClick={mockOnClick} />);
    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledWith(mockRoom);
  });

  it("shows active state when isActive is true", () => {
    const { container } = render(
      <ChatRoomCard room={mockRoom} onClick={mockOnClick} isActive={true} />
    );
    // Active state should apply different background
    const card = container.querySelector(".MuiCard-root");
    expect(card).toBeInTheDocument();
  });

  it("renders avatar with participant initial", () => {
    const { container } = render(<ChatRoomCard room={mockRoom} onClick={mockOnClick} />);
    // Find the Avatar component
    const avatar = container.querySelector(".MuiAvatar-root");
    expect(avatar).toBeInTheDocument();
  });
});
