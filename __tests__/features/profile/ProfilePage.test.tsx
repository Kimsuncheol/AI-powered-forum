import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "@/features/profile/components/ProfilePage";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/features/profile/hooks/useUserProfile";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";

// Mock dependencies
jest.mock("@/context/AuthContext");
jest.mock("@/features/profile/hooks/useUserProfile");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/profile"),
}));
jest.mock("@/features/auth/services/auth.service", () => ({
  authService: {
    deleteAccount: jest.fn(),
  },
}));

// Mock child components
jest.mock("@/features/profile/components/ProfileHeader", () => () => <div data-testid="profile-header" />);
jest.mock("@/features/profile/components/tabs/MyThreadsTab", () => () => <div data-testid="my-threads-tab" />);
jest.mock("@/features/profile/components/tabs/MyCommentsTab", () => () => <div data-testid="my-comments-tab" />);
jest.mock("@/features/profile/components/tabs/AiUsageHistoryTab", () => () => <div data-testid="ai-usage-history-tab" />);

describe("ProfilePage", () => {
  const mockUser = { uid: "test-uid", email: "test@example.com" };
  const mockProfile = { displayName: "Test User" };
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser, loading: false });
    (useUserProfile as jest.Mock).mockReturnValue({ profile: mockProfile, loading: false, error: null });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders profile content", () => {
    render(<ProfilePage />);
    expect(screen.getByTestId("profile-header")).toBeInTheDocument();
  });

  it("shows Danger Zone and Delete Account button", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
    expect(screen.getByText("Opt Out / Delete Account")).toBeInTheDocument();
  });

  it("opens confirmation dialog on delete click", () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Opt Out / Delete Account"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete Account?")).toBeInTheDocument();
  });

  it("calls deleteAccount and redirects on confirmation", async () => {
    (authService.deleteAccount as jest.Mock).mockResolvedValue(undefined);
    render(<ProfilePage />);
    
    // Open dialog
    fireEvent.click(screen.getByText("Opt Out / Delete Account"));
    
    // Confirm delete
    const confirmButton = screen.getByText("Yes, Delete My Account");
    fireEvent.click(confirmButton);
    
    expect(confirmButton).toBeDisabled(); // Loading state check

    await waitFor(() => {
      expect(authService.deleteAccount).toHaveBeenCalled();
    });
    
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("handles delete account error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    (authService.deleteAccount as jest.Mock).mockRejectedValue(new Error("Failed"));

    render(<ProfilePage />);
    fireEvent.click(screen.getByText("Opt Out / Delete Account"));
    fireEvent.click(screen.getByText("Yes, Delete My Account"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    expect(alertSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
