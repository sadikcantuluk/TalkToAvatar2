import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { COLORS, IMAGES } from '../constants';
import { LoadingDots } from '../components';
import { useAuth } from '../context';

const SplashScreen = ({ navigation }) => {
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Check authentication and navigate after animation
    const timer = setTimeout(() => {
      if (!loading) {
        if (isAuthenticated()) {
          navigation.replace('Welcome');
        } else {
          navigation.replace('Login');
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <Image source={IMAGES.logo} style={styles.logo} resizeMode="contain" />
        </Animated.View>

        {/* Loading Dots */}
        <LoadingDots color={COLORS.textLight} size={8} />
      </View>
    </View>
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
    gap: 32,
  },
  logoContainer: {
    width: 112,
    height: 112,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;

