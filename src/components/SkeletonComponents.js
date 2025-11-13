import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import { COLORS, SIZES } from '../constants';

/**
 * Skeleton component for Video Card
 */
export const VideoCardSkeleton = () => {
  return (
    <View style={styles.videoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.videoInfo}>
          <Skeleton width="70%" height={18} borderRadius={4} style={styles.titleSkeleton} />
          <Skeleton width="50%" height={14} borderRadius={4} style={styles.dateSkeleton} />
          <Skeleton width="40%" height={12} borderRadius={4} style={styles.detailsSkeleton} />
        </View>
        <Skeleton width="100%" height={80} borderRadius={8} style={styles.thumbnailSkeleton} />
      </View>
      <View style={styles.cardActions}>
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width={48} height={48} borderRadius={8} />
      </View>
    </View>
  );
};

/**
 * Skeleton component for Audio Card
 */
export const AudioCardSkeleton = () => {
  return (
    <View style={styles.audioCard}>
      <View style={styles.cardHeader}>
        <View style={styles.audioInfo}>
          <Skeleton width="60%" height={18} borderRadius={4} style={styles.titleSkeleton} />
          <Skeleton width="45%" height={14} borderRadius={4} style={styles.dateSkeleton} />
          <Skeleton width="55%" height={12} borderRadius={4} style={styles.subtitleSkeleton} />
          <Skeleton width="90%" height={16} borderRadius={4} style={styles.textSkeleton} />
          <Skeleton width="75%" height={16} borderRadius={4} style={styles.textSkeleton} />
        </View>
        <Skeleton width={64} height={64} variant="circle" style={styles.iconSkeleton} />
      </View>
      <View style={styles.cardActions}>
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width={48} height={48} borderRadius={8} />
      </View>
    </View>
  );
};

/**
 * Skeleton component for Recording Card
 */
export const RecordingCardSkeleton = () => {
  return (
    <View style={styles.recordingCard}>
      <View style={styles.recordingHeader}>
        <View style={styles.recordingInfo}>
          <Skeleton width="65%" height={16} borderRadius={4} style={styles.nameSkeleton} />
          <Skeleton width="50%" height={12} borderRadius={4} style={styles.dateSkeleton} />
        </View>
        <Skeleton width={60} height={28} borderRadius={14} />
      </View>
      <View style={styles.recordingContent}>
        <Skeleton width="25%" height={14} borderRadius={4} style={styles.levelSkeleton} />
        <Skeleton width="90%" height={16} borderRadius={4} style={styles.sentenceSkeleton} />
        <Skeleton width="80%" height={16} borderRadius={4} style={styles.sentenceSkeleton} />
      </View>
      <View style={styles.recordingActions}>
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width="30%" height={40} borderRadius={8} />
        <Skeleton width={48} height={48} borderRadius={8} />
      </View>
    </View>
  );
};

/**
 * Skeleton component for Avatar Grid Item
 */
export const AvatarGridItemSkeleton = () => {
  return (
    <View style={styles.avatarGridItem}>
      <Skeleton width="100%" height={120} borderRadius={12} style={styles.avatarImageSkeleton} />
      <Skeleton width="70%" height={16} borderRadius={4} style={styles.avatarNameSkeleton} />
    </View>
  );
};

/**
 * Generic List Skeleton - renders multiple skeleton items
 */
export const SkeletonList = ({ 
  count = 3, 
  renderSkeleton,
  containerStyle,
  itemStyle 
}) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <View key={index} style={itemStyle}>
      {renderSkeleton()}
    </View>
  ));

  return (
    <View style={[styles.skeletonList, containerStyle]}>
      {skeletons}
    </View>
  );
};

const styles = StyleSheet.create({
  // Video Card Skeleton
  videoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 16,
  },
  videoInfo: {
    flex: 2,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  dateSkeleton: {
    marginBottom: 6,
  },
  detailsSkeleton: {
    marginTop: 4,
  },
  thumbnailSkeleton: {
    flex: 1,
    aspectRatio: 16 / 9,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },

  // Audio Card Skeleton
  audioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 16,
  },
  audioInfo: {
    flex: 1,
  },
  subtitleSkeleton: {
    marginTop: 4,
  },
  textSkeleton: {
    marginTop: 8,
  },
  iconSkeleton: {
    width: 64,
    height: 64,
  },

  // Recording Card Skeleton
  recordingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordingInfo: {
    flex: 1,
  },
  nameSkeleton: {
    marginBottom: 4,
  },
  recordingContent: {
    marginBottom: 12,
    gap: 8,
  },
  levelSkeleton: {
    marginBottom: 4,
  },
  sentenceSkeleton: {
    marginTop: 4,
  },
  recordingActions: {
    flexDirection: 'row',
    gap: 8,
  },

  // Avatar Grid Item Skeleton
  avatarGridItem: {
    marginBottom: 16,
  },
  avatarImageSkeleton: {
    marginBottom: 8,
  },
  avatarNameSkeleton: {
    alignSelf: 'center',
  },

  // Generic List Skeleton
  skeletonList: {
    padding: SIZES.padding,
  },
});

