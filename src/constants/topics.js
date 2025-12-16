/**
 * Static list of topics available for courses
 * These topics are fixed and don't change, so we load them instantly
 * Progress information is fetched separately and merged with this list
 */

export const STATIC_TOPICS = [
  {
    topic: 'directions',
    title: 'Directions',
    description: 'Practice asking for and giving directions',
    icon: 'map',
    order: 1,
  },
  {
    topic: 'accommodation',
    title: 'Accommodation',
    description: 'Practice sentences for hotels and accommodation',
    icon: 'bed',
    order: 2,
  },
  {
    topic: 'greetings',
    title: 'Greetings',
    description: 'Practice basic greetings and introductions',
    icon: 'hand-left',
    order: 3,
  },
  {
    topic: 'ordering',
    title: 'Ordering',
    description: 'Practice ordering food and drinks',
    icon: 'restaurant',
    order: 4,
  },
  {
    topic: 'food',
    title: 'Food',
    description: 'Practice sentences about food and dining',
    icon: 'fast-food',
    order: 5,
  },
];

/**
 * Merge static topics with progress data from backend
 * @param {Array} progressData - Progress data from backend (subjects)
 * @returns {Array} Merged topics with progress information
 */
export const mergeTopicsWithProgress = (progressData = []) => {
  return STATIC_TOPICS.map(staticTopic => {
    const progressInfo = progressData.find(p => p.topic === staticTopic.topic);
    
    return {
      ...staticTopic,
      id: staticTopic.topic,
      progress: progressInfo?.progress_percentage || 0,
      progress_percentage: progressInfo?.progress_percentage || 0,
      total_sentences: progressInfo?.total_sentences || 0,
      completed_sentences: progressInfo?.completed_sentences || 0,
      completed: progressInfo?.completed || false,
      created_at: progressInfo?.created_at || null,
      updated_at: progressInfo?.updated_at || null,
    };
  });
};

