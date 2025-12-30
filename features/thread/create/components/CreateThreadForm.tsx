"use client";
import React, { useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { ThreadCreateInput, LocationData } from "../../types";
import { useRouter } from "next/navigation";
import { FormBasics } from "./FormBasics";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { ContentInput } from "./ContentInput";
import { FormExtraOptions } from "./FormExtraOptions";
import { FormActions } from "./FormActions";
import { AiImageModal } from "../../../ai/components/AiImageModal";
import { AiVideoModal } from "../../../ai/components/AiVideoModal";
import { AiMusicModal } from "../../../ai/components/AiMusicModal";

interface CreateThreadFormProps {
  onSubmit: (data: ThreadCreateInput) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

type ThreadMode = "text" | "markdown" | "link" | "video" | "audio";

export function CreateThreadForm({ onSubmit, loading, error }: CreateThreadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<ThreadMode>("text");
  const [linkUrl, setLinkUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isNSFW, setIsNSFW] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [location, setLocation] = useState<LocationData | undefined>();
  const [locationOpen, setLocationOpen] = useState(false);
  
  const [touched, setTouched] = useState({ 
    title: false, 
    body: false, 
    category: false, 
    linkUrl: false, 
    mediaUrl: false 
  });

  const validate = () => {
    const errors: { title?: string; body?: string; category?: string; linkUrl?: string; mediaUrl?: string } = {};
    if (!title.trim()) errors.title = "Title is required";
    else if (title.length > 120) errors.title = "Title must be 120 characters or less";
    
    if (!["link", "video", "audio"].includes(mode) && !body.trim()) errors.body = "Body content is required";
    if (mode === "link" && !linkUrl.trim()) errors.linkUrl = "URL is required";
    if (mode === "link" && linkUrl.trim() && !/^https?:\/\/.+/.test(linkUrl)) errors.linkUrl = "URL must start with http:// or https://";
    if ((mode === "video" || mode === "audio") && !mediaUrl.trim()) errors.mediaUrl = "Media URL is required";
    if ((mode === "video" || mode === "audio") && mediaUrl.trim() && !/^https?:\/\/.+/.test(mediaUrl)) errors.mediaUrl = "URL must start with http:// or https://";
    if (!categoryId) errors.category = "Category is required";
    
    return errors;
  };

  const formErrors = validate();
  const isValid = Object.keys(formErrors).length === 0;

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, body: true, category: true, linkUrl: true, mediaUrl: true });
    
    if (!isValid) return;

    const sanitizedTags = tagIds.map(t => t.trim()).filter(t => t.length > 0);

    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        categoryId,
        tagIds: sanitizedTags,
        type: mode,
        linkUrl: mode === "link" ? linkUrl : undefined,
        mediaUrl: mode === "video" || mode === "audio" ? mediaUrl : undefined,
        imageUrls: images.length > 0 ? images : undefined,
        isNSFW,
        location,
      });
    } catch {
      // Error handled by parent
    }
  };

  return (
    <Card sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
            Create a New Thread
          </Typography>

          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error">
                {error.message}
              </Alert>
            )}

            <FormBasics
              title={title}
              setTitle={setTitle}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              tagIds={tagIds}
              setTagIds={setTagIds}
              loading={loading}
              touched={touched}
              errors={formErrors}
              onBlur={handleBlur}
            />

            <Stack spacing={1}>
              <ContentTypeSelector
                mode={mode}
                setMode={setMode}
                disabled={loading}
              />

              <ContentInput
                mode={mode}
                body={body}
                setBody={setBody}
                linkUrl={linkUrl}
                setLinkUrl={setLinkUrl}
                mediaUrl={mediaUrl}
                setMediaUrl={setMediaUrl}
                loading={loading}
                touched={touched}
                errors={formErrors}
                onBlur={handleBlur}
                setVideoModalOpen={setVideoModalOpen}
                setMusicModalOpen={setMusicModalOpen}
              />
            </Stack>

            <FormExtraOptions
              isNSFW={isNSFW}
              setIsNSFW={setIsNSFW}
              images={images}
              setImages={setImages}
              loading={loading}
              setAiModalOpen={setAiModalOpen}
              location={location}
              setLocation={setLocation}
              locationOpen={locationOpen}
              setLocationOpen={setLocationOpen}
            />

            <AiImageModal
              open={aiModalOpen}
              onClose={() => setAiModalOpen(false)}
              onImageSelect={(imageUrl) => setImages(prev => [...prev, imageUrl])}
            />

            <AiVideoModal
              open={videoModalOpen}
              onClose={() => setVideoModalOpen(false)}
              onVideoSelect={setMediaUrl}
            />

            <AiMusicModal
              open={musicModalOpen}
              onClose={() => setMusicModalOpen(false)}
              onMusicSelect={setMediaUrl}
            />
          </Stack>
        </CardContent>
        
        <FormActions
          loading={loading}
          isValid={isValid}
          onCancel={() => router.back()}
          onSubmit={handleSubmit}
        />
      </form>
    </Card>
  );
}
