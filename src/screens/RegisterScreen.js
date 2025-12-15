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
import { Input, Button, ValidationMessage } from '../components';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useToast } from '../context';
import authAPI from '../services/authAPI';

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

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { success, error: showError } = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasDigit && isLongEnough;
  };

  const handleRegister = async () => {
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!username.trim()) {
      setUsernameError('Username is required');
      hasError = true;
    } else if (username.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await authAPI.register(
        username.trim(),
        email.trim(),
        password
      );

      success(response.message || 'Registration successful! Please verify your email.');

      navigation.navigate('EmailVerification', {
        userId: response.user_id,
        email: response.email,
        emailSent: response.email_sent !== false,
      });
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.';

      if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.join(', ');
      } else if (error.response?.error) {
        errorMessage = error.response.error;
      }

      showError(errorMessage);
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
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="school" size={48} color={THEME.primary} />
            </View>
            <Text style={styles.appName}>Sualingo</Text>
            <Text style={styles.subtitle}>Kayıt Ol</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Kullanıcı Adı"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setUsernameError('');
                }}
                autoCapitalize="none"
                editable={!loading}
                error={usernameError}
                inputStyle={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={THEME.textSecondary}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Input
                placeholder="E-posta"
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

            <View style={styles.inputWrapper}>
              <Input
                placeholder="Şifreyi Onayla"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError('');
                }}
                secureTextEntry
                editable={!loading}
                error={confirmPasswordError}
                inputStyle={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={THEME.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>

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
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: THEME.textSecondary,
    fontWeight: '500',
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
  registerButton: {
    backgroundColor: THEME.primary,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  loginText: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: THEME.primary,
    fontSize: 14,
    fontWeight: '600',
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

export default RegisterScreen;
