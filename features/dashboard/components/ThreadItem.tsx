import React from "react";
import ThreadCard from "@/features/thread/components/ThreadCard";
import { Thread } from "@/features/thread/types";

interface ThreadItemProps {
  thread: Thread;
}

export default function ThreadItem({ thread }: ThreadItemProps) {
  return <ThreadCard thread={thread} />;
}
