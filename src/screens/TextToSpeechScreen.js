import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, IMAGES } from '../constants';
import { Button, Input, DashboardLayout } from '../components';

const TextToSpeechScreen = ({ navigation, route }) => {
  const selectedAvatar = route?.params?.selectedAvatar || {
    name: 'Yusuf',
    image: IMAGES.yusuf,
  };

  const [outputName, setOutputName] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Aura - Female');
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleModeChange = (mode) => {
    if (mode === 'video') {
      navigation.navigate('AvatarToVideo');
    } else if (mode === 'travel') {
      navigation.navigate('TravelAssistant');
    }
  };

  const handleAvatarSelect = () => {
    navigation.navigate('SelectAvatar');
  };

  const handleCreate = () => {
    if (!textInput.trim()) {
      alert('Please enter some text');
      return;
    }
    // Simulate audio creation
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const handleMicPress = () => {
    // Implement STT functionality
    alert('Voice recording feature coming soon!');
  };

  const handlePastAudio = () => {
    navigation.navigate('PastAudioList');
  };

  return (
    <DashboardLayout 
      currentMode="tts" 
      onModeChange={handleModeChange}
      navigation={navigation}
    >
      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={selectedAvatar.image}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <TouchableOpacity
            style={styles.avatarSelectButton}
            onPress={handleAvatarSelect}
            activeOpacity={0.7}
          >
            <Ionicons name="swap-horizontal" size={18} color={COLORS.white} />
            <Text style={styles.avatarSelectText}>Avatar Select</Text>
          </TouchableOpacity>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Input
            label="Output Name"
            placeholder="Name your audio file..."
            value={outputName}
            onChangeText={setOutputName}
          />

          <Input
            label="Text to Speech"
            placeholder="Type your message here..."
            value={textInput}
            onChangeText={setTextInput}
            multiline={true}
            numberOfLines={5}
            maxLength={500}
            rightIcon={
              <Ionicons name="mic" size={24} color="rgba(255,255,255,0.6)" />
            }
            onRightIconPress={handleMicPress}
          />

          {/* Navigation Arrows */}
          <View style={styles.navigationRow}>
            <View style={styles.arrowButtons}>
              <TouchableOpacity style={styles.arrowButton}>
                <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowButton}>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Voice and Language Selection */}
        <View style={styles.selectionSection}>
          <View style={styles.selectionRow}>
            <View style={styles.selectionItem}>
              <Text style={styles.selectionLabel}>Voice Selection</Text>
              <TouchableOpacity style={styles.selectionButton}>
                <Text style={styles.selectionButtonText}>{selectedVoice}</Text>
                <Ionicons name="chevron-expand" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>

            <View style={styles.selectionItem}>
              <Text style={styles.selectionLabel}>Language</Text>
              <TouchableOpacity style={styles.selectionButton}>
                <Text style={styles.selectionButtonText}>{selectedLanguage}</Text>
                <Ionicons name="chevron-expand" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Create Button Section */}
        <View style={styles.createSection}>
          <TouchableOpacity 
            style={styles.pastAudioButton}
            onPress={handlePastAudio}
          >
            <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.6)" />
            <Text style={styles.pastAudioText}>Past Audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.createButton,
              isPlaying && styles.createButtonActive,
            ]}
            onPress={handleCreate}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>
              {isPlaying ? 'Playing' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.gray[800],
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarSelectButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  avatarSelectText: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: COLORS.white,
  },
  inputSection: {
    marginBottom: 32,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionSection: {
    marginBottom: 32,
  },
  selectionRow: {
    flexDirection: 'row',
    gap: 16,
  },
  selectionItem: {
    flex: 1,
  },
  selectionLabel: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  selectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radius,
  },
  selectionButtonText: {
    fontSize: SIZES.body1,
    color: COLORS.textLight,
  },
  createSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  pastAudioButton: {
    position: 'absolute',
    right: 0,
    top: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pastAudioText: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  createButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  createButtonActive: {
    backgroundColor: '#22c55e',
  },
  createButtonText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.backgroundDark,
  },
});

export default TextToSpeechScreen;

