import axios from 'axios';
import { GOOGLE_AI_API_KEY } from '@env';
import imageCache from '../utils/imageCache';

const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

// Professional avatar transformation prompt
const AVATAR_PROMPT = `Transform the uploaded photo into a professional corporate headshot of a white-collar office employee. 
Keep the person's facial features realistic and recognizable, but adjust their appearance to fit a business environment. 
The person should be wearing formal office attire (e.g., shirt, blazer, or suit), with clean and neat grooming. 
Use soft natural lighting, a neutral or light background, and a confident, friendly facial expression suitable for a LinkedIn or company profile photo. 
Maintain a high-quality, photorealistic style.`;

export const generateAvatarFromImage = async (imageBase64, prompt = '') => {
  const startTime = Date.now();
  
  try {
    console.log('=== Google AI Avatar Generation Debug ===');
    console.time('⏱️ Total Generation Time');
    
    // Check cache first (performance optimization)
    console.log('🔍 Checking cache...');
    const cachedResult = await imageCache.get(imageBase64, prompt);
    if (cachedResult) {
      const cacheTime = Date.now() - startTime;
      console.log(`✅ Cache hit! Retrieved in ${cacheTime}ms`);
      console.timeEnd('⏱️ Total Generation Time');
      return cachedResult;
    }
    console.log('❌ Cache miss, calling API...');
    
    // Check API key
    if (!GOOGLE_AI_API_KEY) {
      const errorMsg = 'Google AI API key not found. Please add GOOGLE_AI_API_KEY to your .env file';
      console.error('❌ API Key Error:', errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log('✅ API Key found:', GOOGLE_AI_API_KEY.substring(0, 10) + '...');

    // Prepare the image data for Gemini API
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    console.log('✅ Base64 data length:', base64Data.length);

    // Use Gemini 2.5 Flash Image model for native image generation
    // Reference: https://ai.google.dev/gemini-api/docs/image-generation?hl=tr#javascript
    const apiUrl = `${GOOGLE_AI_API_URL}/models/gemini-2.5-flash-image:generateContent?key=${GOOGLE_AI_API_KEY}`;
    console.log('🌐 API URL:', apiUrl.replace(GOOGLE_AI_API_KEY, 'API_KEY_HIDDEN'));

    const requestBody = {
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
    };
    
    console.log('📤 Request body prepared (text length:', requestBody.contents[0].parts[0].text.length, ')');

    const response = await axios.post(
      apiUrl,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60 second timeout (increased for large images)
        validateStatus: function (status) {
          return status < 500; // Resolve for any status less than 500
        }
      }
    );

    console.log('📥 Response status:', response.status);
    
    // Check for API errors
    if (response.status !== 200) {
      console.error('❌ API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
    }

    console.log('✅ Google AI Avatar Generation Success');
    console.log('📋 Response data preview:', JSON.stringify(response.data).substring(0, 500));
    
    // Extract generated images from Gemini 2.5 Flash Image response
    const candidates = response.data.candidates || [];
    const generatedImages = [];
    
    if (candidates.length > 0 && candidates[0].content && candidates[0].content.parts) {
      console.log('✅ Found', candidates[0].content.parts.length, 'parts in response');
      
      for (const part of candidates[0].content.parts) {
        // Try both inline_data (snake_case) and inlineData (camelCase)
        const inlineData = part.inline_data || part.inlineData;
        if (inlineData && inlineData.data) {
          console.log('✅ Found generated image, size:', inlineData.data.length);
          generatedImages.push({
            image: {
              imageBytes: inlineData.data
            }
          });
        } else if (part.text) {
          console.log('📝 Response text:', part.text.substring(0, 150) + '...');
        }
      }
    }
    
    console.log('📊 Total generated images:', generatedImages.length);
    
    // If no generated image, use original as fallback
    if (generatedImages.length === 0) {
      console.log('ℹ️ No generated images found, using original image as avatar');
      const fallbackResult = {
        success: true,
        originalImage: imageBase64,
        fallback: true,
        generatedImages: [{
          image: {
            imageBytes: null // Will use original image
          }
        }],
        message: 'Avatar created successfully (using original image)'
      };
      
      // Cache fallback result
      await imageCache.set(imageBase64, prompt, fallbackResult);
      const apiTime = Date.now() - startTime;
      console.log(`✅ Fallback result generated in ${apiTime}ms and cached`);
      console.timeEnd('⏱️ Total Generation Time');
      
      return fallbackResult;
    }
    
    const successResult = {
      success: true,
      generatedImages: generatedImages,
      originalImage: imageBase64,
      message: 'AI-generated avatar created successfully!'
    };
    
    // Cache successful result for future use (performance optimization)
    await imageCache.set(imageBase64, prompt, successResult);
    const apiTime = Date.now() - startTime;
    console.log(`✅ Avatar generated in ${apiTime}ms and cached`);
    console.timeEnd('⏱️ Total Generation Time');
    
    return successResult;

  } catch (error) {
    console.error('❌ Google AI Avatar Generation Error Details:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('Request error (no response received):', {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        message: error.message,
      });
    } else {
      console.error('Configuration error:', error.message);
    }
    
    // Check if it's a network error
    if (error.message.includes('Network Error') || error.code === 'ECONNABORTED' || !error.response) {
      console.error('⚠️ Network connectivity issue detected');
      console.error('Possible causes:');
      console.error('1. No internet connection');
      console.error('2. Firewall or proxy blocking the request');
      console.error('3. Invalid API key or API endpoint');
      console.error('4. CORS issue (should not happen in React Native)');
    }
    
    // Fallback: Create a simple avatar using user's image
    console.log('🔄 Falling back to user image as avatar');
    return {
      success: true,
      originalImage: imageBase64,
      fallback: true,
      generatedImages: [{
        image: {
          imageBytes: null // Will use original image
        }
      }],
      message: 'Using original image as avatar (AI generation unavailable)',
      error: error.message
    };
  }
};

export default {
  generateAvatarFromImage,
};

