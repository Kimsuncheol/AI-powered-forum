import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
} from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import ReactMarkdown from "react-markdown";
import { useThemeMode } from "../context/ThemeContext";
interface TextEditorProps {
  onPost: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ onPost }) => {
  const [mode, setMode] = useState(0); // 0: Text, 1: Markdown
  const [content, setContent] = useState("");
  // ThemeMode
  const { mode: themeMode } = useThemeMode();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMode(newValue);
  };

  const handlePost = () => {
    if (content.trim()) {
      onPost(content);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Tabs
          value={mode}
          onChange={handleTabChange}
          aria-label="editor mode tabs"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Text" />
          <Tab label="Markdown" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {mode === 0 ? (
            <TextField
              fullWidth
              multiline
              minRows={6}
              placeholder="Write your post here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="outlined"
            />
          ) : (
            <Grid container spacing={2} sx={{ height: 400 }}>
              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{ height: "100%", overflow: "auto" }}
              >
                <CodeMirror
                  value={content}
                  height="100%"
                  extensions={[markdown()]}
                  onChange={(value) => setContent(value)}
                  theme={themeMode === "dark" ? "dark" : "light"}
                  style={{
                    border: "1px solid #ccc",
                    height: "100%",
                    textAlign: "left",
                  }}
                />
              </Grid>
              <Grid
                size={{ xs: 12, md: 6 }}
                sx={{
                  height: "100%",
                  overflow: "auto",
                  borderLeft: "1px dashed #ccc",
                }}
              >
                <Box sx={{ p: 1 }}>
                  {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  ) : (
                    <Typography color="text.secondary" fontStyle="italic">
                      Preview will appear here...
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!content.trim()}
        >
          Post
        </Button>
      </Box>
    </Box>
  );
};

export default TextEditor;
