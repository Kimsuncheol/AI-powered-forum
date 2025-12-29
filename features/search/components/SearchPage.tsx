"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchTab } from "../types";
import { useSearch } from "../hooks/useSearch";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import ThreadCard from "@/features/thread/components/ThreadCard";
import { UserCard } from "./UserCard";

const TAB_OPTIONS: Array<{ label: string; value: SearchTab }> = [
  { label: "Threads", value: "threads" },
  { label: "Users", value: "users" },
];


const DEBOUNCE_MS = 350;
const SKELETON_COUNT = 3;

function normalizeTab(tab: string | null): SearchTab {
  return tab === "users" ? "users" : "threads";
}

function buildSearchParams(current: URLSearchParams, query: string, tab: SearchTab) {
  const params = new URLSearchParams(current);
  if (query.trim()) {
    params.set("q", query.trim());
  } else {
    params.delete("q");
  }
  params.set("tab", tab);
  return params.toString();
}

export function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [tab, setTab] = useState<SearchTab>(() => normalizeTab(searchParams.get("tab")));
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);
  const { threads, users, loading, error, search } = useSearch();

  const urlQuery = searchParams.get("q") ?? "";
  const urlTab = normalizeTab(searchParams.get("tab"));
  
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [prevUrlTab, setPrevUrlTab] = useState(urlTab);

  // Adjust state during render when URL params change (e.g. back button)
  // This is the recommended pattern from React docs:
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQuery(urlQuery);
  }
  if (urlTab !== prevUrlTab) {
    setPrevUrlTab(urlTab);
    setTab(urlTab);
  }

  useEffect(() => {
    const nextSearch = buildSearchParams(searchParams, query, tab);
    if (nextSearch !== searchParams.toString()) {
      const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }
  }, [query, tab, router, pathname, searchParams]);

  useEffect(() => {
    search(debouncedQuery, tab);
  }, [debouncedQuery, tab, search]);

  const activeResults = useMemo(() => {
    return tab === "threads" ? threads : users;
  }, [tab, threads, users]);

  const normalizedDebouncedQuery = debouncedQuery.trim();
  const showPrompt = !query.trim() && !loading;
  const showEmptyState = !loading && !error && !!normalizedDebouncedQuery && activeResults.length === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Search
          </Typography>
          <TextField
            fullWidth
            placeholder="Search threads or users"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            size="medium"
          />
        </Box>

        <Tabs
          value={tab}
          onChange={(_, nextValue: SearchTab) => setTab(nextValue)}
          aria-label="Search tabs"
        >
          {TAB_OPTIONS.map((option) => (
            <Tab key={option.value} value={option.value} label={option.label} />
          ))}
        </Tabs>

        {error && <Alert severity="error">{error}</Alert>}

        {showPrompt && (
          <Alert severity="info">Start typing to search {tab === "threads" ? "threads" : "users"}.</Alert>
        )}

        {loading && (
          <Stack spacing={2}>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <Box key={`search-skeleton-${index}`} sx={{ borderRadius: 2 }}>
                <Skeleton variant="rectangular" height={120} />
              </Box>
            ))}
          </Stack>
        )}

        {showEmptyState && (
          <Alert severity="warning">
            No {tab === "threads" ? "threads" : "users"} matched &quot;{debouncedQuery}&quot;.
          </Alert>
        )}

        {!loading && !error && !!normalizedDebouncedQuery && activeResults.length > 0 && (
          <Stack spacing={2}>
            {tab === "threads"
              ? threads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)
              : users.map((user) => <UserCard key={user.uid} user={user} />)}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
