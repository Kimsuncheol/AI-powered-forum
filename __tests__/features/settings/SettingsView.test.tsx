import { render, screen, fireEvent } from "@testing-library/react";
import SettingsView from "@/features/settings/components/SettingsView";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

// Mock dependencies
jest.mock("@/context/AuthContext");
jest.mock("@/context/SettingsContext");
jest.mock("@/components/ThemeToggle", () => {
  const ThemeToggleMock = () => <div data-testid="theme-toggle" />;
  ThemeToggleMock.displayName = "ThemeToggleMock";
  return ThemeToggleMock;
});

describe("SettingsView", () => {
  const mockUser = {
    uid: "test-uid",
    email: "test@example.com",
    providerData: [{ providerId: "password" }],
  };

  const mockSettings = {
    autoPlayEnabled: false,
    toggleAutoPlay: jest.fn(),
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useSettings as jest.Mock).mockReturnValue(mockSettings);
  });

  it("renders settings sections", () => {
    render(<SettingsView />);
    
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument(); // Since mock user is password provider
  });

  it("toggles auto-play setting", () => {
    render(<SettingsView />);
    
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    
    expect(mockSettings.toggleAutoPlay).toHaveBeenCalled();
  });

  it("shows password change button (visible) for password users", () => {
    // Default mock is password user
    render(<SettingsView />);
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  it("hides password change button for non-password users", () => {
    // Mock Google user
    (useAuth as jest.Mock).mockReturnValue({ 
      user: { ...mockUser, providerData: [{ providerId: "google.com" }] } 
    });
    
    render(<SettingsView />);
    expect(screen.queryByText("Change Password")).not.toBeInTheDocument();
  });

  it("opens change password modal", () => {
    render(<SettingsView />);
    fireEvent.click(screen.getByText("Change Password"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Change Password" })).toBeInTheDocument();
  });
});
