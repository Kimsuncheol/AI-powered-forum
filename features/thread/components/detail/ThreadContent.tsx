import React from "react";
import { Thread } from "@/lib/db/threads";
import ThreadMediaSection from "./ThreadMediaSection";
import ThreadMainBody from "./ThreadMainBody";
import ThreadInteractionBar from "./ThreadInteractionBar";

interface ThreadContentProps {
  thread: Thread;
  threadId: string;
}

export default function ThreadContent({ thread, threadId }: ThreadContentProps) {
  const isMediaPost = thread.type === 'video' || thread.type === 'audio' || thread.type === 'link';

  return (
    <>
      {/* Primary Media Section (Link, Video, Audio) */}
      <ThreadMediaSection thread={thread} />

      {/* Main Content Body (Markdown or Text) */}
      {(!isMediaPost || thread.content) && (
        <ThreadMainBody thread={thread} />
      )}

      {/* Interaction Bar (Like, Share) */}
      <ThreadInteractionBar thread={thread} threadId={threadId} />
    </>
  );
}
