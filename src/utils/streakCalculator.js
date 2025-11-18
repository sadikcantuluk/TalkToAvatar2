/**
 * Streak Calculator Utility
 * Calculates consecutive days with practice from recordings
 */

/**
 * Calculate streak from recordings
 * Streak = consecutive days with at least one practice, starting from today or yesterday
 * 
 * @param {Array} recordings - Array of recording objects with created_at or createdAt
 * @returns {number} - Number of consecutive days with practice
 */
export const calculateStreak = (recordings) => {
  if (!Array.isArray(recordings) || recordings.length === 0) return 0;

  // Extract unique dates from recordings
  const dates = recordings
    .map(r => {
      const date = new Date(r.created_at || r.createdAt || r.date);
      if (isNaN(date.getTime())) return null;
      return date.toDateString();
    })
    .filter(date => date !== null)
    .filter((date, index, self) => self.indexOf(date) === index) // Unique dates
    .sort((a, b) => new Date(b) - new Date(a)); // Sort descending (newest first)

  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date().toDateString();
  let currentDate = new Date(today);

  // Check if today has practice, if not start from yesterday
  if (!dates.includes(today)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Count consecutive days
  for (let i = 0; i < dates.length; i++) {
    const dateStr = currentDate.toDateString();
    if (dates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // If we're checking today and it's not in dates, continue to yesterday
      if (i === 0 && dateStr !== today) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
};

/**
 * Calculate streak from grouped recordings structure
 * Used when recordings are grouped by topic/sentence
 * 
 * @param {Array} groupedRecordings - Array of topic objects with sentences containing recordings
 * @returns {number} - Number of consecutive days with practice
 */
export const calculateStreakFromGrouped = (groupedRecordings) => {
  if (!Array.isArray(groupedRecordings) || groupedRecordings.length === 0) return 0;

  // Flatten all recordings from grouped structure
  const allRecordings = [];
  groupedRecordings.forEach(topic => {
    if (topic.sentences && Array.isArray(topic.sentences)) {
      topic.sentences.forEach(sentence => {
        if (sentence.recordings && Array.isArray(sentence.recordings)) {
          allRecordings.push(...sentence.recordings);
        }
      });
    }
  });

  return calculateStreak(allRecordings);
};

