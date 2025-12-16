import React, { useState, useEffect, useMemo } from 'react';
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
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useToast } from '../context';
import { useCourse, useCourseSubjects, useCourseProgress, useDeleteCourse, useUpdateCourse } from '../hooks/useCourseQueries';
import { COLORS, SIZES, FONTS, IMAGES } from '../constants';
import VoiceSelector from '../components/VoiceSelector';
import TopicSelector from '../components/TopicSelector';
import { mergeTopicsWithProgress } from '../constants/topics';
import { ProgressBarSkeleton } from '../components/SkeletonComponents';

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
  const updateCourseMutation = useUpdateCourse();

  // Use query data first (for real-time updates), fallback to initialCourse if query not loaded yet
  const course = courseQuery.data || initialCourse;

  // Merge static topics with progress data from backend
  // Static topics load instantly, progress is fetched separately
  const subjects = useMemo(() => {
    const progressData = subjectsQuery.data || [];
    return mergeTopicsWithProgress(progressData);
  }, [subjectsQuery.data]);

  const loading = courseQuery.isLoading && !initialCourse;

  // Selection State
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState('alloy'); // Default to Alloy
  const [selectedAvatar, setSelectedAvatar] = useState('male'); // 'male' or 'female'
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);

  // Course Edit State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editErrors, setEditErrors] = useState({});

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
      selectedAvatar: selectedAvatar, // Pass selected avatar (male/female) to practice screen
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

        <TouchableOpacity
          style={styles.editLevelButton}
          onPress={() => {
            setEditTitle(course?.title || '');
            setEditDescription(course?.description || '');
            setEditErrors({});
            setIsEditModalVisible(true);
          }}
        >
          <Ionicons name="pencil" size={20} color={THEME.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProgressSection = () => {
    // Helper function for smooth color transitions (0-40% red/orange, 40-70% yellow, 70-100% green)
    const getProgressColor = (progress) => {
      if (progress < 20) return '#EF4444'; // Red - Very low
      if (progress < 40) return '#F97316'; // Orange - Low progress
      if (progress < 60) return '#FBBF24'; // Yellow - Getting started
      if (progress < 70) return '#F59E0B'; // Amber - Good progress
      if (progress < 90) return '#22C55E'; // Green - Great progress
      return '#047857'; // Emerald - Excellent/Complete
    };

    const isLoading = subjectsQuery.isLoading || subjectsQuery.isFetching;

    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.progressCard}
          onPress={() => setIsProgressExpanded(!isProgressExpanded)}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          {isLoading ? (
            <ProgressBarSkeleton showLabel={true} showPercentage={true} />
          ) : (
            <>
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
                <View style={[
                  styles.progressBarFill,
                  {
                    width: `${overallProgress}%`,
                    backgroundColor: getProgressColor(overallProgress)
                  }
                ]} />
              </View>
            </>
          )}

          {isProgressExpanded && !isLoading && (
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
                          backgroundColor: getProgressColor(subject.progress || 0)
                        }
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {isProgressExpanded && isLoading && (
            <View style={styles.detailedProgressContainer}>
              {[1, 2, 3].map((index) => (
                <ProgressBarSkeleton key={index} showLabel={true} showPercentage={true} />
              ))}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

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
              source={IMAGES.sualingoMan}
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
              source={IMAGES.sualingoWoman}
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
              source={selectedAvatar === 'female' ? IMAGES.sualingoWoman : IMAGES.sualingoMan}
              style={styles.previewAvatar}
              resizeMode="cover"
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

      {/* Course Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboardAvoiding}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsEditModalVisible(false)}
          >
            <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Course</Text>
                <TouchableOpacity
                  onPress={() => setIsEditModalVisible(false)}
                  style={styles.modalCloseButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color={THEME.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={styles.modalBodyContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Course Title <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      editErrors.title && styles.inputError
                    ]}
                    placeholder="Enter course title"
                    placeholderTextColor={THEME.textSecondary}
                    value={editTitle}
                    onChangeText={(text) => {
                      setEditTitle(text);
                      if (editErrors.title) {
                        setEditErrors({ ...editErrors, title: null });
                      }
                    }}
                    maxLength={50}
                    autoCorrect={false}
                  />
                  {editErrors.title && (
                    <Text style={styles.errorText}>{editErrors.title}</Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, editErrors.description && styles.inputError]}
                    placeholder="Briefly describe what this course covers..."
                    placeholderTextColor={THEME.textSecondary}
                    value={editDescription}
                    onChangeText={(text) => {
                      setEditDescription(text);
                      if (editErrors.description) {
                        setEditErrors({ ...editErrors, description: null });
                      }
                    }}
                    multiline
                    numberOfLines={4}
                    maxLength={200}
                    textAlignVertical="top"
                  />
                  {editErrors.description && (
                    <Text style={styles.errorText}>{editErrors.description}</Text>
                  )}
                  <Text style={styles.charCount}>
                    {editDescription.length}/200
                  </Text>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditModalVisible(false)}
                  disabled={updateCourseMutation.isLoading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.saveButton,
                    (!editTitle.trim() || updateCourseMutation.isLoading) && styles.saveButtonDisabled,
                  ]}
                  onPress={async () => {
                    // Validate
                    const errors = {};
                    if (!editTitle.trim()) {
                      errors.title = 'Course title is required';
                    }
                    if (editTitle.trim().length < 3) {
                      errors.title = 'Title must be at least 3 characters';
                    }

                    if (Object.keys(errors).length > 0) {
                      setEditErrors(errors);
                      return;
                    }

                    try {
                      await updateCourseMutation.mutateAsync({
                        courseId: courseId,
                        courseData: {
                          title: editTitle.trim(),
                          description: editDescription.trim() || null,
                        },
                      });
                      setIsEditModalVisible(false);
                      Alert.alert('Success', 'Course updated successfully');
                    } catch (error) {
                      Alert.alert('Error', error?.response?.data?.errors?.[0] || error?.message || 'Failed to update course');
                    }
                  }}
                  disabled={!editTitle.trim() || updateCourseMutation.isLoading}
                >
                  {updateCourseMutation.isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
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
    overflow: 'hidden',
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
  // Edit Modal Styles - Updated
  modalKeyboardAvoiding: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay for focus
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24, // Rounded corners
    width: '100%',
    maxWidth: 500, // Constrain width on tablets
    maxHeight: '80%', // Avoid full height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20, // Softer, larger shadow
    elevation: 10,
    overflow: 'hidden', // Clip children for border radius
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: -0.5,
  },
  modalCloseButton: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  modalBody: {
    paddingHorizontal: 24,
  },
  modalBodyContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 2, // Thicker border
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: THEME.text,
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: 6,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 16,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CourseDetailScreen;
