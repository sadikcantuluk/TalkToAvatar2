import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context';
import coursesAPI from '../services/coursesAPI';

export const useCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    console.log('🎯 [useCourses] fetchCourses called');
    console.log('🔑 [useCourses] Token exists:', !!token);

    if (!token) {
      console.error('❌ [useCourses] No authentication token');
      setError('No authentication token');
      return;
    }

    try {
      console.log('🔄 [useCourses] Setting loading state...');
      setLoading(true);
      setError(null);
      
      console.log('📤 [useCourses] Calling coursesAPI.getAll...');
      const data = await coursesAPI.getAll(token);
      
      console.log('✅ [useCourses] Courses fetched successfully');
      console.log('📊 [useCourses] Data type:', Array.isArray(data) ? 'array' : typeof data);
      console.log('📊 [useCourses] Data length:', Array.isArray(data) ? data.length : 'N/A');
      console.log('📦 [useCourses] Courses data:', JSON.stringify(data, null, 2));
      
      const coursesArray = Array.isArray(data) ? data : [];
      console.log('📝 [useCourses] Setting courses state:', coursesArray.length, 'courses');
      setCourses(coursesArray);
    } catch (err) {
      console.error('❌ [useCourses] Error fetching courses');
      console.error('❌ [useCourses] Error type:', err?.constructor?.name);
      console.error('❌ [useCourses] Error message:', err?.message);
      console.error('❌ [useCourses] Error response:', err?.response);
      console.error('❌ [useCourses] Full error:', JSON.stringify(err, null, 2));
      
      setError(err.message || 'Failed to fetch courses');
      setCourses([]);
    } finally {
      console.log('🏁 [useCourses] Clearing loading state');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const createCourse = useCallback(async (courseData) => {
    console.log('🎯 [useCourses] createCourse called');
    console.log('📊 [useCourses] Course data:', courseData);
    console.log('🔑 [useCourses] Token exists:', !!token);

    if (!token) {
      console.error('❌ [useCourses] No authentication token');
      throw new Error('No authentication token');
    }

    try {
      console.log('🔄 [useCourses] Setting loading state...');
      setLoading(true);
      
      console.log('📤 [useCourses] Calling coursesAPI.create...');
      const response = await coursesAPI.create(token, courseData);
      
      console.log('✅ [useCourses] Course created, response:', response);
      console.log('🔄 [useCourses] Refreshing courses list...');
      
      await fetchCourses(); // Refresh list
      
      console.log('✅ [useCourses] Courses list refreshed');
      return response;
    } catch (err) {
      console.error('❌ [useCourses] Error creating course');
      console.error('❌ [useCourses] Error type:', err?.constructor?.name);
      console.error('❌ [useCourses] Error message:', err?.message);
      console.error('❌ [useCourses] Error response:', err?.response);
      console.error('❌ [useCourses] Full error:', JSON.stringify(err, null, 2));
      throw err;
    } finally {
      console.log('🏁 [useCourses] Clearing loading state');
      setLoading(false);
    }
  }, [token, fetchCourses]);

  const updateCourse = useCallback(async (courseId, courseData) => {
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      setLoading(true);
      const response = await coursesAPI.update(token, courseId, courseData);
      await fetchCourses(); // Refresh list
      return response;
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCourses]);

  const deleteCourse = useCallback(async (courseId) => {
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      setLoading(true);
      await coursesAPI.delete(token, courseId);
      await fetchCourses(); // Refresh list
    } catch (err) {
      console.error('Error deleting course:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};

