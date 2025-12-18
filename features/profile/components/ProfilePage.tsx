"use client";

import React, { useState, useEffect } from "react";
import { Container, Tabs, Tab, Box, Alert } from "@mui/material";
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
    </Container>
  );
}
