"use client";
import React, { useCallback } from "react";
import { useDrop, DndProvider } from "react-dnd";
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend";
import { Box, Typography, IconButton, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { CloudUpload, Close, Image as ImageIcon } from "@mui/icons-material";

interface ImageDropZoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

interface DropZoneContentProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
  maxImages: number;
}

function DropZoneContent({ images, onChange, disabled, maxImages }: DropZoneContentProps) {
  const handleFileDrop = useCallback(
    (files: File[]) => {
      if (disabled) return;
      
      const imageFiles = files.filter(file => file.type.startsWith("image/"));
      const remainingSlots = maxImages - images.length;
      const filesToProcess = imageFiles.slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            onChange([...images, result]);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [images, onChange, disabled, maxImages]
  );

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: NativeTypes.FILE,
      drop: (item: { files: File[] }) => {
        handleFileDrop(item.files);
      },
      canDrop: () => !disabled && images.length < maxImages,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [handleFileDrop, disabled, images.length, maxImages]
  );

  const isActive = isOver && canDrop;

  return (
    <Box>
      {/* Drop Zone */}
      <Box
        ref={dropRef as unknown as React.Ref<HTMLDivElement>}
        data-testid="image-drop-zone"
        sx={{
          border: 2,
          borderStyle: "dashed",
          borderColor: isActive ? "primary.main" : disabled ? "action.disabled" : "divider",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          bgcolor: isActive ? "action.hover" : "background.paper",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          ...(!disabled && {
            "&:hover": {
              borderColor: "primary.light",
              bgcolor: "action.hover",
            },
          }),
        }}
      >
        <CloudUpload
          sx={{
            fontSize: 40,
            color: isActive ? "primary.main" : "text.secondary",
            mb: 1,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {isActive
            ? "Drop images here..."
            : `Drag and drop images here (${images.length}/${maxImages})`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supports: JPG, PNG, GIF, WebP
        </Typography>
      </Box>

      {/* Image Previews */}
      {images.length > 0 && (
        <ImageList
          sx={{ mt: 2, maxHeight: 200 }}
          cols={4}
          rowHeight={100}
          gap={8}
        >
          {images.map((src, index) => (
            <ImageListItem key={index} sx={{ borderRadius: 1, overflow: "hidden" }}>
              <Box
                component="img"
                src={src}
                alt={`Upload ${index + 1}`}
                loading="lazy"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <ImageListItemBar
                sx={{ background: "transparent" }}
                position="top"
                actionIcon={
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                    sx={{
                      bgcolor: "rgba(0,0,0,0.5)",
                      color: "white",
                      m: 0.5,
                      "&:hover": { bgcolor: "error.main" },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                }
                actionPosition="right"
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}

export function ImageDropZone({ images, onChange, disabled = false, maxImages = 4 }: ImageDropZoneProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DropZoneContent
        images={images}
        onChange={onChange}
        disabled={disabled}
        maxImages={maxImages}
      />
    </DndProvider>
  );
}

// Export for testing
export { DropZoneContent };
