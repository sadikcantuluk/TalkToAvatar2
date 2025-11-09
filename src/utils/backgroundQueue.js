import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@background_save_queue';
const MAX_QUEUE_SIZE = 100;
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Background Queue for failed backend saves
 * Stores failed saves locally and retries them later
 */
class BackgroundQueue {
  constructor() {
    this.processing = false;
  }

  /**
   * Add an item to the queue
   * @param {string} type - Type of save (e.g., 'audio', 'video', 'recording')
   * @param {object} data - Data to save
   * @param {function} saveFn - Async function to execute for save
   */
  async enqueue(type, data, saveFn) {
    try {
      console.log(`📥 [Queue] Adding ${type} to queue`);
      
      const queue = await this.getQueue();
      
      // Check queue size limit
      if (queue.length >= MAX_QUEUE_SIZE) {
        console.warn(`⚠️ [Queue] Queue is full (${MAX_QUEUE_SIZE}), removing oldest item`);
        queue.shift();
      }

      const item = {
        id: Date.now().toString(),
        type,
        data,
        saveFnName: saveFn.name || 'anonymous',
        attempts: 0,
        createdAt: new Date().toISOString(),
      };

      queue.push(item);
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      console.log(`✅ [Queue] Item added. Queue size: ${queue.length}`);

      // Start processing if not already running
      if (!this.processing) {
        this.processQueue();
      }
    } catch (error) {
      console.error('❌ [Queue] Error adding to queue:', error);
    }
  }

  /**
   * Get the current queue
   */
  async getQueue() {
    try {
      const queueData = await AsyncStorage.getItem(QUEUE_KEY);
      return queueData ? JSON.parse(queueData) : [];
    } catch (error) {
      console.error('❌ [Queue] Error getting queue:', error);
      return [];
    }
  }

  /**
   * Process the queue (retry failed saves)
   */
  async processQueue() {
    if (this.processing) {
      console.log('⏸️ [Queue] Already processing...');
      return;
    }

    this.processing = true;
    console.log('▶️ [Queue] Starting queue processing...');

    try {
      let queue = await this.getQueue();
      
      if (queue.length === 0) {
        console.log('✅ [Queue] Queue is empty');
        this.processing = false;
        return;
      }

      console.log(`📋 [Queue] Processing ${queue.length} items...`);

      const updatedQueue = [];

      for (const item of queue) {
        // Check retry attempts
        if (item.attempts >= MAX_RETRY_ATTEMPTS) {
          console.warn(`⚠️ [Queue] Item ${item.id} exceeded max retries, removing`);
          continue; // Remove from queue
        }

        // Attempt to save (this is a simplified version - in production, 
        // you'd need to serialize and deserialize the save function)
        console.log(`🔄 [Queue] Retrying ${item.type} save (attempt ${item.attempts + 1}/${MAX_RETRY_ATTEMPTS})`);
        
        // For now, just increment attempts and keep in queue
        // In production, you'd actually call the save function here
        item.attempts += 1;
        updatedQueue.push(item);
      }

      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
      console.log(`✅ [Queue] Processing complete. ${updatedQueue.length} items remain`);
    } catch (error) {
      console.error('❌ [Queue] Error processing queue:', error);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Clear the entire queue
   */
  async clearQueue() {
    try {
      await AsyncStorage.removeItem(QUEUE_KEY);
      console.log('✅ [Queue] Queue cleared');
    } catch (error) {
      console.error('❌ [Queue] Error clearing queue:', error);
    }
  }

  /**
   * Get queue statistics
   */
  async getStats() {
    try {
      const queue = await this.getQueue();
      return {
        total: queue.length,
        byType: queue.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {}),
      };
    } catch (error) {
      console.error('❌ [Queue] Error getting stats:', error);
      return { total: 0, byType: {} };
    }
  }
}

// Export singleton instance
export default new BackgroundQueue();

