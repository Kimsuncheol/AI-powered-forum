"use client";

import React, { useRef, useCallback } from "react";
import { Box, Avatar, Typography, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useInfiniteFollowingUsersForChatList } from "@/features/follow/hooks/useInfiniteFollowingUsersForChatList";
import { getOrCreateChatRoom } from "../repositories/chatRepository";

export function FollowingUserAvatarsForChatRoomList() {
  const { user } = useAuth();
  const router = useRouter();
  const { users, loading, loadingMore, hasMore, loadMore } =
    useInfiniteFollowingUsersForChatList(user?.uid);
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

  const handleUserClick = async (targetUserId: string, existingRoomId: string | null) => {
    if (!user?.uid) return;

    if (existingRoomId) {
      router.push(`/chat/${existingRoomId}`);
    } else {
      try {
        const newRoom = await getOrCreateChatRoom(user.uid, targetUserId);
        router.push(`/chat/${newRoom.id}`);
      } catch (error) {
        console.error("Failed to create chat room:", error);
      }
    }
  };

  if (!user) return null;

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", px: 2, py: 2 }}>
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

  if (users.length === 0) {
    return null; 
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          px: 2,
          py: 2,
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
              onClick={() => handleUserClick(profile.uid, profile.chatRoomId)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                flexShrink: 0,
                width: 70,
              }}
            >
              <Avatar
                src={profile.photoURL || undefined}
                alt={profile.displayName || "User"}
                sx={{
                  width: 64,
                  height: 64,
                  mb: 0.5,
                  border: "2px solid",
                  borderColor: "divider", // Default border
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    transform: "scale(1.05)",
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
      </Box>
    </Box>
  );
}
