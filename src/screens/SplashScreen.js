import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants';
import { useAuth } from '../context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LOGO_TEXT = 'TalkToAvatar';

const SplashScreen = ({ navigation }) => {
  const [displayedText, setDisplayedText] = useState('');
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Fade in container
    Animated.timing(containerOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Blinking cursor animation
    const cursorAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    cursorAnimation.start();

    // Letter-by-letter reveal animation
    let currentIndex = 0;
    let navigationTimer = null;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < LOGO_TEXT.length) {
        setDisplayedText(LOGO_TEXT.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        cursorAnimation.stop();
        
        // Hide cursor after typing completes
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
        
        // After typing animation completes, wait a bit then navigate
        navigationTimer = setTimeout(() => {
          if (!loading) {
            if (isAuthenticated()) {
              navigation.replace('Welcome');
            } else {
              navigation.replace('Login');
            }
          }
        }, 800); // Short pause after animation
      }
    }, 120); // Speed of typing (120ms per letter)

    return () => {
      clearInterval(typingInterval);
      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }
      cursorAnimation.stop();
    };
  }, [loading, isAuthenticated, navigation, cursorOpacity]);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        {/* Logo Text with Typing Animation */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            {displayedText}
            {displayedText.length < LOGO_TEXT.length && (
              <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
                |
              </Animated.Text>
            )}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: SIZES.padding * 2,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: SCREEN_WIDTH < 375 ? 42 : SCREEN_WIDTH < 414 ? 48 : 56,
    fontWeight: '700',
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: -1,
    textAlign: 'center',
    // Subtle text shadow for depth
    textShadowColor: 'rgba(19, 127, 236, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  cursor: {
    fontSize: SCREEN_WIDTH < 375 ? 42 : SCREEN_WIDTH < 414 ? 48 : 56,
    fontWeight: '300',
    color: COLORS.primary,
    opacity: 0.8,
  },
});

export default SplashScreen;

