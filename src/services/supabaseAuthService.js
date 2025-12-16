import { supabase } from '../config/supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Storage keys for Remember Me functionality
const REMEMBER_ME_KEY = '@sualingo_remember_me';
const SAVED_EMAIL_KEY = '@sualingo_saved_email';
const SAVED_PASSWORD_KEY = '@sualingo_saved_password';

const supabaseAuthService = {
    /**
     * Sign up with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {object} metadata - Additional user metadata (username, etc.)
     * @returns {Promise<object>} User data and session
     */
    signUp: async (email, password, metadata = {}) => {
        try {
            console.log('🚀 Starting Supabase sign up:', { email, metadata });

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata, // Store username and other metadata
                },
            });

            if (error) {
                console.error('❌ Sign up failed:', error);
                throw error;
            }

            console.log('✅ Sign up successful:', data);
            return {
                user: data.user,
                session: data.session,
                message: 'Registration successful! Please check your email to verify your account.',
            };
        } catch (error) {
            console.error('❌ Sign up error:', error);
            throw error;
        }
    },

    /**
     * Sign in with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<object>} User data and session
     */
    signIn: async (email, password) => {
        try {
            console.log('🚀 Starting Supabase sign in:', { email });

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('❌ Sign in failed:', error);
                throw error;
            }

            console.log('✅ Sign in successful:', data);
            return {
                user: data.user,
                session: data.session,
            };
        } catch (error) {
            console.error('❌ Sign in error:', error);
            throw error;
        }
    },

    /**
   * Sign in with Google OAuth
   * Uses deep linking to handle the OAuth callback
   * @returns {Promise<object>} User data and session
   */
    signInWithGoogle: async () => {
        try {
            console.log('🚀 Starting Google OAuth sign in');

            // Return a promise that resolves when the deep link callback is received
            return new Promise(async (resolve, reject) => {
                let linkingListener = null;
                let timeoutId = null;

                try {
                    // Set up the deep link listener BEFORE opening the browser
                    linkingListener = Linking.addEventListener('url', async (event) => {
                        console.log('🔗 Deep link received:', event.url);

                        try {
                            // Clear timeout if link received
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                            }

                            const url = event.url;
                            let accessToken = null;
                            let refreshToken = null;

                            // Parse tokens from URL (#access_token=... or ?access_token=...)
                            if (url.includes('#')) {
                                const fragment = url.split('#')[1];
                                const params = new URLSearchParams(fragment);
                                accessToken = params.get('access_token');
                                refreshToken = params.get('refresh_token');
                            } else if (url.includes('?')) {
                                const query = url.split('?')[1];
                                const params = new URLSearchParams(query);
                                accessToken = params.get('access_token');
                                refreshToken = params.get('refresh_token');
                            }

                            if (accessToken) {
                                console.log('✅ Tokens extracted, setting session...');

                                // Set the session
                                const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                                    access_token: accessToken,
                                    refresh_token: refreshToken,
                                });

                                if (sessionError) {
                                    console.error('❌ Session error:', sessionError);
                                    reject(sessionError);
                                } else {
                                    console.log('✅ Google OAuth successful!');
                                    resolve({
                                        user: sessionData.user,
                                        session: sessionData.session,
                                    });
                                }
                            } else {
                                console.error('❌ No tokens in callback URL');
                                reject(new Error('No access token in callback'));
                            }
                        } catch (error) {
                            console.error('❌ Error processing callback:', error);
                            reject(error);
                        } finally {
                            // Clean up listener
                            if (linkingListener) {
                                linkingListener.remove();
                            }
                        }
                    });

                    // Get the app's custom scheme URL for callback
                    // Use the production scheme instead of exp:// scheme
                    const redirectUrl = 'talktoavatar://auth/callback';
                    console.log('🔗 Redirect URL:', redirectUrl);

                    // Get OAuth URL from Supabase
                    const { data, error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: redirectUrl,
                            skipBrowserRedirect: true,
                        },
                    });

                    if (error) {
                        console.error('❌ OAuth init failed:', error);
                        if (linkingListener) {
                            linkingListener.remove();
                        }
                        reject(error);
                        return;
                    }

                    if (!data?.url) {
                        if (linkingListener) {
                            linkingListener.remove();
                        }
                        reject(new Error('No OAuth URL from Supabase'));
                        return;
                    }

                    console.log('🌐 Opening browser for OAuth...');

                    // Open the OAuth URL in the default browser
                    // User will complete OAuth, and then be redirected back to the app via deep link
                    await WebBrowser.openBrowserAsync(data.url);

                    // Set a timeout (5 minutes) in case user doesn't complete the flow
                    timeoutId = setTimeout(() => {
                        console.log('⏱️ OAuth timeout');
                        if (linkingListener) {
                            linkingListener.remove();
                        }
                        reject(new Error('OAuth timed out - please try again'));
                    }, 300000);

                } catch (error) {
                    console.error('❌ OAuth setup error:', error);
                    if (linkingListener) {
                        linkingListener.remove();
                    }
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    reject(error);
                }
            });
        } catch (error) {
            console.error('❌ Google OAuth error:', error);
            throw error;
        }
    },

    /**
     * Sign out current user
     * @returns {Promise<void>}
     */
    signOut: async () => {
        try {
            console.log('🚀 Signing out');

            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('❌ Sign out failed:', error);
                throw error;
            }

            console.log('✅ Sign out successful');
        } catch (error) {
            console.error('❌ Sign out error:', error);
            throw error;
        }
    },

    /**
     * Send password reset email
     * @param {string} email - User email
     * @returns {Promise<object>} Success message
     */
    resetPasswordRequest: async (email) => {
        try {
            console.log('🚀 Requesting password reset for:', email);

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: Linking.createURL('/reset-password'),
            });

            if (error) {
                console.error('❌ Password reset request failed:', error);
                throw error;
            }

            console.log('✅ Password reset email sent');
            return {
                message: 'Password reset email sent! Please check your inbox.',
            };
        } catch (error) {
            console.error('❌ Password reset request error:', error);
            throw error;
        }
    },

    /**
     * Update user password
     * @param {string} newPassword - New password
     * @returns {Promise<object>} Success message
     */
    updatePassword: async (newPassword) => {
        try {
            console.log('🚀 Updating password');

            const { data, error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                console.error('❌ Password update failed:', error);
                throw error;
            }

            console.log('✅ Password updated successfully');
            return {
                message: 'Password updated successfully!',
            };
        } catch (error) {
            console.error('❌ Password update error:', error);
            throw error;
        }
    },

    /**
     * Get current session
     * @returns {Promise<object>} Current session
     */
    getSession: async () => {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('❌ Get session failed:', error);
                throw error;
            }

            return data.session;
        } catch (error) {
            console.error('❌ Get session error:', error);
            throw error;
        }
    },

    /**
     * Get current user
     * @returns {Promise<object>} Current user
     */
    getCurrentUser: async () => {
        try {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error('❌ Get user failed:', error);
                throw error;
            }

            return data.user;
        } catch (error) {
            console.error('❌ Get user error:', error);
            throw error;
        }
    },

    /**
     * Listen to auth state changes
     * @param {function} callback - Callback function for auth state changes
     * @returns {object} Subscription object
     */
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Auth state changed:', event);
            callback(event, session);
        });
    },

    // ==================== Remember Me Functionality ====================

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

export default supabaseAuthService;
