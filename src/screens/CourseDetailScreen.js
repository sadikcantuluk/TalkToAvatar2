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
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useToast } from '../context';
import { useCourse, useCourseSubjects, useCourseProgress, useDeleteCourse } from '../hooks/useCourseQueries';
import { COLORS, SIZES, FONTS, IMAGES } from '../constants';
import VoiceSelector from '../components/VoiceSelector';
import TopicSelector from '../components/TopicSelector';

const THEME = {
  primary: '#2D7F83',
  background: '#F9FAFB',
  cardBg: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
};

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId, course: initialCourse } = route.params || {};
  const { token, user } = useAuth();

  // React Query hooks
  const courseQuery = useCourse(courseId);
  const subjectsQuery = useCourseSubjects(courseId);

  // Use initial course if available, otherwise use query data
  const course = initialCourse || courseQuery.data;
  const subjects = subjectsQuery.data || [];
  const loading = courseQuery.isLoading && !initialCourse;

  // Selection State
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState('alloy'); // Default to Alloy
  const [selectedAvatar, setSelectedAvatar] = useState('male'); // 'male' or 'female'
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);

  // Calculate Overall Progress
  const calculateOverallProgress = () => {
    if (!subjects || subjects.length === 0) return 0;
    const totalProgress = subjects.reduce((sum, subject) => sum + (subject.progress || 0), 0);
    return Math.round(totalProgress / subjects.length);
  };

  const overallProgress = calculateOverallProgress();

  // Select first topic by default when loaded
  useEffect(() => {
    if (subjects.length > 0 && !selectedTopic) {
      setSelectedTopic(subjects[0]);
    }
  }, [subjects]);

  const handleStartPractice = () => {
    if (!selectedTopic) {
      Alert.alert('Select Topic', 'Please select a topic to practice.');
      return;
    }

    navigation.navigate('CoursePractice', {
      courseId: courseId,
      course: course,
      topic: selectedTopic.topic,
      topicTitle: selectedTopic.title,
      selectedVoice: selectedVoice,
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={THEME.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{course?.title || 'Course Details'}</Text>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => Alert.alert('Settings', 'Course settings')}
      >
        <Ionicons name="settings-outline" size={24} color={THEME.text} />
      </TouchableOpacity>
    </View>
  );

  const renderLanguageLevelSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Current Level</Text>
      <View style={styles.levelCard}>
        <View style={styles.levelBadgeContainer}>
          <View style={[styles.levelBadge, { backgroundColor: '#F59E0B' }]}>
            <Text style={styles.levelText}>{course?.level || 'A1'}</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: '#8B5CF6', marginLeft: 8 }]}>
            <Text style={styles.levelText}>{course?.language_code?.toUpperCase() || 'EN'}</Text>
          </View>
        </View>

        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>General Proficiency</Text>
          <Text style={styles.levelSubtitle}>Intermediate Level Course</Text>
        </View>

        <TouchableOpacity style={styles.editLevelButton}>
          <Ionicons name="pencil" size={20} color={THEME.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProgressSection = () => (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={styles.progressCard}
        onPress={() => setIsProgressExpanded(!isProgressExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Course Progress</Text>
          <View style={styles.progressHeaderRight}>
            <Text style={styles.progressPercentage}>{overallProgress}%</Text>
            <Ionicons
              name={isProgressExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={THEME.textSecondary}
            />
          </View>
        </View>

        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
        </View>

        {isProgressExpanded && (
          <View style={styles.detailedProgressContainer}>
            {subjects.map((subject, index) => (
              <View key={index} style={styles.topicProgressRow}>
                <View style={styles.topicProgressLabel}>
                  <Text style={styles.topicProgressName}>{subject.title}</Text>
                  <Text style={styles.topicProgressValue}>{subject.progress || 0}%</Text>
                </View>
                <View style={styles.topicProgressBarBackground}>
                  <View
                    style={[
                      styles.topicProgressBarFill,
                      {
                        width: `${subject.progress || 0}%`,
                        backgroundColor: (subject.progress || 0) > 0 ? '#10B981' : '#E5E7EB'
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  // Combined Row for Topic and Voice
  const renderTopicAndVoiceRow = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.rowContainer}>
        {/* Topic Selector */}
        <View style={styles.halfWidth}>
          <Text style={styles.sectionTitle}>Topic</Text>
          <TopicSelector
            topics={subjects}
            selectedTopic={selectedTopic}
            onTopicChange={(topic) => {
              setSelectedTopic(topic);
              setIsProgressExpanded(false);
            }}
            textColor="#1F2937"
            labelColor="#6B7280"
            style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
          />
        </View>

        {/* Voice Selector */}
        <View style={styles.halfWidth}>
          <Text style={styles.sectionTitle}>Voice</Text>
          <VoiceSelector
            selectedVoice={selectedVoice}
            onVoiceChange={(voice) => {
              setSelectedVoice(voice);
              setIsProgressExpanded(false);
            }}
            textColor="#1F2937"
            labelColor="#6B7280"
            style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
          />
        </View>
      </View>
    </View>
  );

  const renderAvatarSelector = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Avatar</Text>
      <View style={styles.voiceContainer}>
        <TouchableOpacity
          style={[
            styles.avatarCard,
            selectedAvatar === 'male' && styles.avatarCardSelected
          ]}
          onPress={() => {
            setSelectedAvatar('male');
            setIsProgressExpanded(false);
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.avatarImageContainer, selectedAvatar === 'male' && styles.avatarImageContainerSelected]}>
            <Image
              source={IMAGES.yusuf}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.voiceLabel, selectedAvatar === 'male' && styles.voiceLabelSelected]}>Male</Text>
          {selectedAvatar === 'male' && (
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.avatarCard,
            selectedAvatar === 'female' && styles.avatarCardSelected
          ]}
          onPress={() => {
            setSelectedAvatar('female');
            setIsProgressExpanded(false);
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.avatarImageContainer, selectedAvatar === 'female' && styles.avatarImageContainerSelected]}>
            <Image
              source={IMAGES.eda}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
          <Text style={[styles.voiceLabel, selectedAvatar === 'female' && styles.voiceLabelSelected]}>Female</Text>
          {selectedAvatar === 'female' && (
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );



  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={THEME.primary} /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />
      {renderHeader()}

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={() => isProgressExpanded && setIsProgressExpanded(false)}
          style={{ flex: 1 }}
        >
          {renderLanguageLevelSelector()}
          {renderProgressSection()}
          {renderAvatarSelector()}
          {renderTopicAndVoiceRow()}
        </Pressable>
      </ScrollView>

      {/* Footer / CTA */}
      <View style={styles.footer}>
        {selectedTopic && (
          <View style={styles.previewCard}>
            <Image
              source={selectedAvatar === 'female' ? IMAGES.eda : IMAGES.yusuf}
              style={styles.previewAvatar}
              resizeMode="contain"
            />
            <View style={styles.previewBubble}>
              <Text style={styles.previewText} numberOfLines={2}>
                Ready to practice {selectedTopic.title}?
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartPractice}>
            <Ionicons name="volume-high" size={24} color={THEME.primary} style={{ marginRight: 8 }} />
            <Text style={styles.startButtonText}>Start Practice</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text,
  },
  content: {
    paddingBottom: 100,
  },
  sectionContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 16, // Slightly reduced for side-by-side
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  // Level Card
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    marginRight: 16,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text,
  },
  levelSubtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  // Progress Section
  progressCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  progressHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderRadius: 4,
  },
  detailedProgressContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  topicProgressRow: {
    gap: 6,
  },
  topicProgressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicProgressName: {
    fontSize: 14,
    color: '#4B5563',
  },
  topicProgressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  topicProgressBarBackground: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  topicProgressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  // Topics
  topicsScroll: {
    paddingRight: 20,
  },
  topicCard: {
    width: 140,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topicCardSelected: {
    backgroundColor: '#EFFCF6', // Light Green Tint
    borderColor: '#10B981',
  },
  topicIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  topicIconContainerSelected: {
    backgroundColor: '#10B981',
  },
  topicCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#10B981',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Voice
  voiceContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  avatarCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  avatarCardSelected: {
    borderColor: '#2D7F83',
    backgroundColor: '#F0F9FA',
    borderWidth: 2,
  },
  avatarImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarImageContainerSelected: {
    borderColor: '#2D7F83',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  voiceCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  voiceCardSelected: {
    borderColor: '#2D7F83',
    backgroundColor: '#F0F9FA',
  },
  voiceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  voiceIconCircleSelected: {
    backgroundColor: '#2D7F83',
  },
  voiceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  voiceLabelSelected: {
    color: THEME.primary,
    fontWeight: '700',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF', // Or transparent if desired for floating effect
    paddingHorizontal: 20,
    paddingHorizontal: 20,
    paddingBottom: 50, // Increased bottom padding to move button up safely (assuming SafeArea handles absolute bottom)
    paddingTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  previewAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  previewBubble: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxWidth: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  previewText: {
    fontSize: 14,
    color: THEME.text,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the single button
    paddingHorizontal: 24,
  },
  startButton: {
    width: '100%', // Full width
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text,
  },
});

export default CourseDetailScreen;
