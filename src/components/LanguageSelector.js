import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange, style, showFlag = true, textColor }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLang = languages.find(l => l.code === selectedLanguage) || languages[0];

  // Use provided color or default
  const mainTextColor = textColor || COLORS.textLight;

  const handleSelect = (lang) => {
    onLanguageChange(lang.code);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, style]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        {showFlag && <Text style={styles.flag}>{selectedLang.flag}</Text>}
        <Text style={[styles.selectedText, { color: mainTextColor }]} numberOfLines={1} ellipsizeMode="tail">
          {selectedLang.name}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={mainTextColor === COLORS.textLight ? "rgba(255,255,255,0.6)" : COLORS.gray[500]}
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
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.languageList}
              contentContainerStyle={styles.languageListContent}
              showsVerticalScrollIndicator={true}
            >
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang.code && styles.languageOptionSelected,
                  ]}
                  onPress={() => handleSelect(lang)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text
                    style={[
                      styles.languageText,
                      selectedLanguage === lang.code && styles.languageTextSelected,
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {lang.name}
                  </Text>
                  {selectedLanguage === lang.code && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
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
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  selectedText: {
    flex: 1,
    fontSize: SIZES.body1,
    color: COLORS.textLight,
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
    backgroundColor: 'transparent',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: SCREEN_HEIGHT * 0.6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: SIZES.h4,
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    flexGrow: 0,
  },
  languageListContent: {
    paddingBottom: 8,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  languageOptionSelected: {
    backgroundColor: 'rgba(19, 127, 236, 0.15)',
  },
  languageFlag: {
    fontSize: 28,
  },
  languageText: {
    flex: 1,
    fontSize: SIZES.body1,
    color: '#1F2937',
  },
  languageTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default LanguageSelector;

