import React, { useState } from "react";
import { Box, TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "flex-end",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={10}
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        size="small"
        sx={{ mr: 1 }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!message.trim()}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default ChatInput;
