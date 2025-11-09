import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Input, Button } from '../components';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../context';
import { useNotifications } from '../context';
import authAPI from '../services/authAPI';

const EmailVerificationScreen = ({ navigation, route }) => {
  const { userId, email, emailSent = true } = route.params || {};
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // Error state
  const [codeError, setCodeError] = useState('');
  
  const { login } = useAuth();
  const { showNotification } = useNotifications();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    setCodeError('');

    if (!code.trim()) {
      setCodeError('Please enter the verification code');
      return;
    }

    if (code.trim().length !== 6) {
      setCodeError('Verification code must be 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyEmail(userId, code.trim());
      
      showNotification(
        response.message || 'Email verified successfully!',
        'success'
      );
      
      // Login with the returned token
      if (response.token && response.user) {
        await login(response.token, response.user);
        navigation.replace('Welcome');
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      // User-friendly error messages
      let errorMessage = 'Doğrulama başarısız oldu. Lütfen tekrar deneyin.';
      
      if (error.response?.error === 'Invalid verification code' || error.error === 'Invalid verification code') {
        errorMessage = 'Doğrulama kodu hatalı. Lütfen e-postanızı kontrol edip tekrar deneyin.';
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

  const handleResend = async () => {
    if (timer > 0) {
      showNotification(`Please wait ${timer} seconds before resending`, 'info');
      return;
    }

    setResendLoading(true);
    try {
      const response = await authAPI.resendVerification(userId);
      showNotification(
        response.message || 'Verification code sent successfully!',
        'success'
      );
      setTimer(60); // 60 seconds cooldown
    } catch (error) {
      console.error('Resend error:', error);
      showNotification(
        error.error || 'Failed to resend code. Please try again.',
        'error'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Verification Code"
          placeholder="Enter 6-digit code"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setCodeError('');
          }}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading}
          inputStyle={[styles.codeInput, styles.authInput]}
          labelStyle={styles.authLabel}
          placeholderTextColor={COLORS.gray[500] || '#718096'}
          error={codeError}
        />

        <Button
          title={loading ? 'Verifying...' : 'Verify Email'}
          onPress={handleVerify}
          disabled={loading || resendLoading}
          style={styles.verifyButton}
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
        <Text style={styles.footerText}>Didn't receive the code? </Text>
        <TouchableOpacity
          onPress={handleResend}
          disabled={loading || resendLoading || timer > 0}
        >
          <Text
            style={[
              styles.resendText,
              (loading || resendLoading || timer > 0) && styles.disabledText,
            ]}
          >
            {resendLoading
              ? 'Sending...'
              : timer > 0
              ? `Resend (${timer}s)`
              : 'Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
        disabled={loading || resendLoading}
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
  email: {
    fontWeight: 'bold',
    color: COLORS.primary || '#4A90E2',
  },
  form: {
    width: '100%',
    marginBottom: 30,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  verifyButton: {
    marginTop: 20,
  },
  loader: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.text || '#666',
  },
  resendText: {
    fontSize: 14,
    color: COLORS.primary || '#4A90E2',
    fontWeight: 'bold',
  },
  disabledText: {
    color: COLORS.textSecondary || '#999',
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

export default EmailVerificationScreen;

