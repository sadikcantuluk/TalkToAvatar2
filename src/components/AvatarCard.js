import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const AvatarCard = ({ 
  image, 
  name, 
  description, 
  isSelected = false, 
  onPress 
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.imageContainer,
        isSelected && styles.imageContainerSelected
      ]}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        {isSelected && (
          <View style={styles.checkBadge}>
            <Ionicons name="checkmark" size={16} color={COLORS.white} />
          </View>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 158,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.transparent,
    position: 'relative',
  },
  imageContainerSelected: {
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 12,
  },
  name: {
    fontSize: SIZES.body1,
    fontWeight: '500',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  description: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
  },
});

export default AvatarCard;

