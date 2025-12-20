import axios from 'axios';

const API_BASE_URL = '/ai/images'; // Assuming a proxy or local API route handles this prefix to the actual backend

export interface AiImageResponse {
  b64_json: string;
  revised_prompt: string;
}


export interface AiVideoResponse {
  operation_id: string; // For polling
  video_url?: string;   // Present when complete
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AiMusicResponse {
  audio_url: string;
}

export const aiService = {
  /**
   * Generates an image from a text prompt.
   * @param prompt The text description for the image.
   * @returns The generated image data (base64) and revised prompt.
   */
  generateImage: async (prompt: string): Promise<AiImageResponse> => {
    try {
      const response = await axios.post<AiImageResponse>(`${API_BASE_URL}/generate`, {
        prompt,
      });
      return response.data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  },

  /**
   * Edits an uploaded image based on a text prompt.
   * @param imageFile The image file to edit.
   * @param prompt The text description for the edit.
   * @returns The edited image data (base64) and revised prompt.
   */
  editImage: async (imageFile: File, prompt: string): Promise<AiImageResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('prompt', prompt);

      const response = await axios.post<AiImageResponse>(`${API_BASE_URL}/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error editing image:', error);
      throw error;
    }
  },

  // --- VEO (Video) ---

  generateVideo: async (prompt: string): Promise<AiVideoResponse> => {
    const response = await axios.post<AiVideoResponse>(`/api/v1/ai/videos/generate`, { prompt });
    return response.data;
  },

  generateVideoFromImage: async (image: File, prompt: string): Promise<AiVideoResponse> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);
    const response = await axios.post<AiVideoResponse>(`/api/v1/ai/videos/generate-from-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getVideoStatus: async (operationId: string): Promise<AiVideoResponse> => {
    const response = await axios.get<AiVideoResponse>(`/api/v1/ai/videos/status/${operationId}`);
    return response.data;
  },

  // --- Lyria (Music) ---

  generateMusic: async (config: any): Promise<AiMusicResponse> => {
      const response = await axios.post<AiMusicResponse>(`/api/v1/ai/music/generate`, config);
      return response.data;
  },

  generateSimpleMusic: async (prompt: string): Promise<AiMusicResponse> => {
    const response = await axios.post<AiMusicResponse>(`/api/v1/ai/music/generate-simple`, { prompt });
    return response.data;
  },
};
