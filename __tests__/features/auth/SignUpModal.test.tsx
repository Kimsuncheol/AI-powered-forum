import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpModal from "@/features/auth/components/SignUpModal";
import { AuthContext } from "@/context/AuthContext";

// Mock AuthContext
const mockSignUp = jest.fn();

const renderWithAuth = (ui: React.ReactNode) => {
  return render(
    <AuthContext.Provider
      value={{
        signUp: mockSignUp,
        user: null,
        loading: false,
        signInWithEmail: jest.fn(),
        signInWithGoogle: jest.fn(),
        signOut: jest.fn(),
        reauthenticate: jest.fn(),
        updatePassword: jest.fn(),
        deleteUserAccount: jest.fn(),
      } as any}
    >
      {ui}
    </AuthContext.Provider>
  );
};

describe("SignUpModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSwitchToSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open", () => {
    renderWithAuth(
      <SignUpModal open={true} onClose={mockOnClose} onSwitchToSignIn={mockOnSwitchToSignIn} />
    );
    expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("submits form when inputs are valid", async () => {
    renderWithAuth(
      <SignUpModal open={true} onClose={mockOnClose} onSwitchToSignIn={mockOnSwitchToSignIn} />
    );

    fireEvent.change(screen.getByLabelText(/^Email Address/i), { target: { value: "newuser@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password/i), { target: { value: "password123" } });

    const submitBtn = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith("newuser@example.com", "password123");
    });
  });

  it("shows error when passwords do not match", async () => {
    renderWithAuth(
      <SignUpModal open={true} onClose={mockOnClose} onSwitchToSignIn={mockOnSwitchToSignIn} />
    );

    fireEvent.change(screen.getByLabelText(/^Email Address/i), { target: { value: "newuser@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/^Confirm Password/i), { target: { value: "mismatch" } });

    const submitBtn = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("switches to sign in modal", () => {
    renderWithAuth(
      <SignUpModal open={true} onClose={mockOnClose} onSwitchToSignIn={mockOnSwitchToSignIn} />
    );

    const signInBtn = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(signInBtn);

    expect(mockOnSwitchToSignIn).toHaveBeenCalled();
  });
});
