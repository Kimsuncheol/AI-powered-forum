import React from "react";
import { render, screen } from "@testing-library/react";
import { UserCard } from "@/features/search/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { useFollowRelationship } from "@/features/follow/hooks/useFollowRelationship";

// Mocks
jest.mock("@/context/AuthContext");
jest.mock("@/features/follow/hooks/useFollowRelationship");

describe("UserCard", () => {
  const mockUser = {
    uid: "user-1",
    email: "test@example.com",
    displayName: "Test User",
    photoURL: "",
    bio: "Test bio",
    role: "user" as const,
    createdAt: Date.now(),
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "viewer-1" } });
    (useFollowRelationship as jest.Mock).mockReturnValue({
      status: "NONE",
      loading: false,
      requestFollow: jest.fn(),
      cancelRequest: jest.fn(),
      unfollow: jest.fn(),
    });
  });

  it("renders user information", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Test bio")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("shows follow button when not following", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  it("shows following button when following", () => {
    (useFollowRelationship as jest.Mock).mockReturnValue({
      status: "FOLLOWING",
      loading: false,
    });
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("Following")).toBeInTheDocument();
  });

  it("shows requested button when requested", () => {
    (useFollowRelationship as jest.Mock).mockReturnValue({
      status: "REQUESTED",
      loading: false,
    });
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("Requested")).toBeInTheDocument();
  });
});
