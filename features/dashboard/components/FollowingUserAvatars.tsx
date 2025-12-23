"use client";

import React, { useRef, useCallback } from "react";
import { Box, Avatar, Typography, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { useInfiniteFollowingUsers } from "@/features/follow/hooks/useInfiniteFollowingUsers";
import { useAuth } from "@/context/AuthContext";

export default function FollowingUserAvatars() {
  const { user } = useAuth();
  const { users, loading, loadingMore, hasMore, loadMore } =
    useInfiniteFollowingUsers(user?.uid);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastUserElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  if (!user) return null;

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2, mb: 2 }}>
        {[...Array(6)].map((_, i) => (
          <Skeleton
            key={i}
            variant="circular"
            width={56}
            height={56}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Box>
    );
  }



  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 1,
          py: 1, // Add some padding for shadow/ring effects
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none", // Firefox
        }}
      >
        {users.map((profile, index) => {
          const isLast = index === users.length - 1;
          return (
            <Box
              key={profile.uid}
              ref={isLast ? lastUserElementRef : null}
              component={Link}
              href={`/profile/${profile.uid}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                flexShrink: 0,
                width: 70, // Fixed width for alignment
              }}
            >
              <Avatar
                src={profile.photoURL || undefined}
                alt={profile.displayName || "User"}
                sx={{
                  width: 64, // Slightly larger for "Story" feel
                  height: 64,
                  mb: 0.5,
                  border: "2px solid",
                  borderColor: "primary.main",
                  // Add hover effect
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s",
                  },
                }}
              >
                {profile.displayName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "0.75rem",
                }}
              >
                {profile.displayName?.split(" ")[0]}
              </Typography>
            </Box>
          );
        })}
        {loadingMore && hasMore && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              flexShrink: 0,
            }}
          >
            <Skeleton variant="circular" width={56} height={56} />
          </Box>
        )}
        <Box
          component={Link}
          href="/search?tab=users"  // Don't modify this line
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            flexShrink: 0,
            width: 70,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mb: 0.5,
              border: "2px dashed",
              borderColor: "divider",
              bgcolor: "background.paper",
              color: "text.secondary",
              "&:hover": {
                borderColor: "primary.main",
                color: "primary.main",
                transform: "scale(1.05)",
                transition: "transform 0.2s, border-color 0.2s, color 0.2s",
              },
            }}
          >
            <AddIcon />
          </Avatar>
          <Typography
            variant="caption"
            sx={{
              width: "100%",
              textAlign: "center",
              fontSize: "0.75rem",
            }}
          >
            Find People
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
