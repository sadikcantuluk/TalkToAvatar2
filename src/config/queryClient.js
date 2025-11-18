import { QueryClient } from '@tanstack/react-query';
import { logCacheHit, logCacheMiss, logAPICall } from '../utils/queryCacheLogger';

/**
 * React Query Client Configuration
 * 
 * Optimized for course data caching with:
 * - Stale-while-revalidate pattern
 * - Background refetching
 * - Automatic cache management
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - data is fresh for 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
      retry: 3, // Retry failed requests 3 times
      refetchOnWindowFocus: true, // Refetch when app comes to foreground
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: false, // Don't refetch if data exists in cache
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
    mutations: {
      retry: 1, // Retry mutations once on failure
      retryDelay: 1000,
    },
  },
});

// Enhanced debug logging with cache tracking
if (__DEV__) {
  // Track query cache events
  queryClient.getQueryCache().subscribe((event) => {
    const query = event?.query;
    if (!query) return;

    const queryKey = query.queryKey.join('/');
    const status = query.state.status;
    const dataUpdatedAt = query.state.dataUpdatedAt;
    const isStale = query.isStale();

    switch (event.type) {
      case 'added':
        console.log(`➕ [QueryCache] ADDED: ${queryKey}`);
        break;
      case 'updated':
        if (status === 'success' && dataUpdatedAt) {
          const cacheAge = Date.now() - dataUpdatedAt;
          if (cacheAge < 2000) {
            // Fresh data (less than 2 seconds old)
            logCacheHit(query.queryKey);
          } else if (!isStale) {
            // Cached but not stale
            logCacheHit(query.queryKey);
          } else {
            // Stale, will refetch
            logCacheMiss(query.queryKey);
          }
        }
        console.log(`🔄 [QueryCache] ${queryKey} - ${status}${isStale ? ' (stale)' : ''}`);
        break;
      case 'removed':
        console.log(`➖ [QueryCache] REMOVED: ${queryKey}`);
        break;
      case 'observerAdded':
        console.log(`👁️ [QueryCache] OBSERVER ADDED: ${queryKey}`);
        break;
      case 'observerRemoved':
        console.log(`👁️ [QueryCache] OBSERVER REMOVED: ${queryKey}`);
        break;
    }
  });

  // Track mutation events
  queryClient.getMutationCache().subscribe((event) => {
    const mutation = event?.mutation;
    if (!mutation) return;

    const mutationKey = mutation.options.mutationKey?.join('/') || 'unknown';
    
    switch (event.type) {
      case 'added':
        console.log(`➕ [MutationCache] ADDED: ${mutationKey}`);
        break;
      case 'updated':
        console.log(`🔄 [MutationCache] ${mutationKey} - ${mutation.state.status}`);
        break;
    }
  });

  // Log cache statistics periodically
  setInterval(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    const staleQueries = queries.filter(q => q.isStale());
    
    console.log(`📊 [CacheStats] Total: ${queries.length}, Stale: ${staleQueries.length}, Fresh: ${queries.length - staleQueries.length}`);
  }, 30000); // Every 30 seconds
}

