import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, ConfirmDialog } from '../components';
import { COLORS, SIZES } from '../constants/theme';
import { useAuth, useToast } from '../context';

const THEME = {
  primary: '#2D7F83',
  background: '#F0F9FA', // Light teal tint bg
  cardBg: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  danger: '#EF4444',
};

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { success } = useToast();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const handleLogout = async () => {
    setLogoutDialogVisible(false);
    await logout();
    success('Logged out successfully');
    navigation.replace('Login');
  };

  const toggleTheme = () => setIsDarkMode(previousState => !previousState);

  const ProfileMenuItem = ({ icon, title, onPress, showArrow = true, color = THEME.text }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={THEME.textSecondary} />
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color={THEME.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Ionicons name="arrow-back" size={24} color={THEME.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Settings & Profile</Text>
          <Text style={styles.headerSubtitle}>(Ayarlar ve Profil)</Text>
        </View>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.settingsIcon}
            onPress={() => Alert.alert('Settings', 'General settings would go here')}
          >
            <Ionicons name="settings-outline" size={24} color={THEME.textSecondary} />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            {/* Placeholder Avatar Image */}
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={48} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.username}>{user?.username || 'username'}</Text>

          {/* Theme Switch */}
          <View style={styles.themeRow}>
            <View style={styles.themeInfo}>
              <Ionicons name="contrast" size={24} color={THEME.textSecondary} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.themeTitle}>Tema Seçimi</Text>
                <Text style={styles.themeSubtitle}>(Koyu/Açık Mod)</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: THEME.primary }}
              thumbColor={isDarkMode ? "#FFFFFF" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <ProfileMenuItem
              icon="notifications-outline"
              title="Bildirim Ayarları"
              onPress={() => Alert.alert('Info', 'Notification settings')}
            />
            <View style={styles.divider} />

            <ProfileMenuItem
              icon="person-outline"
              title="Hesap Yönetimi"
              onPress={() => Alert.alert('Info', 'Account management')}
            />
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutDialogVisible(true)}
          >
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <ConfirmDialog
        visible={logoutDialogVisible}
        title="Logout"
        message="Are you sure you want to logout?"
        type="warning"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setLogoutDialogVisible(false)}
        overlayStyle={{ backgroundColor: 'transparent' }}
      />
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderButton: {
    width: 40,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827', // Darker gray for better contrast
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4B5563', // Darker gray for better contrast
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  avatarContainer: {
    marginBottom: 16,
    marginTop: 10,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#374151', // Dark grey placeholder
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 32,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  themeSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  menuContainer: {
    width: '100%',
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EF4444',
    width: '100%',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default ProfileScreen;
