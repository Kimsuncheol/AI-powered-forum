"use client";

import { authService } from "@/features/auth/services/auth.service";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);



  const handleSignInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
      toast.success("You have been signed in", {
        autoClose: 5000,
        position: "top-right",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google", error);
      toast.error("Failed to sign in", {
        autoClose: 5000,
        position: "top-right",
      });
      throw error;
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      await authService.signInWithEmail(email, password);
      toast.success("You have been signed in", {
        autoClose: 5000,
        position: "top-right",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing in with email", error);
      toast.error("Failed to sign in", {
        autoClose: 5000,
        position: "top-right",
      });
      throw error;
    }
  };
  
  const handleSignUp = async (email: string, password: string, displayName?: string) => {
    try {
      await authService.signUp(email, password, displayName);
      toast.success("You have been signed up", {
        autoClose: 5000,
        position: "top-right",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing up", error);
      toast.error("Failed to sign up", {
        autoClose: 5000,
        position: "top-right",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      toast.success("You have been signed out", {
        autoClose: 5000,
        position: "top-right",
      });
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error);
      toast.error("Failed to sign out", {
        autoClose: 5000,
        position: "top-right",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle: handleSignInWithGoogle, 
      signInWithEmail: handleSignInWithEmail,
      signUp: handleSignUp,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
