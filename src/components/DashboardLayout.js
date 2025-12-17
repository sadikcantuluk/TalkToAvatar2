import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import NotificationSystem from './NotificationSystem';

const modes = [
  { id: 'sualingo', name: 'Sualingo Mode', icon: 'language' },
  { id: 'video', name: 'Video Mode', icon: 'videocam' },
  { id: 'travel', name: 'Travel Assistant', icon: 'navigate' },
  { id: 'tts', name: 'TTS Mode', icon: 'mic' },
];

const DashboardLayout = ({ children, currentMode = 'tts', onModeChange, navigation, hideHeader = false, showBackButton = false }) => {
  const [modeModalVisible, setModeModalVisible] = useState(false);

  const currentModeData = modes.find(m => m.id === currentMode) || modes[0];

  const handleModeSelect = (mode) => {
    setModeModalVisible(false);

    // Direct navigation based on mode (only if navigation is available)
    if (navigation) {
      if (mode.id === 'tts') {
        navigation.navigate('TextToSpeech');
      } else if (mode.id === 'video') {
        navigation.navigate('AvatarToVideo');
      } else if (mode.id === 'travel') {
        navigation.navigate('TravelAssistant');
      } else if (mode.id === 'sualingo') {
        navigation.navigate('Courses');
      }
    }

    // Also call onModeChange if provided (for internal state updates)
    if (onModeChange) {
      onModeChange(mode.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      {!hideHeader && (
        <View style={styles.header}>
          {/* Left: Back Button */}
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation ? navigation.navigate('Dashboard') : null}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* Center: Mode Selector */}
          <View style={styles.headerCenter}>
            <TouchableOpacity
              style={styles.modeSelector}
              onPress={() => setModeModalVisible(true)}
            >
              <View style={styles.modePill}>
                <Ionicons name={currentModeData.icon} size={18} color={COLORS.primary} />
                <Text style={styles.modeText}>{currentModeData.name}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* Right: Notifications & Profile */}
          <View style={styles.headerRight}>
            <NotificationSystem navigation={navigation} />

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle-outline" size={28} color="#2D7F83" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content */}
      {children}

      {/* Mode Selection Modal */}
      <Modal
        visible={modeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Mode</Text>
              <TouchableOpacity onPress={() => setModeModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={modes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modeItem,
                    currentMode === item.id && styles.modeItemSelected,
                  ]}
                  onPress={() => handleModeSelect(item)}
                >
                  <View style={styles.modeItemIconContainer}>
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={currentMode === item.id ? COLORS.primary : '#6B7280'}
                    />
                  </View>
                  <Text style={[
                    styles.modeItemText,
                    currentMode === item.id && styles.modeItemTextSelected
                  ]}>
                    {item.name}
                  </Text>
                  {currentMode === item.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light Background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 0,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: -8, // Align with padding
  },
  modeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: '#1F2937',
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 0,
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  modeItemSelected: {
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
  },
  modeItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeItemText: {
    flex: 1,
    fontSize: SIZES.body1,
    color: '#1F2937',
  },
  modeItemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default DashboardLayout;

