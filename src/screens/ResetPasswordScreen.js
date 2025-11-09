import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Input, Button } from '../components';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useNotifications } from '../context';
import authAPI from '../services/authAPI';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { showNotification } = useNotifications();

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasDigit && isLongEnough;
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    if (!validatePassword(password)) {
      showNotification(
        'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit',
        'error'
      );
      return;
    }

    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword(token, password);
      
      showNotification(
        response.message || 'Password reset successfully!',
        'success'
      );
      
      // Navigate to login
      navigation.replace('Login');
    } catch (error) {
      console.error('Reset password error:', error);
      showNotification(
        error.error || 'Failed to reset password. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your new password below
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="New Password"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <Text style={styles.passwordHint}>
          Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit
        </Text>

        <Button
          title={loading ? 'Resetting...' : 'Reset Password'}
          onPress={handleResetPassword}
          disabled={loading}
          style={styles.resetButton}
        />

        {loading && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={styles.loader}
          />
        )}
      </View>
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
  },
  form: {
    width: '100%',
  },
  passwordHint: {
    fontSize: 12,
    color: COLORS.textSecondary || '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 10,
  },
  loader: {
    marginTop: 10,
  },
});

export default ResetPasswordScreen;

