import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get user-specific storage key
 * @param {string} baseKey - Base storage key (e.g., '@video_history')
 * @param {string|null} userId - User ID (optional, if not provided returns base key)
 * @returns {string} User-specific storage key
 */
export const getUserStorageKey = (baseKey, userId) => {
  if (!userId) {
    return baseKey;
  }
  return `${baseKey}_${userId}`;
};

/**
 * Clear all user-specific data for a given user
 * @param {string} userId - User ID
 */
export const clearUserData = async (userId) => {
  if (!userId) return;
  
  const keys = [
    getUserStorageKey('@video_history', userId),
    getUserStorageKey('@audio_history', userId),
    getUserStorageKey('@sualingo_recordings_history', userId),
    getUserStorageKey('@custom_avatars', userId),
    getUserStorageKey('@notifications', userId),
  ];

  try {
    await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
    console.log('✅ Cleared user-specific data for user:', userId);
  } catch (error) {
    console.error('⚠️ Error clearing user data:', error);
  }
};

/**
 * Clear all old global storage keys (migration helper)
 * This should be called once to migrate from global to user-specific keys
 */
export const clearOldGlobalKeys = async () => {
  const oldKeys = [
    '@video_history',
    '@audio_history',
    '@sualingo_recordings_history',
    '@custom_avatars',
    '@notifications',
  ];

  try {
    await Promise.all(oldKeys.map(key => AsyncStorage.removeItem(key)));
    console.log('✅ Cleared old global storage keys');
  } catch (error) {
    console.error('⚠️ Error clearing old global keys:', error);
  }
};

