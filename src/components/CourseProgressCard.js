import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import ProgressBar from './ProgressBar';

const CourseProgressCard = ({ progress }) => {
  if (!progress) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#84cc16';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={styles.container}>
      {/* Overall Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <ProgressBar
          progress={progress.overallProgress}
          height={12}
          borderRadius={6}
          showPercentage={true}
          containerStyle={styles.progressContainer}
          textStyle={styles.progressText}
        />
      </View>

      {/* Weekly Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={20} color="#f59e0b" />
            <Text style={styles.statValue}>{progress.weeklyStats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="play-circle" size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{progress.weeklyStats.practices}</Text>
            <Text style={styles.statLabel}>Practices</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={20} color="#10b981" />
            <Text style={[styles.statValue, { color: getScoreColor(progress.weeklyStats.avgScore) }]}>
              {progress.weeklyStats.avgScore}%
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      </View>

      {/* Recent Activities */}
      {progress.recentActivities && progress.recentActivities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {progress.recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons
                  name="mic"
                  size={16}
                  color={getScoreColor(activity.score)}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {activity.title}
                </Text>
                <Text style={styles.activityMeta}>
                  Score: {activity.score}% • {formatDate(activity.date)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
    minWidth: 50,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: 4,
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
    marginTop: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: SIZES.body2,
    fontWeight: '500',
    color: COLORS.textLight,
    marginBottom: 2,
  },
  activityMeta: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
  },
});

export default CourseProgressCard;

