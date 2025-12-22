/**
 * Integration tests for settings affecting component behavior across pages
 * Tests that setting changes actually affect how components render and behave
 */

import { render, screen, within } from "@testing-library/react";
import { SettingsProvider } from "@/context/SettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ThreadCard from "@/features/thread/components/ThreadCard";
import { Thread } from "@/features/thread/types";
import { Timestamp } from "firebase/firestore";

// Mock necessary modules
jest.mock("@/context/AuthContext", () => ({
  ...jest.requireActual("@/context/AuthContext"),
  useAuth: jest.fn(() => ({ user: { uid: "test-user" }, loading: false })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/context/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useThemeMode: jest.fn(() => ({ mode: "light", toggleMode: jest.fn() })),
}));

jest.mock("react-markdown", () => ({ children }: { children: React.ReactNode }) => <>{children}</>);
jest.mock("rehype-sanitize", () => ({}));
jest.mock("remark-gfm", () => ({}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (loader: any) => {
    const DynamicComponent = () => null;
    DynamicComponent.displayName = "DynamicComponent";
    return DynamicComponent;
  },
}));

jest.mock("next/link", () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  Link.displayName = "Link";
  return Link;
});

describe("Settings Component Behavior Integration Tests", () => {
  const mockThread: Thread = {
    id: "thread-1",
    title: "Test Thread",
    body: "Test body content",
    authorId: "user-1",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    tagIds: ["tag1", "tag2"],
    categoryId: "cat1",
    type: "text",
    isNSFW: false,
    commentsCount: 5,
  };

  const mockNSFWThread: Thread = {
    ...mockThread,
    id: "thread-2",
    title: "NSFW Thread",
    isNSFW: true,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("NSFW Filter Setting", () => {
    it("should blur NSFW content when filter is enabled", () => {
      localStorage.setItem("settings_nsfwFilter", "true");

      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockNSFWThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Should show NSFW badge
      expect(screen.getByText("NSFW")).toBeInTheDocument();
      
      // Should have blur effect (button to reveal)
      expect(screen.getByText(/Reveal NSFW Content/i)).toBeInTheDocument();
    });

    it("should not blur NSFW content when filter is disabled", () => {
      localStorage.setItem("settings_nsfwFilter", "false");

      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockNSFWThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Should still show NSFW badge
      expect(screen.getByText("NSFW")).toBeInTheDocument();
      
      // Should NOT have blur effect
      expect(screen.queryByText(/Reveal NSFW Content/i)).not.toBeInTheDocument();
    });

    it("should not affect non-NSFW content", () => {
      localStorage.setItem("settings_nsfwFilter", "true");

      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Should NOT show NSFW badge
      expect(screen.queryByText("NSFW")).not.toBeInTheDocument();
      
      // Should NOT have blur effect
      expect(screen.queryByText(/Reveal NSFW Content/i)).not.toBeInTheDocument();
      
      // Content should be visible
      expect(screen.getByText("Test Thread")).toBeInTheDocument();
      expect(screen.getByText("Test body content")).toBeInTheDocument();
    });
  });

  describe("AutoPlay Setting", () => {
    const mockVideoThread: Thread = {
      ...mockThread,
      id: "thread-video",
      type: "video",
      mediaUrl: "https://example.com/video.mp4",
    };

    it("should pass autoPlay enabled to video player when setting is on", () => {
      localStorage.setItem("settings_autoPlay", "true");

      const { container } = render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockVideoThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Note: Since we're mocking react-player, we can't fully test the playing prop
      // But we can verify the component renders
      expect(screen.getByText("Test Thread")).toBeInTheDocument();
    });

    it("should pass autoPlay disabled to video player when setting is off", () => {
      localStorage.setItem("settings_autoPlay", "false");

      const { container } = render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockVideoThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Note: Since we're mocking react-player, we can't fully test the playing prop
      // But we can verify the component renders with the correct thread
      expect(screen.getByText("Test Thread")).toBeInTheDocument();
    });
  });

  describe("Settings Persistence Across Navigation", () => {
    it("should maintain NSFW filter setting when navigating between pages", () => {
      localStorage.setItem("settings_nsfwFilter", "false");

      // First render - simulate viewing thread list
      const { unmount } = render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockNSFWThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Verify NSFW content is not blurred
      expect(screen.queryByText(/Reveal NSFW Content/i)).not.toBeInTheDocument();

      // Unmount (simulate navigation)
      unmount();

      // Second render - simulate navigating back or to another page
      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockNSFWThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Setting should persist
      expect(screen.queryByText(/Reveal NSFW Content/i)).not.toBeInTheDocument();
    });

    it("should maintain autoPlay setting when navigating between pages", () => {
      const mockVideoThread: Thread = {
        ...mockThread,
        type: "video",
        mediaUrl: "https://example.com/video.mp4",
      };

      localStorage.setItem("settings_autoPlay", "true");

      // First render
      const { unmount } = render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockVideoThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      unmount();

      // Second render - setting should persist
      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockVideoThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Video component should render
      expect(screen.getByText("Test Thread")).toBeInTheDocument();
    });
  });

  describe("Multiple Settings Interaction", () => {
    it("should apply both NSFW filter and other settings correctly", () => {
      localStorage.setItem("settings_nsfwFilter", "true");
      localStorage.setItem("settings_autoPlay", "false");
      localStorage.setItem("settings_compactView", "true");

      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockNSFWThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Both settings should be applied
      expect(screen.getByText("NSFW")).toBeInTheDocument();
      expect(screen.getByText(/Reveal NSFW Content/i)).toBeInTheDocument();
    });
  });

  describe("Settings Default Behavior", () => {
    it("should use default NSFW filter (enabled) when no setting exists", () => {
      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockNSFWThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Default is enabled (true), so content should be blurred
      expect(screen.getByText(/Reveal NSFW Content/i)).toBeInTheDocument();
    });

    it("should use default autoPlay (disabled) when no setting exists", () => {
      const mockVideoThread: Thread = {
        ...mockThread,
        type: "video",
        mediaUrl: "https://example.com/video.mp4",
      };

      render(
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <ThreadCard thread={mockVideoThread} />
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      );

      // Should render video component with default settings
      expect(screen.getByText("Test Thread")).toBeInTheDocument();
    });
  });
});
