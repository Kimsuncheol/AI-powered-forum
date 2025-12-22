import { render, screen, fireEvent } from "@testing-library/react";
import ThreadCard from "@/features/thread/components/ThreadCard";
import { useSettings } from "@/context/SettingsContext";
import { Thread } from "@/features/thread/types";
import { Timestamp } from "firebase/firestore";

// Mock dependencies
jest.mock("@/context/SettingsContext");
jest.mock("next/link", () => {
  const LinkMock = ({ children, href }: any) => <a href={href}>{children}</a>;
  LinkMock.displayName = "LinkMock";
  return LinkMock;
});

describe("ThreadCard - NSFW Filtering", () => {
  const baseThread: Thread = {
    id: "thread-1",
    title: "Test Thread",
    body: "Test content",
    authorId: "user-1",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    tagIds: ["tag1"],
    categoryId: "cat1",
    type: "text",
    commentsCount: 0,
  };

  const mockSettings = {
    autoPlayEnabled: false,
    nsfwFilterEnabled: true,
  };

  beforeEach(() => {
    (useSettings as jest.Mock).mockReturnValue(mockSettings);
  });

  it("shows NSFW badge when thread is marked as NSFW", () => {
    const nsfwThread = { ...baseThread, isNSFW: true };
    render(<ThreadCard thread={nsfwThread} />);
    
    expect(screen.getByText("NSFW")).toBeInTheDocument();
  });

  it("does not show NSFW badge for normal threads", () => {
    render(<ThreadCard thread={baseThread} />);
    
    expect(screen.queryByText("NSFW")).not.toBeInTheDocument();
  });

  it("blurs content when NSFW filter is enabled", () => {
    const nsfwThread = { ...baseThread, isNSFW: true };
    render(<ThreadCard thread={nsfwThread} />);
    
    expect(screen.getByText("Reveal NSFW Content")).toBeInTheDocument();
  });

  it("does not blur content when NSFW filter is disabled", () => {
    (useSettings as jest.Mock).mockReturnValue({
      ...mockSettings,
      nsfwFilterEnabled: false,
    });

    const nsfwThread = { ...baseThread, isNSFW: true };
    render(<ThreadCard thread={nsfwThread} />);
    
    expect(screen.queryByText("Reveal NSFW Content")).not.toBeInTheDocument();
    expect(screen.getByText("NSFW")).toBeInTheDocument(); // Badge still shown
  });

  it("reveals content when reveal button is clicked", () => {
    const nsfwThread = { ...baseThread, isNSFW: true, body: "Sensitive content" };
    render(<ThreadCard thread={nsfwThread} />);
    
    // Content should be blurred initially
    expect(screen.getByText("Reveal NSFW Content")).toBeInTheDocument();
    
    // Click reveal button
    const revealButton = screen.getByText("Reveal NSFW Content");
    fireEvent.click(revealButton);
    
    // Reveal button should disappear
    expect(screen.queryByText("Reveal NSFW Content")).not.toBeInTheDocument();
  });

  it("shows NSFW badge for thread with images", () => {
    const nsfwThread = { 
      ...baseThread, 
      isNSFW: true,
      imageUrls: ["https://example.com/image1.jpg"]
    };
    render(<ThreadCard thread={nsfwThread} />);
    
    expect(screen.getByText("NSFW")).toBeInTheDocument();
    expect(screen.getByText("Reveal NSFW Content")).toBeInTheDocument();
  });

  it("shows NSFW badge for thread with video", () => {
    const nsfwThread = { 
      ...baseThread, 
      isNSFW: true,
      type: "video" as const,
      mediaUrl: "https://youtube.com/watch?v=test"
    };
    render(<ThreadCard thread={nsfwThread} />);
    
    expect(screen.getByText("NSFW")).toBeInTheDocument();
    expect(screen.getByText("Reveal NSFW Content")).toBeInTheDocument();
  });

  it("does not blur already revealed NSFW content on re-render", () => {
    const nsfwThread = { ...baseThread, isNSFW: true };
    const { rerender } = render(<ThreadCard thread={nsfwThread} />);
    
    // Reveal content
    const revealButton = screen.getByText("Reveal NSFW Content");
    fireEvent.click(revealButton);
    
    // Re-render
    rerender(<ThreadCard thread={nsfwThread} />);
    
    // Should still be revealed
    expect(screen.queryByText("Reveal NSFW Content")).not.toBeInTheDocument();
  });
});
