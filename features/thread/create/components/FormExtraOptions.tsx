import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { Warning, AutoAwesome, Place } from "@mui/icons-material";
import { ImageDropZone } from "./ImageDropZone";
import LocationPicker from "@/features/location/components/LocationPicker";
import { LocationData } from "../../types";

interface FormExtraOptionsProps {
  isNSFW: boolean;
  setIsNSFW: (value: boolean) => void;
  images: string[];
  setImages: (images: string[]) => void;
  loading: boolean;
  setAiModalOpen: (open: boolean) => void;
  location: LocationData | undefined;
  setLocation: (value: LocationData | undefined) => void;
  locationOpen: boolean;
  setLocationOpen: (open: boolean) => void;
}

export function FormExtraOptions({
  isNSFW,
  setIsNSFW,
  images,
  setImages,
  loading,
  setAiModalOpen,
  location,
  setLocation,
  locationOpen,
  setLocationOpen,
}: FormExtraOptionsProps) {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={isNSFW}
            onChange={(e) => setIsNSFW(e.target.checked)}
            disabled={loading}
            icon={<Warning />}
            checkedIcon={<Warning />}
          />
        }
        label={
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Mark as NSFW (Not Safe For Work)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Check this if your content contains sensitive material
            </Typography>
          </Box>
        }
      />

      <ImageDropZone
        images={images}
        onChange={setImages}
        disabled={loading}
        maxImages={4}
      />

      <Button
        startIcon={<AutoAwesome />}
        onClick={() => setAiModalOpen(true)}
        variant="outlined"
        size="small"
        sx={{ alignSelf: "flex-start" }}
      >
        Generate with AI
      </Button>

      <Box>
        <Button
          startIcon={<Place />}
          onClick={() => setLocationOpen(!locationOpen)}
          variant={location ? "contained" : "outlined"}
          color={location ? "primary" : "inherit"}
          size="small"
          sx={{ mb: 1 }}
        >
          {location ? "Location Attached" : "Add Location"}
        </Button>

        {locationOpen && (
          <Box
            sx={{
              mt: 1,
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <LocationPicker value={location} onChange={setLocation} />
            {location && (
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1, color: "text.secondary" }}
              >
                Selected: {location.address}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}
