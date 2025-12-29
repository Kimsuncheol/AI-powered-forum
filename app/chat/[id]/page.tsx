"use client";

import { useParams, useRouter } from "next/navigation";
import { ChatView } from "@/features/chat/components/ChatView";

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const handleBack = () => {
    router.push("/chat");
  };

  return <ChatView roomId={id} onBack={handleBack} />;
}
