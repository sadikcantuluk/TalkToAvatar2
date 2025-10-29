import { fal } from '@fal-ai/client';
import * as FileSystem from 'expo-file-system';
import { FAL_API_KEY } from '@env';

// Configure Fal.ai client
if (FAL_API_KEY) {
  fal.config({
    credentials: FAL_API_KEY,
  });
} else {
  console.warn('⚠️  FAL_API_KEY not found in environment variables');
}

// Upload file to Fal.ai storage and get public URL
// Returns URL like: https://v3.fal.media/files/rabbit/xyz.mp3
export const uploadToFal = async (fileUri, fileName) => {
  try {
    console.log('=== Uploading to Fal.ai Storage ===');
    console.log('File URI:', fileUri);
    console.log('File Name:', fileName);

    if (!FAL_API_KEY) {
      throw new Error('FAL_API_KEY not found in environment variables');
    }

    // Check file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }
    console.log('File size:', fileInfo.size, 'bytes');

    // Determine content type
    const contentType = fileName.endsWith('.mp3') 
      ? 'audio/mpeg' 
      : fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')
      ? 'image/jpeg'
      : 'image/png';
    
    console.log('Content Type:', contentType);

    // Read file as base64
    console.log('📖 Reading file as base64...');
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Don't log full base64 - too large for console
    console.log('Base64 read complete. Length:', base64.length);

    // Convert base64 to Buffer for upload
    // Create a Uint8Array from base64
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('📤 Uploading to Fal.ai storage...');
    console.log('Uploading with filename:', fileName);
    
    // Use fal.storage.upload with ArrayBuffer
    // The @fal-ai/client expects ArrayBuffer or Blob
    // It will automatically upload and return a public URL
    const url = await fal.storage.upload(bytes.buffer);
    
    console.log('✅ File uploaded successfully!');
    console.log('Public URL:', url);
    
    // Verify URL format
    if (!url || !url.startsWith('http')) {
      throw new Error('Invalid URL returned from storage: ' + url);
    }

    return {
      success: true,
      url: url,
    };
  } catch (error) {
    console.error('=== Fal.ai Upload Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return {
      success: false,
      error: error.message || 'Failed to upload to Fal.ai storage',
    };
  }
}

// Generate video with Fal.ai using fal.subscribe() method
// As per documentation: https://fal.ai/models/fal-ai/kling-video/v1/standard/ai-avatar/api#submit-a-request
export const generateVideo = async (imageUrl, audioUrl, prompt) => {
  try {
    console.log('=== Fal.ai Video Generation (fal.subscribe) ===');
    console.log('📋 Input Parameters:');
    console.log('  - Image URL:', imageUrl);
    console.log('  - Audio URL:', audioUrl);
    console.log('  - Prompt:', prompt || '.');

    if (!FAL_API_KEY) {
      throw new Error('FAL_API_KEY not found in environment variables');
    }

    console.log('🚀 Model: fal-ai/kling-video/v1/standard/ai-avatar');
    console.log('⏱️  This may take 2-5 minutes...');

    // Use fal.subscribe() as per documentation
    console.log('📤 Subscribing to video generation...');
    const result = await fal.subscribe('fal-ai/kling-video/v1/standard/ai-avatar', {
      input: {
        image_url: imageUrl,
        audio_url: audioUrl,
        prompt: prompt || '.',
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('📊 Queue Update:', update.status);
        if (update.status === 'IN_PROGRESS') {
          if (update.logs) {
            update.logs.map((log) => log.message).forEach((msg) => {
              console.log('📝 Log:', msg);
            });
          }
        }
      },
    });

    console.log('=== 🎉 Video Generation Completed! ===');
    console.log('Request ID:', result.requestId);
    console.log('Full result data:', JSON.stringify(result.data, null, 2));

    // According to Fal.ai docs, output format is:
    // { video: { url: "..." }, duration: number }
    const videoUrl = result.data?.video?.url;
    const duration = result.data?.duration;

    if (!videoUrl) {
      console.error('❌ No video URL in response');
      console.error('Response keys:', Object.keys(result.data || {}));
      console.error('Full response:', JSON.stringify(result, null, 2));
      throw new Error('Video URL not found in result');
    }

    console.log('✅ Video URL:', videoUrl);
    console.log('⏱️  Duration:', duration, 'seconds');

    return {
      success: true,
      videoUrl: videoUrl,
      requestId: result.requestId,
      duration: duration,
      data: result.data,
    };
  } catch (error) {
    console.error('=== ❌ Fal Video Generation Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.body) {
      console.error('Error body:', JSON.stringify(error.body, null, 2));
    }
    
    return {
      success: false,
      error: error.message || 'Failed to generate video',
    };
  }
};

// Download video from Fal.ai URL
export const downloadVideo = async (videoUrl, fileName) => {
  try {
    console.log('=== Downloading Video ===');
    console.log('Video URL:', videoUrl);
    console.log('File Name:', fileName);

    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    console.log('Downloading to:', fileUri);
    const downloadResult = await FileSystem.downloadAsync(videoUrl, fileUri);

    console.log('✅ Video downloaded successfully');
    console.log('Local URI:', downloadResult.uri);

    return {
      success: true,
      uri: downloadResult.uri,
    };
  } catch (error) {
    console.error('=== Video Download Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  uploadToFal,
  generateVideo,
  downloadVideo,
};

