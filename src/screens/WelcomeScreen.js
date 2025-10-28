import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { Button, LanguageSelector } from '../components';

const { width } = Dimensions.get('window');

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

const modes = [
  {
    id: 1,
    route: 'Dashboard',
    icon: 'mic',
    title: 'TTS Avatar',
    description: 'Type any text and have a realistic avatar speak it aloud for you.',
    buttonText: 'Get Started',
  },
  {
    id: 2,
    route: 'TravelAssistant',
    icon: 'navigate',
    title: 'AI Travel Assistant',
    description: 'Get real-time travel help and translations from your avatar companion.',
    buttonText: 'Try Now',
  },
  {
    id: 3,
    route: 'AvatarToVideo',
    icon: 'videocam',
    title: 'Avatar to Video',
    description: 'Create engaging animated videos simply by recording your voice.',
    buttonText: 'Explore',
  },
];

const WelcomeScreen = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (width - 32));
    setCurrentIndex(index);
  };

  const handleGetStarted = () => {
    navigation.navigate('SelectAvatar');
  };

  const handleSkip = () => {
    navigation.navigate('Dashboard');
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TALKTOAVATAR</Text>
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </View>

      {/* Spacer */}
      <View style={{ height: 20 }} />

      {/* Main Content - Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}
        >
          {modes.map((mode) => (
            <View key={mode.id} style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons name={mode.icon} size={32} color={COLORS.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{mode.title}</Text>
                <Text style={styles.cardDescription}>{mode.description}</Text>
              </View>
              <Button
                title={mode.buttonText}
                onPress={() => navigation.navigate(mode.route)}
                variant="primary"
                style={styles.cardButton}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Page Indicators */}
        <View style={styles.indicators}>
          {modes.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex ? styles.indicatorActive : styles.indicatorInactive,
              ]}
            />
          ))}
        </View>

        {/* Skip Button */}
        <Button
          title="Skip for now"
          onPress={handleSkip}
          variant="ghost"
          style={styles.skipButton}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingTop: 48,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    flex: 1,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radius,
  },
  languageText: {
    fontSize: SIZES.body3,
    fontWeight: 'bold',
    color: COLORS.gray[300],
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    width: width - 32,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderRadius: 12,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: 'rgba(19, 127, 236, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: SIZES.body1,
    color: COLORS.gray[400],
    textAlign: 'center',
    lineHeight: 22,
  },
  cardButton: {
    width: '100%',
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 32,
    gap: 16,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: COLORS.gray[700],
  },
  skipButton: {
    paddingVertical: 12,
  },
});

export default WelcomeScreen;

