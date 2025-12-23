import React from "react";
import { Box } from "@mui/material";
import { LocationData } from "@/lib/db/threads";

interface ThreadLocationProps {
  location?: LocationData;
}

export default function ThreadLocation({ location }: ThreadLocationProps) {
  if (!location) return null;

  return (
    <Box sx={{ mb: 4, height: 300, borderRadius: 2, overflow: "hidden", border: 1, borderColor: "divider" }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${location.address}`}
      ></iframe>
    </Box>
  );
}
