"use client";

import { useRouter } from "next/navigation";
import { ChatRoomList } from "@/features/chat/components/ChatRoomList";
import { ChatRoomListHeader } from "@/features/chat/components/ChatRoomListHeader";
import { FollowingUserAvatarsForChatRoomList } from "@/features/chat/components/FollowingUserAvatarsForChatRoomList";
import { ChatRoomWithParticipant } from "@/features/chat/types";
import { Box } from "@mui/material";

export default function ChatPage() {
  const router = useRouter();

  const handleSelectRoom = (room: ChatRoomWithParticipant) => {
    router.push(`/chat/${room.id}`);
  };

  return (
    <Box>
      {/* Header */}
      <ChatRoomListHeader />

      {/* Following Users */}
      <FollowingUserAvatarsForChatRoomList />

      {/* Chat Room List */}
      <ChatRoomList onSelectRoom={handleSelectRoom} />
    </Box>
  );
}

