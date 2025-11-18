/**
 * Query Cache Logger
 * Provides detailed logging for cache hits, misses, and performance metrics
 */

let cacheStats = {
  hits: 0,
  misses: 0,
  apiCalls: 0,
  cacheTime: {},
};

/**
 * Log cache hit
 */
export const logCacheHit = (queryKey) => {
  cacheStats.hits++;
  const key = queryKey.join('/');
  console.log(`🎯 [Cache] HIT: ${key}`);
  
  if (__DEV__) {
    cacheStats.cacheTime[key] = Date.now();
  }
};

/**
 * Log cache miss
 */
export const logCacheMiss = (queryKey) => {
  cacheStats.misses++;
  const key = queryKey.join('/');
  console.log(`❌ [Cache] MISS: ${key}`);
};

/**
 * Log API call
 */
export const logAPICall = (endpoint, duration) => {
  cacheStats.apiCalls++;
  console.log(`📤 [API] ${endpoint} - ${duration}ms`);
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  const hitRate = cacheStats.hits + cacheStats.misses > 0
    ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(2)
    : 0;
  
  return {
    ...cacheStats,
    hitRate: `${hitRate}%`,
    totalRequests: cacheStats.hits + cacheStats.misses,
  };
};

/**
 * Reset cache statistics
 */
export const resetCacheStats = () => {
  cacheStats = {
    hits: 0,
    misses: 0,
    apiCalls: 0,
    cacheTime: {},
  };
};

/**
 * Performance monitor wrapper
 */
export const withPerformanceMonitor = (fn, name) => {
  return async (...args) => {
    const startTime = Date.now();
    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;
      console.log(`⏱️ [Performance] ${name} - ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ [Performance] ${name} - ${duration}ms - Error:`, error);
      throw error;
    }
  };
};

