import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants';
import { Button } from '../components';
import { useAuth } from '../context';

const { width, height } = Dimensions.get('window');

const modes = [
  {
    id: 1,
    route: 'Dashboard',
    icon: 'mic-outline',
    gradient: ['#6366F1', '#8B5CF6'],
    title: 'TTS Avatar',
    description: 'Transform text into lifelike speech with AI-powered avatars that bring your words to life.',
    features: ['Multiple Voice Options', 'Custom Avatars', 'High Quality Audio'],
  },
  {
    id: 2,
    route: 'AvatarToVideo',
    icon: 'videocam-outline',
    gradient: ['#EC4899', '#F43F5E'],
    title: 'Avatar to Video',
    description: 'Create stunning videos with realistic animated avatars using just your voice.',
    features: ['Voice Recording', 'HD Video Export', 'Custom Animation'],
  },
  {
    id: 3,
    route: 'Sualingo',
    icon: 'language-outline',
    gradient: ['#10B981', '#06B6D4'],
    title: 'Sualingo',
    description: 'Master pronunciation and elevate your language skills with AI-powered feedback.',
    features: ['6 Language Levels', 'Real-time Scoring', 'Practice Mode'],
  },
  {
    id: 4,
    route: 'TravelAssistant',
    icon: 'airplane-outline',
    gradient: ['#F59E0B', '#EF4444'],
    title: 'Travel Assistant',
    description: 'Your AI travel companion for instant translations and local insights.',
    features: ['Live Translation', 'Travel Tips', 'Multi-language'],
  },
];

const WelcomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIconContainer}>
              <Ionicons name="mic" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.logoText}>TalkToAvatar</Text>
          </View>
          <Text style={styles.headerSubtitle}>AI-Powered Avatar Experience</Text>
        </View>
      </Animated.View>

      {/* Welcome User Message */}
      <Animated.View style={[styles.welcomeSection, { opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.usernameText}>{user?.username || 'User'}!</Text>
      </Animated.View>

      {/* Main Content - Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
        style={styles.carouselContainer}
      >
        {modes.map((mode, index) => (
          <TouchableOpacity
            key={mode.id}
            style={styles.cardWrapper}
            activeOpacity={0.95}
            onPress={() => navigation.navigate(mode.route)}
          >
            <View style={styles.card}>
              {/* Gradient Background */}
              <LinearGradient
                colors={mode.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    <Ionicons name={mode.icon} size={48} color={COLORS.white} />
                  </View>

                  {/* Title & Description */}
                  <View style={styles.textContent}>
                    <Text style={styles.cardTitle}>{mode.title}</Text>
                    <Text style={styles.cardDescription}>{mode.description}</Text>
                  </View>

                  {/* Features */}
                  <View style={styles.featuresContainer}>
                    {mode.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureRow}>
                        <Ionicons name="checkmark-circle" size={16} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {/* CTA */}
                  <View style={styles.ctaContainer}>
                    <View style={styles.ctaButton}>
                      <Text style={styles.ctaText}>Get Started</Text>
                      <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Page Indicators */}
        <View style={styles.indicators}>
          {modes.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.indicator,
                  index === currentIndex ? styles.indicatorActive : styles.indicatorInactive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={20} color={COLORS.gray[400]} />
          <Text style={styles.profileText}>View Profile</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  logoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray[400],
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  carouselContainer: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  cardWrapper: {
    width: width,
    paddingHorizontal: 24,
  },
  card: {
    height: height * 0.58,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  cardGradient: {
    flex: 1,
    padding: 32,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeText: {
    fontSize: 24,
    color: COLORS.gray[400],
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  textContent: {
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 10,
    paddingVertical: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray[700],
  },
  indicatorActive: {
    width: 32,
    backgroundColor: COLORS.primary,
  },
  indicatorInactive: {
    width: 8,
    backgroundColor: COLORS.gray[700],
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  profileText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[400],
  },
});

export default WelcomeScreen;

