import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatMessageInput } from "@/features/chat/components/ChatMessageInput";

describe("ChatMessageInput", () => {
  const mockOnSend = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input field with placeholder", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
  });

  it("renders custom placeholder when provided", () => {
    render(<ChatMessageInput onSend={mockOnSend} placeholder="Say something..." />);
    expect(screen.getByPlaceholderText("Say something...")).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    fireEvent.change(input!, { target: { value: "Hello!" } });
    expect(input).toHaveValue("Hello!");
  });

  it("calls onSend when send button clicked", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    fireEvent.change(input!, { target: { value: "Hello!" } });
    
    const sendButton = screen.getByTestId("chat-send-button");
    fireEvent.click(sendButton);
    
    expect(mockOnSend).toHaveBeenCalledWith("Hello!");
  });

  it("clears input after sending", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    fireEvent.change(input!, { target: { value: "Hello!" } });
    
    const sendButton = screen.getByTestId("chat-send-button");
    fireEvent.click(sendButton);
    
    expect(input).toHaveValue("");
  });

  it("sends message on Enter key press", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    fireEvent.change(input!, { target: { value: "Hello!" } });
    fireEvent.keyDown(input!, { key: "Enter", shiftKey: false });
    
    expect(mockOnSend).toHaveBeenCalledWith("Hello!");
  });

  it("does not send on Shift+Enter (new line)", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    fireEvent.change(input!, { target: { value: "Hello!" } });
    fireEvent.keyDown(input!, { key: "Enter", shiftKey: true });
    
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("disables send button when input is empty", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    const sendButton = screen.getByTestId("chat-send-button");
    expect(sendButton).toBeDisabled();
  });

  it("disables input when disabled prop is true", () => {
    render(<ChatMessageInput onSend={mockOnSend} disabled={true} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    expect(input).toBeDisabled();
  });

  it("disables send button when sending", () => {
    render(<ChatMessageInput onSend={mockOnSend} sending={true} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    fireEvent.change(input!, { target: { value: "Hello!" } });
    
    const sendButton = screen.getByTestId("chat-send-button");
    expect(sendButton).toBeDisabled();
  });

  it("does not send whitespace-only messages", () => {
    render(<ChatMessageInput onSend={mockOnSend} />);
    const input = screen.getByTestId("chat-message-input").querySelector("textarea");
    fireEvent.change(input!, { target: { value: "   " } });
    
    const sendButton = screen.getByTestId("chat-send-button");
    expect(sendButton).toBeDisabled();
  });
});
