import AsyncStorage from '@react-native-async-storage/async-storage';

const JOB_KEY_PREFIX = '@video_creation_job';

/**
 * @typedef {Object} VideoCreationJob
 * @property {string} jobId
 * @property {'idle'|'running'|'succeeded'|'failed'|'cancelled'} status
 * @property {'generating_speech'|'uploading_audio'|'uploading_avatar'|'generating_video'|'downloading_video'|'saving'|null} step
 * @property {string} message
 * @property {string} startedAt
 * @property {string} updatedAt
 * @property {string=} error
 * @property {Object=} result
 */

const nowIso = () => new Date().toISOString();

const getJobKey = (userId) => `${JOB_KEY_PREFIX}_${userId}`;

class VideoCreationJobService {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.listenersByUserId = new Map();
    /** @type {Map<string, Promise<any>>} */
    this.runningByUserId = new Map();
  }

  subscribe(userId, listener) {
    if (!userId) return () => {};
    const set = this.listenersByUserId.get(userId) || new Set();
    set.add(listener);
    this.listenersByUserId.set(userId, set);
    return () => {
      const current = this.listenersByUserId.get(userId);
      if (!current) return;
      current.delete(listener);
      if (current.size === 0) this.listenersByUserId.delete(userId);
    };
  }

  async getJob(userId) {
    if (!userId) return null;
    try {
      const raw = await AsyncStorage.getItem(getJobKey(userId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[VideoCreationJob] Failed to read job:', e?.message || e);
      return null;
    }
  }

  async clearJob(userId) {
    if (!userId) return;
    await AsyncStorage.removeItem(getJobKey(userId));
    this._emit(userId, null);
  }

  async _setJob(userId, job) {
    await AsyncStorage.setItem(getJobKey(userId), JSON.stringify(job));
    this._emit(userId, job);
  }

  _emit(userId, job) {
    const set = this.listenersByUserId.get(userId);
    if (!set) return;
    set.forEach((fn) => {
      try {
        fn(job);
      } catch (e) {
        // ignore listener errors
      }
    });
  }

  /**
   * Runs the workflow and persists progress. Prevents concurrent runs per user.
   */
  async start({
    userId,
    workflow,
    initialMessage = "Video creation started. We'll notify you when it's ready.",
  }) {
    if (!userId) {
      throw new Error('Missing userId');
    }
    if (this.runningByUserId.has(userId)) {
      throw new Error('A video creation is already in progress');
    }

    const jobId = `${Date.now()}`;
    const baseJob = {
      jobId,
      status: 'running',
      step: null,
      message: initialMessage,
      startedAt: nowIso(),
      updatedAt: nowIso(),
    };

    await this._setJob(userId, baseJob);

    const runPromise = (async () => {
      try {
        const update = async (step, message) => {
          const current = (await this.getJob(userId)) || baseJob;
          const next = {
            ...current,
            status: 'running',
            step,
            message,
            updatedAt: nowIso(),
          };
          await this._setJob(userId, next);
        };

        const result = await workflow({ update });

        const done = {
          ...(await this.getJob(userId)),
          status: 'succeeded',
          updatedAt: nowIso(),
          result: result || null,
        };
        await this._setJob(userId, done);
        return done;
      } catch (e) {
        const failed = {
          ...(await this.getJob(userId)),
          status: 'failed',
          updatedAt: nowIso(),
          error: e?.message || String(e),
        };
        await this._setJob(userId, failed);
        throw e;
      } finally {
        this.runningByUserId.delete(userId);
      }
    })();

    this.runningByUserId.set(userId, runPromise);
    return runPromise;
  }
}

export const videoCreationJobService = new VideoCreationJobService();


