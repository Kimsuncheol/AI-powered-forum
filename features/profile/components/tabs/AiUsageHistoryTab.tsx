import React from "react";
import { Box, Typography, Paper, Alert, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { History, ShowChart, Token } from "@mui/icons-material";

export default function AiUsageHistoryTab() {
  return (
    <Box sx={{ mt: 2 }}>
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderRadius: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom color="text.secondary" fontWeight="bold">
          No AI history yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your interactions with AI tools (summarization, tag generation, etc.) will appear here.
        </Typography>
      </Paper>

      <Box>
        <Typography variant="subtitle2" gutterBottom sx={{ textTransform: "uppercase", letterSpacing: 1, color: "text.secondary", fontSize: "0.75rem", fontWeight: "bold" }}>
          What to expect
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <History fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Interaction Log" 
              secondary="A timeline of when you used AI features to summarize threads or generate tags." 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Token fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Token Usage" 
              secondary="Detailed breakdown of tokens consumed per request." 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ShowChart fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Usage Stats" 
              secondary="Monthly usage charts and quota remaining." 
            />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
