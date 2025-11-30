import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import TagInput from "../components/TagInput";
import TextEditor from "../components/TextEditor";
import MediaUpload from "../components/MediaUpload";
import LinkInput from "../components/LinkInput";

type ThreadMode = "text" | "media" | "link";

const NewThreadPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mode, setMode] = useState<ThreadMode>("text");

  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ThreadMode | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handlePost = (content: any) => {
    console.log("New Thread Posted:", {
      title,
      tags,
      mode,
      content,
    });
    // Here you would typically redirect the user or show a success message
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Adding a new thread
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            gap: 2,
          }}
        >
          <TextField
            label="Title"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
          />
          <TagInput tags={tags} onChange={setTags} />
        </Box>

        <Box sx={{ mb: 3, display: "flex", justifyContent: "left" }}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="thread type"
          >
            <ToggleButton value="text" aria-label="text post">
              <ArticleIcon sx={{ mr: 1 }} /> Text
            </ToggleButton>
            <ToggleButton value="media" aria-label="media post">
              <ImageIcon sx={{ mr: 1 }} /> Media
            </ToggleButton>
            <ToggleButton value="link" aria-label="link post">
              <LinkIcon sx={{ mr: 1 }} /> Link
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box>
          {mode === "text" && <TextEditor onPost={handlePost} />}
          {mode === "media" && <MediaUpload onPost={handlePost} />}
          {mode === "link" && <LinkInput onPost={handlePost} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default NewThreadPage;
