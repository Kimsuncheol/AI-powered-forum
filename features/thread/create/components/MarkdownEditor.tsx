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
              "& img": { maxWidth: "100%" },
              "& pre": {
                bgcolor: "background.paper",
                p: 1,
                borderRadius: 1,
                overflow: "auto",
              },
              "& blockquote": {
                borderLeft: `4px solid ${theme.palette.divider}`,
                m: 0,
                pl: 2,
                color: "text.secondary",
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
