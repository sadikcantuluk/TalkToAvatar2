import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../components';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../context';
import { useNotifications } from '../context';
import authAPI from '../services/authAPI';

const ProfileScreen = ({ navigation }) => {
  const { user, token, logout, updateUser } = useAuth();
  const { showNotification } = useNotifications();
  
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const isLongEnough = password.length >= 8;
    
    return hasUpperCase && hasLowerCase && hasDigit && isLongEnough;
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      showNotification('Username cannot be empty', 'error');
      return;
    }

    if (username.trim().length < 3) {
      showNotification('Username must be at least 3 characters', 'error');
      return;
    }

    if (username.trim() === user?.username) {
      showNotification('Username is the same', 'info');
      setEditingUsername(false);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.updateProfile(token, username.trim());
      
      await updateUser(response.user);
      showNotification(
        response.message || 'Username updated successfully!',
        'success'
      );
      setEditingUsername(false);
    } catch (error) {
      console.error('Update username error:', error);
      const errorMessage = error.errors
        ? error.errors.join(', ')
        : error.error || 'Failed to update username';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotification('Please fill in all password fields', 'error');
      return;
    }

    if (!validatePassword(newPassword)) {
      showNotification(
        'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit',
        'error'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.changePassword(
        token,
        currentPassword,
        newPassword
      );
      
      showNotification(
        response.message || 'Password changed successfully!',
        'success'
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = error.errors
        ? error.errors.join(', ')
        : error.error || 'Failed to change password';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            showNotification('Logged out successfully', 'success');
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Second confirmation
            Alert.alert(
              'Final Confirmation',
              'This will permanently delete your account and all associated data including recordings, videos, and custom avatars.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete Forever',
                  style: 'destructive',
                  onPress: async () => {
                    setLoading(true);
                    try {
                      await authAPI.deleteAccount(token);
                      showNotification('Account deleted successfully', 'success');
                      await logout();
                      navigation.replace('Login');
                    } catch (error) {
                      console.error('Delete account error:', error);
                      showNotification(
                        error.error || 'Failed to delete account. Please try again.',
                        'error'
                      );
                    } finally {
                      setLoading(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary || '#137FEC'} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
          <Text style={styles.note}>Email cannot be changed</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Member Since</Text>
          <Text style={styles.value}>
            {user?.created_at ? formatDate(user.created_at) : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Username Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Username</Text>
        
        {editingUsername ? (
          <>
            <Input
              placeholder="Enter new username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => {
                  setUsername(user?.username || '');
                  setEditingUsername(false);
                }}
                disabled={loading}
                variant="outline"
                style={styles.halfButton}
              />
              <Button
                title={loading ? 'Saving...' : 'Save'}
                onPress={handleUpdateUsername}
                disabled={loading}
                style={styles.halfButton}
              />
            </View>
          </>
        ) : (
          <>
            <Text style={styles.currentValue}>{user?.username}</Text>
            <Button
              title="Change Username"
              onPress={() => setEditingUsername(true)}
              variant="outline"
            />
          </>
        )}
      </View>

      {/* Password Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Password</Text>
        
        {changingPassword ? (
          <>
            <Input
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              editable={!loading}
            />
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!loading}
            />
            <Input
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
            <Text style={styles.passwordHint}>
              Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 digit
            </Text>
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setChangingPassword(false);
                }}
                disabled={loading}
                variant="outline"
                style={styles.halfButton}
              />
              <Button
                title={loading ? 'Changing...' : 'Change'}
                onPress={handleChangePassword}
                disabled={loading}
                style={styles.halfButton}
              />
            </View>
          </>
        ) : (
          <Button
            title="Change Password"
            onPress={() => setChangingPassword(true)}
            variant="outline"
          />
        )}
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
        />
      </View>

      {/* Delete Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <Text style={styles.warningText}>
          Once you delete your account, there is no going back. All your data including recordings, videos, and custom avatars will be permanently deleted.
        </Text>
        <Button
          title="Delete Account"
          onPress={handleDeleteAccount}
          variant="danger"
        />
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#FFFFFF',
  },
  content: {
    padding: SIZES.padding || 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary || '#4A90E2',
    flex: 1,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text || '#333',
    marginBottom: 15,
  },
  infoRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary || '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.text || '#333',
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    color: COLORS.textSecondary || '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  currentValue: {
    fontSize: 18,
    color: COLORS.text || '#333',
    fontWeight: '600',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfButton: {
    flex: 1,
  },
  passwordHint: {
    fontSize: 12,
    color: COLORS.textSecondary || '#999',
    marginBottom: 15,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  warningText: {
    fontSize: 14,
    color: '#EF4444',
    lineHeight: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ProfileScreen;

