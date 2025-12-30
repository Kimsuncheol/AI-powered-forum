import React from "react";
import { Card, CardContent, CardActionArea } from "@mui/material";
import { Thread } from "@/lib/db/threads";
import Link from "next/link";
import ThreadCardHeader from "./ThreadCardHeader";
import ThreadCardContent from "./ThreadCardContent";
import ThreadCardFooter from "./ThreadCardFooter";

interface ThreadCardProps {
  thread: Thread;
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea component={Link} href={`/thread/${thread.id}`}>
        <CardContent>
          <ThreadCardHeader
            authorName={thread.authorName}
            createdAt={thread.createdAt}
            threadId={thread.id}
            threadTitle={thread.title}
          />
          <ThreadCardContent title={thread.title} content={thread.content} />
          <ThreadCardFooter
            tags={thread.tags}
            likes={thread.likes}
            commentsCount={thread.commentsCount}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
