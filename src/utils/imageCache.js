import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const CACHE_KEY_PREFIX = '@gemini_avatar_cache_';
const CACHE_METADATA_KEY = '@gemini_cache_metadata';
const MAX_CACHE_SIZE = 50; // Maximum number of cached items
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const LARGE_VALUE_THRESHOLD = 300_000; // ~300KB JSON threshold for AsyncStorage/CursorWindow safety

/**
 * Image Cache for Gemini API responses
 * Caches generated avatars to avoid redundant API calls
 */
class ImageCache {
  /**
   * Generate a cache key from image data and prompt
   * @param {string} imageBase64 - Base64 encoded image
   * @param {string} prompt - Generation prompt
   * @returns {string} Cache key
   */
  generateCacheKey(imageBase64, prompt = '') {
    // Stable key: hash of inputs (no timestamp). This allows actual cache hits.
    const imageHash = imageBase64.substring(0, 300);
    const combined = imageHash + '::' + (prompt || '');
    
    // Simple hash function with limited length
    let hash = 0;
    const maxLength = 200; // Limit input length for hashing
    for (let i = 0; i < Math.min(combined.length, maxLength); i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 3) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `${CACHE_KEY_PREFIX}${Math.abs(hash).toString(36)}`; // Base36 for shorter key
  }

  async _writeLargeResultToFile(cacheKey, result) {
    const dir = `${FileSystem.cacheDirectory}gemini-avatar-cache/`;
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => null);
    const fileUri = `${dir}${cacheKey.replace(CACHE_KEY_PREFIX, '')}.json`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(result), {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return fileUri;
  }

  async _readLargeResultFromFile(fileUri) {
    const raw = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return JSON.parse(raw);
  }

  /**
   * Get cached avatar generation result
   * @param {string} imageBase64 - Base64 encoded image
   * @param {string} prompt - Generation prompt
   * @returns {Promise<object|null>} Cached result or null
   */
  async get(imageBase64, prompt = '') {
    try {
      const cacheKey = this.generateCacheKey(imageBase64, prompt);
      console.log(`🔍 [Cache] Checking cache for key: ${cacheKey.substring(0, 50)}...`);
      
      const cached = await AsyncStorage.getItem(cacheKey);
      if (!cached) {
        console.log('❌ [Cache] Cache miss');
        return null;
      }

      const data = JSON.parse(cached);
      
      // Check if cache is expired
      const now = Date.now();
      if (now - data.timestamp > CACHE_EXPIRY_MS) {
        console.log('⚠️ [Cache] Cache expired, removing...');
        await this.remove(cacheKey);
        return null;
      }

      console.log('✅ [Cache] Cache hit! Age:', Math.floor((now - data.timestamp) / 1000 / 60), 'minutes');
      
      // Update access time in metadata
      await this.updateAccessTime(cacheKey);
      
      // Support large results stored in FileSystem
      if (data.resultFileUri) {
        try {
          return await this._readLargeResultFromFile(data.resultFileUri);
        } catch (e) {
          console.warn('⚠️ [Cache] Failed to read cached file, treating as miss:', e?.message || e);
          await this.remove(cacheKey);
          return null;
        }
      }

      return data.result;
    } catch (error) {
      console.error('❌ [Cache] Error getting from cache:', error);
      // Android CursorWindow "Row too big" should be treated as cache miss
      if (String(error?.message || '').includes('CursorWindow')) {
        return null;
      }
      return null;
    }
  }

  /**
   * Save avatar generation result to cache
   * @param {string} imageBase64 - Base64 encoded image
   * @param {string} prompt - Generation prompt
   * @param {object} result - Generation result to cache
   */
  async set(imageBase64, prompt = '', result) {
    try {
      const cacheKey = this.generateCacheKey(imageBase64, prompt);
      console.log(`💾 [Cache] Saving to cache: ${cacheKey.substring(0, 50)}...`);
      
      const base = {
        timestamp: Date.now(),
        imageHashLength: imageBase64.length,
        prompt: prompt.substring(0, 100), // Store first 100 chars for reference
      };

      const resultJson = JSON.stringify(result);
      let data = { ...base, result };

      // If too large, store result in FileSystem and keep only URI in AsyncStorage
      if (resultJson.length > LARGE_VALUE_THRESHOLD) {
        const fileUri = await this._writeLargeResultToFile(cacheKey, result);
        data = { ...base, resultFileUri: fileUri, resultSize: resultJson.length };
      }

      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      console.log('✅ [Cache] Successfully cached result');
      
      // Update metadata
      await this.addToMetadata(cacheKey);
      
      // Clean up old caches if needed
      await this.cleanupOldCaches();
    } catch (error) {
      // Silently handle cache errors - don't expose to user
      if (error.message && error.message.includes('database or disk is full')) {
        console.warn('⚠️ [Cache] Storage full, clearing old cache entries...');
        await this.clearAll();
      } else if (String(error?.message || '').includes('CursorWindow')) {
        // Treat as non-fatal; cache is best-effort
        console.warn('⚠️ [Cache] CursorWindow row-too-big, skipping cache write');
      } else {
        console.error('❌ [Cache] Error saving to cache:', error);
      }
    }
  }

  /**
   * Remove a specific cache entry
   * @param {string} cacheKey - Cache key to remove
   */
  async remove(cacheKey) {
    try {
      await AsyncStorage.removeItem(cacheKey);
      await this.removeFromMetadata(cacheKey);
      console.log('🗑️ [Cache] Removed cache entry');
    } catch (error) {
      console.error('❌ [Cache] Error removing from cache:', error);
    }
  }

  /**
   * Get cache metadata (list of all cache keys with timestamps)
   */
  async getMetadata() {
    try {
      const metadata = await AsyncStorage.getItem(CACHE_METADATA_KEY);
      return metadata ? JSON.parse(metadata) : [];
    } catch (error) {
      console.error('❌ [Cache] Error getting metadata:', error);
      return [];
    }
  }

  /**
   * Add cache key to metadata
   */
  async addToMetadata(cacheKey) {
    try {
      const metadata = await this.getMetadata();
      const existing = metadata.find(m => m.key === cacheKey);
      
      if (existing) {
        existing.lastAccess = Date.now();
      } else {
        metadata.push({
          key: cacheKey,
          created: Date.now(),
          lastAccess: Date.now(),
        });
      }
      
      await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('❌ [Cache] Error adding to metadata:', error);
    }
  }

  /**
   * Remove cache key from metadata
   */
  async removeFromMetadata(cacheKey) {
    try {
      const metadata = await this.getMetadata();
      const filtered = metadata.filter(m => m.key !== cacheKey);
      await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('❌ [Cache] Error removing from metadata:', error);
    }
  }

  /**
   * Update last access time for a cache entry
   */
  async updateAccessTime(cacheKey) {
    try {
      const metadata = await this.getMetadata();
      const entry = metadata.find(m => m.key === cacheKey);
      if (entry) {
        entry.lastAccess = Date.now();
        await AsyncStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
      }
    } catch (error) {
      console.error('❌ [Cache] Error updating access time:', error);
    }
  }

  /**
   * Clean up old caches (LRU - Least Recently Used)
   */
  async cleanupOldCaches() {
    try {
      const metadata = await this.getMetadata();
      
      if (metadata.length <= MAX_CACHE_SIZE) {
        return; // No cleanup needed
      }

      console.log(`🧹 [Cache] Cleaning up old caches (${metadata.length}/${MAX_CACHE_SIZE})`);
      
      // Sort by last access time (oldest first)
      metadata.sort((a, b) => a.lastAccess - b.lastAccess);
      
      // Remove oldest entries
      const toRemove = metadata.length - MAX_CACHE_SIZE;
      for (let i = 0; i < toRemove; i++) {
        await this.remove(metadata[i].key);
        console.log(`🗑️ [Cache] Removed old cache entry: ${metadata[i].key.substring(0, 50)}...`);
      }
      
      console.log(`✅ [Cache] Cleanup complete. Remaining: ${MAX_CACHE_SIZE}`);
    } catch (error) {
      console.error('❌ [Cache] Error cleaning up caches:', error);
    }
  }

  /**
   * Clear all caches
   */
  async clearAll() {
    try {
      const metadata = await this.getMetadata();
      for (const entry of metadata) {
        await AsyncStorage.removeItem(entry.key);
      }
      await AsyncStorage.removeItem(CACHE_METADATA_KEY);
      console.log('✅ [Cache] All caches cleared');
    } catch (error) {
      console.error('❌ [Cache] Error clearing all caches:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats() {
    try {
      const metadata = await this.getMetadata();
      const now = Date.now();
      
      return {
        total: metadata.length,
        maxSize: MAX_CACHE_SIZE,
        expiryDays: Math.floor(CACHE_EXPIRY_MS / (24 * 60 * 60 * 1000)),
        entries: metadata.map(m => ({
          key: m.key.substring(0, 50) + '...',
          ageMinutes: Math.floor((now - m.created) / 1000 / 60),
          lastAccessMinutes: Math.floor((now - m.lastAccess) / 1000 / 60),
        })),
      };
    } catch (error) {
      console.error('❌ [Cache] Error getting stats:', error);
      return { total: 0, maxSize: MAX_CACHE_SIZE, entries: [] };
    }
  }
}

// Export singleton instance
export default new ImageCache();
