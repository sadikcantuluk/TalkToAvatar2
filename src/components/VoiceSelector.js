import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { generateVoicePreview, stopVoicePreview } from '../services/openAI';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// OpenAI TTS voices
const voices = [
  { id: 'alloy', name: 'Alloy', gender: 'Neutral', description: 'Clear and balanced' },
  { id: 'echo', name: 'Echo', gender: 'Male', description: 'Warm and friendly' },
  { id: 'fable', name: 'Fable', gender: 'Male', description: 'Expressive and engaging' },
  { id: 'onyx', name: 'Onyx', gender: 'Male', description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', gender: 'Female', description: 'Energetic and bright' },
  { id: 'shimmer', name: 'Shimmer', gender: 'Female', description: 'Soft and soothing' },
];

const VoiceSelector = ({ selectedVoice, onVoiceChange, style }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [previewingVoice, setPreviewingVoice] = useState(null);
  
  const selectedVoiceObj = voices.find(v => v.id === selectedVoice) || voices[0];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoicePreview();
    };
  }, []);

  const handleSelect = (voice) => {
    onVoiceChange(voice.id);
    setModalVisible(false);
  };

  const handlePreview = async (voiceId) => {
    // If already previewing this voice, stop it
    if (previewingVoice === voiceId) {
      await stopVoicePreview();
      setPreviewingVoice(null);
      return;
    }

    // Stop any previous preview immediately
    if (previewingVoice) {
      await stopVoicePreview();
    }

    // Start new preview immediately
    setPreviewingVoice(voiceId);
    
    // Generate and play voice
    const result = await generateVoicePreview(voiceId);
    
    if (result.success) {
      // Auto-stop indicator after 3 seconds (sound will finish naturally)
      setTimeout(() => {
        setPreviewingVoice(null);
      }, 3000);
    } else {
      setPreviewingVoice(null);
      alert('Voice preview failed. Please check your OpenAI API key.');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, style]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.voiceInfo}>
          <Text style={styles.voiceName}>{selectedVoiceObj.name}</Text>
          <Text style={styles.voiceGender}>{selectedVoiceObj.gender}</Text>
        </View>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color="rgba(255,255,255,0.6)" 
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Voice</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.voiceList}
              contentContainerStyle={styles.voiceListContent}
              showsVerticalScrollIndicator={true}
            >
              {voices.map((voice) => (
                <View key={voice.id} style={styles.voiceOptionWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.voiceOption,
                      selectedVoice === voice.id && styles.voiceOptionSelected,
                    ]}
                    onPress={() => handleSelect(voice)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.voiceDetails}>
                      <Text style={[
                        styles.voiceOptionName,
                        selectedVoice === voice.id && styles.voiceOptionNameSelected,
                      ]}>
                        {voice.name}
                      </Text>
                      <Text style={styles.voiceOptionGender}>{voice.gender}</Text>
                      <Text style={styles.voiceOptionDescription}>{voice.description}</Text>
                    </View>
                    {selectedVoice === voice.id && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.previewButton,
                      previewingVoice === voice.id && styles.previewButtonActive,
                    ]}
                    onPress={() => handlePreview(voice.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={previewingVoice === voice.id ? "pause" : "play"} 
                      size={16} 
                      color={COLORS.primary} 
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selector: {
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
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  voiceGender: {
    fontSize: SIZES.body4,
    color: COLORS.gray[400],
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: 'rgba(30, 41, 59, 0.98)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(30, 41, 59, 1)',
  },
  modalTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  closeButton: {
    padding: 4,
  },
  voiceList: {
    flexGrow: 0,
  },
  voiceListContent: {
    paddingBottom: 8,
  },
  voiceOptionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  voiceOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  voiceOptionSelected: {
    backgroundColor: 'rgba(19, 127, 236, 0.15)',
  },
  voiceDetails: {
    flex: 1,
  },
  voiceOptionName: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  voiceOptionNameSelected: {
    color: COLORS.primary,
  },
  voiceOptionGender: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    marginTop: 2,
  },
  voiceOptionDescription: {
    fontSize: SIZES.body4,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  previewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 127, 236, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewButtonActive: {
    backgroundColor: 'rgba(19, 127, 236, 0.2)',
    borderColor: COLORS.primary,
  },
});

export default VoiceSelector;

