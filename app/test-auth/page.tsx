"use client";

import { useAuth } from "@/context/AuthContext";
import React from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function TestAuthPage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Auth & Theme Test</h1>
        <ThemeToggle />
      </div>
      
      {user ? (
        <div className="space-y-4">
          <p className="text-green-600">Logged In as: {user.email ?? "Anonymous"}</p>
          <div className="p-4 border rounded bg-gray-50">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">Not Logged In</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => signInWithGoogle()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign In with Google
            </button>
            <div className="text-sm text-gray-500">
              Check console/code for Email/Password methods (signInWithEmail, signUp)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
