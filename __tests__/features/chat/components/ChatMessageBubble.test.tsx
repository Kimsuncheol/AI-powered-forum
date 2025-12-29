import React from "react";
import { render, screen } from "@testing-library/react";
import { ChatMessageBubble } from "@/features/chat/components/ChatMessageBubble";
import { Timestamp } from "firebase/firestore";
import { ChatMessage } from "@/features/chat/types";

describe("ChatMessageBubble", () => {
  const mockMessage: ChatMessage = {
    id: "msg-1",
    roomId: "room-1",
    senderId: "user-1",
    content: "Hello, this is a test message!",
    createdAt: Timestamp.fromDate(new Date()),
    readBy: ["user-1"],
  };

  it("renders message content correctly", () => {
    render(
      <ChatMessageBubble
        message={mockMessage}
        isOwn={true}
        senderName="You"
      />
    );
    expect(screen.getByText("Hello, this is a test message!")).toBeInTheDocument();
  });

  it("renders sender bubble with correct styling", () => {
    const { container } = render(
      <ChatMessageBubble
        message={mockMessage}
        isOwn={true}
        senderName="You"
      />
    );
    // Own messages should have flex-direction: row-reverse
    const messageBox = container.firstChild as HTMLElement;
    expect(messageBox).toHaveStyle({ flexDirection: "row-reverse" });
  });

  it("renders receiver bubble with correct styling", () => {
    const { container } = render(
      <ChatMessageBubble
        message={mockMessage}
        isOwn={false}
        senderName="John"
      />
    );
    // Other messages should have flex-direction: row
    const messageBox = container.firstChild as HTMLElement;
    expect(messageBox).toHaveStyle({ flexDirection: "row" });
  });

  it("displays avatar for other users when showAvatar is true", () => {
    render(
      <ChatMessageBubble
        message={mockMessage}
        isOwn={false}
        showAvatar={true}
        senderName="John"
      />
    );
    // Should show avatar letter
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("does not display avatar when showAvatar is false", () => {
    render(
      <ChatMessageBubble
        message={mockMessage}
        isOwn={false}
        showAvatar={false}
        senderName="John"
      />
    );
    // Should not show avatar
    expect(screen.queryByText("J")).not.toBeInTheDocument();
  });

  it("displays timestamp", () => {
    render(
      <ChatMessageBubble
        message={mockMessage}
        isOwn={true}
        senderName="You"
      />
    );
    // Should have some time text (e.g., "less than a minute ago")
    const timeText = screen.getByText(/ago|now/i);
    expect(timeText).toBeInTheDocument();
  });
});
