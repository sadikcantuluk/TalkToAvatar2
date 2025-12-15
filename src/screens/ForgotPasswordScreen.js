import React, { useState } from 'react';
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.formTitle}>Şifre Sıfırlama</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {!emailSent ? (
          <View style={styles.form}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={64} color={THEME.primary} />
            </View>

            <Text style={styles.title}>Şifreni mi Unuttun?</Text>
            <Text style={styles.subtitle}>
              E-posta adresini gir, sana şifreni sıfırlaman için bir bağlantı gönderelim.
            </Text>

            <View style={styles.inputWrapper}>
              <Input
                placeholder="E-posta Adresin"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                inputStyle={styles.input}
                containerStyle={styles.inputContainer}
                placeholderTextColor={THEME.textSecondary}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Sıfırlama Bağlantısı Gönder</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <View style={[styles.iconContainer, { backgroundColor: '#DEF7EC' }]}>
              <Ionicons name="mail-open-outline" size={64} color={THEME.primary} />
            </View>

            <Text style={styles.successTitle}>E-posta Gönderildi!</Text>
            <Text style={styles.successText}>
              Şifre sıfırlama talimatlarını şu adrese gönderdik:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.noteText}>
              Eğer e-postayı gelen kutunda bulamazsan, spam klasörünü kontrol etmeyi unutma.
            </Text>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Tekrar Gönder</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backToLoginText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 100, // Move content up a bit
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(45, 127, 131, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  inputWrapper: {
    width: '100%',
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
  submitButton: {
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
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: THEME.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  backToLoginButton: {
    marginTop: 24,
  },
  backToLoginText: {
    color: THEME.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
