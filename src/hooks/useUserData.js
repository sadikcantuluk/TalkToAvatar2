import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context';
import { getUserStorageKey } from '../utils/userStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import videosAPI from '../services/videosAPI';
import audiosAPI from '../services/audiosAPI';
import recordingsAPI from '../services/recordingsAPI';
import customAvatarsAPI from '../services/customAvatarsAPI';

/**
 * Centralized hook for user-scoped data fetching with automatic backend sync
 * This ensures all data is properly filtered by the authenticated user
 * 
 * @param {string} dataType - Type of data: 'videos', 'audios', 'recordings', 'customAvatars'
 * @param {object} options - Configuration options
 * @returns {object} - { data, loading, error, refresh, syncWithBackend }
 */
export const useUserData = (dataType, options = {}) => {
  const { token, user } = useAuth();
  const { autoSync = true, storageKey, transformBackendData, transformLocalData } = options;
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get storage key for this data type
  const getStorageKey = useCallback(() => {
    if (storageKey) return getUserStorageKey(storageKey, user?.id);
    
    const keyMap = {
      videos: '@video_history',
      audios: '@audio_history',
      recordings: '@sualingo_recordings_history',
      customAvatars: '@custom_avatars',
    };
    
    return getUserStorageKey(keyMap[dataType], user?.id);
  }, [dataType, user?.id, storageKey]);

  // Get API client for this data type
  const getAPIClient = useCallback(() => {
    const apiMap = {
      videos: videosAPI,
      audios: audiosAPI,
      recordings: recordingsAPI,
      customAvatars: customAvatarsAPI,
    };
    return apiMap[dataType];
  }, [dataType]);

  // Default transformers
  const defaultTransformers = {
    videos: (backendItem) => ({
      id: backendItem.id,
      backend_id: backendItem.id,
      name: backendItem.audio_info?.name || `Video ${backendItem.id.substring(0, 8)}`,
      text: backendItem.text,
      translatedText: backendItem.audio_info?.translated_text || backendItem.text,
      videoUri: backendItem.local_uri,
      videoUrl: backendItem.avatar_info?.video_url,
      voice: backendItem.audio_info?.voice_type || 'nova',
      language: backendItem.audio_info?.language_code || 'en',
      avatarName: backendItem.avatar_info?.name || 'Yusuf',
      createdAt: backendItem.created_at,
    }),
    audios: (backendItem) => ({
      id: backendItem.id,
      backend_id: backendItem.id,
      name: backendItem.avatar_name ? `${backendItem.avatar_name} audio` : `Audio ${backendItem.id.substring(0, 8)}`,
      text: backendItem.text,
      translatedText: backendItem.translated_text || backendItem.text,
      audioUri: backendItem.local_uri,
      voice: backendItem.voice_type || 'nova',
      language: backendItem.language_code || 'en',
      avatarName: backendItem.avatar_name || 'Yusuf',
      createdAt: backendItem.created_at,
    }),
    recordings: (backendItem) => {
      const date = new Date(backendItem.created_at);
      const dateStr = date.toISOString().split('T')[0];
      return {
        id: backendItem.id,
        backend_id: backendItem.id,
        name: `Level_${backendItem.level}_${dateStr}`,
        level: backendItem.level,
        sentence: backendItem.reference_text,
        reference_text: backendItem.reference_text,
        userTranscript: backendItem.transcript,
        user_transcript: backendItem.transcript,
        transcript: backendItem.transcript,
        pronunciationScore: backendItem.score,
        pronunciation_score: backendItem.score,
        score: backendItem.score,
        userAudioUri: backendItem.local_uri,
        referenceAudioUri: null,
        audioUri: backendItem.local_uri,
        language_code: backendItem.language_code,
        // Detailed pronunciation scores
        accuracy: backendItem.accuracy,
        accuracy_score: backendItem.accuracy,
        fluency: backendItem.fluency,
        fluency_score: backendItem.fluency,
        completeness: backendItem.completeness,
        completeness_score: backendItem.completeness,
        words: backendItem.words || [],
        word_level_details: backendItem.words || [],
        createdAt: backendItem.created_at,
      };
    },
    customAvatars: (backendItem) => ({
      id: backendItem.id,
      backend_id: backendItem.id,
      name: backendItem.avatar_name,
      description: 'Custom avatar',
      image: { uri: backendItem.local_uri },
      imageUri: backendItem.local_uri,
      isDefault: false,
    }),
  };

  // Sync with backend
  const syncWithBackend = useCallback(async () => {
    if (!token || !user?.id || !autoSync) {
      return { success: false, error: 'Not authenticated or autoSync disabled' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const apiClient = getAPIClient();
      const key = getStorageKey();
      
      if (!apiClient) {
        throw new Error(`No API client found for dataType: ${dataType}`);
      }

      // Fetch from backend
      console.log(`📤 Syncing ${dataType} from backend for user ${user.id}...`);
      const response = await apiClient.getAll(token);
      
      // Handle different response formats (array or wrapped in object)
      const backendData = Array.isArray(response) ? response : (response.data || response[dataType] || []);
      console.log(`✅ Backend ${dataType} loaded:`, backendData.length);

      // Transform backend data
      const transformer = transformBackendData || defaultTransformers[dataType];
      if (!transformer) {
        throw new Error(`No transformer found for dataType: ${dataType}`);
      }

      const transformedData = backendData.map(transformer);

      // Load local data
      const localDataStr = await AsyncStorage.getItem(key);
      const localData = localDataStr ? JSON.parse(localDataStr) : [];

      // Merge: backend data takes precedence, add any local-only items
      const backendIds = new Set(transformedData.map(item => item.backend_id || item.id));
      const localOnlyItems = localData.filter(item => {
        const itemId = item.backend_id || item.id;
        return !itemId || !backendIds.has(itemId);
      });

      const mergedData = [...transformedData, ...localOnlyItems];

      // Sort by createdAt (newest first)
      mergedData.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      // Save merged data to local storage
      await AsyncStorage.setItem(key, JSON.stringify(mergedData));
      setData(mergedData);
      
      console.log(`✅ ${dataType} synced. Total:`, mergedData.length);
      return { success: true, data: mergedData };
    } catch (err) {
      console.error(`⚠️ Error syncing ${dataType} from backend:`, err);
      setError(err);
      
      // Fallback to local data
      const key = getStorageKey();
      const localDataStr = await AsyncStorage.getItem(key);
      const localData = localDataStr ? JSON.parse(localDataStr) : [];
      setData(localData);
      
      return { success: false, error: err, data: localData };
    } finally {
      setLoading(false);
    }
  }, [token, user?.id, dataType, autoSync, getAPIClient, getStorageKey, transformBackendData]);

  // Load data from local storage
  const loadLocalData = useCallback(async () => {
    if (!user?.id) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const key = getStorageKey();
      const localDataStr = await AsyncStorage.getItem(key);
      const localData = localDataStr ? JSON.parse(localDataStr) : [];
      
      // Transform local data if transformer provided
      const transformed = transformLocalData 
        ? localData.map(transformLocalData)
        : localData;
      
      setData(transformed);
      setError(null);
    } catch (err) {
      console.error(`Error loading local ${dataType}:`, err);
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, getStorageKey, dataType, transformLocalData]);

  // Initial load: local first, then sync with backend if authenticated
  useEffect(() => {
    if (!user?.id) {
      setData([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      // Load local data first for instant display
      await loadLocalData();
      
      // Then sync with backend if authenticated and autoSync enabled
      if (token && user?.id && autoSync) {
        await syncWithBackend();
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, token, autoSync]);

  // Refresh function
  const refresh = useCallback(async () => {
    if (token && user?.id && autoSync) {
      return await syncWithBackend();
    } else {
      return await loadLocalData();
    }
  }, [token, user?.id, autoSync, syncWithBackend, loadLocalData]);

  return {
    data,
    loading,
    error,
    refresh,
    syncWithBackend,
    setData, // Allow manual updates
  };
};

