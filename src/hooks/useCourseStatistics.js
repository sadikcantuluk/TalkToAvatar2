import { useMemo } from 'react';
import { useCourseSubjects, useCourseRecordings, useCourseReports, useCourseAnalyses } from './useCourseQueries';

/**
 * Computed statistics hook
 * Calculates statistics from cached data instead of making API calls
 * 
 * This eliminates the need for a separate statistics endpoint
 */
export const useCourseStatistics = (courseId) => {
  const subjectsQuery = useCourseSubjects(courseId);
  const recordingsQuery = useCourseRecordings(courseId);
  const reportsQuery = useCourseReports(courseId);
  const analysesQuery = useCourseAnalyses(courseId);

  const statistics = useMemo(() => {
    console.log('📊 [useCourseStatistics] Computing statistics from cache...');
    const startTime = Date.now();

    const subjects = subjectsQuery.data || [];
    const recordings = recordingsQuery.data || [];
    const reports = reportsQuery.data || [];
    const analyses = analysesQuery.data;

    // Calculate total recordings count from grouped structure
    const totalRecordings = Array.isArray(recordings) && recordings.length > 0
      ? recordings.reduce((total, topic) => {
          const topicRecordings = topic.sentences?.reduce((sum, sentence) => {
            return sum + (sentence.recordings?.length || 0);
          }, 0) || 0;
          return total + topicRecordings;
        }, 0)
      : 0;

    // Calculate total reports count from grouped structure (same as recordings)
    const totalReports = Array.isArray(reports) && reports.length > 0
      ? reports.reduce((total, topic) => {
          const topicReports = topic.sentences?.reduce((sum, sentence) => {
            return sum + (sentence.reports?.length || 0);
          }, 0) || 0;
          return total + topicReports;
        }, 0)
      : 0;

    const stats = {
      subjectsCount: subjects.length,
      recordingsCount: totalRecordings,
      reportsCount: totalReports,
      analysesCount: analyses ? 1 : 0,
      // Additional computed stats
      subjects: subjects,
      recordings: recordings,
      reports: reports,
      analyses: analyses,
    };

    const duration = Date.now() - startTime;
    console.log(`✅ [useCourseStatistics] Statistics computed in ${duration}ms:`, {
      subjectsCount: stats.subjectsCount,
      recordingsCount: stats.recordingsCount,
      reportsCount: stats.reportsCount,
      analysesCount: stats.analysesCount,
    });
    return stats;
  }, [
    subjectsQuery.data,
    recordingsQuery.data,
    reportsQuery.data,
    analysesQuery.data,
  ]);

  const loading = subjectsQuery.isLoading || 
                   recordingsQuery.isLoading || 
                   reportsQuery.isLoading || 
                   analysesQuery.isLoading;

  const error = subjectsQuery.error || 
                recordingsQuery.error || 
                reportsQuery.error || 
                analysesQuery.error;

  return {
    statistics,
    loading,
    error,
    // Individual query states for granular control
    subjectsQuery,
    recordingsQuery,
    reportsQuery,
    analysesQuery,
  };
};

