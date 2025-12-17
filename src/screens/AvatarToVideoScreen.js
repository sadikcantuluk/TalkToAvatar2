import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { COLORS, SIZES, IMAGES } from '../constants';
import { Button, Input, DashboardLayout, LanguageSelector, VoiceSelector } from '../components';
import { generateTextToSpeech } from '../services/openAI';
import { uploadToFal, generateVideo, downloadVideo } from '../services/falAI';
import { useNotifications } from '../context/NotificationContext';
import { useAuth, useToast } from '../context';
import videosAPI from '../services/videosAPI';
import notificationsAPI from '../services/notificationsAPI';
import { getUserStorageKey } from '../utils/userStorage';
import { useFocusEffect } from '@react-navigation/native';
import { videoCreationJobService } from '../services/videoCreationJobService';

const AvatarToVideoScreen = ({ navigation, route }) => {
  const { addNotification } = useNotifications();
  const { token, user } = useAuth();
  const { success, error: showError } = useToast();

  const [selectedAvatar, setSelectedAvatar] = useState({
    name: 'Yusuf',
    description: 'Natural',
    image: IMAGES.yusuf,
  });

  const [scriptText, setScriptText] = useState('');
  const [outputName, setOutputName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState('');
  const [job, setJob] = useState(null);
  const [progressPanelVisible, setProgressPanelVisible] = useState(false);

  const STEP_LABELS = {
    generating_speech: 'Generating speech',
    uploading_audio: 'Uploading audio',
    uploading_avatar: 'Uploading avatar',
    generating_video: 'Creating video (this may take a few minutes)',
    downloading_video: 'Downloading video',
    saving: 'Saving',
  };

  const refreshJob = async () => {
    if (!user?.id) return;
    const current = await videoCreationJobService.getJob(user.id);
    setJob(current);
    setProgressPanelVisible(current?.status === 'running');
    if (current?.status === 'running') {
      setIsCreating(true);
      setCreationProgress(current?.message || '');
    }
    if (current?.status === 'succeeded' || current?.status === 'failed') {
      setIsCreating(false);
      setCreationProgress('');
    }
  };

  useEffect(() => {
    refreshJob();
    // Subscribe to in-memory updates (best effort)
    const unsubscribe = videoCreationJobService.subscribe(user?.id, (next) => {
      setJob(next);
      setProgressPanelVisible(next?.status === 'running');
    });
    return unsubscribe;
  }, [user?.id]);

  useFocusEffect(
    React.useCallback(() => {
      // Re-sync from storage when coming back to this screen
      refreshJob();
      return undefined;
    }, [user?.id])
  );

  // Handle avatar selection from route params
  useEffect(() => {
    if (route?.params?.selectedAvatar) {
      console.log('=== Avatar Updated from Route Params ===');
      console.log('New Avatar:', route.params.selectedAvatar.name);
      setSelectedAvatar(route.params.selectedAvatar);
    }
  }, [route?.params?.selectedAvatar]);

  // Handle video params from history
  useEffect(() => {
    const loadVideoParams = async () => {
      if (route?.params?.loadVideo) {
        console.log('=== Loading Video Parameters from History ===');
        const video = route.params.loadVideo;
        console.log('Video ID:', video.id);
        console.log('Video Name:', video.name);
        console.log('Text:', video.text);
        console.log('Voice:', video.voice);
        console.log('Language:', video.language);
        console.log('Avatar Name:', video.avatarName);

        setOutputName(video.name || '');
        setScriptText(video.text || '');
        setSelectedVoice(video.voice || 'nova');
        setSelectedLanguage(video.language || 'en');

        // Handle avatar
        if (video.avatarName === 'Yusuf' || video.avatarName === 'Eda') {
          console.log('Loading default avatar:', video.avatarName);
          setSelectedAvatar({
            name: video.avatarName,
            description: 'Natural',
            image: video.avatarName === 'Yusuf' ? IMAGES.yusuf : IMAGES.eda,
          });
        } else if (video.avatarName) {
          console.log('Loading custom avatar:', video.avatarName);
          try {
            const customAvatarsKey = getUserStorageKey('@custom_avatars', user?.id);
            const customAvatarsJSON = await AsyncStorage.getItem(customAvatarsKey);
            if (customAvatarsJSON) {
              const customAvatars = JSON.parse(customAvatarsJSON);
              const customAvatar = customAvatars.find(a => a.name === video.avatarName);
              if (customAvatar) {
                console.log('Custom avatar found:', customAvatar.name);
                setSelectedAvatar({
                  name: customAvatar.name,
                  description: 'Custom',
                  image: { uri: customAvatar.imageUri },
                });
              }
            }
          } catch (error) {
            console.error('Error loading custom avatar:', error);
          }
        }

        console.log('✅ All parameters loaded successfully');
      }
    };

    loadVideoParams();
  }, [route?.params?.loadVideo]);

  const handleModeChange = (mode) => {
    if (mode === 'tts') {
      navigation.navigate('Dashboard');
    } else if (mode === 'travel') {
      navigation.navigate('TravelAssistant');
    }
  };

  const handleAvatarSelect = () => {
    navigation.navigate('SelectAvatar', { returnScreen: 'AvatarToVideo' });
  };

  const handleClearText = () => {
    console.log('=== Clearing Script Text ===');
    setScriptText('');
  };

  const saveVideoToHistory = async (videoData) => {
    if (!user?.id) {
      showError('User not authenticated');
      return;
    }

    try {
      console.log('=== Saving Video to History ===');
      const key = getUserStorageKey('@video_history', user.id);

      // Save to local AsyncStorage (fast)
      const existingHistory = await AsyncStorage.getItem(key);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(videoData);
      await AsyncStorage.setItem(key, JSON.stringify(history));
      console.log('✅ Video saved to AsyncStorage. Total videos:', history.length);

      // Save to backend asynchronously (non-blocking)
      if (token && user) {
        Promise.resolve().then(async () => {
          try {
            console.log('📤 Saving video to backend (background)...');
            const backendData = {
              name: videoData.name,
              text: videoData.text,
              translated_text: videoData.translatedText,
              voice_type: videoData.voice,
              language_code: videoData.language,
              avatar_name: videoData.avatarName,
              video_uri: videoData.videoUri,
              video_url: videoData.videoUrl,
              metadata: {
                created_at: videoData.createdAt,
              },
            };

            const response = await videosAPI.create(token, backendData);
            const backendId = response.video?.id;
            console.log('✅ Video saved to backend:', backendId);

            // Update local storage with backend_id for future deletion
            const saved = await AsyncStorage.getItem(key);
            if (saved && backendId) {
              const history = JSON.parse(saved);
              const updatedHistory = history.map(item => {
                if (item.id === videoData.id) {
                  return { ...item, backend_id: backendId };
                }
                return item;
              });
              await AsyncStorage.setItem(key, JSON.stringify(updatedHistory));
            }
          } catch (backendError) {
            console.error('⚠️ Backend save failed, but local save succeeded:', backendError);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error saving video to history:', error);
      showError('Failed to save video');
    }
  };

  const handleCreateVideo = async () => {
    console.log('=== Creating Video ===');
    console.log('Avatar:', selectedAvatar.name);
    console.log('Script:', scriptText);
    console.log('Voice:', selectedVoice);
    console.log('Language:', selectedLanguage);
    console.log('Output Name:', outputName);

    if (!scriptText.trim()) {
      Alert.alert('Error', 'Please enter your script');
      return;
    }

    if (!outputName.trim()) {
      Alert.alert('Error', 'Please enter a name for your video');
      return;
    }

    if (!user?.id) {
      showError('User not authenticated');
      return;
    }

    try {
      setIsCreating(true);
      setProgressPanelVisible(true);

      await videoCreationJobService.start({
        userId: user.id,
        workflow: async ({ update }) => {
          await update('generating_speech', 'Generating speech...');
          setCreationProgress('Generating speech...');
          const ttsResult = await generateTextToSpeech(scriptText, selectedVoice, selectedLanguage);
          if (!ttsResult.success || !ttsResult.audioUri) {
            throw new Error(ttsResult.error || 'Failed to generate speech');
          }

          const translatedText = ttsResult.translatedText || scriptText;

          await update('uploading_audio', 'Uploading audio...');
          setCreationProgress('Uploading audio...');
          const audioUpload = await uploadToFal(ttsResult.audioUri, `audio_${Date.now()}.mp3`);
          if (!audioUpload.success) {
            throw new Error(audioUpload.error || 'Failed to upload audio');
          }

          await update('uploading_avatar', 'Uploading avatar...');
          setCreationProgress('Uploading avatar...');
          let avatarUri;
          if (selectedAvatar.image.uri) {
            avatarUri = selectedAvatar.image.uri;
          } else {
            const resolvedAsset = Image.resolveAssetSource(selectedAvatar.image);
            if (!resolvedAsset || !resolvedAsset.uri) {
              throw new Error('Could not resolve default avatar');
            }
            const fileName = `avatar_default_${Date.now()}.jpg`;
            const newUri = `${FileSystem.documentDirectory}${fileName}`;
            await FileSystem.downloadAsync(resolvedAsset.uri, newUri);
            avatarUri = newUri;
          }

          const imageUpload = await uploadToFal(avatarUri, `avatar_${Date.now()}.jpg`);
          if (!imageUpload.success) {
            throw new Error(imageUpload.error || 'Failed to upload avatar');
          }

          await update('generating_video', 'Creating video (this may take a few minutes)...');
          setCreationProgress('Creating video (this may take a few minutes)...');
          const videoResult = await generateVideo(imageUpload.url, audioUpload.url, translatedText);
          if (!videoResult.success || !videoResult.videoUrl) {
            throw new Error(videoResult.error || 'Failed to generate video');
          }

          await update('downloading_video', 'Downloading video...');
          setCreationProgress('Downloading video...');
          const downloadResult = await downloadVideo(videoResult.videoUrl, `video_${Date.now()}.mp4`);
          if (!downloadResult.success || !downloadResult.uri) {
            throw new Error(downloadResult.error || 'Failed to download video');
          }

          await update('saving', 'Saving...');
          setCreationProgress('Saving...');
          const videoData = {
            id: Date.now(),
            name: outputName,
            text: scriptText,
            translatedText,
            voice: selectedVoice,
            language: selectedLanguage,
            avatarName: selectedAvatar.name,
            videoUri: downloadResult.uri,
            videoUrl: videoResult.videoUrl,
            createdAt: new Date().toISOString(),
          };

          await saveVideoToHistory(videoData);

          addNotification({
            type: 'video_ready',
            title: 'Video Ready! 🎉',
            message: `Your video "${outputName}" has been created successfully and is ready to watch.`,
            videoData: videoData,
            fromBackend: false,
          });

          return { videoData };
        },
      });

      setIsCreating(false);
      setCreationProgress('');
      setProgressPanelVisible(false);
    } catch (error) {
      console.error('=== Video Creation Error ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setIsCreating(false);
      setCreationProgress('');
      setProgressPanelVisible(false);
      Alert.alert('Error', `Failed to create video: ${error.message}`);
    }
  };

  const handlePastVideos = () => {
    console.log('=== Navigating to Past Videos ===');
    navigation.navigate('PastVideosList');
  };

  return (
    <DashboardLayout
      currentMode="video"
      onModeChange={handleModeChange}
      navigation={navigation}
      showBackButton={true}
    >
      {(progressPanelVisible || job?.status === 'running') && (
        <View style={styles.progressOverlayContainer} pointerEvents="box-none">
          <View style={styles.progressOverlayCard} pointerEvents="auto">
            <View style={styles.progressModalHeader}>
              <View style={styles.progressModalHeaderLeft}>
                <Ionicons name="videocam" size={20} color="#2D7F83" />
                <Text style={styles.progressModalTitle}>Creating your video</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  // Allow collapse, but keep Create disabled via isCreating while job is running
                  setProgressPanelVisible(false);
                }}
                style={styles.progressModalClose}
              >
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.progressModalSubtitle}>
              Video creation started successfully. We'll notify you when it's ready.
            </Text>

            <View style={styles.progressStepList}>
              {Object.entries(STEP_LABELS).map(([key, label]) => {
                const isActive = job?.status === 'running' && job?.step === key;
                const isDone =
                  job?.step &&
                  Object.keys(STEP_LABELS).indexOf(key) < Object.keys(STEP_LABELS).indexOf(job.step) &&
                  job?.status !== 'failed';
                return (
                  <View key={key} style={styles.progressStepRow}>
                    <View
                      style={[
                        styles.progressStepDot,
                        isDone && styles.progressStepDotDone,
                        isActive && styles.progressStepDotActive,
                      ]}
                    />
                    <Text style={[styles.progressStepText, isActive && styles.progressStepTextActive]}>
                      {label}
                    </Text>
                    {isActive && <ActivityIndicator size="small" color="#2D7F83" />}
                    {isDone && <Ionicons name="checkmark-circle" size={18} color="#10b981" />}
                  </View>
                );
              })}
            </View>

            <View style={styles.progressModalFooter}>
              <Text style={styles.progressModalFooterText}>{job?.message || creationProgress || ''}</Text>
            </View>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Avatar</Text>
            <TouchableOpacity
              style={styles.chooseAvatarButton}
              onPress={handleAvatarSelect}
              activeOpacity={0.7}
            >
              <Ionicons name="person-add" size={16} color={COLORS.primary} />
              <Text style={styles.chooseAvatarText}>Choose Avatar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarImageContainer}>
                <Image
                  source={selectedAvatar.image}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.avatarName}>{selectedAvatar.name}</Text>
                <Text style={styles.avatarDescription}>{selectedAvatar.description}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Output Name Section */}
        <View style={styles.section}>
          <Input
            label="Video Name"
            placeholder="Enter a name for your video..."
            value={outputName}
            onChangeText={setOutputName}
            maxLength={50}
            editable={!isCreating}
            labelStyle={{ color: '#1F2937' }}
            inputStyle={{
              color: '#1F2937',
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB'
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Script Section */}
        <View style={styles.section}>
          <Input
            label="Enter Your Script"
            placeholder="Type what you want the avatar to say..."
            value={scriptText}
            onChangeText={setScriptText}
            multiline={true}
            numberOfLines={6}
            maxLength={1000}
            editable={!isCreating}
            labelStyle={{ color: '#1F2937' }}
            inputStyle={{
              color: '#1F2937',
              backgroundColor: '#FFFFFF',
              borderColor: '#E5E7EB',
              textAlignVertical: 'top'
            }}
            placeholderTextColor="#9CA3AF"
            rightIcon={
              scriptText.length > 0 ? (
                <TouchableOpacity onPress={handleClearText} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>
              ) : null
            }
          />
        </View>

        {/* Voice & Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customize Voice & Language</Text>
          <View style={styles.spacer} />
          <View style={styles.customizeRow}>
            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Voice</Text>
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
                style={styles.selectButton}
                textColor="#1F2937"
                labelColor="#6B7280"
              />
            </View>

            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Language</Text>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                showFlag={false}
                style={styles.selectButton}
                textColor="#1F2937"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {isCreating && (
            <View style={styles.progressContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.progressText}>{creationProgress}</Text>
            </View>
          )}
          <Button
            title={isCreating ? "Creating..." : "Create Video"}
            onPress={handleCreateVideo}
            variant="primary"
            style={styles.createButton}
            disabled={isCreating}
          />
          <Button
            title="Past Videos"
            onPress={handlePastVideos}
            variant="outline"
            style={styles.pastButton}
            textStyle={{ color: COLORS.primary }}
            disabled={isCreating}
          />
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light Background
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 1.5,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  spacer: {
    height: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: '#1F2937', // Dark Text
  },
  chooseAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(45, 127, 131, 0.5)', // Teal Border
    borderRadius: 20,
    backgroundColor: 'rgba(45, 127, 131, 0.05)',
  },
  chooseAvatarText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: '#2D7F83', // Teal Text
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  avatarImageContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    borderWidth: 4, // Thicker border
    borderColor: '#FFFFFF',
    shadowColor: '#2D7F83', // Teal Shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarInfo: {
    alignItems: 'center',
  },
  avatarName: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: '#1F2937', // Dark Text
    marginBottom: 4,
  },
  avatarDescription: {
    fontSize: SIZES.body4,
    color: '#6B7280', // Gray Text
  },
  nameInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    fontSize: SIZES.body1,
    color: '#1F2937',
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    paddingTop: 40,
    paddingBottom: 32,
    fontSize: SIZES.body1,
    color: '#1F2937',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clearButtonInside: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: SIZES.body4,
    color: '#9CA3AF',
  },
  customizeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  selectContainer: {
    flex: 1,
  },
  selectLabel: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: '#4B5563', // Gray 600
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectButtonText: {
    fontSize: SIZES.body2,
    color: '#1F2937',
  },
  actionSection: {
    marginTop: 32,
    gap: 12,
  },
  progressOverlayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 50,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOverlayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  progressModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  progressModalClose: {
    padding: 6,
  },
  progressModalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  progressStepList: {
    gap: 10,
    marginBottom: 10,
  },
  progressStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressStepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  progressStepDotActive: {
    backgroundColor: '#2D7F83',
  },
  progressStepDotDone: {
    backgroundColor: '#10b981',
  },
  progressStepText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
  },
  progressStepTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  progressModalFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  progressModalFooterText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  progressText: {
    fontSize: SIZES.body3,
    color: '#2D7F83',
    flex: 1,
  },
  createButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#2D7F83', // Teal
    borderRadius: 16,
  },
  pastButton: {
    width: '100%',
    height: 56,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#FFFFFF', // Enable visibility on off-white backgrounds
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default AvatarToVideoScreen;
