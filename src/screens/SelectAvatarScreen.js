import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, IMAGES } from '../constants';
import { Header, Button } from '../components';

const CUSTOM_AVATARS_KEY = '@custom_avatars';

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
  const [selectedAvatar, setSelectedAvatar] = useState('yusuf');
  const [customAvatars, setCustomAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load custom avatars from AsyncStorage on mount
  useEffect(() => {
    loadCustomAvatars();
  }, []);

  const loadCustomAvatars = async () => {
    try {
      const savedAvatars = await AsyncStorage.getItem(CUSTOM_AVATARS_KEY);
      if (savedAvatars) {
        setCustomAvatars(JSON.parse(savedAvatars));
      }
    } catch (error) {
      console.error('Error loading custom avatars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomAvatars = async (avatars) => {
    try {
      await AsyncStorage.setItem(CUSTOM_AVATARS_KEY, JSON.stringify(avatars));
    } catch (error) {
      console.error('Error saving custom avatars:', error);
    }
  };

  // Check for new custom avatar whenever screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.customAvatar) {
        const newAvatar = route.params.customAvatar;
        console.log('New custom avatar received:', newAvatar);
        
        // Force immediate update
        setCustomAvatars(prevAvatars => {
          console.log('Current avatars count:', prevAvatars.length);
          const updatedAvatars = [...prevAvatars, newAvatar];
          console.log('Updated avatars count:', updatedAvatars.length);
          saveCustomAvatars(updatedAvatars);
          setSelectedAvatar(newAvatar.id);
          return updatedAvatars;
        });
        
        // Clear the param to prevent re-adding on next focus
        navigation.setParams({ customAvatar: undefined });
      }
    }, [route.params?.customAvatar, navigation])
  );

  const allAvatars = [...defaultAvatars, ...customAvatars];

  const handleContinue = () => {
    // Navigate back to the screen that called us, or Dashboard if none
    const avatar = allAvatars.find(a => a.id === selectedAvatar);
    const returnScreen = route.params?.returnScreen || 'Dashboard';
    
    if (navigation.canGoBack()) {
      navigation.navigate(returnScreen, { selectedAvatar: avatar });
    } else {
      navigation.navigate('Dashboard', { selectedAvatar: avatar });
    }
  };

  const handleCreateCustom = () => {
    navigation.navigate('CreateCustomAvatar');
  };

  const handleDeleteAvatar = (avatarId) => {
    const updatedAvatars = customAvatars.filter(a => a.id !== avatarId);
    setCustomAvatars(updatedAvatars);
    saveCustomAvatars(updatedAvatars);
    if (selectedAvatar === avatarId) {
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
          <Ionicons name="add-circle-outline" size={24} color={COLORS.textLight} />
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
        {customAvatars.length > 0 && (
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
      <View style={styles.footer}>
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
    backgroundColor: COLORS.backgroundDark,
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
    backgroundColor: COLORS.gray[800],
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  createButtonText: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 16,
  },
  sectionTitleSpaced: {
    marginTop: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  avatarWrapper: {
    flex: 1,
    minWidth: 158,
  },
  avatarCard: {
    flex: 1,
  },
  avatarCardSelected: {
    // Style handled in image container
  },
  avatarImageContainer: {
    width: '100%',
    height: 200, // Fixed height
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
    height: 200, // Fixed height to match container
    resizeMode: 'cover',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInfo: {
    marginTop: 12,
  },
  avatarName: {
    fontSize: SIZES.body1,
    fontWeight: '500',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  avatarDescription: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: 'rgba(16, 25, 34, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  continueButton: {
    width: '100%',
  },
});

export default SelectAvatarScreen;

