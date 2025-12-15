import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

// Update COLORS for this specific screen to match requested Sualingo/Teal theme
const THEME_COLORS = {
  primary: '#2D7F83', // Teal-ish color from the reference description
  primaryDark: '#236568',
  background: '#FFFFFF',
  text: '#1A202C',
  textSecondary: '#718096',
  white: '#FFFFFF',
  dotInactive: '#E2E8F0',
};

const slides = [
  {
    id: '3',
    title: 'Sualingo',
    description: 'Master pronunciation and elevate your language skills with AI-powered feedback.',
    icon: 'school', // changed for language learning context
    color: '#10B981',
  },
  {
    id: '4',
    title: 'Travel Assistant',
    description: 'Your AI travel companion for instant translations and local insights.',
    icon: 'airplane',
    color: '#F59E0B',
  },
  {
    id: '2',
    title: 'Avatar to Video',
    description: 'Create stunning videos with realistic animated avatars using just your voice.',
    icon: 'videocam',
    color: '#EC4899',
  },
  {
    id: '1',
    title: 'TTS Avatar',
    description: 'Transform text into lifelike speech with AI-powered avatars that bring your words to life.',
    icon: 'mic-circle',
    color: '#6366F1',
  },
];

const WelcomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const Slide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.illustrationContainer}>
          <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
            <Ionicons name={item.icon} size={100} color={item.color} />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Footer = () => {
    return (
      <View style={styles.footer}>
        {/* Paginator */}
        <View style={styles.paginatorContainer}>
          {slides.map((_, index) => {
            const width = index === currentIndex ? 20 : 8;
            const backgroundColor = index === currentIndex ? THEME_COLORS.primary : THEME_COLORS.dotInactive;
            return (
              <View
                key={index}
                style={[styles.dot, { width, backgroundColor }]}
              />
            );
          })}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentIndex === slides.length - 1 ? (
            <TouchableOpacity style={styles.btn} onPress={scrollToNext}>
              <Text style={styles.btnText}>Get Started</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.navButtons}>
              <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={scrollToNext}>
                <Ionicons name="arrow-forward" size={24} color={THEME_COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <Slide item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          scrollEventThrottle={32}
        />
      </View>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  content: {
    flex: 3,
  },
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center', // Center content vertically in the slide area
  },
  illustrationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.4,
    width: '100%', // Ensure text takes full width of padding
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME_COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flex: 1, // Take up remaining space
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40, // Add some bottom padding
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  btn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME_COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: THEME_COLORS.white,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  skipBtn: {
    padding: 16,
  },
  skipText: {
    color: THEME_COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  nextBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME_COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default WelcomeScreen;

