import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context';
import coursesAPI from '../services/coursesAPI';
import recordingsAPI from '../services/recordingsAPI';
import practiceSentencesAPI from '../services/practiceSentencesAPI';

export const useCourseProgress = (courseId) => {
  const { token } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateProgress = useCallback(async () => {
    if (!courseId || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch course data
      const course = await coursesAPI.getById(token, courseId);
      
      // Fetch course progress from API
      const progressData = await coursesAPI.getProgress(token, courseId).catch(() => null);
      
      if (progressData) {
        // Use API progress data
        setProgress({
          overallProgress: progressData.overall_progress || 0,
          subjectProgress: (progressData.topic_progress || []).map(tp => ({
            id: tp.topic,
            title: tp.title,
            progress: tp.progress || 0,
            completed: tp.completed_status || false,
          })),
          weeklyStats: {
            practices: progressData.weekly_stats?.practices || 0,
            avgScore: progressData.weekly_stats?.avg_score || 0,
            streak: 0, // Calculate if needed
          },
          recentActivities: [],
          totalSubjects: progressData.topic_progress?.length || 0,
          completedSubjects: (progressData.topic_progress || []).filter(tp => tp.completed_status).length,
          totalRecordings: progressData.completed_sentences || 0,
          totalReports: 0,
          totalAnalyses: 0,
        });
        return;
      }

      // Fallback: Calculate from related data
      const [subjects, videos, reports, analyses, recordings] = await Promise.all([
        coursesAPI.getSubjects(token, courseId).catch(() => []),
        coursesAPI.getVideos(token, courseId).catch(() => []),
        coursesAPI.getReports(token, courseId).catch(() => []),
        coursesAPI.getAnalyses(token, courseId).catch(() => []),
        coursesAPI.getRecordings(token, courseId).catch(() => []),
      ]);

      // Calculate overall progress from subjects (topics)
      const totalSubjects = Array.isArray(subjects) ? subjects.length : 0;
      const completedSubjects = Array.isArray(subjects) 
        ? subjects.filter(s => s.completed || s.completed_status).length 
        : 0;
      
      const overallProgress = totalSubjects > 0 
        ? (completedSubjects / totalSubjects) * 100 
        : 0;

      // Calculate weekly stats - use recordings instead of videos
      const allRecordings = Array.isArray(recordings) ? recordings : [];
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const weeklyRecordings = allRecordings.filter(r => {
        const createdAt = new Date(r.created_at || r.createdAt);
        return createdAt >= weekAgo;
      });

      const weeklyPractices = weeklyRecordings.length;
      const weeklyScores = weeklyRecordings
        .map(r => r.pronunciation_score || r.score || 0)
        .filter(s => s > 0);
      const weeklyAvgScore = weeklyScores.length > 0
        ? weeklyScores.reduce((a, b) => a + b, 0) / weeklyScores.length
        : 0;

      // Calculate streak (consecutive days with practice)
      const streak = calculateStreak(allRecordings);

      // Get recent activities (last 5 recordings)
      const recentActivities = allRecordings
        .sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt);
          const dateB = new Date(b.created_at || b.createdAt);
          return dateB - dateA;
        })
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          type: 'practice',
          title: r.sentence || r.title || 'Practice Session',
          score: r.pronunciation_score || r.score || 0,
          date: r.created_at || r.createdAt,
        }));

      // Subject progress
      const subjectProgress = Array.isArray(subjects) 
        ? subjects.map(s => ({
            id: s.id,
            title: s.title,
            progress: calculateSubjectProgress(s, allRecordings),
            completed: s.completed || s.status === 'completed',
          }))
        : [];

      setProgress({
        overallProgress: Math.round(overallProgress),
        subjectProgress,
        weeklyStats: {
          practices: weeklyPractices,
          avgScore: Math.round(weeklyAvgScore),
          streak,
        },
        recentActivities,
        totalSubjects,
        completedSubjects,
        totalRecordings: allRecordings.length,
        totalReports: Array.isArray(reports) ? reports.length : 0,
        totalAnalyses: Array.isArray(analyses) ? analyses.length : 0,
      });
    } catch (err) {
      console.error('Error calculating course progress:', err);
      setError(err.message || 'Failed to calculate progress');
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  const refresh = useCallback(() => {
    calculateProgress();
  }, [calculateProgress]);

  return {
    progress,
    loading,
    error,
    refresh,
  };
};

// Helper function to calculate streak
const calculateStreak = (recordings) => {
  if (!Array.isArray(recordings) || recordings.length === 0) return 0;

  const dates = recordings
    .map(r => {
      const date = new Date(r.created_at || r.createdAt);
      return date.toDateString();
    })
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));

  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toDateString();
  let currentDate = new Date(today);

  for (let i = 0; i < dates.length; i++) {
    const dateStr = currentDate.toDateString();
    if (dates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If today has no practice, check yesterday
      if (i === 0 && dateStr !== today) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
};

// Helper function to calculate subject progress
const calculateSubjectProgress = (subject, recordings) => {
  if (!subject || !Array.isArray(recordings)) return 0;
  
  // For now, return 0. This can be enhanced based on subject-specific recordings
  // when subject_id is added to recordings
  return 0;
};

