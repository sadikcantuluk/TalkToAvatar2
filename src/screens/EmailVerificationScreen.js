import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
        navigation.replace('Dashboard');
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.formTitle}>Doğrulama</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark-outline" size={64} color={THEME.primary} />
        </View>

        <Text style={styles.title}>E-postanı Doğrula</Text>
        <Text style={styles.subtitle}>
          Lütfen <Text style={styles.emailText}>{email}</Text> adresine gönderilen 6 haneli kodu gir.
        </Text>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <Input
              placeholder="0 0 0 0 0 0"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                setCodeError('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
              inputStyle={[styles.input, styles.codeInput]}
              containerStyle={styles.inputContainer}
              placeholderTextColor={THEME.textSecondary}
              error={codeError}
            />
          </View>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading || resendLoading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>Doğrula ve Giriş Yap</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Kod gelmedi mi? </Text>
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
                  ? 'Gönderiliyor...'
                  : timer > 0
                    ? `Tekrar Gönder (${timer}s)`
                    : 'Tekrar Gönder'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(45, 127, 131, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emailText: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 24,
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
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 8,
  },
  verifyButton: {
    width: '100%',
    backgroundColor: THEME.primary,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: THEME.textSecondary,
  },
  resendText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: 'bold',
  },
  disabledText: {
    color: THEME.textSecondary,
    opacity: 0.6,
  },
});

export default EmailVerificationScreen;
