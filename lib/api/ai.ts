const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function summarizeThread(threadId: string, content: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/summarize-thread`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        thread_id: threadId,
        content: content,
      }),
    });

    if (!response.ok) {
      // Fallback for demo if backend is unavailable
      console.warn("Backend unavailable, using mock summary");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            "**[MOCK SUMMARY]**\n\nThe user discusses the impact of AI on software development. Key points include:\n- Potential for increased productivity.\n- Concerns about code quality.\n- The shifting role of junior developers."
          );
        }, 1500);
      });
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("AI API Error:", error);
     // Fallback for demo
    return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            "**[MOCK SUMMARY (Network Error)]**\n\nThe user discusses the impact of AI on software development. Key points include:\n- Potential for increased productivity.\n- Concerns about code quality.\n- The shifting role of junior developers."
          );
        }, 1500);
      });
  }
}
