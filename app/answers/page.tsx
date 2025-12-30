"use client";

import { useState } from 'react';
import { Box, Alert } from "@mui/material";
import { aiService } from "@/features/ai/api/aiService";
import { AnswerHeader } from "@/features/ai/components/AnswerHeader";
import { AnswerSearchBar } from "@/features/ai/components/AnswerSearchBar";
import { AnswerResult } from "@/features/ai/components/AnswerResult";
import { AnswerSuggestions } from "@/features/ai/components/AnswerSuggestions";

export default function AnswersPage() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setAnswer('');
    
    try {
       const result = await aiService.generateAnswerFromForum(query);
       setAnswer(result);
    } catch (err) {
       setError("Failed to generate answer. Please try again.");
       console.error(err);
    } finally {
       setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4 }}>
      <AnswerHeader />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {answer && <AnswerResult answer={answer} />}
      
      <AnswerSearchBar 
        query={query}
        setQuery={setQuery}
        loading={loading}
        onSearch={handleAsk}
      />
      {!answer && !loading && <AnswerSuggestions />}
    </Box>
  );
}
