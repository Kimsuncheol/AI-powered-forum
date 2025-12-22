"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  Stack,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  SelectChangeEvent,
} from "@mui/material";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { ChangePasswordModal } from "./ChangePasswordModal";
import DataExportModal from "./DataExportModal";
import DeleteAccountModal from "./DeleteAccountModal";
import { useAiQuota } from "@/features/ai/hooks/useAiQuota";
import type { AiFeatureType } from "@/features/ai/types/AiQuota";

export default function SettingsView() {
  const { user } = useAuth();
  const settings = useSettings();
  const { status: aiQuotaStatus } = useAiQuota("image");

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [dataExportOpen, setDataExportOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const isPasswordUser = user?.providerData?.some(
    (provider) => provider.providerId === "password"
  );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Settings
      </Typography>

      {/* General */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          General
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoPlayEnabled}
                onChange={settings.toggleAutoPlay}
              />
            }
            label="Auto-play Media"
          />
        </Stack>
      </Paper>

      {/* Appearance */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Appearance
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography>Theme</Typography>
            <ThemeToggle />
          </Box>
        </Stack>
      </Paper>

      {/* Security */}
      {isPasswordUser && (
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Security
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setChangePasswordOpen(true)}
          >
            Change Password
          </Button>
        </Paper>
      )}

      {/* Notifications & Privacy */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Notifications & Privacy
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={settings.toggleEmailNotifications}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.pushNotifications}
                onChange={settings.togglePushNotifications}
              />
            }
            label="Push Notifications"
          />
          <FormControl fullWidth>
            <Typography gutterBottom>Profile Visibility</Typography>
            <Select
              value={settings.profileVisibility}
              onChange={(e: SelectChangeEvent<"public" | "private">) =>
                settings.setProfileVisibility(e.target.value as "public" | "private")
              }
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={settings.showOnlineStatus}
                onChange={settings.toggleOnlineStatus}
              />
            }
            label="Show Online Status"
          />
        </Stack>
      </Paper>

      {/* Content Preferences */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Content Preferences
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <Typography gutterBottom>Default Feed</Typography>
            <Select
              value={settings.defaultFeed}
              onChange={(e: SelectChangeEvent<"global" | "following">) =>
                settings.setDefaultFeed(e.target.value as "global" | "following")
              }
            >
              <MenuItem value="global">Global</MenuItem>
              <MenuItem value="following">Following</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={settings.nsfwFilterEnabled}
                onChange={settings.toggleNsfwFilter}
              />
            }
            label="NSFW Content Filter"
          />
          <FormControl fullWidth>
            <Typography gutterBottom>Comments Sort Order</Typography>
            <Select
              value={settings.commentsSortOrder}
              onChange={(e: SelectChangeEvent<"newest" | "oldest">) =>
                settings.setCommentsSortOrder(e.target.value as "newest" | "oldest")
              }
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* AI Features */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          AI Features
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.aiAssistanceEnabled}
                onChange={settings.toggleAiAssistance}
              />
            }
            label="AI Assistance"
          />
          <FormControl fullWidth>
            <Typography gutterBottom>Default AI Model</Typography>
            <Select
              value={settings.defaultAiModel}
              onChange={(e: SelectChangeEvent) =>
                settings.setDefaultAiModel(e.target.value as AiFeatureType)
              }
            >
              <MenuItem value="image">Image Generation</MenuItem>
              <MenuItem value="video">Video Generation</MenuItem>
              <MenuItem value="music">Music Generation</MenuItem>
            </Select>
          </FormControl>
          {aiQuotaStatus && (
            <Typography variant="body2" color="text.secondary">
              AI Quota: {aiQuotaStatus.remaining} / {aiQuotaStatus.limit} remaining
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* Search & History */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Search & History
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.searchAutoSave}
                onChange={settings.toggleSearchAutoSave}
              />
            }
            label="Auto-save Search History"
          />
          <FormControl fullWidth>
            <Typography gutterBottom>Max Recent Searches</Typography>
            <Select
              value={String(settings.maxRecentSearches)}
              onChange={(e: SelectChangeEvent) =>
                settings.setMaxRecentSearches(Number(e.target.value) as 5 | 10 | 20 | 9999)
              }
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={9999}>Unlimited</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" color="error" onClick={settings.clearSearchHistory}>
            Clear Search History
          </Button>
        </Stack>
      </Paper>

      {/* Localization */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Localization
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <Typography gutterBottom>Language</Typography>
            <Select value={settings.language} onChange={(e) => settings.setLanguage(e.target.value)}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ko">한국어</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <Typography gutterBottom>Date Format</Typography>
            <Select
              value={settings.dateFormat}
              onChange={(e: SelectChangeEvent<"MM/DD/YYYY" | "DD/MM/YYYY">) =>
                settings.setDateFormat(e.target.value as "MM/DD/YYYY" | "DD/MM/YYYY")
              }
            >
              <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
              <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Account Management */}
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "error.main" }}>
          Account Management
        </Typography>
        <Stack spacing={2}>
          <Button variant="outlined" onClick={() => setDataExportOpen(true)}>
            Export Data
          </Button>
          <Divider />
          <Button variant="outlined" color="error" onClick={() => setDeleteAccountOpen(true)}>
            Delete Account
          </Button>
        </Stack>
      </Paper>

      {/* Modals */}
      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <DataExportModal open={dataExportOpen} onClose={() => setDataExportOpen(false)} />
      <DeleteAccountModal
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
      />
    </Box>
  );
}
