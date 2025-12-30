"use client";

import React from "react";
import { Box, IconButton, Button, Badge } from "@mui/material";
import Link from "next/link";
import { AddCircleOutlineOutlined, ChatBubbleOutline } from "@mui/icons-material";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useRouter } from "next/navigation";
import { useInbox } from "@/features/inbox/hooks/useInbox";
import { useChatRooms } from "@/features/chat/hooks/useChatRooms";
import { useAuth } from "@/context/AuthContext";

interface UserActionsProps {
  isMobile: boolean;
}

export default function UserActions({ isMobile }: UserActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { items: inboxItems } = useInbox();
  const { rooms } = useChatRooms();

  // Calculate total unread messages across all chat rooms
  const unreadMessagesCount = React.useMemo(() => {
    if (!user?.uid) return 0;
    return rooms.reduce((total, room) => {
      const userUnreadCount = room.unreadCount?.[user.uid] || 0;
      return total + userUnreadCount;
    }, 0);
  }, [rooms, user]);

  // Unread notifications count
  const unreadNotificationsCount = inboxItems.length;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <IconButton
        component={Link}
        href="/inbox"
        size="small"
        sx={{ p: 0.75 }}
      >
        <Badge 
          badgeContent={unreadNotificationsCount} 
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              height: 16,
              minWidth: 16,
              padding: '0 4px',
            }
          }}
        >
          <NotificationsNoneOutlinedIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>
      <IconButton
        onClick={() => router.push("/chat")}
        size="small"
        sx={{ p: 0.75 }}
        data-testid="chat-trigger-button"
      >
        <Badge 
          badgeContent={unreadMessagesCount} 
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              height: 16,
              minWidth: 16,
              padding: '0 4px',
            }
          }}
        >
          <ChatBubbleOutline sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>
      {isMobile ? (
        <IconButton
          component={Link}
          href="/threads/new"
          size="small"
          color="primary"
        >
          <AddCircleOutlineOutlined sx={{ fontSize: 24 }} />
        </IconButton>
      ) : (
        <Button
          component={Link}
          href="/threads/new"
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineOutlined sx={{ fontSize: 24 }} />}
          sx={{
            textTransform: "none",
            borderRadius: 20,
            fontSize: "0.875rem",
            px: 2,
            py: 0.5,
            fontWeight: 700,
          }}
        >
          Create
        </Button>
      )}
    </Box>
  );
}
