import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

/**
 * Compress and resize image to reduce file size for API uploads
 * @param {string} imageUri - Local file URI
 * @param {number} maxWidth - Maximum width (default: 1024)
 * @param {number} maxHeight - Maximum height (default: 1024)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @param {number} maxSizeKB - Maximum file size in KB (default: 1000KB = 1MB)
 * @returns {Promise<string>} Compressed base64 string
 */
export const compressImageForAPI = async (
  imageUri,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.8,
  maxSizeKB = 1000
) => {
  try {
    console.log('🗜️ [Compression] Starting image compression...');
    console.log('📏 [Compression] Original URI:', imageUri);
    
    // First, get original image info
    const originalInfo = await FileSystem.getInfoAsync(imageUri);
    if (originalInfo.exists) {
      const originalSizeKB = originalInfo.size / 1024;
      console.log(`📊 [Compression] Original size: ${originalSizeKB.toFixed(2)} KB`);
      
      // If already small enough, return as-is
      if (originalSizeKB <= maxSizeKB) {
        console.log('✅ [Compression] Image already small enough, skipping compression');
        const base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return base64;
      }
    }
    
    // Manipulate image: resize and compress
    console.log(`🔄 [Compression] Resizing to max ${maxWidth}x${maxHeight} with quality ${quality}`);
    
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    
    console.log('✅ [Compression] Image manipulated:', manipulatedImage.uri);
    
    // Check compressed size
    const compressedInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);
    if (compressedInfo.exists) {
      const compressedSizeKB = compressedInfo.size / 1024;
      console.log(`📊 [Compression] Compressed size: ${compressedSizeKB.toFixed(2)} KB`);
      
      // If still too large, reduce quality further
      if (compressedSizeKB > maxSizeKB && quality > 0.5) {
        console.log('⚠️ [Compression] Still too large, reducing quality further...');
        const lowerQuality = Math.max(0.5, quality - 0.2);
        
        const furtherCompressed = await ImageManipulator.manipulateAsync(
          imageUri,
          [
            {
              resize: {
                width: maxWidth * 0.9, // Slightly smaller
                height: maxHeight * 0.9,
              },
            },
          ],
          {
            compress: lowerQuality,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );
        
        const furtherInfo = await FileSystem.getInfoAsync(furtherCompressed.uri);
        if (furtherInfo.exists) {
          const furtherSizeKB = furtherInfo.size / 1024;
          console.log(`📊 [Compression] Further compressed size: ${furtherSizeKB.toFixed(2)} KB`);
        }
        
        // Read base64 from further compressed image
        const base64 = await FileSystem.readAsStringAsync(furtherCompressed.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Clean up temp file
        await FileSystem.deleteAsync(furtherCompressed.uri, { idempotent: true });
        
        console.log(`✅ [Compression] Final base64 length: ${(base64.length / 1024).toFixed(2)} KB`);
        return base64;
      }
    }
    
    // Read base64 from compressed image
    const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Clean up temp file
    await FileSystem.deleteAsync(manipulatedImage.uri, { idempotent: true });
    
    console.log(`✅ [Compression] Final base64 length: ${(base64.length / 1024).toFixed(2)} KB`);
    return base64;
    
  } catch (error) {
    console.error('❌ [Compression] Error compressing image:', error);
    // Fallback: return original image as base64
    console.log('⚠️ [Compression] Falling back to original image');
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  }
};

/**
 * Convert image URI to base64 with compression
 * @param {string} imageUri - Local file URI
 * @returns {Promise<string>} Base64 string
 */
export const imageUriToBase64 = async (imageUri) => {
  return compressImageForAPI(imageUri);
};

