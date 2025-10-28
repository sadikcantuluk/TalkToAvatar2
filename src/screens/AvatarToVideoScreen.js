import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, IMAGES } from '../constants';
import { Button, DashboardLayout, LanguageSelector, VoiceSelector } from '../components';

const AvatarToVideoScreen = ({ navigation, route }) => {
  const selectedAvatar = route?.params?.selectedAvatar || {
    name: 'Aria',
    description: 'Natural',
    image: IMAGES.yusuf,
  };

  const [scriptText, setScriptText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

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

  const handleCreateVideo = () => {
    if (!scriptText.trim()) {
      alert('Please enter your script');
      return;
    }
    // TODO: Implement video creation with Fal.ai API
    alert('Video creation will be implemented with Fal.ai API');
  };

  const handlePastVideos = () => {
    navigation.navigate('PastVideosList');
  };

  return (
    <DashboardLayout 
      currentMode="video" 
      onModeChange={handleModeChange}
      navigation={navigation}
    >
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

        {/* Script Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Your Script</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Type what you want the avatar to say..."
              placeholderTextColor={COLORS.gray[400]}
              value={scriptText}
              onChangeText={setScriptText}
              multiline={true}
              numberOfLines={6}
              maxLength={1000}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{scriptText.length}/1000</Text>
          </View>
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
              />
            </View>

            <View style={styles.selectContainer}>
              <Text style={styles.selectLabel}>Language</Text>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                showFlag={false}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <Button
          title="Create Video"
          onPress={handleCreateVideo}
          variant="primary"
          style={styles.createButton}
        />
        <Button
          title="Past Videos"
          onPress={handlePastVideos}
          variant="outline"
          style={styles.pastButton}
        />
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingBottom: 200,
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
    color: COLORS.textLight,
  },
  chooseAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(19, 127, 236, 0.5)',
    borderRadius: 20,
  },
  chooseAvatarText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.primary,
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
    borderWidth: 2,
    borderColor: COLORS.primary,
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
    fontWeight: '500',
    color: COLORS.textLight,
  },
  avatarDescription: {
    fontSize: SIZES.body4,
    color: COLORS.gray[400],
  },
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.gray[700],
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    paddingBottom: 32,
    fontSize: SIZES.body1,
    color: COLORS.textLight,
    minHeight: 150,
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: SIZES.body4,
    color: COLORS.gray[400],
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
    color: COLORS.gray[400],
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.gray[700],
    borderRadius: SIZES.radius,
  },
  selectButtonText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.padding,
    backgroundColor: 'rgba(16, 25, 34, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.1)',
    gap: 12,
  },
  createButton: {
    width: '100%',
    height: 56,
  },
  pastButton: {
    width: '100%',
    height: 56,
  },
});

export default AvatarToVideoScreen;

