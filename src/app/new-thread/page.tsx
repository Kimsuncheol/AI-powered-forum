import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import TagInput from "../../components/TagInput";
import TextEditor from "../../components/TextEditor";
import MediaUpload from "../../components/MediaUpload";
import LinkInput from "../../components/LinkInput";
import { useNavigate } from "react-router-dom";

type ThreadMode = "text" | "media" | "link";

const NewThreadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [mode, setMode] = useState<ThreadMode>("text");

  const handleModeChange = (
    event: React.SyntheticEvent,
    newValue: ThreadMode
  ) => {
    setMode(newValue);
  };

  const handlePost = (content: any) => {
    console.log("Posting new thread:", {
      title,
      tags,
      mode,
      content,
    });
    // Simulate API call and redirect
    navigate("/");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Adding a new thread
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TagInput tags={tags} onChange={setTags} />

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Tabs
            value={mode}
            onChange={handleModeChange}
            aria-label="thread type tabs"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="Text / Markdown" value="text" />
            <Tab label="Media" value="media" />
            <Tab label="Link" value="link" />
          </Tabs>

          <Box sx={{ minHeight: 300 }}>
            {mode === "text" && (
              <TextEditor
                onPost={(content, editorMode) =>
                  handlePost({ text: content, editorMode })
                }
              />
            )}
            {mode === "media" && (
              <MediaUpload onPost={(file) => handlePost({ file })} />
            )}
            {mode === "link" && (
              <LinkInput onPost={(url) => handlePost({ url })} />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NewThreadPage;
