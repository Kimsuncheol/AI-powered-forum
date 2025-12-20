"use client";

import React, { useState } from "react";
import { Container, Typography, Paper, Box, Switch, Divider, Button, Stack } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import ThemeToggle from "@/components/ThemeToggle";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { LockReset } from "@mui/icons-material";

export default function SettingsView() {
  const { user } = useAuth();
  const { autoPlayEnabled, toggleAutoPlay } = useSettings();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Settings
      </Typography>
      <Paper elevation={0} variant="outlined" sx={{ p: 0, mt: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
           <Typography variant="subtitle1" fontWeight="bold">
            General
           </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
           <Stack spacing={3}>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body1" fontWeight="medium">Auto-play Media</Typography>
                  <Typography variant="body2" color="text.secondary">Automatically play videos and audio when viewed.</Typography>
                </Box>
                <Switch 
                  checked={autoPlayEnabled} 
                  onChange={toggleAutoPlay} 
                  inputProps={{ 'aria-label': 'auto-play-switch' }}
                />
             </Box>
           </Stack>
        </Box>

        <Divider />
        <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
           <Typography variant="subtitle1" fontWeight="bold">
            Appearance
           </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 3 }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body1" fontWeight="medium">Theme</Typography>
                <Typography variant="body2" color="text.secondary">Toggle between light and dark mode.</Typography>
              </Box>
              <ThemeToggle />
           </Box>
        </Box>

        {/* Only show Security settings for email/password users (simplistic check) */}
        {user?.providerData[0]?.providerId === 'password' && (
          <>
            <Divider />
            <Box sx={{ p: 3, bgcolor: 'action.hover' }}>
               <Typography variant="subtitle1" fontWeight="bold">
                Security
               </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 3 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">Password</Typography>
                    <Typography variant="body2" color="text.secondary">Update your password to keep your account secure.</Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<LockReset />}
                    onClick={() => setPasswordModalOpen(true)}
                  >
                    Change Password
                  </Button>
               </Box>
            </Box>
          </>
        )}
      </Paper>
      
      <ChangePasswordModal 
        open={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
    </Container>
  );
}
