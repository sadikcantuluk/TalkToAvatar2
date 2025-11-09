import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Input, Button } from '../components';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useNotifications } from '../context';
import authAPI from '../services/authAPI';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { showNotification } = useNotifications();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      showNotification('Please enter your email address', 'error');
      return;
    }

    if (!validateEmail(email.trim())) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(email.trim());
      
      showNotification(
        response.message || 'Password reset instructions sent to your email',
        'success'
      );
      setEmailSent(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      showNotification(
        error.error || 'Failed to send reset email. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          {emailSent
            ? 'Check your email for reset instructions'
            : 'Enter your email address and we\'ll send you instructions to reset your password'}
        </Text>
      </View>

      {!emailSent ? (
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            labelStyle={styles.authLabel}
            inputStyle={styles.authInput}
            placeholderTextColor={COLORS.gray[500] || '#718096'}
          />

          <Button
            title={loading ? 'Sending...' : 'Send Reset Link'}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.loader}
            />
          )}
        </View>
      ) : (
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✉️</Text>
          <Text style={styles.successText}>
            We've sent password reset instructions to:
          </Text>
          <Text style={styles.emailText}>{email}</Text>
          <Text style={styles.noteText}>
            If you don't see the email, check your spam folder.
          </Text>

          <Button
            title="Resend Email"
            onPress={handleSubmit}
            disabled={loading}
            style={styles.resendButton}
            variant="outline"
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#FFFFFF',
    padding: SIZES.padding || 20,
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text || '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    width: '100%',
    marginBottom: 30,
  },
  submitButton: {
    marginTop: 20,
  },
  loader: {
    marginTop: 10,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    color: COLORS.text || '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary || '#4A90E2',
    marginBottom: 20,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textSecondary || '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  resendButton: {
    width: '100%',
  },
  backButton: {
    alignSelf: 'center',
  },
  backText: {
    fontSize: 14,
    color: COLORS.textSecondary || '#999',
  },
  authLabel: {
    color: COLORS.textDark || '#1A202C', // Dark label for better contrast on light backgrounds
  },
  authInput: {
    color: COLORS.textDark || '#1A202C', // Dark text for better contrast on light backgrounds
  },
});

export default ForgotPasswordScreen;

