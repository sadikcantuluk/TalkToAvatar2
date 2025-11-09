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
} from 'react-native';
import { Input, Button } from '../components';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useNotifications } from '../context';
import authAPI from '../services/authAPI';

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
  
  const { showNotification } = useNotifications();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 digit
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasDigit && isLongEnough;
  };

  const handleRegister = async () => {
    // Clear previous errors
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    // Validation
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

    if (hasError) {
      return;
    }

    console.log('🔵 RegisterScreen: Starting registration process...');
    console.log('📝 Form data:', { 
      username: username.trim(), 
      email: email.trim(),
      passwordLength: password.length 
    });
    
    setLoading(true);
    try {
      console.log('⏳ RegisterScreen: Calling authAPI.register...');
      
      const response = await authAPI.register(
        username.trim(),
        email.trim(),
        password
      );
      
      console.log('✅ RegisterScreen: Registration successful!', response);
      
      showNotification(
        response.message || 'Registration successful! Please verify your email.',
        'success'
      );
      
      // Navigate to email verification screen
      navigation.navigate('EmailVerification', {
        userId: response.user_id,
        email: response.email,
        emailSent: response.email_sent !== false,
      });
    } catch (error) {
      console.error('❌ RegisterScreen: Registration error:', {
        error,
        message: error.message,
        code: error.code,
        name: error.name,
      });
      
      // User-friendly error messages
      let errorMessage = 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.';
      
      if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors.join(', ');
      } else if (error.response?.error) {
        const backendError = error.response.error;
        if (backendError.includes('already exists') || backendError.includes('taken')) {
          if (backendError.includes('email')) {
            errorMessage = 'Bu e-posta adresi zaten kullanılıyor. Lütfen farklı bir e-posta deneyin.';
          } else if (backendError.includes('username')) {
            errorMessage = 'Bu kullanıcı adı zaten alınmış. Lütfen farklı bir kullanıcı adı deneyin.';
          } else {
            errorMessage = backendError;
          }
        } else {
          errorMessage = backendError;
        }
      } else if (error.error) {
        errorMessage = error.error;
      } else if (error.message && !error.message.includes('status code')) {
        errorMessage = error.message;
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
      console.log('🔵 RegisterScreen: Process completed');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError('');
            }}
            autoCapitalize="none"
            editable={!loading}
            error={usernameError}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            error={emailError}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry
            editable={!loading}
            error={passwordError}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError('');
            }}
            secureTextEntry
            editable={!loading}
            error={confirmPasswordError}
          />

          <Text style={styles.passwordHint}>
            Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit
          </Text>

          <Button
            title={loading ? 'Creating Account...' : 'Sign Up'}
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.loader}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding || 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary || '#4A90E2',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text || '#666',
  },
  form: {
    width: '100%',
    marginBottom: 30,
  },
  passwordHint: {
    fontSize: 12,
    color: COLORS.textSecondary || '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 10,
  },
  loader: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text || '#666',
  },
  signInText: {
    fontSize: 14,
    color: COLORS.primary || '#4A90E2',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;

