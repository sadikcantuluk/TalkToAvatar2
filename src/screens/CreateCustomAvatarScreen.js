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
import { COLORS, SIZES } from '../constants';
import { Header, Button, Input } from '../components';

const CreateCustomAvatarScreen = ({ navigation }) => {
  const [step, setStep] = useState('create'); // 'create', 'loading', 'confirmation'
  const [selectedImage, setSelectedImage] = useState(null);
  const [avatarName, setAvatarName] = useState('');
  const [generatedAvatar, setGeneratedAvatar] = useState(null);

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
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
      alert('Please upload a photo and enter an avatar name');
      return;
    }

    // Show loading
    setStep('loading');

    // Simulate avatar creation with Gemini API
    // In real implementation, call Gemini API here
    setTimeout(() => {
      setGeneratedAvatar(selectedImage); // For now, use the same image
      setStep('confirmation');
    }, 3000);
  };

  const handleAccept = () => {
    // Navigate back to Select Avatar with the new custom avatar
    navigation.navigate('SelectAvatar', {
      customAvatar: {
        id: 'custom_' + Date.now(),
        name: avatarName,
        description: 'Custom avatar',
        image: { uri: generatedAvatar },
      },
    });
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
        />
        <Button
          title="Recreate"
          onPress={handleRecreate}
          variant="outline"
          style={styles.actionButton}
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

