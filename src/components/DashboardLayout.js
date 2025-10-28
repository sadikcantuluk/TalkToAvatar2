import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const modes = [
  { id: 'tts', name: 'TTS Mode', icon: 'mic' },
  { id: 'video', name: 'Video Mode', icon: 'videocam' },
  { id: 'travel', name: 'Travel Assistant', icon: 'navigate' },
];

const DashboardLayout = ({ children, currentMode = 'tts', onModeChange, navigation }) => {
  const [modeModalVisible, setModeModalVisible] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const currentModeData = modes.find(m => m.id === currentMode) || modes[0];

  const handleModeSelect = (mode) => {
    setModeModalVisible(false);
    if (onModeChange) {
      onModeChange(mode.id);
    }
  };

  const handleNotifications = () => {
    // Navigate to notifications screen (future implementation)
    console.log('Notifications clicked');
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.textLight} />
          {hasNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.modeSelector}
          onPress={() => setModeModalVisible(true)}
        >
          <View style={styles.modePill}>
            <Ionicons name={currentModeData.icon} size={18} color={COLORS.primary} />
            <Text style={styles.modeText}>{currentModeData.name}</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
        </TouchableOpacity>
        
        <View style={styles.placeholder} />
      </View>

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
                <Ionicons name="close" size={24} color={COLORS.textLight} />
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
                      color={currentMode === item.id ? COLORS.primary : COLORS.textLight} 
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
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: 'rgba(16, 25, 34, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  modeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    borderRadius: 20,
  },
  modeText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  placeholder: {
    width: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[800],
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeItemText: {
    flex: 1,
    fontSize: SIZES.body1,
    color: COLORS.textLight,
  },
  modeItemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default DashboardLayout;

