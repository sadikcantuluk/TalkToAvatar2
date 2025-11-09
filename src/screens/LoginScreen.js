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
import { useAuth } from '../context';
import { useNotifications } from '../context';
import authAPI from '../services/authAPI';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
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
      navigation.replace('Welcome');
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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email or Username"
            placeholder="Enter your email or username"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            error={emailError}
            inputStyle={styles.authInput}
            containerStyle={styles.authInputContainer}
            labelStyle={styles.authLabel}
            placeholderTextColor={COLORS.gray[500] || '#718096'}
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
            inputStyle={styles.authInput}
            containerStyle={styles.authInputContainer}
            labelStyle={styles.authLabel}
            placeholderTextColor={COLORS.gray[500] || '#718096'}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={loading}
            style={styles.loginButton}
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
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.primary || '#4A90E2',
    fontSize: 14,
  },
  loginButton: {
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
  signUpText: {
    fontSize: 14,
    color: COLORS.primary || '#4A90E2',
    fontWeight: 'bold',
  },
  authInputContainer: {
    marginBottom: SIZES.padding,
  },
  authInput: {
    color: COLORS.textDark || '#1A202C', // Dark text for better contrast on light backgrounds
  },
  authLabel: {
    color: COLORS.textDark || '#1A202C', // Dark label for better contrast on light backgrounds
  },
});

export default LoginScreen;

