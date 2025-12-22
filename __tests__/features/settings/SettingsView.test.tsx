import { render, screen, fireEvent, within } from "@testing-library/react";
import SettingsView from "@/features/settings/components/SettingsView";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import { useAiQuota } from "@/features/ai/hooks/useAiQuota";

// Mock dependencies
jest.mock("@/context/AuthContext");
jest.mock("@/context/SettingsContext");
jest.mock("@/features/ai/hooks/useAiQuota");
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
    emailNotifications: true,
    pushNotifications: false,
    profileVisibility: "public" as const,
    showOnlineStatus: true,
    toggleEmailNotifications: jest.fn(),
    togglePushNotifications: jest.fn(),
    setProfileVisibility: jest.fn(),
    toggleOnlineStatus: jest.fn(),
    defaultFeed: "global" as const,
    nsfwFilterEnabled: true,
    compactView: false,
    commentsSortOrder: "newest" as const,
    setDefaultFeed: jest.fn(),
    toggleNsfwFilter: jest.fn(),
    toggleCompactView: jest.fn(),
    setCommentsSortOrder: jest.fn(),
    aiAssistanceEnabled: true,
    defaultAiModel: "image" as const,
    toggleAiAssistance: jest.fn(),
    setDefaultAiModel: jest.fn(),
    searchAutoSave: true,
    maxRecentSearches: 10 as const,
    toggleSearchAutoSave: jest.fn(),
    setMaxRecentSearches: jest.fn(),
    clearSearchHistory: jest.fn(),
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY" as const,
    setLanguage: jest.fn(),
    setTimezone: jest.fn(),
    setDateFormat: jest.fn(),
    reduceAnimations: false,
    toggleReduceAnimations: jest.fn(),
  };

  const mockQuota = {
    quota: null,
    status: { available: true, remaining: 5, limit: 10 },
    loading: false,
    error: null,
    consumeQuota: jest.fn(),
    refreshQuota: jest.fn(),
    hasQuota: true,
    remaining: 5,
    limit: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useSettings as jest.Mock).mockReturnValue(mockSettings);
    (useAiQuota as jest.Mock).mockReturnValue(mockQuota);
  });

  it("renders settings sections",  () => {
    render(<SettingsView />);
    
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument(); // Since mock user is password provider
    expect(screen.getByText("Notifications & Privacy")).toBeInTheDocument();
    expect(screen.getByText("Content Preferences")).toBeInTheDocument();
    expect(screen.getByText("AI Features")).toBeInTheDocument();
  });

  it("toggles auto-play setting", () => {
    render(<SettingsView />);
    
    // Find the specific auto-play switch by its label text
    const autoPlaySection = screen.getByText("Auto-play Media").closest('.MuiPaper-root');
    const switchElement = within(autoPlaySection!).getByRole("switch");
    fireEvent.click(switchElement);
    
    expect(mockSettings.toggleAutoPlay).toHaveBeenCalled();
  });

  it("shows password change button for password users", () => {
    render(<SettingsView />);
    expect(screen.getByText("Change Password")).toBeInTheDocument();
  });

  it("hides password change button for non-password users", () => {
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

  it("toggles NSFW filter setting", () => {
    render(<SettingsView />);
    
    // Get all switches and find the one near "NSFW Content Filter" text
    const nsfwText = screen.getByText("NSFW Content Filter");
    const allSwitches = screen.getAllByRole("switch");
    
    // The NSFW switch should be one of the switches - we'll check by clicking and verifying the mock
    // Find the parent that contains both the text and a switch
    const nsfwSwitch = allSwitches.find(sw => {
      const parent = sw.closest('.MuiStack-root');
      return parent?.textContent?.includes('NSFW Content Filter');
    });
    
    expect(nsfwSwitch).toBeDefined();
    fireEvent.click(nsfwSwitch!);
    
    expect(mockSettings.toggleNsfwFilter).toHaveBeenCalled();
  });

  it("opens delete account modal", () => {
    render(<SettingsView />);
    
    // Use button role with name to be more specific
    const deleteButton = screen.getByRole("button", { name: /delete account/i });
    fireEvent.click(deleteButton);
    
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens data export modal", () => {
    render(<SettingsView />);
    
    // Use button role with name to be more specific
    const exportButton = screen.getByRole("button", { name: /export data/i });
    fireEvent.click(exportButton);
    
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
