import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignInModal from "@/features/auth/components/SignInModal";
import { AuthContext } from "@/context/AuthContext";

// Mock AuthContext
const mockSignInWithEmail = jest.fn();
const mockSignInWithGoogle = jest.fn();

const renderWithAuth = (ui: React.ReactNode) => {
  return render(
    <AuthContext.Provider
      value={{
        signInWithEmail: mockSignInWithEmail,
        signInWithGoogle: mockSignInWithGoogle,
        user: null,
        loading: false,
        signUp: jest.fn(),
        signOut: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        createUserWithEmailAndPassword: jest.fn(),
        signInWithPopup: jest.fn(),
        // Add other missing properties if needed by types, using explicit any mostly avoidable but good for mocks
      } as any}
    >
      {ui}
    </AuthContext.Provider>
  );
};

describe("SignInModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSwitchToSignUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open", () => {
    renderWithAuth(
      <SignInModal open={true} onClose={mockOnClose} onSwitchToSignUp={mockOnSwitchToSignUp} />
    );
    expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    renderWithAuth(
      <SignInModal open={false} onClose={mockOnClose} onSwitchToSignUp={mockOnSwitchToSignUp} />
    );
    expect(screen.queryByRole("heading", { name: "Sign In" })).not.toBeInTheDocument();
  });

  it("submits the form with email and password", async () => {
    renderWithAuth(
      <SignInModal open={true} onClose={mockOnClose} onSwitchToSignUp={mockOnSwitchToSignUp} />
    );

    fireEvent.change(screen.getByLabelText(/^Email Address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: "password123" } });
    
    const submitBtn = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSignInWithEmail).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("calls google sign in", async () => {
    renderWithAuth(
      <SignInModal open={true} onClose={mockOnClose} onSwitchToSignUp={mockOnSwitchToSignUp} />
    );

    const googleBtn = screen.getByRole("button", { name: /sign in with google/i });
    fireEvent.click(googleBtn);

    expect(mockSignInWithGoogle).toHaveBeenCalled();
  });

  it("switches to sign up modal", () => {
    renderWithAuth(
      <SignInModal open={true} onClose={mockOnClose} onSwitchToSignUp={mockOnSwitchToSignUp} />
    );

    const signUpBtn = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(signUpBtn);

    expect(mockOnSwitchToSignUp).toHaveBeenCalled();
  });
});
