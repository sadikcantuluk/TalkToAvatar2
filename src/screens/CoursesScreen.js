import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCourses, useCreateCourse, useDeleteCourse } from '../hooks/useCourseQueries';
import { useAuth } from '../context';
import { COLORS, SIZES } from '../constants';
import { DashboardLayout, LanguageSelector, ConfirmDialog, CourseCardSkeleton, SkeletonList } from '../components';

// Supported languages for Sualingo mode
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

// Validation constants
const VALIDATION = {
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 255,
    REQUIRED: true,
  },
  DESCRIPTION: {
    MAX_LENGTH: 1000,
    REQUIRED: false,
  },
  LANGUAGE_CODE: {
    LENGTH: 2,
    REQUIRED: true,
  },
};

const CoursesScreen = ({ navigation }) => {
  const { data: coursesData = [], isLoading: loading, error, refetch } = useCourses();
  const createCourseMutation = useCreateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const { token } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Sort courses by created_at - newest at the end
  const courses = useMemo(() => {
    if (!Array.isArray(coursesData) || coursesData.length === 0) {
      return [];
    }
    return [...coursesData].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      // Sort ascending (oldest first, newest last)
      return dateA - dateB;
    });
  }, [coursesData]);

  // Mark initial load as complete when loading is done
  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseLevel, setCourseLevel] = useState('A1');
  const [courseLanguage, setCourseLanguage] = useState('en');
  const [isCreatingLocal, setIsCreatingLocal] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    language: '',
  });

  const validateTitle = (text) => {
    const trimmed = text.trim();
    if (VALIDATION.TITLE.REQUIRED && !trimmed) {
      return 'Course title is required';
    }
    if (trimmed.length < VALIDATION.TITLE.MIN_LENGTH) {
      return `Title must be at least ${VALIDATION.TITLE.MIN_LENGTH} characters`;
    }
    if (trimmed.length > VALIDATION.TITLE.MAX_LENGTH) {
      return `Title must be less than ${VALIDATION.TITLE.MAX_LENGTH} characters`;
    }
    return '';
  };

  const validateDescription = (text) => {
    if (text.length > VALIDATION.DESCRIPTION.MAX_LENGTH) {
      return `Description must be less than ${VALIDATION.DESCRIPTION.MAX_LENGTH} characters`;
    }
    return '';
  };

  const handleTitleChange = (text) => {
    console.log('📝 [DEBUG] Title changed:', text);
    setCourseTitle(text);
    const error = validateTitle(text);
    setErrors(prev => ({ ...prev, title: error }));
  };

  const handleDescriptionChange = (text) => {
    console.log('📝 [DEBUG] Description changed:', text);
    setCourseDescription(text);
    const error = validateDescription(text);
    setErrors(prev => ({ ...prev, description: error }));
  };

  const handleCreateCourse = () => {
    console.log('🎯 [DEBUG] handleCreateCourse called');
    console.log('📊 [DEBUG] Current state:', {
      showCreateModal,
      token: token ? 'exists' : 'missing',
    });
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    console.log('🎯 [DEBUG] handleCloseModal called');
    setShowCreateModal(false);
    setCourseTitle('');
    setCourseDescription('');
    setCourseLevel('A1');
    setCourseLanguage('en');
    setErrors({ title: '', description: '', language: '' });
  };

  const handleSubmitCourse = async () => {
    console.log('🎯 [DEBUG] handleSubmitCourse called');
    console.log('📊 [DEBUG] Form data:', {
      title: courseTitle,
      description: courseDescription,
      level: courseLevel,
      language: courseLanguage,
      token: token ? 'exists' : 'missing',
    });

    // Validate all fields
    const titleError = validateTitle(courseTitle);
    const descriptionError = validateDescription(courseDescription);
    const languageError = !courseLanguage ? 'Language is required' : '';

    const newErrors = {
      title: titleError,
      description: descriptionError,
      language: languageError,
    };

    setErrors(newErrors);

    if (titleError || descriptionError || languageError) {
      console.warn('⚠️ [WARNING] Validation errors:', newErrors);
      Alert.alert('Validation Error', 'Please fix the errors before submitting');
      return;
    }

    if (!token) {
      console.error('❌ [ERROR] No authentication token');
      Alert.alert('Error', 'Authentication required. Please login again.');
      return;
    }

    try {
      console.log('🔄 [DEBUG] Starting course creation...');
      setIsCreatingLocal(true);

      const courseData = {
        title: courseTitle.trim(),
        description: courseDescription.trim(),
        language_code: courseLanguage,
        level: courseLevel,
        status: 'active',
      };

      console.log('📤 [DEBUG] Sending course data:', courseData);
      console.log('🔑 [DEBUG] Token:', token.substring(0, 20) + '...');

      await createCourseMutation.mutateAsync(courseData);

      console.log('✅ [SUCCESS] Course created successfully');

      handleCloseModal();
    } catch (err) {
      console.error('❌ [ERROR] Course creation failed');
      console.error('❌ [ERROR] Error object:', err);
      console.error('❌ [ERROR] Error message:', err.message);
      console.error('❌ [ERROR] Error stack:', err.stack);

      const errorMessage = err.message || err.error || JSON.stringify(err);
      console.error('❌ [ERROR] Full error:', errorMessage);

      Alert.alert(
        'Error',
        `Failed to create course: ${errorMessage}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsCreatingLocal(false);
      console.log('🏁 [DEBUG] Course creation process finished');
    }
  };

  const isCreating = createCourseMutation.isLoading || isCreatingLocal;

  const handleDeleteCourse = (courseId, courseTitle) => {
    console.log('🎯 [DEBUG] handleDeleteCourse called');
    console.log('📊 [DEBUG] Course ID:', courseId);
    console.log('📊 [DEBUG] Course Title:', courseTitle);

    setCourseToDelete({ id: courseId, title: courseTitle });
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteCourse = () => {
    if (!courseToDelete) return;

    console.log('🔄 [DEBUG] Starting course deletion...');

    // Close dialog immediately (optimistic update will remove course from UI)
    setDeleteConfirmVisible(false);
    const courseToDeleteId = courseToDelete.id;
    const courseToDeleteTitle = courseToDelete.title;
    setCourseToDelete(null);

    // Delete course (optimistic update handled by React Query)
    // Course will be removed from UI immediately, backend deletion happens in background
    // IMPORTANT: Do not call refetch() - optimistic update already removed course from cache
    deleteCourseMutation.mutate(courseToDeleteId, {
      onError: (err) => {
        console.error('❌ [ERROR] Course deletion failed:', err);
        // Show error and restore course in UI (rollback already happened in hook)
        Alert.alert(
          'Error',
          `Failed to delete "${courseToDeleteTitle}". Please try again.`,
          [{ text: 'OK' }]
        );
        // Note: Rollback already happened in useDeleteCourse hook
      },
      onSuccess: () => {
        console.log('✅ [SUCCESS] Course deleted successfully');
        // Course already removed from UI via optimistic update
        // Do NOT call refetch() here - it would cause skeleton loading
        // Backend deletion is already complete, cache is already updated
      },
    });
  };

  const handleCoursePress = (course) => {
    console.log('🎯 [DEBUG] Course pressed:', course.id);
    if (navigation) {
      navigation.navigate('CourseDetail', { courseId: course.id, course });
    } else {
      console.error('❌ [ERROR] Navigation is not available');
      Alert.alert('Error', 'Navigation is not available');
    }
  };

  const handleRefresh = async () => {
    console.log('🔄 [DEBUG] Pull to refresh triggered');
    setRefreshing(true);
    try {
      await refetch();
      console.log('✅ [SUCCESS] Courses refreshed');
    } catch (err) {
      console.error('❌ [ERROR] Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Get badge color based on level
  const getLevelColor = (level) => {
    const levelColors = {
      'A1': '#10b981', // Green
      'A2': '#22c55e', // Light Green
      'B1': '#84cc16', // Yellow-Green
      'B2': '#f59e0b', // Orange
      'C1': '#f97316', // Dark Orange
      'C2': '#ef4444', // Red
    };
    return levelColors[level] || COLORS.primary;
  };

  // Get language flag emoji
  const getLanguageFlag = (code) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang?.flag || '🌐';
  };

  // Get icon based on level
  const getLevelIcon = (level) => {
    const levelIcons = {
      'A1': 'school-outline',
      'A2': 'library-outline',
      'B1': 'document-text-outline',
      'B2': 'trophy-outline',
      'C1': 'star-outline',
      'C2': 'ribbon-outline',
    };
    return levelIcons[level] || 'school-outline';
  };

  const renderCourseItem = ({ item }) => {
    const levelColor = item.level ? getLevelColor(item.level) : COLORS.primary;
    const languageFlag = item.language_code ? getLanguageFlag(item.language_code) : '🌐';
    const levelIcon = item.level ? getLevelIcon(item.level) : 'school-outline';

    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => handleCoursePress(item)}
        activeOpacity={0.7}
      >
        {/* Card Header with Icon */}
        <View style={styles.courseCardHeader}>
          <View style={[styles.courseIconContainer, { backgroundColor: levelColor + '20' }]}>
            <Ionicons name={levelIcon} size={28} color={levelColor} />
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteCourse(item.id, item.title);
            }}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error || '#ef4444'} />
          </TouchableOpacity>
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
          {item.description && (
            <Text style={styles.courseDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>

        {/* Course Meta Badges */}
        <View style={styles.courseMeta}>
          {item.level && (
            <View style={[styles.metaBadge, styles.levelBadge]}>
              <Ionicons name="school-outline" size={14} color="#4F46E5" />
              <Text style={[styles.metaText, { color: '#4F46E5' }]}>{item.level}</Text>
            </View>
          )}
          {item.language_code && (
            <View style={[styles.metaBadge, styles.languageBadge]}>
              <Text style={styles.languageFlag}>{languageFlag}</Text>
              <Text style={[styles.metaText, { color: '#059669' }]}>{item.language_code.toUpperCase()}</Text>
            </View>
          )}
          <View style={[styles.metaBadge, styles.statusBadge]}>
            <Ionicons
              name={item.status === 'active' ? 'checkmark-circle-outline' : 'time-outline'}
              size={14}
              color="#D97706"
            />
            <Text style={[styles.metaText, { color: '#D97706' }]}>{item.status || 'active'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeleton = () => (
    <SkeletonList
      count={3}
      renderSkeleton={() => <CourseCardSkeleton />}
      containerStyle={styles.skeletonContainer}
      itemStyle={styles.skeletonItem}
    />
  );

  // Format error message properly
  const errorMessage = error?.message || (typeof error === 'string' ? error : error?.error || 'An error occurred');

  if (error) {
    return (
      <DashboardLayout>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error || '#ef4444'} />
          <Text style={styles.errorText}>{errorMessage}</Text>
          {!errorMessage.includes('Session expired') && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={async () => {
                console.log('🔄 [DEBUG] Retry button pressed');
                await refetch();
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.retryButton, { marginTop: 10, backgroundColor: COLORS.gray[600] }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  const isFormValid = courseTitle.trim().length >= VALIDATION.TITLE.MIN_LENGTH &&
    courseTitle.trim().length <= VALIDATION.TITLE.MAX_LENGTH &&
    courseDescription.length <= VALIDATION.DESCRIPTION.MAX_LENGTH &&
    courseLanguage &&
    !errors.title &&
    !errors.description &&
    !errors.language;

  return (
    <DashboardLayout navigation={navigation} currentMode="sualingo">
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Courses</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('CourseSetup')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {loading || isInitialLoad ? (
          <View style={styles.skeletonWrapper}>
            {renderSkeleton()}
          </View>
        ) : (courses || []).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyText}>No courses yet</Text>
            <Text style={styles.emptySubtext}>
              Start your language journey by creating a new course.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CourseSetup')}
            >
              <Text style={styles.createButtonText}>Create New Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={courses || []}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id?.toString() || item.id}
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.listContent,
              (courses || []).length === 0 && { flexGrow: 1 }
            ]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}

        {/* Create Course Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalOverlay}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={handleCloseModal}
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Course</Text>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                contentContainerStyle={styles.modalBodyContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Course Title <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    placeholder="Enter course title (min 3, max 255 characters)"
                    placeholderTextColor={COLORS.gray[400]}
                    value={courseTitle}
                    onChangeText={handleTitleChange}
                    maxLength={VALIDATION.TITLE.MAX_LENGTH}
                    autoFocus
                  />
                  {errors.title ? (
                    <Text style={styles.errorText}>{errors.title}</Text>
                  ) : (
                    <Text style={styles.helperText}>
                      {courseTitle.length}/{VALIDATION.TITLE.MAX_LENGTH} characters
                    </Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                    placeholder="Enter course description (optional, max 1000 characters)"
                    placeholderTextColor={COLORS.gray[400]}
                    value={courseDescription}
                    onChangeText={handleDescriptionChange}
                    multiline
                    numberOfLines={4}
                    maxLength={VALIDATION.DESCRIPTION.MAX_LENGTH}
                    textAlignVertical="top"
                  />
                  {errors.description ? (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  ) : (
                    <Text style={styles.helperText}>
                      {courseDescription.length}/{VALIDATION.DESCRIPTION.MAX_LENGTH} characters
                    </Text>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Level</Text>
                  <View style={styles.levelButtons}>
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.levelButton,
                          courseLevel === level && styles.levelButtonActive,
                        ]}
                        onPress={() => {
                          console.log('📚 [DEBUG] Level selected:', level);
                          setCourseLevel(level);
                        }}
                      >
                        <Text
                          style={[
                            styles.levelButtonText,
                            courseLevel === level && styles.levelButtonTextActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Language <Text style={styles.required}>*</Text>
                  </Text>
                  <LanguageSelector
                    selectedLanguage={courseLanguage}
                    onLanguageChange={(langCode) => {
                      console.log('🌍 [DEBUG] Language selected:', langCode);
                      setCourseLanguage(langCode);
                      setErrors(prev => ({ ...prev, language: '' }));
                    }}
                    style={errors.language && styles.inputError}
                  />
                  {errors.language && (
                    <Text style={styles.errorText}>{errors.language}</Text>
                  )}
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCloseModal}
                  disabled={isCreating}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.createButtonModal,
                    (!isFormValid || isCreating) && styles.createButtonDisabled,
                  ]}
                  onPress={handleSubmitCourse}
                  disabled={!isFormValid || isCreating}
                >
                  {isCreating ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.createButtonTextModal}>Create</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          visible={deleteConfirmVisible}
          title="Delete Course"
          message={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDeleteCourse}
          onCancel={() => {
            setDeleteConfirmVisible(false);
            setCourseToDelete(null);
          }}
          loading={deleteCourseMutation.isLoading}
        />
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 0,
    backgroundColor: '#F9FAFB', // Reverted to Light Background
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937', // Dark Text
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  addButton: {
    backgroundColor: '#2D7F83', // Teal Button
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D7F83',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Light gray bg for icon
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  courseInfo: {
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  courseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  levelBadge: {
    backgroundColor: '#E0E7FF', // Light Indigo
    borderColor: '#C7D2FE',
    borderWidth: 1,
  },
  languageBadge: {
    backgroundColor: '#ECFDF5', // Light Emerald
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusBadge: {
    backgroundColor: '#FFFBEB', // Light Amber
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '800', // Extra Bold
    color: '#111827', // Almost Black for maximum contrast
  },
  languageFlag: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: '#2D7F83',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#2D7F83',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Skeleton styles
  skeletonWrapper: {
    flex: 1,
    paddingTop: 8,
  },
  skeletonContainer: {
    padding: 24,
    paddingTop: 8,
  },
  skeletonItem: {
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#f59e0b' + '20',
    borderColor: '#f59e0b' + '40',
  },
  languageFlag: {
    fontSize: 16,
  },
  metaText: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
    fontWeight: '600',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: SIZES.h2,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    fontSize: SIZES.body,
    color: COLORS.gray[400],
    textAlign: 'center',
    marginTop: SIZES.base,
    marginBottom: SIZES.padding * 2,
  },
  createButton: {
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    minWidth: 150,
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundDark,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    flexGrow: 0,
  },
  modalBodyContent: {
    padding: SIZES.padding,
  },
  formGroup: {
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 8,
  },
  required: {
    color: COLORS.error || '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    fontSize: SIZES.body,
    color: COLORS.textLight,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputError: {
    borderColor: COLORS.error || '#ef4444',
    borderWidth: 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: SIZES.caption,
    color: COLORS.gray[400],
    marginTop: 4,
  },
  levelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  levelButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  levelButtonText: {
    fontSize: SIZES.body,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  levelButtonTextActive: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    color: COLORS.textLight,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  createButtonModal: {
    backgroundColor: COLORS.primary,
  },
  createButtonDisabled: {
    backgroundColor: COLORS.gray[600],
    opacity: 0.5,
  },
  createButtonTextModal: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  skeletonContainer: {
    padding: SIZES.padding,
  },
  skeletonItem: {
    marginBottom: SIZES.base,
  },
});

export default CoursesScreen;
