import { getAI, getGenerativeModel, ResponseModality, GoogleAIBackend } from "firebase/ai";
import { app } from "@/lib/firebase"; 
import { getRecentThreads } from "@/features/thread/repositories/threadRepo";

export interface AiImageResponse {
  b64_json: string;
}

export const aiService = {
  /**
   * Generates an image from a text prompt using Firebase AILogic (Gemini).
   * @param prompt The text description for the image.
   * @returns The generated image data (base64).
   */
  generateText: async (prompt: string): Promise<string> => {
    try {
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  },

  /**
   * Generates an image from a text prompt using Firebase AILogic (Gemini).
   */
  generateImage: async (prompt: string): Promise<AiImageResponse> => {
    console.log('generateImage', prompt);
    try {
      // NOTE: Using 'firebase/ai' as per the documentation snippet viewed.
      // If this fails, we might need to investigate further, but the doc was specific.
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      
      // Using 'gemini-2.5-flash-image' as per the documentation.
      // This model supports image generation via responseModalities.
      const model = getGenerativeModel(ai, { 
        model: "gemini-2.5-flash-image", 
        generationConfig: {
          responseModalities: [ResponseModality.IMAGE], 
        }
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      
      // Handle the generated image
      // Based on doc: result.response.inlineDataParts() or candidates...
      // The doc example: const inlineDataParts = result.response.inlineDataParts();
      // But standard JS SDK might not have that helper method in all versions.
      // Let's try standard access first, or the helper if types allow.
      
      // We'll check if specific helper exists, otherwise fall back to candidates.
      // The doc snippet: 
      // const inlineDataParts = result.response.inlineDataParts();
      // if (inlineDataParts?.[0]) ...
      
      // Let's try to match strict types.
      if (typeof response.inlineDataParts === 'function') {
         const parts = response.inlineDataParts();
         if (parts && parts.length > 0) {
             return { b64_json: parts[0].inlineData.data };
         }
      }

      // Fallback to standard candidates structure
      const candidates = response.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error("No candidates returned");
      }
      
      const parts = candidates[0].content.parts;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imagePart = parts.find((p: any) => p.inlineData);
      
      if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
        throw new Error("No image generated");
      }

      return {
        b64_json: imagePart.inlineData.data
      };

    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  },

  /**
   * Encodes a File object to a base64 string.
   */
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  },

  /**
   * Edits an uploaded image based on a text prompt.
   */
  editImage: async (imageFile: File, prompt: string): Promise<AiImageResponse> => {
     try {
       const ai = getAI(app, { backend: new GoogleAIBackend() });
       const model = getGenerativeModel(ai, { 
         model: "gemini-2.5-flash-image",
         generationConfig: {
           responseModalities: [ResponseModality.IMAGE]
         }
       });

       const base64Image = await aiService.fileToBase64(imageFile);
       
       const imagePart = {
         inlineData: {
           mimeType: imageFile.type,
           data: base64Image
         }
       };

       const result = await model.generateContent([prompt, imagePart]);
       const response = result.response;
       
       if (typeof response.inlineDataParts === 'function') {
         const parts = response.inlineDataParts();
         if (parts && parts.length > 0) {
             return { b64_json: parts[0].inlineData.data };
         }
       }
       
       const candidates = response.candidates;
       if (!candidates || candidates.length === 0) {
        throw new Error("No candidates returned");
       }
      
       const parts = candidates[0].content.parts;
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const outImagePart = parts.find((p: any) => p.inlineData);

       if (!outImagePart || !outImagePart.inlineData || !outImagePart.inlineData.data) {
        throw new Error("No image generated");
       }

       return {
         b64_json: outImagePart.inlineData.data
       };

     } catch (error) {
       console.error('Error editing image:', error);
       throw error;
     }
  },

  /**
   * Generates an answer based on forum context (RAG-like).
   */
  generateAnswerFromForum: async (question: string): Promise<string> => {
    try {
      // 1. Fetch Context
      const threads = await getRecentThreads(30);

      // 2. Prepare Context String
      const context = threads.map(t => {
        return `Thread Title: ${t.title}
Body: ${t.body}
ID: ${t.id}
---`;
      }).join('\n');

      const prompt = `You are a helpful assistant for a community forum.
Your task is to answer the user's question based ONLY on the provided forum context.
If the answer cannot be found in the context, state that you don't have enough information from the recent threads.
Do not invent facts.

IMPORTANT: When you reference specific threads in your answer, include the thread ID using this exact format: [THREAD:thread-id-here]
For example: "You can find more details in this thread [THREAD:abc123]"
Always include thread references when they are relevant to your answer.

Context from Forum Threads:
${context}

User Question: ${question}

Answer:`;

      // 3. Call AI
      const ai = getAI(app, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error generating answer from forum:", error);
      throw error;
    }
  },
};

