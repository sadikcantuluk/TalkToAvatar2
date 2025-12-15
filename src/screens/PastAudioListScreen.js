import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES } from '../constants';
import { Header, Button } from '../components';
import { AudioCardSkeleton, SkeletonList } from '../components/SkeletonComponents';
import { playAudio, stopAudio } from '../services/openAI';
import { useAuth } from '../context';
import audiosAPI from '../services/audiosAPI';
import { getUserStorageKey } from '../utils/userStorage';
import { useUserData } from '../hooks/useUserData';

const PastAudioListScreen = ({ navigation }) => {
  const { token, user } = useAuth();
  const { data: audioItems, loading: isLoading, refresh, setData: setAudioItems } = useUserData('audios');
  const [playingId, setPlayingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
      return () => {
        // Stop any playing audio when leaving screen
        stopAudio();
        setPlayingId(null);
      };
    }, [refresh])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Audio',
      'Are you sure you want to delete this audio?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('=== Deleting Audio ===');
              console.log('Audio ID:', id);

              const audioItem = audioItems.find(item => item.id === id);

              // Delete from local storage
              const updatedItems = audioItems.filter(item => item.id !== id);
              setAudioItems(updatedItems);
              const key = getUserStorageKey('@audio_history', user.id);
              await AsyncStorage.setItem(key, JSON.stringify(updatedItems));

              console.log('✅ Audio deleted locally. Remaining items:', updatedItems.length);

              // Delete from backend if authenticated and backend_id exists
              if (token && user && audioItem?.backend_id) {
                try {
                  console.log('📤 Deleting audio from backend...');
                  await audiosAPI.delete(token, audioItem.backend_id);
                  console.log('✅ Audio deleted from backend');
                } catch (backendError) {
                  console.error('⚠️ Backend delete failed:', backendError);
                  Alert.alert('Warning', 'Audio deleted locally but failed to delete from server');
                }
              } else if (!audioItem?.backend_id) {
                console.log('⚠️ No backend_id found, audio was only local');
              }

              if (playingId === id) {
                await stopAudio();
                setPlayingId(null);
              }
            } catch (error) {
              console.error('❌ Error deleting audio:', error);
              Alert.alert('Error', 'Failed to delete audio');
            }
          },
        },
      ]
    );
  };

  const handlePlay = async (item) => {
    try {
      console.log('=== Playing Audio from History ===');
      console.log('Audio ID:', item.id);
      console.log('Audio URI:', item.audioUri);

      if (playingId === item.id) {
        // Stop if already playing
        await stopAudio();
        setPlayingId(null);
      } else {
        // Stop any current playback
        if (playingId) {
          await stopAudio();
        }

        // Play new audio
        setPlayingId(item.id);
        const result = await playAudio(item.audioUri, () => {
          setPlayingId(null);
        });

        if (!result.success) {
          setPlayingId(null);
          Alert.alert('Error', 'Failed to play audio');
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingId(null);
      Alert.alert('Error', 'Failed to play audio');
    }
  };

  const handleUse = (item) => {
    console.log('=== Using Audio Parameters ===');
    console.log('Audio:', item.name);
    console.log('Parameters:', {
      name: item.name,
      text: item.text,
      voice: item.voice,
      language: item.language,
      avatarName: item.avatarName,
    });

    // Navigate back to TTS screen with this audio's parameters
    navigation.navigate('Dashboard', {
      loadAudio: item,
    });
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Audio Library</Text>
      </View>

      {isLoading ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <SkeletonList
            count={3}
            renderSkeleton={() => <AudioCardSkeleton />}
            itemStyle={{ marginBottom: 16 }}
          />
        </ScrollView>
      ) : audioItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={64} color={COLORS.gray[600]} />
          <Text style={styles.emptyTitle}>No Audio Yet</Text>
          <Text style={styles.emptyText}>Create your first audio in Text To Speech mode</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
        >
          {audioItems.map(item => (
            <View key={item.id} style={styles.audioCard}>
              <View style={styles.cardHeader}>
                <View style={styles.audioInfo}>
                  <Text style={styles.audioTitle}>{item.name}</Text>
                  <Text style={styles.audioDate}>Created: {formatDate(item.createdAt)}</Text>
                  <View style={styles.badgeContainer}>
                    <View style={styles.avatarBadge}>
                      <Ionicons name="person-circle-outline" size={14} color="#6B21A8" />
                      <Text style={styles.avatarBadgeText}>
                        {item.avatarName}
                      </Text>
                    </View>
                    <View style={styles.voiceBadge}>
                      <Ionicons name="mic-outline" size={14} color="#047857" />
                      <Text style={styles.voiceBadgeText}>
                        {item.voice}
                      </Text>
                    </View>
                  </View>
                  {item.text && (
                    <Text style={styles.audioText} numberOfLines={2}>
                      {item.text}
                    </Text>
                  )}
                </View>
                <View style={styles.audioIcon}>
                  <Ionicons
                    name={playingId === item.id ? "pause-circle" : "musical-notes"}
                    size={32}
                    color={playingId === item.id ? "#22c55e" : COLORS.primary}
                  />
                </View>
              </View>
              <View style={styles.cardActions}>
                <Button
                  title={playingId === item.id ? 'Stop' : 'Play'}
                  variant="primary"
                  style={styles.actionBtn}
                  onPress={() => handlePlay(item)}
                  icon={
                    <Ionicons
                      name={playingId === item.id ? "stop-circle" : "play-circle"}
                      size={20}
                      color={COLORS.white}
                    />
                  }
                />
                <Button
                  title="Use"
                  variant="secondary"
                  style={styles.actionBtn}
                  onPress={() => handleUse(item)}
                  icon={<Ionicons name="create" size={20} color={COLORS.textLight} />}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    paddingTop: 32, // Increased top padding for status bar spacing
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 24,
    paddingTop: 8,
    gap: 16
  },
  audioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start'
  },
  audioInfo: {
    flex: 1
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937'
  },
  audioDate: {
    fontSize: 12,
    color: '#4B5563', // Darker gray
    marginTop: 4
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  avatarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF', // Light Purple
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  avatarBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8', // Dark Purple
  },
  voiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5', // Light Green/Teal
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  voiceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857', // Dark Green
  },
  audioText: {
    fontSize: 14,
    color: '#1F2937', // Nearly black
    marginTop: 8,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  audioIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#E0F2F1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    height: 48,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PastAudioListScreen;
