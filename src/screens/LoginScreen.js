import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../components';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../context';
import { useNotifications } from '../context';
import authAPI from '../services/authAPI';

// Local Theme Colors for Sualingo Design
const THEME = {
  primary: '#2D7F83',
  primaryDark: '#236568',
  background: '#FFFFFF',
  text: '#1A202C',
  textSecondary: '#718096',
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
  error: '#EF4444',
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();
  const { showNotification } = useNotifications();

  const handleLogin = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    // Validation
    if (!email.trim()) {
      setEmailError('Email or username is required');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(email.trim(), password);

      // Check if email is verified
      if (response.error && !response.email_verified) {
        showNotification(response.error, 'error');
        // Navigate to email verification screen
        navigation.navigate('EmailVerification', { userId: response.user_id });
        return;
      }

      // Login successful
      await login(response.token, response.user);
      showNotification('Login successful!', 'success');
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Login error:', error);

      // User-friendly error messages
      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.error === 'Invalid credentials' || error.error === 'Invalid credentials') {
        errorMessage = 'Kullanıcı adı veya şifreniz yanlış. Lütfen tekrar deneyin.';
      } else if (error.response?.error) {
        errorMessage = error.response.error;
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.message && !error.message.includes('status code')) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header / Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {/* Using a simpler icon approach as placeholder for Sualingo logo */}
              <Ionicons name="infinite" size={60} color={THEME.primary} style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
            <Text style={styles.appName}>Sualingo</Text>
          </View>

          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Input
                placeholder="E-posta veya Kullanıcı Adı"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                error={emailError}
                inputStyle={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={THEME.textSecondary}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Şifre"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                }}
                secureTextEntry
                editable={!loading}
                error={passwordError}
                inputStyle={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={THEME.textSecondary}
              />
            </View>

            {/* Remember Me & Forgot Password Row */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.rememberMeText}>Beni Hatırla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Hesabın yok mu? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 40,
  },
  logoContainer: {
    marginBottom: 16,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    backgroundColor: THEME.inputBg,
    borderWidth: 1,
    borderColor: THEME.inputBorder,
    borderRadius: 12,
    color: THEME.text,
    fontSize: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  loginButton: {
    backgroundColor: THEME.primary,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: THEME.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: THEME.primary,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: THEME.primary,
  },
  rememberMeText: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  registerText: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: THEME.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default LoginScreen;
