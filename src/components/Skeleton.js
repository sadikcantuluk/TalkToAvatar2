import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../constants';

/**
 * Base Skeleton component with shimmer animation
 * Reusable component for creating loading placeholders
 */
const Skeleton = ({ 
  width, 
  height, 
  borderRadius = 8, 
  style,
  variant = 'default' // 'default', 'circle', 'text', 'card'
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 0.3, 0.5, 0.7, 1],
    outputRange: [0.2, 0.8, 1, 0.8, 0.2],
  });

  // Variant-specific styles
  const variantStyles = {
    circle: { borderRadius: height / 2 || width / 2 },
    text: { height: height || 16, borderRadius: 4 },
    card: { borderRadius: borderRadius || 12 },
    default: { borderRadius: borderRadius || 8 },
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: width || '100%',
          height: height || 20,
          borderRadius: variant === 'circle' ? (height / 2 || width / 2) : borderRadius,
        },
        variantStyles[variant],
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            opacity,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6', // Light gray background for skeleton
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // White shimmer overlay
  },
});

export default Skeleton;

