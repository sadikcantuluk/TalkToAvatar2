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
      <Header
        title="My Audio Library"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

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
                  <Text style={styles.audioSubtitle}>
                    Avatar: {item.avatarName} • Voice: {item.voice}
                  </Text>
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
    backgroundColor: COLORS.backgroundDark 
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
    color: COLORS.textLight,
    marginTop: 16,
  },
  emptyText: {
    fontSize: SIZES.body2,
    color: COLORS.gray[400],
    textAlign: 'center',
    marginTop: 8,
  },
  scrollView: { 
    flex: 1 
  },
  content: { 
    padding: SIZES.padding, 
    gap: 16 
  },
  audioCard: { 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 12, 
    padding: 16, 
    gap: 16 
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
    fontSize: SIZES.body1, 
    fontWeight: 'bold', 
    color: COLORS.textLight 
  },
  audioDate: { 
    fontSize: SIZES.body3, 
    color: COLORS.gray[400], 
    marginTop: 4 
  },
  audioSubtitle: { 
    fontSize: SIZES.body4, 
    color: COLORS.gray[500], 
    marginTop: 2 
  },
  audioText: {
    fontSize: SIZES.body3,
    color: COLORS.gray[300],
    marginTop: 8,
    lineHeight: 20,
  },
  audioIcon: { 
    width: 64, 
    height: 64, 
    backgroundColor: 'rgba(19, 127, 236, 0.1)', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardActions: { 
    flexDirection: 'row', 
    gap: 8 
  },
  actionBtn: { 
    flex: 1 
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PastAudioListScreen;
