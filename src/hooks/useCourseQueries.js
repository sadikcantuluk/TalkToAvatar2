import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context';
import coursesAPI from '../services/coursesAPI';
import userTopicProgressAPI from '../services/userTopicProgressAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withPerformanceMonitor, logAPICall } from '../utils/queryCacheLogger';

/**
 * Custom hook for course data queries with React Query
 * Provides caching, background sync, and optimistic updates
 */

// Cache keys
export const courseKeys = {
  all: ['courses'],
  lists: () => [...courseKeys.all, 'list'],
  list: (userId) => [...courseKeys.lists(), userId],
  details: () => [...courseKeys.all, 'detail'],
  detail: (courseId) => [...courseKeys.details(), courseId],
  stats: (courseId) => [...courseKeys.all, 'stats', courseId],
  subjects: (courseId) => [...courseKeys.all, 'subjects', courseId],
  recordings: (courseId) => [...courseKeys.all, 'recordings', courseId],
  reports: (courseId) => [...courseKeys.all, 'reports', courseId],
  analyses: (courseId) => [...courseKeys.all, 'analyses', courseId],
  progress: (courseId) => [...courseKeys.all, 'progress', courseId],
  topicProgress: (courseId) => [...courseKeys.all, 'topicProgress', courseId],
};

/**
 * Get all courses for the current user
 */
export const useCourses = () => {
  const { token, user, logout } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: courseKeys.list(userId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log('📤 [useCourses] Fetching courses from API...');
      const startTime = Date.now();
      try {
        const data = await coursesAPI.getAll(token);
        const duration = Date.now() - startTime;
        logAPICall('GET /courses', duration);
        console.log('✅ [useCourses] Courses fetched:', data?.length || 0, `(${duration}ms)`);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        // Handle 401 Unauthorized - logout user
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useCourses] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        // Convert error object to string
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch courses';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, 'useCourses'),
    enabled: !!token && !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error?.message?.includes('Session expired') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get a specific course by ID
 */
export const useCourse = (courseId) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: courseKeys.detail(courseId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log(`📤 [useCourse] Fetching course ${courseId} from API...`);
      const startTime = Date.now();
      try {
        const data = await coursesAPI.getById(token, courseId);
        const duration = Date.now() - startTime;
        logAPICall(`GET /courses/${courseId}`, duration);
        console.log('✅ [useCourse] Course fetched:', data?.title, `(${duration}ms)`);
        return data;
      } catch (error) {
        // Handle 404 - course not found (might be deleted)
        if (error?.response?.status === 404 || error?.status === 404) {
          console.warn(`⚠️ [useCourse] Course ${courseId} not found (might be deleted)`);
          // Remove from cache and disable query
          queryClient.removeQueries(courseKeys.detail(courseId));
          throw new Error('Course not found');
        }
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useCourse] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch course';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, `useCourse-${courseId}`),
    enabled: !!token && !!courseId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on 404 or 401
      if (error?.message?.includes('Course not found') || 
          error?.message?.includes('Session expired') || 
          error?.message?.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get course subjects
 */
export const useCourseSubjects = (courseId) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: courseKeys.subjects(courseId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log(`📤 [useCourseSubjects] Fetching subjects for course ${courseId}...`);
      const startTime = Date.now();
      try {
        const data = await coursesAPI.getSubjects(token, courseId);
        const duration = Date.now() - startTime;
        logAPICall(`GET /courses/${courseId}/subjects`, duration);
        console.log('✅ [useCourseSubjects] Subjects fetched:', Array.isArray(data) ? data.length : 0, `(${duration}ms)`);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        // Handle 404 - course not found (might be deleted)
        if (error?.response?.status === 404 || error?.status === 404) {
          console.warn(`⚠️ [useCourseSubjects] Course ${courseId} not found (might be deleted)`);
          queryClient.removeQueries(courseKeys.subjects(courseId));
          return []; // Return empty array instead of throwing
        }
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useCourseSubjects] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch subjects';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, `useCourseSubjects-${courseId}`),
    enabled: !!token && !!courseId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Session expired') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      // Don't retry on 404
      if (error?.response?.status === 404 || error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get course recordings
 */
export const useCourseRecordings = (courseId) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: courseKeys.recordings(courseId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log(`📤 [useCourseRecordings] Fetching recordings for course ${courseId}...`);
      const startTime = Date.now();
      try {
        const data = await coursesAPI.getRecordings(token, courseId);
        const duration = Date.now() - startTime;
        logAPICall(`GET /courses/${courseId}/recordings`, duration);
        console.log('✅ [useCourseRecordings] Recordings fetched:', Array.isArray(data) ? data.length : 0, `(${duration}ms)`);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        // Handle 404 - course not found (might be deleted)
        if (error?.response?.status === 404 || error?.status === 404) {
          console.warn(`⚠️ [useCourseRecordings] Course ${courseId} not found (might be deleted)`);
          queryClient.removeQueries(courseKeys.recordings(courseId));
          return []; // Return empty array instead of throwing
        }
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useCourseRecordings] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch recordings';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, `useCourseRecordings-${courseId}`),
    enabled: !!token && !!courseId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Session expired') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      // Don't retry on 404
      if (error?.response?.status === 404 || error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get course reports
 */
export const useCourseReports = (courseId) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: courseKeys.reports(courseId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log(`📤 [useCourseReports] Fetching reports for course ${courseId}...`);
      const startTime = Date.now();
      try {
        const data = await coursesAPI.getReports(token, courseId);
        const duration = Date.now() - startTime;
        logAPICall(`GET /courses/${courseId}/reports`, duration);
        console.log('✅ [useCourseReports] Reports fetched:', Array.isArray(data) ? data.length : 0, `(${duration}ms)`);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        // Handle 404 - course not found (might be deleted)
        if (error?.response?.status === 404 || error?.status === 404) {
          console.warn(`⚠️ [useCourseReports] Course ${courseId} not found (might be deleted)`);
          queryClient.removeQueries(courseKeys.reports(courseId));
          return []; // Return empty array instead of throwing
        }
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useCourseReports] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch reports';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, `useCourseReports-${courseId}`),
    enabled: !!token && !!courseId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Session expired') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      // Don't retry on 404
      if (error?.response?.status === 404 || error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get course analyses
 */
export const useCourseAnalyses = (courseId) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: courseKeys.analyses(courseId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log(`📤 [useCourseAnalyses] Fetching analyses for course ${courseId}...`);
      const startTime = Date.now();
      try {
        const data = await coursesAPI.getAnalyses(token, courseId);
        const duration = Date.now() - startTime;
        logAPICall(`GET /courses/${courseId}/analyses`, duration);
        console.log('✅ [useCourseAnalyses] Analyses fetched', `(${duration}ms)`);
        return data;
      } catch (error) {
        // Handle 404 - course not found (might be deleted)
        if (error?.response?.status === 404 || error?.status === 404) {
          console.warn(`⚠️ [useCourseAnalyses] Course ${courseId} not found (might be deleted)`);
          queryClient.removeQueries(courseKeys.analyses(courseId));
          return null; // Return null instead of throwing
        }
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useCourseAnalyses] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch analyses';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, `useCourseAnalyses-${courseId}`),
    enabled: false, // Disabled: Analysis stat is computed from other stats, no need to fetch
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Session expired') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      // Don't retry on 404
      if (error?.response?.status === 404 || error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get course progress
 */
export const useCourseProgress = (courseId) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: courseKeys.progress(courseId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log(`📤 [useCourseProgress] Fetching progress for course ${courseId}...`);
      const startTime = Date.now();
      try {
        const data = await coursesAPI.getProgress(token, courseId);
        const duration = Date.now() - startTime;
        logAPICall(`GET /courses/${courseId}/progress`, duration);
        console.log('✅ [useCourseProgress] Progress fetched', `(${duration}ms)`);
        return data;
      } catch (error) {
        // Handle 404 - course not found (might be deleted)
        if (error?.response?.status === 404 || error?.status === 404) {
          console.warn(`⚠️ [useCourseProgress] Course ${courseId} not found (might be deleted)`);
          queryClient.removeQueries(courseKeys.progress(courseId));
          return null; // Return null instead of throwing
        }
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useCourseProgress] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch progress';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, `useCourseProgress-${courseId}`),
    enabled: !!token && !!courseId,
    staleTime: 1 * 60 * 1000, // 1 minute - progress changes more frequently
    cacheTime: 3 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Session expired') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      // Don't retry on 404
      if (error?.response?.status === 404 || error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Get topic progress for a course
 */
export const useTopicProgress = (courseId) => {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: courseKeys.topicProgress(courseId),
    queryFn: withPerformanceMonitor(async () => {
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log(`📤 [useTopicProgress] Fetching topic progress for course ${courseId}...`);
      const startTime = Date.now();
      try {
        const data = await userTopicProgressAPI.getByCourse(token, courseId);
        const duration = Date.now() - startTime;
        logAPICall(`GET /courses/${courseId}/topic_progress`, duration);
        console.log('✅ [useTopicProgress] Topic progress fetched', `(${duration}ms)`);
        return data;
      } catch (error) {
        // Handle 404 - course not found
        if (error?.response?.status === 404 || error?.status === 404) {
          console.warn(`⚠️ [useTopicProgress] Course ${courseId} not found`);
          queryClient.removeQueries(courseKeys.topicProgress(courseId));
          return { topic_progress: [] };
        }
        if (error?.response?.status === 401 || error?.status === 401 || error?.error === 'Unauthorized') {
          console.error('❌ [useTopicProgress] Unauthorized - logging out user');
          logout();
          throw new Error('Session expired. Please login again.');
        }
        const errorMessage = error?.response?.data?.error || error?.error || error?.message || 'Failed to fetch topic progress';
        throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }, `useTopicProgress-${courseId}`),
    enabled: !!token && !!courseId,
    staleTime: 30 * 1000, // 30 seconds - progress updates frequently
    cacheTime: 2 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Session expired') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      if (error?.response?.status === 404 || error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Update topic progress mutation
 */
export const useUpdateTopicProgress = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, topic }) => {
      console.log(`📤 [useUpdateTopicProgress] Updating topic progress for ${topic}...`);
      const response = await userTopicProgressAPI.update(token, courseId, topic);
      console.log('✅ [useUpdateTopicProgress] Topic progress updated');
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate topic progress and general progress to refetch
      queryClient.invalidateQueries(courseKeys.topicProgress(variables.courseId));
      queryClient.invalidateQueries(courseKeys.progress(variables.courseId));
      queryClient.invalidateQueries(courseKeys.subjects(variables.courseId));
    },
  });
};

/**
 * Create a new course (with optimistic update)
 */
export const useCreateCourse = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (courseData) => {
      console.log('📤 [useCreateCourse] Creating course...');
      const response = await coursesAPI.create(token, courseData);
      console.log('✅ [useCreateCourse] Course created:', response?.id);
      return response;
    },
    onMutate: async (newCourse) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries(courseKeys.list(userId));

      // Snapshot previous value
      const previous = queryClient.getQueryData(courseKeys.list(userId));

      // Optimistically update
      queryClient.setQueryData(courseKeys.list(userId), (old = []) => {
        const optimisticCourse = {
          ...newCourse,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        return [...old, optimisticCourse];
      });

      return { previous };
    },
    onError: (err, newCourse, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(courseKeys.list(userId), context.previous);
      }
      console.error('❌ [useCreateCourse] Error:', err);
    },
    onSuccess: (data) => {
      // Invalidate to refetch with real data
      queryClient.invalidateQueries(courseKeys.list(userId));
    },
  });
};

/**
 * Update a course (with optimistic update)
 */
export const useUpdateCourse = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ courseId, courseData }) => {
      console.log(`📤 [useUpdateCourse] Updating course ${courseId}...`);
      const response = await coursesAPI.update(token, courseId, courseData);
      console.log('✅ [useUpdateCourse] Course updated');
      return response;
    },
    onMutate: async ({ courseId, courseData }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries(courseKeys.detail(courseId));
      await queryClient.cancelQueries(courseKeys.list(userId));

      // Snapshot previous values
      const previousDetail = queryClient.getQueryData(courseKeys.detail(courseId));
      const previousList = queryClient.getQueryData(courseKeys.list(userId));

      // Optimistically update detail
      queryClient.setQueryData(courseKeys.detail(courseId), (old) => {
        if (!old) return old;
        return { ...old, ...courseData };
      });

      // Optimistically update list
      queryClient.setQueryData(courseKeys.list(userId), (old = []) => {
        return old.map((course) =>
          course.id === courseId ? { ...course, ...courseData } : course
        );
      });

      return { previousDetail, previousList };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousDetail) {
        queryClient.setQueryData(courseKeys.detail(variables.courseId), context.previousDetail);
      }
      if (context?.previousList) {
        queryClient.setQueryData(courseKeys.list(userId), context.previousList);
      }
      console.error('❌ [useUpdateCourse] Error:', err);
    },
    onSuccess: (data, variables) => {
      // Invalidate to refetch with real data
      queryClient.invalidateQueries(courseKeys.detail(variables.courseId));
      queryClient.invalidateQueries(courseKeys.list(userId));
    },
  });
};

/**
 * Delete a course (with optimistic update)
 * @param {Function} onMutateCallback - Optional callback to call after optimistic update
 */
export const useDeleteCourse = (onMutateCallback) => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (courseId) => {
      // Delete from backend - await but don't block UI (optimistic update already happened)
      console.log(`📤 [useDeleteCourse] Deleting course ${courseId} from backend...`);
      try {
        await coursesAPI.delete(token, courseId);
        console.log('✅ [useDeleteCourse] Course deleted from backend');
      } catch (error) {
        console.error('❌ [useDeleteCourse] Backend delete failed:', error);
        // Re-throw so onError can handle it and rollback
        throw error;
      }
    },
    onMutate: async (courseId) => {
      console.log(`🔄 [useDeleteCourse] Optimistically removing course ${courseId}...`);
      
      // Cancel all outgoing queries for this course
      await Promise.all([
        queryClient.cancelQueries(courseKeys.list(userId)),
        queryClient.cancelQueries(courseKeys.detail(courseId)),
        queryClient.cancelQueries(courseKeys.subjects(courseId)),
        queryClient.cancelQueries(courseKeys.recordings(courseId)),
        queryClient.cancelQueries(courseKeys.reports(courseId)),
        queryClient.cancelQueries(courseKeys.analyses(courseId)),
        queryClient.cancelQueries(courseKeys.progress(courseId)),
      ]);

      // Snapshot previous values
      const previousList = queryClient.getQueryData(courseKeys.list(userId));
      const previousDetail = queryClient.getQueryData(courseKeys.detail(courseId));
      const previousSubjects = queryClient.getQueryData(courseKeys.subjects(courseId));
      const previousRecordings = queryClient.getQueryData(courseKeys.recordings(courseId));
      const previousReports = queryClient.getQueryData(courseKeys.reports(courseId));
      const previousAnalyses = queryClient.getQueryData(courseKeys.analyses(courseId));
      const previousProgress = queryClient.getQueryData(courseKeys.progress(courseId));

      // Optimistically remove from list
      queryClient.setQueryData(courseKeys.list(userId), (old = []) => {
        return old.filter((course) => course.id !== courseId);
      });

      // Remove all course-related queries from cache immediately
      queryClient.removeQueries(courseKeys.detail(courseId));
      queryClient.removeQueries(courseKeys.subjects(courseId));
      queryClient.removeQueries(courseKeys.recordings(courseId));
      queryClient.removeQueries(courseKeys.reports(courseId));
      queryClient.removeQueries(courseKeys.analyses(courseId));
      queryClient.removeQueries(courseKeys.progress(courseId));

      console.log(`✅ [useDeleteCourse] Course ${courseId} removed from cache`);

      // Call optional callback (e.g., to navigate back)
      if (onMutateCallback) {
        onMutateCallback();
      }

      return { 
        previousList,
        previousDetail,
        previousSubjects,
        previousRecordings,
        previousReports,
        previousAnalyses,
        previousProgress,
      };
    },
    onError: (err, courseId, context) => {
      console.error('❌ [useDeleteCourse] Error deleting course:', err);
      
      // Rollback optimistic update on error
      if (context?.previousList) {
        queryClient.setQueryData(courseKeys.list(userId), context.previousList);
        console.log('🔄 [useDeleteCourse] Rolled back course list');
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(courseKeys.detail(courseId), context.previousDetail);
      }
      if (context?.previousSubjects) {
        queryClient.setQueryData(courseKeys.subjects(courseId), context.previousSubjects);
      }
      if (context?.previousRecordings) {
        queryClient.setQueryData(courseKeys.recordings(courseId), context.previousRecordings);
      }
      if (context?.previousReports) {
        queryClient.setQueryData(courseKeys.reports(courseId), context.previousReports);
      }
      if (context?.previousAnalyses) {
        queryClient.setQueryData(courseKeys.analyses(courseId), context.previousAnalyses);
      }
      if (context?.previousProgress) {
        queryClient.setQueryData(courseKeys.progress(courseId), context.previousProgress);
      }
      
      // Re-throw error so component can handle it
      throw err;
    },
    onSuccess: (data, courseId) => {
      console.log(`✅ [useDeleteCourse] Course ${courseId} successfully deleted`);
      // Don't invalidate - optimistic update already removed it from cache
      // Invalidating would cause a refetch and show skeleton
      // Just ensure cache is clean
      queryClient.removeQueries(courseKeys.detail(courseId));
      queryClient.removeQueries(courseKeys.subjects(courseId));
      queryClient.removeQueries(courseKeys.recordings(courseId));
      queryClient.removeQueries(courseKeys.reports(courseId));
      queryClient.removeQueries(courseKeys.analyses(courseId));
      queryClient.removeQueries(courseKeys.progress(courseId));
    },
  });
};

/**
 * Prefetch course data for better UX
 */
export const usePrefetchCourseData = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const prefetchCourse = async (courseId) => {
    if (!token || !courseId) return;

    console.log(`🔮 [usePrefetchCourseData] Prefetching course ${courseId}...`);
    
    // Prefetch all course-related data
    await Promise.all([
      queryClient.prefetchQuery(courseKeys.detail(courseId), () =>
        coursesAPI.getById(token, courseId)
      ),
      queryClient.prefetchQuery(courseKeys.subjects(courseId), () =>
        coursesAPI.getSubjects(token, courseId).catch(() => [])
      ),
      queryClient.prefetchQuery(courseKeys.recordings(courseId), () =>
        coursesAPI.getRecordings(token, courseId).catch(() => [])
      ),
      queryClient.prefetchQuery(courseKeys.reports(courseId), () =>
        coursesAPI.getReports(token, courseId).catch(() => [])
      ),
      queryClient.prefetchQuery(courseKeys.analyses(courseId), () =>
        coursesAPI.getAnalyses(token, courseId).catch(() => null)
      ),
    ]);

    console.log(`✅ [usePrefetchCourseData] Prefetch complete for course ${courseId}`);
  };

  return { prefetchCourse };
};

