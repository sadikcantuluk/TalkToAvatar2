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
 * Skeleton component for Course Card
 */
export const CourseCardSkeleton = () => {
  return (
    <View style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <Skeleton width="70%" height={20} borderRadius={4} style={styles.titleSkeleton} />
          <Skeleton width="50%" height={14} borderRadius={4} style={styles.dateSkeleton} />
        </View>
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>
      <View style={styles.courseContent}>
        <Skeleton width="90%" height={16} borderRadius={4} style={styles.descriptionSkeleton} />
        <Skeleton width="75%" height={16} borderRadius={4} style={styles.descriptionSkeleton} />
      </View>
      <View style={styles.courseMeta}>
        <Skeleton width={40} height={24} borderRadius={12} />
        <Skeleton width={50} height={24} borderRadius={12} />
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
 * Skeleton component for Course Detail Overview
 */
export const OverviewSkeleton = () => {
  return (
    <View style={styles.overviewSkeleton}>
      <View style={styles.progressCardSkeleton}>
        <Skeleton width="40%" height={18} borderRadius={4} style={styles.sectionTitleSkeleton} />
        <View style={styles.progressBarContainer}>
          <Skeleton width="70%" height={12} borderRadius={6} />
          <Skeleton width="15%" height={20} borderRadius={4} />
        </View>
        <Skeleton width="30%" height={18} borderRadius={4} style={styles.sectionTitleSkeleton} />
        <View style={styles.statsGridSkeleton}>
          <Skeleton width="100%" height={80} borderRadius={12} />
          <Skeleton width="100%" height={80} borderRadius={12} />
          <Skeleton width="100%" height={80} borderRadius={12} />
        </View>
      </View>
    </View>
  );
};

/**
 * Skeleton component for Subjects List
 */
export const SubjectsSkeleton = () => {
  return (
    <View style={styles.subjectsSkeleton}>
      {[1, 2, 3].map((index) => (
        <View key={index} style={styles.subjectCardSkeleton}>
          <View style={styles.subjectHeaderSkeleton}>
            <Skeleton width={24} height={24} variant="circle" />
            <View style={styles.subjectInfoSkeleton}>
              <Skeleton width="60%" height={18} borderRadius={4} />
              <Skeleton width="50%" height={14} borderRadius={4} style={styles.subjectMetaSkeleton} />
            </View>
            <Skeleton width={80} height={36} borderRadius={18} />
          </View>
          <View style={styles.subjectProgressSkeleton}>
            <Skeleton width="75%" height={8} borderRadius={4} />
            <Skeleton width="15%" height={14} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * Skeleton component for Recordings List
 */
export const RecordingsSkeleton = () => {
  return (
    <View style={styles.recordingsSkeleton}>
      {[1, 2, 3].map((index) => (
        <View key={index} style={styles.recordingItemSkeleton}>
          <View style={styles.recordingHeaderSkeleton}>
            <Skeleton width={20} height={20} borderRadius={10} />
            <Skeleton width="70%" height={16} borderRadius={4} />
          </View>
          <Skeleton width="25%" height={24} borderRadius={12} style={styles.scoreBadgeSkeleton} />
          <Skeleton width="90%" height={14} borderRadius={4} style={styles.transcriptSkeleton} />
          <Skeleton width="80%" height={14} borderRadius={4} style={styles.transcriptSkeleton} />
          <Skeleton width="40%" height={12} borderRadius={4} style={styles.dateSkeleton} />
        </View>
      ))}
    </View>
  );
};

/**
 * Skeleton component for Reports List
 */
export const ReportsSkeleton = () => {
  return (
    <View style={styles.reportsSkeleton}>
      {[1, 2, 3].map((index) => (
        <View key={index} style={styles.reportItemSkeleton}>
          <Skeleton width="60%" height={18} borderRadius={4} style={styles.reportTitleSkeleton} />
          <Skeleton width="90%" height={14} borderRadius={4} style={styles.reportContentSkeleton} />
          <Skeleton width="80%" height={14} borderRadius={4} style={styles.reportContentSkeleton} />
          <Skeleton width="70%" height={14} borderRadius={4} style={styles.reportContentSkeleton} />
          <Skeleton width="30%" height={12} borderRadius={4} style={styles.reportMetaSkeleton} />
        </View>
      ))}
    </View>
  );
};

/**
 * Skeleton component for Analysis
 */
export const AnalysisSkeleton = () => {
  return (
    <View style={styles.analysisSkeleton}>
      <View style={styles.analysisCardSkeleton}>
        <Skeleton width="40%" height={18} borderRadius={4} style={styles.sectionTitleSkeleton} />
        <Skeleton width="100%" height={200} borderRadius={12} style={styles.chartSkeleton} />
      </View>
      <View style={styles.analysisCardSkeleton}>
        <Skeleton width="40%" height={18} borderRadius={4} style={styles.sectionTitleSkeleton} />
        <Skeleton width="100%" height={150} borderRadius={12} style={styles.chartSkeleton} />
      </View>
      <View style={styles.analysisCardSkeleton}>
        <Skeleton width="40%" height={18} borderRadius={4} style={styles.sectionTitleSkeleton} />
        <View style={styles.statsGridSkeleton}>
          <Skeleton width="100%" height={60} borderRadius={12} />
          <Skeleton width="100%" height={60} borderRadius={12} />
          <Skeleton width="100%" height={60} borderRadius={12} />
        </View>
      </View>
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

  // Course Card Skeleton
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  courseInfo: {
    flex: 1,
  },
  courseContent: {
    marginBottom: SIZES.base,
    gap: 6,
  },
  descriptionSkeleton: {
    marginTop: 4,
  },
  courseMeta: {
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

  // Overview Skeleton
  overviewSkeleton: {
    padding: SIZES.padding,
  },
  progressCardSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitleSkeleton: {
    marginBottom: SIZES.base,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SIZES.padding,
  },
  statsGridSkeleton: {
    flexDirection: 'row',
    gap: SIZES.base,
    marginTop: SIZES.base,
  },

  // Subjects Skeleton
  subjectsSkeleton: {
    padding: SIZES.padding,
  },
  subjectCardSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subjectHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SIZES.base,
  },
  subjectInfoSkeleton: {
    flex: 1,
  },
  subjectMetaSkeleton: {
    marginTop: 4,
  },
  subjectProgressSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Recordings Skeleton
  recordingsSkeleton: {
    padding: SIZES.padding,
  },
  recordingItemSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recordingHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scoreBadgeSkeleton: {
    marginTop: 4,
    marginBottom: 8,
  },
  transcriptSkeleton: {
    marginTop: 4,
  },

  // Reports Skeleton
  reportsSkeleton: {
    padding: SIZES.padding,
  },
  reportItemSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reportTitleSkeleton: {
    marginBottom: 8,
  },
  reportContentSkeleton: {
    marginTop: 4,
  },
  reportMetaSkeleton: {
    marginTop: 8,
  },

  // Analysis Skeleton
  analysisSkeleton: {
    padding: SIZES.padding,
  },
  analysisCardSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartSkeleton: {
    marginTop: SIZES.base,
  },
});
