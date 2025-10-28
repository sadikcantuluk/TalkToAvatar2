import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { Button, DashboardLayout } from '../components';

const TravelAssistantScreen = ({ navigation }) => {
  const [userText, setUserText] = useState('');
  const [counterpartText, setCounterpartText] = useState('');
  const [userLanguage, setUserLanguage] = useState('English');
  const [counterpartLanguage, setCounterpartLanguage] = useState('Español');

  const handleModeChange = (mode) => {
    if (mode === 'tts') {
      navigation.navigate('Dashboard');
    } else if (mode === 'video') {
      navigation.navigate('AvatarToVideo');
    }
  };

  return (
    <DashboardLayout 
      currentMode="travel" 
      onModeChange={handleModeChange}
      navigation={navigation}
    >
      <View style={styles.container}>
        {/* User Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>You</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.languageButton}>
                <Ionicons name="language" size={16} color={COLORS.gray[400]} />
                <Text style={styles.languageText}>{userLanguage}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="close" size={20} color={COLORS.gray[400]} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="Type or tap the mic to speak... (0/500)"
              placeholderTextColor={COLORS.gray[400]}
              value={userText}
              onChangeText={setUserText}
              multiline
              maxLength={500}
            />
            <View style={styles.arrowButtons}>
              <TouchableOpacity><Ionicons name="chevron-back" size={24} color={COLORS.gray[400]} /></TouchableOpacity>
              <TouchableOpacity><Ionicons name="chevron-forward" size={24} color={COLORS.gray[400]} /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.buttonRow}>
              <Button title="Speak" variant="outline" style={styles.smallButton} />
              <Button title="Send" variant="primary" style={styles.smallButton} />
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Counterpart Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Counterpart</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.languageButton}>
                <Ionicons name="language" size={16} color={COLORS.gray[400]} />
                <Text style={styles.languageText}>{counterpartLanguage}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="close" size={20} color={COLORS.gray[400]} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="Escriba o toque el micrófono... (0/500)"
              placeholderTextColor={COLORS.gray[400]}
              value={counterpartText}
              onChangeText={setCounterpartText}
              multiline
              maxLength={500}
            />
            <View style={styles.arrowButtons}>
              <TouchableOpacity><Ionicons name="chevron-back" size={24} color={COLORS.gray[400]} /></TouchableOpacity>
              <TouchableOpacity><Ionicons name="chevron-forward" size={24} color={COLORS.gray[400]} /></TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.buttonRow}>
              <Button title="Speak" variant="outline" style={styles.smallButton} />
              <Button title="Send" variant="primary" style={styles.smallButton} />
            </View>
          </View>
        </View>
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flex: 1,
    padding: SIZES.padding,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.gray[800],
    borderRadius: 8,
  },
  languageText: {
    fontSize: SIZES.body3,
    fontWeight: '500',
    color: COLORS.textLight,
  },
  textAreaWrapper: {
    flex: 1,
    position: 'relative',
  },
  textArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: COLORS.gray[700],
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    color: COLORS.textLight,
    fontSize: SIZES.body1,
    textAlignVertical: 'top',
  },
  arrowButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
  },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(19, 127, 236, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  smallButton: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[800],
    marginHorizontal: SIZES.padding,
  },
});

export default TravelAssistantScreen;

