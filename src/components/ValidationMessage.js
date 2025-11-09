import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const ValidationMessage = ({ message, type = 'error', style }) => {
  if (!message) return null;

  const getIconName = () => {
    switch (type) {
      case 'error': return 'alert-circle';
      case 'warning': return 'warning';
      case 'info': return 'information-circle';
      case 'success': return 'checkmark-circle';
      default: return 'alert-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'info': return COLORS.primary;
      case 'success': return '#10B981';
      default: return '#EF4444';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={getIconName()} size={16} color={getColor()} />
      <Text style={[styles.message, { color: getColor() }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  message: {
    fontSize: SIZES.body3,
    flex: 1,
  },
});

export default ValidationMessage;

