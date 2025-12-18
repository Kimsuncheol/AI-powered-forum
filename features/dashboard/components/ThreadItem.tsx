import React from "react";
import ThreadCard from "@/components/ThreadCard";
import { Thread } from "../api/thread.service";

interface ThreadItemProps {
  thread: Thread;
}

export default function ThreadItem({ thread }: ThreadItemProps) {
  return <ThreadCard thread={thread} />;
}
