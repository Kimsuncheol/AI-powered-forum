"use client";

import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Box, Alert, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "./ProfileHeader";
import MyThreadsTab from "./tabs/MyThreadsTab";
import MyCommentsTab from "./tabs/MyCommentsTab";
import AiUsageHistoryTab from "./tabs/AiUsageHistoryTab";
import { useUserProfile } from "../hooks/useUserProfile";
import { useRouter } from "next/navigation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile(user?.uid || null);
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  
  const [deleteDTOpen, setDeleteDTOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    setDeleteDTOpen(true);
  };

  const confirmDeleteAccount = async () => {
    setLoading(true);
    try {
      await import("@/features/auth/services/auth.service").then(m => m.authService.deleteAccount());
      // Auth state listener in Header/Layout will likely handle redirect, but force it here
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account", error);
      alert("Failed to delete account. You may need to sign in again recently to perform this action.");
    } finally {
      setLoading(false);
      setDeleteDTOpen(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
    }
  }, [user, authLoading, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (authLoading) return null;

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {profileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {profileError}
        </Alert>
      )}

      <ProfileHeader 
        user={user} 
        profile={profile} 
        loading={profileLoading} 
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
          <Tab label="My Threads" />
          <Tab label="My Comments" />
          <Tab label="AI History" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <MyThreadsTab uid={user.uid} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <MyCommentsTab uid={user.uid} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AiUsageHistoryTab />
      </TabPanel>

      <Box sx={{ mt: 8, mb: 4, p: 3, border: '1px solid', borderColor: 'error.main', borderRadius: 2, bgcolor: 'error.lighter' }}>
        <Typography variant="h6" color="error" gutterBottom fontWeight="bold">
          Danger Zone
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Once you delete your account, there is no going back. Please be certain.
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          Opt Out / Delete Account
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDTOpen} onClose={() => setDeleteDTOpen(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Delete Account?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to opt out? This action will permanently delete your account and remove your access.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDTOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteAccount} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete My Account"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
