"use client";

import { Box, Card, CardContent, Divider, Typography, Stack } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from "react";
import { getThread } from "@/features/thread/repositories/threadRepo";
import { Thread } from "@/features/thread/types";
import ThreadCard from "@/features/thread/components/ThreadCard";

interface AnswerResultProps {
  answer: string;
}

export const AnswerResult = ({ answer }: AnswerResultProps) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [cleanedAnswer, setCleanedAnswer] = useState("");

  useEffect(() => {
    const extractAndFetchThreads = async () => {
      // Extract thread IDs using regex: [THREAD:thread-id]
      const threadIdRegex = /\[THREAD:([^\]]+)\]/g;
      const matches = [...answer.matchAll(threadIdRegex)];
      const threadIds = matches.map(match => match[1]);

      // Remove thread markers from the answer for display
      const cleaned = answer.replace(threadIdRegex, '').trim();
      setCleanedAnswer(cleaned);

      // Fetch threads in parallel
      if (threadIds.length > 0) {
        const fetchedThreads = await Promise.all(
          threadIds.map(id => getThread(id))
        );
        // Filter out null values (threads that don't exist)
        setThreads(fetchedThreads.filter((t): t is Thread => t !== null));
      }
    };

    extractAndFetchThreads();
  }, [answer]);

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: 'calc(100vh - 314px)',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        borderRadius: 4, 
        bgcolor: 'background.paper', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        marginBottom: 2,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AutoAwesome fontSize="small" color="primary" />
          <Typography variant="overline" color="primary" fontWeight="bold">
            AI Generated Answer
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {/* Markdown Answer */}
        <Box sx={{ 
          typography: 'body1', 
          '& p': { mb: 2, lineHeight: 1.7 }, 
          '& ul': { pl: 3, mb: 2 },
          '& h1, & h2, & h3': { mt: 3, mb: 2, fontWeight: 'bold' },
          '& blockquote': { 
            borderLeft: '4px solid #ccc', 
            pl: 2, 
            py: 1, 
            my: 2, 
            bgcolor: 'action.hover' 
          }
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanedAnswer}</ReactMarkdown>
        </Box>

        {/* Referenced Threads */}
        {threads.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Referenced Threads
            </Typography>
            <Stack spacing={2}>
              {threads.map(thread => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
