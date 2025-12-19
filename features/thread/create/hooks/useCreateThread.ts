import { useState } from "react";
import { createThread } from "../../repositories/threadRepo";
import { ThreadCreateInput } from "../../types";
import { useAuth } from "@/context/AuthContext";

interface UseCreateThreadResult {
  create: (input: ThreadCreateInput) => Promise<string>;
  loading: boolean;
  error: Error | null;
}

export function useCreateThread(): UseCreateThreadResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const create = async (input: ThreadCreateInput): Promise<string> => {
    if (!user) {
      const err = new Error("User must be authenticated to create a thread");
      setError(err);
      throw err;
    }

    if (loading) {
      return Promise.reject(new Error("Operation in progress"));
    }

    setLoading(true);
    setError(null);

    try {
      // New repo signature: createThread(input, authorId) returns { id }
      const { id } = await createThread(input, user.uid);
      return id;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error("Failed to create thread");
      setError(errorObj);
      throw errorObj;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
