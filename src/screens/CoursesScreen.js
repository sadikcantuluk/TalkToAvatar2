import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCourses } from '../hooks/useCourses';
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
  const { courses: coursesFromHook, loading, error, createCourse, deleteCourse, fetchCourses } = useCourses();
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Sync courses from hook and manage initial load state
  useEffect(() => {
    setCourses(coursesFromHook);
    // Mark initial load as complete when loading is done (regardless of data)
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [coursesFromHook, loading]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseLevel, setCourseLevel] = useState('A1');
  const [courseLanguage, setCourseLanguage] = useState('en');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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
      setIsCreating(true);

      const courseData = {
        title: courseTitle.trim(),
        description: courseDescription.trim(),
        language_code: courseLanguage,
        level: courseLevel,
        status: 'active',
      };

      console.log('📤 [DEBUG] Sending course data:', courseData);
      console.log('🔑 [DEBUG] Token:', token.substring(0, 20) + '...');

      const response = await createCourse(courseData);
      
      console.log('✅ [SUCCESS] Course created successfully');
      console.log('📦 [DEBUG] Response:', JSON.stringify(response, null, 2));

      handleCloseModal();
      
      // Refresh courses list
      console.log('🔄 [DEBUG] Refreshing courses list...');
      await fetchCourses();
      console.log('✅ [SUCCESS] Courses list refreshed');
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
      setIsCreating(false);
      console.log('🏁 [DEBUG] Course creation process finished');
    }
  };

  const handleDeleteCourse = (courseId, courseTitle) => {
    console.log('🎯 [DEBUG] handleDeleteCourse called');
    console.log('📊 [DEBUG] Course ID:', courseId);
    console.log('📊 [DEBUG] Course Title:', courseTitle);
    
    setCourseToDelete({ id: courseId, title: courseTitle });
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      console.log('🔄 [DEBUG] Starting course deletion...');
      setIsDeleting(true);
      
      // Optimistically remove from UI immediately
      const updatedCourses = courses.filter(c => c.id !== courseToDelete.id);
      // We'll use a local state update here, but we need to access setCourses
      // For now, we'll call deleteCourse which will refresh, but we can optimize later
      
      // Delete from backend in background (non-blocking)
      Promise.resolve().then(async () => {
        try {
          await deleteCourse(courseToDelete.id);
          console.log('✅ [SUCCESS] Course deleted from backend');
        } catch (err) {
          console.error('❌ [ERROR] Backend deletion failed:', err);
          // Refresh to restore if backend delete failed
          await fetchCourses();
        }
      });

      // Optimistically update UI
      setCourses(prev => prev.filter(c => c.id !== courseToDelete.id));
      setDeleteConfirmVisible(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error('❌ [ERROR] Course deletion failed:', err);
      Alert.alert('Error', err.message || 'Failed to delete course');
    } finally {
      setIsDeleting(false);
    }
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
      await fetchCourses();
      console.log('✅ [SUCCESS] Courses refreshed');
    } catch (err) {
      console.error('❌ [ERROR] Refresh failed:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.courseDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteCourse(item.id, item.title)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error || '#ef4444'} />
        </TouchableOpacity>
      </View>
      <View style={styles.courseMeta}>
        {item.level && (
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>{item.level}</Text>
          </View>
        )}
        {item.language_code && (
          <View style={styles.metaBadge}>
            <Text style={styles.metaText}>{item.language_code.toUpperCase()}</Text>
          </View>
        )}
        <View style={[styles.metaBadge, styles.statusBadge]}>
          <Text style={styles.metaText}>{item.status || 'active'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <SkeletonList
      count={3}
      renderSkeleton={() => <CourseCardSkeleton />}
      containerStyle={styles.skeletonContainer}
      itemStyle={styles.skeletonItem}
    />
  );

  if (error) {
    return (
      <DashboardLayout>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error || '#ef4444'} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={async () => {
              console.log('🔄 [DEBUG] Retry button pressed');
              await fetchCourses();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Courses</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateCourse}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons name="add" size={24} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>

        {loading || isInitialLoad ? (
          renderSkeleton()
        ) : courses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No courses yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first course to get started
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateCourse}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.createButtonText}>Create Course</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={courses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={[
              styles.listContent,
              courses.length === 0 && { flexGrow: 1 }
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
          loading={isDeleting}
        />
      </View>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SIZES.padding,
  },
  courseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
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
    marginRight: SIZES.base,
  },
  courseTitle: {
    fontSize: SIZES.h3,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: SIZES.body,
    color: COLORS.gray[400],
  },
  deleteButton: {
    padding: 4,
  },
  courseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    backgroundColor: COLORS.primary + '30',
  },
  metaText: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
    fontWeight: '500',
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
