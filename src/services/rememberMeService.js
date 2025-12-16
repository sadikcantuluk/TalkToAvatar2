import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys for Remember Me functionality
const REMEMBER_ME_KEY = '@sualingo_remember_me';
const SAVED_EMAIL_KEY = '@sualingo_saved_email';
const SAVED_PASSWORD_KEY = '@sualingo_saved_password';

const rememberMeService = {
  /**
   * Save credentials for Remember Me
   * @param {string} email - User email
   * @param {string} password - User password
   */
  saveCredentials: async (email, password) => {
    try {
      await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
      await AsyncStorage.setItem(SAVED_EMAIL_KEY, email);
      await AsyncStorage.setItem(SAVED_PASSWORD_KEY, password);
      console.log('✅ Credentials saved for Remember Me');
    } catch (error) {
      console.error('❌ Error saving credentials:', error);
    }
  },

  /**
   * Get saved credentials
   * @returns {Promise<object>} Saved email and password
   */
  getSavedCredentials: async () => {
    try {
      const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);

      if (rememberMe === 'true') {
        const email = await AsyncStorage.getItem(SAVED_EMAIL_KEY);
        const password = await AsyncStorage.getItem(SAVED_PASSWORD_KEY);

        console.log('✅ Retrieved saved credentials');
        return { email, password, rememberMe: true };
      }

      return { email: '', password: '', rememberMe: false };
    } catch (error) {
      console.error('❌ Error getting saved credentials:', error);
      return { email: '', password: '', rememberMe: false };
    }
  },

  /**
   * Clear saved credentials
   */
  clearSavedCredentials: async () => {
    try {
      await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      await AsyncStorage.removeItem(SAVED_EMAIL_KEY);
      await AsyncStorage.removeItem(SAVED_PASSWORD_KEY);
      console.log('✅ Saved credentials cleared');
    } catch (error) {
      console.error('❌ Error clearing credentials:', error);
    }
  },
};

export default rememberMeService;
