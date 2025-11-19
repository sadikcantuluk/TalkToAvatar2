import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DashboardLayout, CourseProgressCard } from '../components';
import ProgressBar from '../components/ProgressBar';
import { 
  OverviewSkeleton, 
  SubjectsSkeleton, 
  RecordingsSkeleton, 
  ReportsSkeleton, 
  AnalysisSkeleton 
} from '../components/SkeletonComponents';
import { COLORS, SIZES } from '../constants';
import { useAuth } from '../context';
import { playAudio, stopAudio } from '../services/openAI';
import coursesAPI from '../services/coursesAPI';
import {
  useCourse,
  useCourseSubjects,
  useCourseRecordings,
  useCourseReports,
  useCourseAnalyses,
  useCourseProgress,
  useDeleteCourse,
  courseKeys,
} from '../hooks/useCourseQueries';
import { useCourseStatistics } from '../hooks/useCourseStatistics';
import { calculateStreakFromGrouped } from '../utils/streakCalculator';
import { useQueryClient } from '@tanstack/react-query';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId, course: initialCourse } = route.params || {};
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  // React Query hooks - data is automatically cached
  const courseQuery = useCourse(courseId);
  const subjectsQuery = useCourseSubjects(courseId);
  const recordingsQuery = useCourseRecordings(courseId);
  const reportsQuery = useCourseReports(courseId);
  const analysesQuery = useCourseAnalyses(courseId);
  const progressQuery = useCourseProgress(courseId);
  const deleteCourseMutation = useDeleteCourse(() => {
    // Navigate back immediately after optimistic update
    navigation.goBack();
  });
  
  // Computed statistics from cache (no API calls)
  const { statistics } = useCourseStatistics(courseId);

  // Manually fetch analyses when analyses tab is active (since query is disabled by default)
  useEffect(() => {
    if (activeTab === 'analyses' && token && courseId && !analysesQuery.data && !analysesQuery.isLoading) {
      queryClient.fetchQuery({
        queryKey: courseKeys.analyses(courseId),
        queryFn: () => coursesAPI.getAnalyses(token, courseId),
      });
    }
  }, [activeTab, courseId, token, analysesQuery.data, analysesQuery.isLoading, queryClient]);
  
  // Use initial course if available, otherwise use query data
  const course = initialCourse || courseQuery.data;
  const loading = courseQuery.isLoading && !initialCourse;
  const error = courseQuery.error;
  
  // Extract data from queries
  const subjects = subjectsQuery.data || [];
  const recordings = recordingsQuery.data || [];
  const reports = reportsQuery.data || [];
  const analyses = analysesQuery.data || null;
  const progress = progressQuery.data;
  
  // Loading states for each tab (from cache, should be instant)
  const loadingOverview = progressQuery.isLoading;
  const loadingSubjects = subjectsQuery.isLoading && activeTab === 'subjects';
  const loadingRecordings = recordingsQuery.isLoading && activeTab === 'recordings';
  const loadingReports = reportsQuery.isLoading && activeTab === 'reports';
  const loadingAnalyses = analysesQuery.isLoading && activeTab === 'analyses';
  
  // Accordion state for recordings
  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedSentences, setExpandedSentences] = useState({});
  const [playingAudioId, setPlayingAudioId] = useState(null);
  
  // Accordion state for reports
  const [expandedReportTopics, setExpandedReportTopics] = useState({});
  const [expandedReportSentences, setExpandedReportSentences] = useState({});
  const [expandedReportDetails, setExpandedReportDetails] = useState({});

  const handleDeleteCourse = () => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${course?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Start mutation - optimistic update happens in onMutate
            // Navigation happens automatically via callback in onMutate
            // Backend deletion continues in background
            deleteCourseMutation.mutate(courseId, {
              onError: (err) => {
                // Only show error if deletion actually failed
                console.error('❌ [CourseDetailScreen] Failed to delete course:', err);
                // Error is already handled by mutation's onError (rollback)
              },
            });
          },
        },
      ]
    );
  };

  const handleAddSubject = () => {
    // TODO: Navigate to AddSubjectScreen or show modal
    Alert.alert('Add Subject', 'Subject creation will be implemented');
  };

  // Course Info Card Component
  const renderCourseInfoCard = () => {
    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    return (
    <View style={styles.courseInfoCard}>
        <View style={styles.courseInfoContent}>
          {/* Left Section - Title and Description */}
          <View style={styles.courseInfoLeft}>
            <View style={styles.courseInfoTitleRow}>
              <Ionicons name="book" size={24} color={COLORS.primary} style={styles.courseInfoIcon} />
              <Text style={styles.courseInfoTitle} numberOfLines={2}>{course?.title}</Text>
            </View>
            {course?.description && (
              <Text style={styles.courseInfoDescription} numberOfLines={3}>
                {course.description}
              </Text>
            )}
            {course?.created_at && (
              <View style={styles.courseInfoMeta}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.gray[400]} />
                <Text style={styles.courseInfoMetaText}>
                  Created {formatDate(course.created_at)}
                </Text>
              </View>
            )}
          </View>

          {/* Right Section - Badges */}
          <View style={styles.courseInfoRight}>
        <View style={styles.courseInfoBadges}>
          <View style={[styles.infoBadge, styles.levelBadge]}>
                <Ionicons name="school-outline" size={14} color={COLORS.primary} />
            <Text style={styles.infoBadgeText}>{course?.level || 'N/A'}</Text>
          </View>
          <View style={[styles.infoBadge, styles.languageBadge]}>
                <Ionicons name="globe-outline" size={14} color="#10b981" />
            <Text style={styles.infoBadgeText}>
              {course?.language_code?.toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View style={[styles.infoBadge, styles.statusBadge]}>
                <Ionicons 
                  name={course?.status === 'active' ? 'checkmark-circle-outline' : 'time-outline'} 
                  size={14} 
                  color="#f59e0b" 
                />
            <Text style={styles.infoBadgeText}>{course?.status || 'active'}</Text>
          </View>
        </View>
      </View>
        </View>
    </View>
  );
  };

  // Stats Row Component - Now uses computed statistics from cache
  const renderStatsRow = () => {
    // Use computed statistics (no API calls, calculated from cache)
    const stats = statistics || {
      subjectsCount: 0,
      recordingsCount: 0,
      reportsCount: 0,
      analysesCount: 0,
    };

    return (
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={20} color={COLORS.primary} />
          <Text style={styles.statValue}>{stats.subjectsCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            Subjects
          </Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="mic-outline" size={20} color={COLORS.primary} />
          <Text style={styles.statValue}>{stats.recordingsCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            Records
          </Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
          <Text style={styles.statValue}>{stats.reportsCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            Reports
          </Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
          <Text style={styles.statValue}>{stats.analysesCount}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            Analysis
          </Text>
        </View>
      </View>
    );
  };

  const renderOverview = () => {
    if (loadingOverview || progressQuery.isLoading) {
      return (
        <View style={styles.tabContent}>
          <OverviewSkeleton />
        </View>
      );
    }

    // Transform progress data to match CourseProgressCard format
    const progressData = progress ? {
      overallProgress: progress.overall_progress || 0,
      subjectProgress: (progress.topic_progress || []).map(tp => ({
        id: tp.topic,
        title: tp.title,
        progress: tp.progress || 0,
        completed: tp.completed_status || false,
      })),
      weeklyStats: {
        practices: progress.weekly_stats?.practices || 0,
        avgScore: progress.weekly_stats?.avg_score || 0,
        // Calculate streak from recordings if not provided by backend
        streak: progress.weekly_stats?.streak ?? (recordings.length > 0 ? calculateStreakFromGrouped(recordings) : 0),
      },
      recentActivities: [],
      totalSubjects: progress.topic_progress?.length || 0,
      completedSubjects: (progress.topic_progress || []).filter(tp => tp.completed_status).length,
      totalRecordings: progress.completed_sentences || 0,
      totalReports: 0,
      totalAnalyses: 0,
    } : null;

    return (
      <ScrollView
        style={styles.tabContent}
        contentContainerStyle={styles.tabContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        {progressData && <CourseProgressCard progress={progressData} />}
      </ScrollView>
    );
  };

  const renderSubjects = () => {
    if (loadingSubjects) {
      return (
        <View style={styles.tabContent}>
          <SubjectsSkeleton />
        </View>
      );
    }

    if (subjects.length === 0) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={COLORS.gray[400]} />
            <Text style={styles.emptyText}>No topics available</Text>
            <Text style={styles.emptySubtext}>
              Practice sentences will appear here once available for your course language and level
            </Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id || item.topic}
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          const progressPercentage = item.progress_percentage || 0;
          const completedCount = item.completed_sentences || 0;
          const totalCount = item.total_sentences || 0;
          const isCompleted = item.completed || false;

          return (
            <TouchableOpacity
              style={[styles.topicCard, isCompleted && styles.topicCardCompleted]}
              onPress={() => {
                console.log('🎯 [DEBUG] Topic pressed:', item.topic);
                 navigation.navigate('Sualingo', {
                   courseId: courseId,
                   course: course,
                   topic: item.topic,
                   topicTitle: item.title,
                   fromCourse: true,
                 });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.topicHeader}>
                <View style={styles.topicHeaderLeft}>
                  <Ionicons
                    name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={isCompleted ? '#10b981' : COLORS.primary}
                  />
                  <View style={styles.topicTitleContainer}>
                    <Text style={styles.topicTitle}>{item.title}</Text>
                    <Text style={styles.topicDescription}>
                      {completedCount} / {totalCount} sentences completed
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.topicProgressContainer}>
                <ProgressBar
                  progress={progressPercentage}
                  height={8}
                  showPercentage={true}
                  containerStyle={styles.topicProgressContainer}
                  textStyle={styles.topicProgressText}
                />
              </View>

              <View style={styles.topicActionContainer}>
                <TouchableOpacity
                  style={styles.startPracticeButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    console.log('🎯 [DEBUG] Start practice pressed:', item.topic);
                 navigation.navigate('Sualingo', {
                   courseId: courseId,
                   course: course,
                   topic: item.topic,
                   topicTitle: item.title,
                   fromCourse: true,
                 });
                  }}
                >
                  <Ionicons name="play" size={16} color={COLORS.white} />
                  <Text style={styles.startPracticeButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.tabContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const toggleTopic = (topic) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTopics(prev => {
      const isCurrentlyExpanded = prev[topic];
      // If opening, close all others and open this one
      // If closing, just close this one
      if (isCurrentlyExpanded) {
        return { ...prev, [topic]: false };
      } else {
        // Close all topics, then open this one
        const newState = {};
        Object.keys(prev).forEach(key => {
          newState[key] = false;
        });
        newState[topic] = true;
        return newState;
      }
    });
    // Also close all sentences when topic changes
    setExpandedSentences({});
  };

  const toggleSentence = (sentenceId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSentences(prev => {
      const isCurrentlyExpanded = prev[sentenceId];
      // If opening, close all others and open this one
      // If closing, just close this one
      if (isCurrentlyExpanded) {
        return { ...prev, [sentenceId]: false };
      } else {
        // Close all sentences, then open this one
        const newState = {};
        Object.keys(prev).forEach(key => {
          newState[key] = false;
        });
        newState[sentenceId] = true;
        return newState;
      }
    });
  };

  const handlePlayRecording = async (audioUri, recordingId) => {
    try {
      if (playingAudioId === recordingId) {
        await stopAudio();
        setPlayingAudioId(null);
      } else {
        await stopAudio(); // Stop any other audio
        setPlayingAudioId(recordingId);
        await playAudio(audioUri);
        // Auto-stop when finished (you might want to add audio finished callback)
      }
    } catch (error) {
      console.error('❌ [ERROR] Playback error:', error);
      setPlayingAudioId(null);
    }
  };

  const renderRecordings = () => {
    if (loadingRecordings) {
      return (
        <View style={styles.tabContent}>
          <RecordingsSkeleton />
        </View>
      );
    }

    // Check if recordings is empty or has no data
    const hasRecordings = Array.isArray(recordings) && recordings.length > 0 && 
                         recordings.some(topic => topic.sentences && topic.sentences.length > 0);

    if (!hasRecordings) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.emptyState}>
            <Ionicons name="mic-off-outline" size={48} color={COLORS.gray[400]} />
            <Text style={styles.emptyText}>No recordings yet</Text>
            <Text style={styles.emptySubtext}>
              Practice recordings associated with this course will appear here
            </Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        data={recordings}
        keyExtractor={(item, index) => item.topic || `topic-${index}`}
        style={{ flex: 1 }}
        renderItem={({ item: topicData }) => {
          const isTopicExpanded = expandedTopics[topicData.topic];
          
          return (
            <View style={styles.topicSection}>
              {/* Topic Header */}
              <TouchableOpacity
                style={styles.topicHeader}
                onPress={() => toggleTopic(topicData.topic)}
                activeOpacity={0.7}
              >
                <View style={styles.topicHeaderLeft}>
                  <Ionicons
                    name={isTopicExpanded ? 'chevron-down' : 'chevron-forward'}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.topicHeaderTitle}>{topicData.topic_title || topicData.topic}</Text>
                  <View style={styles.topicBadge}>
                    <Text style={styles.topicBadgeText}>
                      {topicData.sentences?.length || 0} sentences
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Sentences (nested) */}
              {isTopicExpanded && topicData.sentences && topicData.sentences.map((sentenceData) => {
                const sentenceId = sentenceData.sentence_id || sentenceData.sentence;
                const isSentenceExpanded = expandedSentences[sentenceId];
                const recordingsCount = sentenceData.recordings?.length || 0;

                return (
                  <View key={sentenceId} style={styles.sentenceSection}>
                    {/* Sentence Header */}
                    <TouchableOpacity
                      style={styles.sentenceHeader}
                      onPress={() => toggleSentence(sentenceId)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.sentenceHeaderLeft}>
                        <Ionicons
                          name={isSentenceExpanded ? 'chevron-down' : 'chevron-forward'}
                          size={16}
                          color={COLORS.gray[400]}
                        />
                        <Text style={styles.sentenceHeaderText} numberOfLines={1}>
                          {sentenceData.sentence}
                        </Text>
                        <View style={styles.recordingCountBadge}>
                          <Text style={styles.recordingCountText}>
                            {recordingsCount} {recordingsCount === 1 ? 'recording' : 'recordings'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Recordings List */}
                    {isSentenceExpanded && sentenceData.recordings && sentenceData.recordings.map((recording) => {
                      const isPlaying = playingAudioId === recording.id;
                      
                      return (
                        <View key={recording.id} style={styles.recordingItem}>
                          <View style={styles.recordingItemContent}>
                            <View style={styles.recordingItemHeader}>
                              <TouchableOpacity
                                style={styles.playButton}
                                onPress={() => handlePlayRecording(recording.audio_uri, recording.id)}
                              >
                                <Ionicons
                                  name={isPlaying ? 'pause' : 'play'}
                                  size={16}
                                  color={COLORS.primary}
                                />
                              </TouchableOpacity>
                              <View style={styles.recordingItemInfo}>
                                <View style={styles.recordingScoreRow}>
                                  <View style={[styles.scoreBadge, { backgroundColor: recording.score >= 85 ? '#10b98130' : recording.score >= 70 ? '#84cc1630' : '#f59e0b30' }]}>
                                    <Text style={[styles.scoreText, { color: recording.score >= 85 ? '#10b981' : recording.score >= 70 ? '#84cc16' : '#f59e0b' }]}>
                                      {Math.round(recording.score)}%
                                    </Text>
                                  </View>
                                  {recording.created_at && (
                                    <Text style={styles.recordingDate}>
                                      {new Date(recording.created_at).toLocaleDateString()}
                                    </Text>
                                  )}
                                </View>
                                {recording.transcript && (
                                  <Text style={styles.recordingTranscript} numberOfLines={2}>
                                    "{recording.transcript}"
                                  </Text>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        }}
        contentContainerStyle={styles.tabContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const toggleReportTopic = (topic) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedReportTopics(prev => {
      const isCurrentlyExpanded = prev[topic];
      // If opening, close all others and open this one
      // If closing, just close this one
      if (isCurrentlyExpanded) {
        return { ...prev, [topic]: false };
      } else {
        // Close all report topics, then open this one
        const newState = {};
        Object.keys(prev).forEach(key => {
          newState[key] = false;
        });
        newState[topic] = true;
        return newState;
      }
    });
    // Also close all report sentences and details when topic changes
    setExpandedReportSentences({});
    setExpandedReportDetails({});
  };

  const toggleReportSentence = (sentenceId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedReportSentences(prev => {
      const isCurrentlyExpanded = prev[sentenceId];
      // If opening, close all others and open this one
      // If closing, just close this one
      if (isCurrentlyExpanded) {
        return { ...prev, [sentenceId]: false };
      } else {
        // Close all report sentences, then open this one
        const newState = {};
        Object.keys(prev).forEach(key => {
          newState[key] = false;
        });
        newState[sentenceId] = true;
        return newState;
      }
    });
    // Also close all report details when sentence changes
    setExpandedReportDetails({});
  };

  const toggleReportDetails = (reportId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedReportDetails(prev => {
      const isCurrentlyExpanded = prev[reportId];
      // If opening, close all others and open this one
      // If closing, just close this one
      if (isCurrentlyExpanded) {
        return { ...prev, [reportId]: false };
      } else {
        // Close all report details, then open this one
        const newState = {};
        Object.keys(prev).forEach(key => {
          newState[key] = false;
        });
        newState[reportId] = true;
        return newState;
      }
    });
  };

  const renderReports = () => {
    if (loadingReports) {
      return (
        <View style={styles.tabContent}>
          <ReportsSkeleton />
        </View>
      );
    }

    // Check if reports is empty or has no data
    const hasReports = Array.isArray(reports) && reports.length > 0 && 
                      reports.some(topic => topic.sentences && topic.sentences.length > 0);

    if (!hasReports) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={COLORS.gray[400]} />
            <Text style={styles.emptyText}>No reports yet</Text>
            <Text style={styles.emptySubtext}>
              Practice reports for this course will appear here
            </Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        data={reports}
        keyExtractor={(item, index) => item.topic || `report-topic-${index}`}
        style={{ flex: 1 }}
        renderItem={({ item: topicData }) => {
          const isTopicExpanded = expandedReportTopics[topicData.topic];
          
          return (
            <View style={styles.topicSection}>
              {/* Topic Header */}
              <TouchableOpacity
                style={styles.topicHeader}
                onPress={() => toggleReportTopic(topicData.topic)}
                activeOpacity={0.7}
              >
                <View style={styles.topicHeaderLeft}>
                  <Ionicons
                    name={isTopicExpanded ? 'chevron-down' : 'chevron-forward'}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.topicHeaderTitle}>{topicData.topic_title || topicData.topic}</Text>
                  <View style={styles.topicBadge}>
                    <Text style={styles.topicBadgeText}>
                      {topicData.sentences?.length || 0} sentences
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Sentences (nested) */}
              {isTopicExpanded && topicData.sentences && topicData.sentences.map((sentenceData) => {
                const sentenceId = sentenceData.sentence_id || sentenceData.sentence;
                const isSentenceExpanded = expandedReportSentences[sentenceId];
                const reportsCount = sentenceData.reports?.length || 0;

                return (
                  <View key={sentenceId} style={styles.sentenceSection}>
                    {/* Sentence Header */}
                    <TouchableOpacity
                      style={styles.sentenceHeader}
                      onPress={() => toggleReportSentence(sentenceId)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.sentenceHeaderLeft}>
                        <Ionicons
                          name={isSentenceExpanded ? 'chevron-down' : 'chevron-forward'}
                          size={16}
                          color={COLORS.gray[400]}
                        />
                        <Text style={styles.sentenceHeaderText} numberOfLines={1}>
                          {sentenceData.sentence}
                        </Text>
                        <View style={styles.recordingCountBadge}>
                          <Text style={styles.recordingCountText}>
                            {reportsCount} {reportsCount === 1 ? 'report' : 'reports'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Reports List */}
                    {isSentenceExpanded && sentenceData.reports && sentenceData.reports.map((report) => {
                      const isDetailsExpanded = expandedReportDetails[report.id];
                      const getScoreColor = (score) => {
                        if (score >= 85) return '#10b981';
                        if (score >= 70) return '#84cc16';
                        return '#f59e0b';
                      };
                      
                      // Helper function to get word score color (same as Sualingo)
                      const getWordScoreColor = (score) => {
                        if (score >= 90) return '#10b981'; // Yeşil
                        if (score >= 70) return '#84cc16'; // Açık Yeşil
                        if (score >= 50) return '#f59e0b'; // Sarı
                        return '#ef4444'; // Kırmızı
                      };

                      // Process words: combine reference text with spoken words (same logic as Sualingo)
                      const processWords = (words, referenceText) => {
                        if (!referenceText && words.length > 0) {
                          // If no reference text, just use words from API
                          return words.map(w => ({
                            word: w.word || '',
                            accuracy_score: w.accuracy_score || 0,
                            error_type: w.error_type || null,
                            referenceWord: w.word || '',
                          }));
                        }

                        const referenceWords = referenceText ? referenceText.split(/\s+/) : [];
                        const spokenWordsMap = {};
                        
                        words.forEach(word => {
                          const wordText = (word.word || '').toLowerCase();
                          if (wordText) {
                            spokenWordsMap[wordText] = word;
                          }
                        });
                        
                        return referenceWords.map((refWord) => {
                          const refWordLower = refWord.toLowerCase().replace(/[.,!?]/g, '');
                          const spokenWord = spokenWordsMap[refWordLower];
                          
                          if (spokenWord) {
                            return {
                              word: spokenWord.word || refWord,
                              accuracy_score: spokenWord.accuracy_score || 0,
                              error_type: spokenWord.error_type || null,
                              referenceWord: refWord,
                            };
                          } else {
                            return {
                              word: refWord,
                              accuracy_score: 0,
                              error_type: 'Omission',
                              referenceWord: refWord,
                            };
                          }
                        });
                      };

                      const processedWords = processWords(report.words || [], report.reference_text || '');
                      
                      return (
                        <View key={report.id} style={styles.reportItem}>
                          <TouchableOpacity
                            style={styles.reportItemHeader}
                            onPress={() => toggleReportDetails(report.id)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.reportItemHeaderLeft}>
                              <Ionicons
                                name={isDetailsExpanded ? 'chevron-down' : 'chevron-forward'}
                                size={14}
                                color={COLORS.gray[400]}
                              />
                              <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(report.score) + '30' }]}>
                                <Text style={[styles.scoreText, { color: getScoreColor(report.score) }]}>
                                  {Math.round(report.score)}%
                                </Text>
                              </View>
                              {report.created_at && (
                                <Text style={styles.reportDate}>
                                  {new Date(report.created_at).toLocaleDateString()}
                                </Text>
                              )}
                            </View>
                          </TouchableOpacity>

                          {/* Report Details */}
                          {isDetailsExpanded && (
                            <View style={styles.reportDetails}>
                              <View style={styles.reportDetailSection}>
                                <Text style={styles.reportDetailLabel}>Reference Text:</Text>
                                <Text style={styles.reportDetailValue}>{report.reference_text}</Text>
                              </View>
                              
                              {report.transcript && (
                                <View style={styles.reportDetailSection}>
                                  <Text style={styles.reportDetailLabel}>Your Transcript:</Text>
                                  <Text style={styles.reportDetailValue}>{report.transcript}</Text>
                                </View>
                              )}

                              <View style={styles.reportScoresRow}>
                                <View style={styles.reportScoreItem}>
                                  <Text style={styles.reportScoreLabel}>Accuracy</Text>
                                  <Text style={styles.reportScoreValue}>{Math.round(report.accuracy_score || 0)}%</Text>
                                </View>
                                <View style={styles.reportScoreItem}>
                                  <Text style={styles.reportScoreLabel}>Fluency</Text>
                                  <Text style={styles.reportScoreValue}>{Math.round(report.fluency_score || 0)}%</Text>
                                </View>
                                <View style={styles.reportScoreItem}>
                                  <Text style={styles.reportScoreLabel}>Completeness</Text>
                                  <Text style={styles.reportScoreValue}>{Math.round(report.completeness_score || 0)}%</Text>
                                </View>
                              </View>

                              {/* Word-level Details */}
                              {processedWords && processedWords.length > 0 && (
                                <View style={styles.reportDetailSection}>
                                  <Text style={styles.reportDetailLabel}>Word-level Analysis:</Text>
                                  <ScrollView 
                                    style={styles.wordAnalysisContainer}
                                    nestedScrollEnabled={true}
                                  >
                                    {processedWords.map((word, index) => {
                                      const score = word.accuracy_score || 0;
                                      const color = getWordScoreColor(score);
                                      const hasError = word.error_type && word.error_type.length > 0 && word.error_type !== 'None';
                                      const isMissing = score === 0 && (word.error_type === 'Omission' || word.error_type === 'Missing');
                                      
                                      return (
                                        <View key={index} style={styles.wordItemContainer}>
                                          <View style={styles.wordItemHeader}>
                                            <Text style={styles.wordText}>
                                              {word.referenceWord || word.word || 'N/A'}
                                              {isMissing && <Text style={styles.missingText}> (eksik)</Text>}
                                            </Text>
                                            <Text style={[styles.wordScore, { color }]}>
                                              {Math.round(score)}%
                                            </Text>
                                          </View>
                                          <View style={styles.wordBarContainer}>
                                            <View style={[styles.wordBar, { backgroundColor: color, width: `${Math.max(score, 5)}%` }]} />
                                          </View>
                                          {hasError && (
                                            <View style={styles.wordErrorBadge}>
                                              <Text style={styles.wordErrorText}>{word.error_type}</Text>
                                            </View>
                                          )}
                                        </View>
                                      );
                                    })}
                                  </ScrollView>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          );
        }}
        contentContainerStyle={styles.tabContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderAnalyses = () => {
    if (loadingAnalyses) {
      return (
        <View style={styles.tabContent}>
          <AnalysisSkeleton />
        </View>
      );
    }

    // Check if analyses data exists
    if (!analyses || !analyses.overall) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={48} color={COLORS.gray[400]} />
            <Text style={styles.emptyText}>No analyses yet</Text>
            <Text style={styles.emptySubtext}>
              Performance analyses for this course will appear here
            </Text>
          </View>
        </View>
      );
    }

    const { overall, topics, time_series, error_analysis } = analyses;

    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.tabContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Statistics */}
        <View style={styles.analysisCard}>
          <Text style={styles.analysisCardTitle}>Overall Performance</Text>
          <View style={styles.statsGrid}>
            <View style={styles.analysisStatCard}>
              <Text style={styles.analysisStatValue}>{typeof overall.avg_score === 'string' ? parseFloat(overall.avg_score).toFixed(1) : (overall.avg_score?.toFixed(1) || 0)}%</Text>
              <Text style={styles.analysisStatLabel}>Avg Score</Text>
            </View>
            <View style={styles.analysisStatCard}>
              <Text style={styles.analysisStatValue}>{typeof overall.success_rate === 'string' ? parseFloat(overall.success_rate).toFixed(1) : (overall.success_rate?.toFixed(1) || 0)}%</Text>
              <Text style={styles.analysisStatLabel}>Success Rate</Text>
            </View>
            <View style={styles.analysisStatCard}>
              <Text style={styles.analysisStatValue}>{typeof overall.completion_rate === 'string' ? parseFloat(overall.completion_rate).toFixed(1) : (overall.completion_rate?.toFixed(1) || 0)}%</Text>
              <Text style={styles.analysisStatLabel}>Completion</Text>
            </View>
            <View style={styles.analysisStatCard}>
              <Text style={styles.analysisStatValue}>{overall.total_recordings || 0}</Text>
              <Text style={styles.analysisStatLabel}>Recordings</Text>
            </View>
          </View>
          <View style={styles.scoreRangeRow}>
            <View style={styles.scoreRangeItem}>
              <Text style={styles.scoreRangeLabel}>Max</Text>
              <Text style={styles.scoreRangeValue}>{typeof overall.max_score === 'string' ? parseFloat(overall.max_score).toFixed(1) : (overall.max_score?.toFixed(1) || 0)}%</Text>
            </View>
            <View style={styles.scoreRangeItem}>
              <Text style={styles.scoreRangeLabel}>Min</Text>
              <Text style={styles.scoreRangeValue}>{typeof overall.min_score === 'string' ? parseFloat(overall.min_score).toFixed(1) : (overall.min_score?.toFixed(1) || 0)}%</Text>
            </View>
            <View style={styles.scoreRangeItem}>
              <Text style={styles.scoreRangeLabel}>Success</Text>
              <Text style={styles.scoreRangeValue}>{overall.success_count || 0}</Text>
            </View>
          </View>
        </View>

        {/* Topic-wise Statistics */}
        {topics && topics.length > 0 && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisCardTitle}>Topic Performance</Text>
            {topics.map((topic, index) => {
              // Calculate completion percentage based on completed/total sentences
              const completedSentences = topic.completed_sentences || 0;
              const totalSentences = topic.total_sentences || 0;
              const completionPercentage = totalSentences > 0 
                ? (completedSentences / totalSentences) * 100 
                : 0;

              return (
              <View key={index} style={styles.topicStatItem}>
                <View style={styles.topicStatHeader}>
                  <Text style={styles.topicStatTitle}>{topic.topic_title}</Text>
                    <Text style={styles.topicStatScore}>{Math.round(completionPercentage)}%</Text>
                </View>
                  <View style={styles.topicStatProgressContainer}>
                    <ProgressBar
                      progress={completionPercentage}
                      height={6}
                      borderRadius={3}
                      showPercentage={false}
                      containerStyle={{ gap: 0 }}
                    />
                </View>
                <View style={styles.topicStatDetails}>
                  <Text style={styles.topicStatDetailText}>
                      {completedSentences} / {totalSentences} completed
                  </Text>
                  <Text style={styles.topicStatDetailText}>
                    {topic.total_recordings || 0} recordings
                  </Text>
                </View>
              </View>
              );
            })}
          </View>
        )}

        {/* Time Series (Last 7 Days) */}
        {time_series && time_series.length > 0 && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisCardTitle}>Last 7 Days</Text>
            {time_series.map((day, index) => (
              <View key={index} style={styles.dayStatItem}>
                <Text style={styles.dayStatDate}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </Text>
                <View style={styles.dayStatRight}>
                  <Text style={styles.dayStatValue}>{typeof day.avg_score === 'string' ? parseFloat(day.avg_score).toFixed(1) : (day.avg_score?.toFixed(1) || 0)}%</Text>
                  <Text style={styles.dayStatCount}>{day.practices || 0} practices</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Error Analysis 
        {error_analysis && error_analysis.length > 0 && (
          <View style={styles.analysisCard}>
            <Text style={styles.analysisCardTitle}>Error Analysis</Text>
            {error_analysis.map((error, index) => (
              <View key={index} style={styles.errorItem}>
                <Text style={styles.errorType}>{error.error_type || 'Unknown'}</Text>
                <View style={styles.errorCountBadge}>
                  <Text style={styles.errorCount}>{error.count || 0}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
  */} 

      </ScrollView>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'subjects':
        return renderSubjects();
      case 'recordings':
        return renderRecordings();
      case 'reports':
        return renderReports();
      case 'analyses':
        return renderAnalyses();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <DashboardLayout navigation={navigation}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading course...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout navigation={navigation}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error || '#ef4444'} />
          <Text style={styles.errorText}>{error || 'Course not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'information-circle-outline' },
    { id: 'subjects', label: 'Subjects', icon: 'book-outline' },
    { id: 'recordings', label: 'Recordings', icon: 'mic-outline' },
    { id: 'reports', label: 'Reports', icon: 'document-text-outline' },
    { id: 'analyses', label: 'Analyses', icon: 'analytics-outline' },
  ];

  return (
    <DashboardLayout navigation={navigation} currentMode="sualingo" hideHeader={true}>
      <View style={styles.container}>
        {/* Spacer for top padding */}
        <View style={styles.topSpacer} />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Course Details
          </Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteCourse}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.error || '#ef4444'} />
          </TouchableOpacity>
        </View>

         {/* Course Info Card - Üstte */}
         {renderCourseInfoCard()}

         {/* Stats Row */}
         {renderStatsRow()}

         {/* Tab Navigation - Minimal - Fixed Position */}
         <View style={styles.tabsContainerWrapper}>
           <ScrollView
             horizontal
             showsHorizontalScrollIndicator={false}
             style={styles.tabsContainer}
             contentContainerStyle={styles.tabsContent}
           >
             {tabs.map((tab) => (
               <TouchableOpacity
                 key={tab.id}
                 style={[
                   styles.tab,
                   activeTab === tab.id && styles.tabActive,
                 ]}
                 onPress={() => setActiveTab(tab.id)}
               >
                 <Ionicons
                   name={tab.icon}
                   size={16}
                   color={activeTab === tab.id ? COLORS.primary : COLORS.gray[400]}
                 />
                 <Text
                   style={[
                     styles.tabText,
                     activeTab === tab.id && styles.tabTextActive,
                   ]}
                 >
                   {tab.label}
                 </Text>
               </TouchableOpacity>
             ))}
           </ScrollView>
         </View>

         {/* Tab Content - FlatList'ler ScrollView dışında */}
         <View style={styles.tabContentWrapper}>
           {renderTabContent()}
         </View>
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  topSpacer: {
    height: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginHorizontal: SIZES.base,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 4,
  },
  tabsContainerWrapper: {
    marginBottom: SIZES.padding,
    flexShrink: 0,
  },
  // Course Info Card
  courseInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseInfoContent: {
    flexDirection: 'row',
    gap: SIZES.padding,
  },
  courseInfoLeft: {
    flex: 1,
    minWidth: 0, // Allows text to wrap properly
  },
  courseInfoRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    minWidth: 100,
    maxWidth: 140,
  },
  courseInfoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    gap: 8,
  },
  courseInfoIcon: {
    flexShrink: 0,
  },
  courseInfoTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textLight,
    flex: 1,
    lineHeight: 28,
  },
  courseInfoDescription: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
    lineHeight: 20,
    marginTop: 4,
  },
  courseInfoBadges: {
    flexDirection: 'column',
    gap: 8,
    width: '100%',
    alignItems: 'flex-end',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    minWidth: 100,
    justifyContent: 'flex-start',
  },
  levelBadge: {
    backgroundColor: COLORS.primary + '30',
  },
  languageBadge: {
    backgroundColor: '#10b981' + '30',
  },
  statusBadge: {
    backgroundColor: '#f59e0b' + '30',
  },
  infoBadgeText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  courseInfoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SIZES.base,
  },
  courseInfoMetaText: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SIZES.base + 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    textAlign: 'center',
    maxWidth: '100%',
  },
  // Tab Navigation
  tabsContainer: {
    flexShrink: 0,
  },
  tabsContent: {
    paddingHorizontal: SIZES.padding,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabActive: {
    backgroundColor: COLORS.primary + '30',
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Tab Content
  tabContent: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    paddingBottom: SIZES.padding * 1.5,
  },
  tabContentContainer: {
    paddingBottom: SIZES.padding * 2,
  },
  progressLoadingContainer: {
    padding: SIZES.padding * 2,
    alignItems: 'center',
  },
  overviewSection: {
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  infoItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoItemLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  infoItemValue: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.gray[400],
    textAlign: 'center',
    marginTop: SIZES.base,
  },
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  listItemMeta: {
    fontSize: SIZES.caption,
    color: COLORS.gray[500],
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  scoreText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Topic Card Styles
  topicCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  topicCardCompleted: {
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  topicHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  topicTitleContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
  },
  startPracticeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  startPracticeButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body2,
    fontWeight: '600',
  },
  topicProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SIZES.padding,
  },
  topicProgressText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.textLight,
    minWidth: 45,
    textAlign: 'right',
  },
  topicActionContainer: {
    alignItems: 'flex-end',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  loadingText: {
    marginTop: SIZES.padding,
    fontSize: SIZES.body,
    color: COLORS.textLight,
  },
  errorText: {
    marginTop: SIZES.padding,
    fontSize: SIZES.body,
    color: COLORS.error || '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  tabContentWrapper: {
    flex: 1,
  },
  // Recordings Accordion Styles
  // Responsive spacing adjustments
  topicSection: {
    marginBottom: SIZES.padding + 4,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  topicHeader: {
    padding: SIZES.padding,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  topicHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicHeaderTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    flex: 1,
  },
  topicBadge: {
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topicBadgeText: {
    fontSize: SIZES.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  sentenceSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  sentenceHeader: {
    padding: SIZES.base,
    paddingLeft: SIZES.padding * 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  sentenceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentenceHeaderText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    flex: 1,
  },
  recordingCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recordingCountText: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
  },
  recordingItem: {
    paddingLeft: SIZES.padding * 2,
    paddingRight: SIZES.padding,
    paddingVertical: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.03)',
  },
  recordingItemContent: {
    flex: 1,
  },
  recordingItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  recordingItemInfo: {
    flex: 1,
  },
  recordingScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: SIZES.caption,
    color: COLORS.gray[500],
  },
  recordingTranscript: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    fontStyle: 'italic',
  },
  // Reports Styles
  reportItem: {
    paddingLeft: SIZES.padding * 2,
    paddingRight: SIZES.padding,
    paddingVertical: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.03)',
  },
  reportItemHeader: {
    marginBottom: 8,
  },
  reportItemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportDate: {
    fontSize: SIZES.caption,
    color: COLORS.gray[500],
    marginLeft: 'auto',
  },
  reportDetails: {
    marginTop: 8,
    padding: SIZES.base,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 8,
  },
  reportDetailSection: {
    marginBottom: SIZES.base,
  },
  reportDetailLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
    fontWeight: '600',
    marginBottom: 4,
  },
  reportDetailValue: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  reportScoresRow: {
    flexDirection: 'row',
    gap: SIZES.base,
    marginTop: SIZES.base,
    marginBottom: SIZES.base,
  },
  reportScoreItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: SIZES.base,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportScoreLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  reportScoreValue: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  wordAnalysisContainer: {
    maxHeight: 200,
    marginTop: 8,
  },
  wordItemContainer: {
    marginBottom: 12,
  },
  wordItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  wordText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
    flex: 1,
  },
  missingText: {
    color: '#ef4444',
    fontStyle: 'italic',
  },
  wordScore: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  wordBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  wordBar: {
    height: '100%',
    borderRadius: 4,
  },
  wordErrorBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  wordErrorText: {
    fontSize: SIZES.caption,
    color: COLORS.white,
    fontWeight: '600',
  },
  // Analysis Styles
  analysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SIZES.padding,
    marginBottom: SIZES.padding + 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  analysisCardTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: SIZES.base,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
    marginBottom: SIZES.padding * 4,
    paddingBottom: SIZES.padding,
  },
  // Analysis specific stat cards (smaller, no flex: 1)
  analysisStatCard: {
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: SIZES.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
  },
  analysisStatValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: 4,
  },
  analysisStatLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
    marginTop: 2,
    textAlign: 'center',
  },
  scoreRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 0,
    paddingTop: SIZES.padding * 2,
    paddingBottom: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreRangeItem: {
    alignItems: 'center',
  },
  scoreRangeLabel: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  scoreRangeValue: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: COLORS.primary,
  },
  topicStatItem: {
    padding: SIZES.base,
    marginBottom: SIZES.base,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  topicStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicStatTitle: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
    flex: 1,
  },
  topicStatScore: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  topicStatProgressContainer: {
    marginBottom: 8,
  },
  topicStatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topicStatDetailText: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
  },
  dayStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.base,
    marginBottom: SIZES.base,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  dayStatDate: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  dayStatRight: {
    alignItems: 'flex-end',
  },
  dayStatValue: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dayStatCount: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
  },
  errorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.base,
    marginBottom: SIZES.base,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
  },
  errorType: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    flex: 1,
  },
  errorCountBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  errorCount: {
    fontSize: SIZES.caption,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default CourseDetailScreen;
