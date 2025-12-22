import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import ReactMarkdown from "react-markdown";
import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { dracula } from "@uiw/codemirror-theme-dracula";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your markdown here...",
  minHeight = "300px",
  disabled = false,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const theme = useTheme();

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: "write" | "preview"
  ) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 1,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="markdown editor tabs"
          sx={{ minHeight: 40 }}
        >
          <Tab
            label="Write"
            value="write"
            sx={{ textTransform: "none", minHeight: 40, py: 1 }}
          />
          <Tab
            label="Preview"
            value="preview"
            sx={{ textTransform: "none", minHeight: 40, py: 1 }}
            disabled={!value.trim()}
          />
        </Tabs>
      </Box>

      <Box sx={{ p: 0 }}>
        {activeTab === "write" && (
          <CodeMirror
            value={value}
            height={minHeight}
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
            ]}
            onChange={(val) => {
              if (!disabled) onChange(val);
            }}
            theme={dracula}
            placeholder={placeholder}
            editable={!disabled}
            basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
            }}
          />
        )}
        {activeTab === "preview" && (
          <Box
            sx={{
              p: 2,
              minHeight: minHeight,
              "& h1": {
                fontSize: "2rem",
                fontWeight: 700,
                mt: 2,
                mb: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 0.5,
              },
              "& h2": {
                fontSize: "1.5rem",
                fontWeight: 600,
                mt: 2,
                mb: 1,
              },
              "& h3": {
                fontSize: "1.25rem",
                fontWeight: 600,
                mt: 1.5,
                mb: 0.5,
              },
              "& h4": {
                fontSize: "1.1rem",
                fontWeight: 600,
                mt: 1.5,
                mb: 0.5,
              },
              "& h5": {
                fontSize: "1rem",
                fontWeight: 600,
                mt: 1,
                mb: 0.5,
              },
              "& h6": {
                fontSize: "0.9rem",
                fontWeight: 600,
                mt: 1,
                mb: 0.5,
              },
              "& p": {
                my: 1,
                lineHeight: 1.6,
              },
              "& ul, & ol": {
                pl: 3,
                my: 1,
              },
              "& li": {
                my: 0.5,
              },
              "& code": {
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                px: 0.5,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: "0.9em",
                fontFamily: "monospace",
              },
              "& pre": {
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                p: 1.5,
                borderRadius: 1,
                overflow: "auto",
                my: 1,
                "& code": {
                  bgcolor: "transparent",
                  px: 0,
                  py: 0,
                },
              },
              "& a": {
                color: theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              "& img": { 
                maxWidth: "100%",
                borderRadius: 1,
                my: 1,
              },
              "& blockquote": {
                borderLeft: `4px solid ${theme.palette.divider}`,
                m: 0,
                my: 1,
                pl: 2,
                py: 0.5,
                color: "text.secondary",
                fontStyle: "italic",
              },
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                my: 1,
              },
              "& th, & td": {
                border: `1px solid ${theme.palette.divider}`,
                px: 1,
                py: 0.5,
                textAlign: "left",
              },
              "& th": {
                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                fontWeight: 600,
              },
              "& hr": {
                border: "none",
                borderTop: `1px solid ${theme.palette.divider}`,
                my: 2,
              },
            }}
          >
            {value.trim() ? (
              <ReactMarkdown
                rehypePlugins={[rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <Typography color="text.secondary" fontStyle="italic">
                Nothing to preview
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
