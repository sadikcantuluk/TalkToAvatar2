import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { COLORS, SIZES } from '../constants';
import { Header, Button, Input } from '../components';
import { generateAvatarFromImage } from '../services/googleAI';
import { useAuth, useToast } from '../context';
import customAvatarsAPI from '../services/customAvatarsAPI';
import { compressImageForAPI } from '../utils/imageCompression';

const CreateCustomAvatarScreen = ({ navigation }) => {
  const { token, user } = useAuth();
  const { error: showError, warning, info, success } = useToast();
  
  const [step, setStep] = useState('create'); // 'create', 'loading', 'confirmation'
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarName, setAvatarName] = useState('');
  const [generatedAvatar, setGeneratedAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showError('We need camera roll permissions to upload photos');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCreate = async () => {
    if (!selectedImage || !avatarName.trim()) {
      showError('Please upload a photo and enter an avatar name');
      return;
    }

    try {
      console.log('=== Creating Custom Avatar ===');
      console.log('Avatar Name:', avatarName);
      console.log('Selected Image URI:', selectedImage);
      
      // Show loading
      setStep('loading');

      // Convert image to base64 with compression (max 1MB)
      console.log('Reading and compressing image...');
      const base64 = await compressImageForAPI(selectedImage, 1024, 1024, 0.8, 1000);
      console.log('Base64 length:', base64.length, 'bytes (', (base64.length / 1024).toFixed(2), 'KB)');

      // Call Google AI API to generate avatar
      console.log('Calling Google AI API...');
      const result = await generateAvatarFromImage(base64);
      console.log('API result success:', result.success);

      if (result.success) {
        // Check if we have a generated image or using fallback
        if (result.generatedImages && result.generatedImages.length > 0 && 
            result.generatedImages[0].image.imageBytes) {
          // Use the AI-generated image
          console.log('Using AI-generated image');
          const generatedImageBase64 = result.generatedImages[0].image.imageBytes;
          console.log('Generated image base64 length:', generatedImageBase64.length);
          setGeneratedAvatar(`data:image/jpeg;base64,${generatedImageBase64}`);
        } else if (result.fallback) {
          // Fallback: Use the original image
          console.log('Using original image as fallback');
          setGeneratedAvatar(selectedImage);
          info('AI generation unavailable, using your original image');
        } else {
          // No image available
          console.error('No image returned from API');
          throw new Error('No image returned from API');
        }
        console.log('Moving to confirmation step');
        setStep('confirmation');
      } else {
        console.error('API returned failure:', result.error);
        throw new Error('Failed to generate avatar');
      }
    } catch (error) {
      console.error('❌ Avatar creation error:', error);
      console.error('Error stack:', error.stack);
      showError('Failed to create avatar. Please try again.');
      setStep('create');
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      console.log('=== Accepting Custom Avatar ===');
      console.log('Avatar Name:', avatarName);
      console.log('Generated Avatar Type:', generatedAvatar.startsWith('data:image') ? 'base64' : 'file');
      
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Media library permission denied');
        alert('Permission to access media library is required!');
        setIsLoading(false);
        return;
      }

      let savedImageUri = generatedAvatar;

      // If the image is base64, save it to gallery first
      if (generatedAvatar.startsWith('data:image')) {
        console.log('Saving base64 image to file system...');
        
        // Create a file from base64
        const filename = `avatar_${avatarName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        console.log('File URI:', fileUri);
        
        // Extract base64 data
        const base64Data = generatedAvatar.split(',')[1];
        console.log('Base64 data length:', base64Data.length);
        
        // Write to file
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('File written successfully');
        
        // Save to media library
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        savedImageUri = asset.uri;
        console.log('Saved to media library:', savedImageUri);
        
        // Clean up temp file
        await FileSystem.deleteAsync(fileUri, { idempotent: true });
        console.log('Temp file cleaned up');
      }

      const newAvatar = {
        id: 'custom_' + Date.now(),
        name: avatarName,
        description: 'Custom avatar',
        image: { uri: savedImageUri },
      };
      
      console.log('New Avatar Object:', JSON.stringify(newAvatar));
      
      // Show loading message for backend save
      info('Creating your avatar... This may take a moment.');
      
      // Save to backend first, then navigate
      if (token && user) {
        try {
          console.log('📤 Saving custom avatar to backend...');
          // Backend expects: avatar_name and local_uri (not name, image_uri, description, metadata)
          const backendData = {
            avatar_name: avatarName,
            local_uri: savedImageUri,
          };
          
          console.log('📤 Backend data:', { avatar_name: avatarName, local_uri: savedImageUri.substring(0, 50) + '...' });
          
          const response = await customAvatarsAPI.create(token, backendData);
          const backendId = response.avatar?.id || response.custom_avatar?.id;
          console.log('✅ Custom avatar saved to backend with ID:', backendId);
          
          // Add backend_id to avatar object
          newAvatar.backend_id = backendId;
          console.log('✅ Backend ID added to avatar:', backendId);
          
          // Show success toast after backend save
          success('Custom avatar created successfully!');
          
          console.log('Navigating to SelectAvatar...');
          
          // Navigate back to Select Avatar with new custom avatar
          navigation.navigate('SelectAvatar', {
            customAvatar: newAvatar,
          });
        } catch (backendError) {
          console.error('⚠️ Backend save failed, saving locally only:', backendError);
          
          // Still save locally and navigate even if backend fails
          newAvatar.backend_id = null;
          success('Custom avatar created locally!');
          
          console.log('Navigating to SelectAvatar...');
          
          // Navigate back to Select Avatar with new custom avatar
          navigation.navigate('SelectAvatar', {
            customAvatar: newAvatar,
          });
        }
      } else {
        // No user/token, save locally only
        newAvatar.backend_id = null;
        success('Custom avatar created locally!');
        
        console.log('Navigating to SelectAvatar...');
        
        // Navigate back to Select Avatar with new custom avatar
        navigation.navigate('SelectAvatar', {
          customAvatar: newAvatar,
        });
      }
    } catch (error) {
      console.error('❌ Error saving avatar:', error);
      console.error('Error stack:', error.stack);
      showError('Failed to save avatar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecreate = () => {
    setStep('create');
    setGeneratedAvatar(null);
  };

  // Create View
  if (step === 'create') {
    return (
      <View style={styles.container}>
        <Header
          title="Create Your Avatar"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Image Upload */}
          <TouchableOpacity
            style={styles.uploadContainer}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.uploadedImage} resizeMode="cover" />
            ) : (
              <>
                <Text style={styles.uploadTitle}>Upload Photo</Text>
                <Text style={styles.uploadDescription}>
                  Tap to upload a clear, front-facing photo
                </Text>
                <Button
                  title="Upload"
                  onPress={pickImage}
                  variant="secondary"
                  size="small"
                  style={styles.uploadButton}
                />
              </>
            )}
          </TouchableOpacity>

          {/* Avatar Name Input */}
          <Input
            label="Avatar Name"
            placeholder="Enter Avatar Name"
            value={avatarName}
            onChangeText={setAvatarName}
            containerStyle={styles.inputContainer}
          />
        </ScrollView>

        {/* Create Button */}
        <View style={styles.footer}>
          <Button
            title="Create"
            onPress={handleCreate}
            variant="primary"
            disabled={!selectedImage || !avatarName.trim()}
            style={styles.createButton}
          />
        </View>
      </View>
    );
  }

  // Loading View
  if (step === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <View style={styles.loadingTextContainer}>
            <Text style={styles.loadingTitle}>Bringing your avatar to life...</Text>
            <Text style={styles.loadingDescription}>This might take a moment.</Text>
          </View>
        </View>
      </View>
    );
  }

  // Confirmation View
  return (
    <View style={styles.container}>
      <Header title="Here's Your Avatar!" />

      <View style={styles.confirmationContent}>
        {/* Avatar Preview */}
        <View style={styles.avatarPreviewContainer}>
          <Image
            source={{ uri: generatedAvatar }}
            style={styles.avatarPreview}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.avatarNamePreview}>{avatarName}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title="Accept and Continue"
          onPress={handleAccept}
          variant="primary"
          style={styles.actionButton}
          disabled={isLoading}
          loading={isLoading}
        />
        <Button
          title="Recreate"
          onPress={handleRecreate}
          variant="outline"
          style={styles.actionButton}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 100,
  },
  uploadContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.gray[700],
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    maxHeight: 400,
    marginBottom: 24,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    textAlign: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    minWidth: 100,
  },
  inputContainer: {
    marginBottom: 0,
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: 'rgba(16, 25, 34, 0.8)',
    gap: 12,
  },
  createButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(16, 25, 34, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 24,
  },
  loadingTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  loadingTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  loadingDescription: {
    fontSize: SIZES.body2,
    color: COLORS.gray[300],
  },
  confirmationContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  avatarPreviewContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarPreview: {
    width: '100%',
    height: '100%',
  },
  avatarNamePreview: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: 16,
  },
  actionButton: {
    width: '100%',
  },
});

export default CreateCustomAvatarScreen;
