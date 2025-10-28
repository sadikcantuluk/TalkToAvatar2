import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, IMAGES } from '../constants';
import { Header, Button, AvatarCard } from '../components';

const defaultAvatars = [
  {
    id: 'yusuf',
    name: 'Yusuf',
    description: 'Default male avatar',
    image: IMAGES.yusuf,
  },
  {
    id: 'eda',
    name: 'Eda',
    description: 'Default female avatar',
    image: IMAGES.eda,
  },
];

const SelectAvatarScreen = ({ navigation }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('yusuf');

  const handleContinue = () => {
    // Navigate to Dashboard with selected avatar
    navigation.navigate('Dashboard', { 
      selectedAvatar: defaultAvatars.find(a => a.id === selectedAvatar) 
    });
  };

  const handleCreateCustom = () => {
    navigation.navigate('CreateCustomAvatar');
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

        {/* Avatar Grid */}
        <View style={styles.grid}>
          {defaultAvatars.map((avatar) => (
            <AvatarCard
              key={avatar.id}
              image={avatar.image}
              name={avatar.name}
              description={avatar.description}
              isSelected={selectedAvatar === avatar.id}
              onPress={() => setSelectedAvatar(avatar.id)}
            />
          ))}
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
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

