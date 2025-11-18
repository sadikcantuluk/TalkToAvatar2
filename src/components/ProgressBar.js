import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants';

/**
 * Get progress color based on percentage
 * @param {number} percentage - Progress percentage (0-100)
 * @returns {string} Color hex code
 */
export const getProgressColor = (percentage) => {
  if (percentage >= 100) return '#10b981'; // Green - Completed
  if (percentage >= 75) return '#22c55e'; // Light Green - Almost done
  if (percentage >= 50) return '#84cc16'; // Yellow-Green - Halfway
  if (percentage >= 25) return '#f59e0b'; // Orange - Started
  return '#ef4444'; // Red - Just started
};

/**
 * ProgressBar Component
 * Reusable progress bar with color-coded progress indication
 * 
 * @param {Object} props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {number} [props.height=8] - Height of the progress bar
 * @param {boolean} [props.showPercentage=true] - Whether to show percentage text
 * @param {string} [props.backgroundColor] - Background color of the bar (default: rgba(255, 255, 255, 0.1))
 * @param {Object} [props.containerStyle] - Additional styles for container
 * @param {Object} [props.barStyle] - Additional styles for bar
 * @param {Object} [props.textStyle] - Additional styles for percentage text
 */
const ProgressBar = ({
  progress = 0,
  height = 8,
  showPercentage = true,
  backgroundColor,
  containerStyle,
  barStyle,
  textStyle,
  borderRadius,
}) => {
  const progressPercentage = Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  const progressColor = getProgressColor(progressPercentage);
  const defaultBackgroundColor = backgroundColor || 'rgba(255, 255, 255, 0.1)';
  const barBorderRadius = borderRadius !== undefined ? borderRadius : height / 2;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.progressBar, { height, backgroundColor: defaultBackgroundColor, borderRadius: barBorderRadius }, barStyle]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`,
              backgroundColor: progressColor,
              height: '100%',
              borderRadius: barBorderRadius,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={[styles.progressText, textStyle]}>
          {Math.round(progressPercentage)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },
  progressText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.textLight,
    minWidth: 45,
    textAlign: 'right',
  },
});

export default ProgressBar;

