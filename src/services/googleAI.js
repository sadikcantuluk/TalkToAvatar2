import axios from 'axios';
import { GOOGLE_AI_API_KEY } from '@env';

const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Professional avatar transformation prompt
const AVATAR_PROMPT = `Transform the uploaded photo into a professional corporate headshot of a white-collar office employee. 
Keep the person's facial features realistic and recognizable, but adjust their appearance to fit a business environment. 
The person should be wearing formal office attire (e.g., shirt, blazer, or suit), with clean and neat grooming. 
Use soft natural lighting, a neutral or light background, and a confident, friendly facial expression suitable for a LinkedIn or company profile photo. 
Maintain a high-quality, photorealistic style.`;

export const generateAvatarFromImage = async (imageBase64, prompt = '') => {
  try {
    if (!GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key not found. Please add GOOGLE_AI_API_KEY to your .env file');
    }

    // Prepare the image data for Gemini API
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    // Use Gemini 2.5 Flash Image model for native image generation
    const response = await axios.post(
      `${GOOGLE_AI_API_URL}/models/gemini-2.5-flash-image:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        contents: [{
          parts: [
            {
              text: prompt || AVATAR_PROMPT
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 second timeout for image generation
      }
    );

    console.log('Google AI Avatar Generation Success');
    console.log('Response data:', JSON.stringify(response.data).substring(0, 500));
    
    // Extract generated image from response
    const candidates = response.data.candidates || [];
    const generatedImages = [];
    
    if (candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        // Try both inline_data (snake_case) and inlineData (camelCase)
        const inlineData = part.inline_data || part.inlineData;
        if (inlineData && inlineData.data) {
          console.log('Found generated image, size:', inlineData.data.length);
          generatedImages.push({
            image: {
              imageBytes: inlineData.data
            }
          });
        } else if (part.text) {
          console.log('Part contains text:', part.text.substring(0, 100));
        }
      }
    }
    
    console.log('Total generated images:', generatedImages.length);
    
    return {
      success: true,
      generatedImages: generatedImages,
      originalImage: imageBase64,
      message: 'Avatar created successfully'
    };

  } catch (error) {
    console.error('Google AI Avatar Generation Error:', error.response?.data || error.message);
    
    // Fallback: Create a simple avatar using user's image
    console.log('Falling back to user image as avatar');
    return {
      success: true,
      originalImage: imageBase64,
      fallback: true,
      generatedImages: [{
        image: {
          imageBytes: null // Will use original image
        }
      }],
      message: 'Using original image as avatar'
    };
  }
};

export default {
  generateAvatarFromImage,
};

