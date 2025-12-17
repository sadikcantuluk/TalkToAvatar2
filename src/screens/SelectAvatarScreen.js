import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, IMAGES } from '../constants';
import { Header, Button } from '../components';
import { useAuth } from '../context';
import customAvatarsAPI from '../services/customAvatarsAPI';
import { getUserStorageKey } from '../utils/userStorage';
import { useUserData } from '../hooks/useUserData';
import { AvatarGridItemSkeleton, SkeletonList } from '../components/SkeletonComponents';

const defaultAvatars = [
  {
    id: 'yusuf',
    name: 'Yusuf',
    description: 'Default male avatar',
    image: IMAGES.yusuf,
    isDefault: true,
  },
  {
    id: 'eda',
    name: 'Eda',
    description: 'Default female avatar',
    image: IMAGES.eda,
    isDefault: true,
  },
];

const SelectAvatarScreen = ({ navigation, route }) => {
  const { token, user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState('yusuf');
  const { data: customAvatars, loading: isLoading, setData: setCustomAvatars, refresh: refreshAvatars } = useUserData('customAvatars');
  const insets = useSafeAreaInsets();
  const returnScreenRef = React.useRef(route?.params?.returnScreen || 'Dashboard');

  const getCustomAvatarsKey = () => {
    return getUserStorageKey('@custom_avatars', user?.id);
  };

  const saveCustomAvatars = async (avatars) => {
    if (!user?.id) return;

    try {
      console.log('=== Saving Custom Avatars ===');
      console.log('Number of avatars to save:', avatars.length);
      console.log('Avatar details:', avatars.map(a => ({ id: a.id, name: a.name })));
      const key = getCustomAvatarsKey();
      await AsyncStorage.setItem(key, JSON.stringify(avatars));
      console.log('Avatars saved successfully to AsyncStorage');
    } catch (error) {
      console.error('Error saving custom avatars:', error);
      console.error('Error stack:', error.stack);
    }
  };

  // Check for new custom avatar whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const handleFocus = async () => {
        console.log('=== SelectAvatarScreen Focus ===');
        console.log('Route params:', route.params);

        // Reload custom avatars from storage to ensure we have the latest data
        await refreshAvatars();

        if (route.params?.customAvatar) {
          const newAvatar = route.params.customAvatar;
          console.log('New custom avatar received:', newAvatar.id, newAvatar.name);

          try {
            // Load current avatars from storage
            const key = getCustomAvatarsKey();
            const savedAvatars = await AsyncStorage.getItem(key);
            let currentAvatars = savedAvatars ? JSON.parse(savedAvatars) : [];
            console.log('Current avatars in storage:', currentAvatars.length);

            // Check if this avatar already exists (avoid duplicates)
            const exists = currentAvatars.some(a => a.id === newAvatar.id);
            console.log('Avatar already exists:', exists);

            if (!exists) {
              // Add new avatar to the list
              const updatedAvatars = [...currentAvatars, newAvatar];
              console.log('Adding new avatar. Total avatars:', updatedAvatars.length);

              // Save to storage
              await saveCustomAvatars(updatedAvatars);

              // Update state
              setCustomAvatars(updatedAvatars);
              setSelectedAvatar(newAvatar.id);

              console.log('Avatar added successfully');
            } else {
              // Avatar exists, just select it
              setSelectedAvatar(newAvatar.id);
              console.log('Avatar already exists, just selecting it');
            }
          } catch (error) {
            console.error('Error handling new custom avatar:', error);
          }

          // Clear the param to prevent re-adding on next focus
          navigation.setParams({ customAvatar: undefined });
        }
      };

      handleFocus();
    }, [route.params?.customAvatar])
  );

  const allAvatars = [...defaultAvatars, ...customAvatars];

  const handleContinue = () => {
    // Navigate back to the screen that called us, or Dashboard if none
    const avatar = allAvatars.find(a => a.id === selectedAvatar);
    const returnScreen = returnScreenRef.current || route.params?.returnScreen || 'Dashboard';

    if (navigation.canGoBack()) {
      navigation.navigate(returnScreen, { selectedAvatar: avatar });
    } else {
      navigation.navigate('Dashboard', { selectedAvatar: avatar });
    }
  };

  const handleCreateCustom = () => {
    navigation.navigate('CreateCustomAvatar', {
      returnScreen: returnScreenRef.current || route.params?.returnScreen || 'Dashboard',
    });
  };

  const handleDeleteAvatar = async (avatarId) => {
    console.log('=== Deleting Custom Avatar ===');
    console.log('Avatar ID to delete:', avatarId);
    console.log('Current avatars count:', customAvatars.length);

    const avatarToDelete = customAvatars.find(a => a.id === avatarId);

    // Delete from local storage
    const updatedAvatars = customAvatars.filter(a => a.id !== avatarId);
    console.log('Avatars after deletion:', updatedAvatars.length);

    setCustomAvatars(updatedAvatars);
    saveCustomAvatars(updatedAvatars);

    // Delete from backend if authenticated and backend_id exists
    if (token && user && avatarToDelete?.backend_id) {
      try {
        console.log('📤 Deleting custom avatar from backend...');
        await customAvatarsAPI.delete(token, avatarToDelete.backend_id);
        console.log('✅ Custom avatar deleted from backend');
      } catch (backendError) {
        console.error('⚠️ Backend delete failed:', backendError);
        Alert.alert('Warning', 'Avatar deleted locally but failed to delete from server');
      }
    } else if (!avatarToDelete?.backend_id) {
      console.log('⚠️ No backend_id found, avatar was only local');
    }

    if (selectedAvatar === avatarId) {
      console.log('Deleted avatar was selected, switching to default');
      setSelectedAvatar('yusuf');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Choose Your Avatar"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        containerStyle={{ backgroundColor: 'transparent' }}
        titleColor="#1F2937"
        iconColor="#1F2937"
      />

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Create Custom Avatar Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCustom}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={24} color="#1F2937" />
          <Text style={styles.createButtonText}>Create Your Own Avatar</Text>
        </TouchableOpacity>

        {/* Default Avatars */}
        <Text style={styles.sectionTitle}>Default Avatars</Text>
        <View style={styles.grid}>
          {defaultAvatars.map((avatar) => (
            <View key={avatar.id} style={styles.avatarWrapper}>
              <TouchableOpacity
                style={[
                  styles.avatarCard,
                  selectedAvatar === avatar.id && styles.avatarCardSelected,
                ]}
                onPress={() => setSelectedAvatar(avatar.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.avatarImageContainer,
                  selectedAvatar === avatar.id && styles.avatarImageSelected
                ]}>
                  <Image
                    source={avatar.image}
                    style={styles.avatarImage}
                    resizeMode="cover"
                    defaultSource={avatar.image}
                  />
                  {selectedAvatar === avatar.id && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={16} color={COLORS.white} />
                    </View>
                  )}
                </View>
                <View style={styles.avatarInfo}>
                  <Text style={styles.avatarName}>{avatar.name}</Text>
                  {avatar.description && (
                    <Text style={styles.avatarDescription}>{avatar.description}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Custom Avatars */}
        {isLoading ? (
          <>
            <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Custom Avatars</Text>
            <View style={styles.grid}>
              <SkeletonList
                count={2}
                renderSkeleton={() => (
                  <View style={styles.avatarWrapper}>
                    <AvatarGridItemSkeleton />
                  </View>
                )}
                containerStyle={styles.gridSkeleton}
                itemStyle={{ marginBottom: 0 }}
              />
            </View>
          </>
        ) : customAvatars.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>Custom Avatars</Text>
            <View style={styles.grid}>
              {customAvatars.map((avatar) => (
                <View key={avatar.id} style={styles.avatarWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.avatarCard,
                      selectedAvatar === avatar.id && styles.avatarCardSelected,
                    ]}
                    onPress={() => setSelectedAvatar(avatar.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.avatarImageContainer,
                      selectedAvatar === avatar.id && styles.avatarImageSelected
                    ]}>
                      <Image
                        source={avatar.image}
                        style={styles.avatarImage}
                        resizeMode="cover"
                        defaultSource={avatar.image}
                      />
                      {selectedAvatar === avatar.id && (
                        <View style={styles.checkBadge}>
                          <Ionicons name="checkmark" size={16} color={COLORS.white} />
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteAvatar(avatar.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close-circle" size={24} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.avatarInfo}>
                      <Text style={styles.avatarName}>{avatar.name}</Text>
                      {avatar.description && (
                        <Text style={styles.avatarDescription}>{avatar.description}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light Background
    paddingTop: 30, // Spacing for header
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radius,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  createButtonText: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: '#1F2937', // Dark Text
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: '#1F2937', // Dark Text
    marginBottom: 16,
  },
  sectionTitleSpaced: {
    marginTop: 24,
  },
  gridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    padding: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    width: '48%', // Ensures 2 avatars per row with some space between
    marginBottom: 16,
  },
  avatarCard: {
    flex: 1,
  },
  avatarCardSelected: {
    // Style handled in image container
  },
  avatarImageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  avatarImageSelected: {
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // Ensure consistent aspect ratio and prevent cropping issues
    borderRadius: 0,
  },
  checkBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInfo: {
    marginTop: 12,
  },
  avatarName: {
    fontSize: SIZES.body1,
    fontWeight: '500',
    color: '#1F2937', // Dark Text
    marginBottom: 4,
  },
  avatarDescription: {
    fontSize: SIZES.body3,
    color: COLORS.gray[500],
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    width: '100%',
  },
});

export default SelectAvatarScreen;
