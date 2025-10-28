import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { Header, Button } from '../components';

const audioList = [
  { id: 1, title: 'Project Intro - v1', date: 'Created: Oct 26, 2023', subtitle: 'Avatar: Alex, Emotion: Happy' },
  { id: 2, title: 'Happy Birthday Greeting', date: 'Created: Oct 26, 2023', subtitle: 'Voice: Nova' },
  { id: 3, title: 'Weekly Update Snippet', date: 'Created: Oct 25, 2023', subtitle: 'Voice: Nova' },
];

const PastAudioListScreen = ({ navigation }) => {
  const [audioItems, setAudioItems] = React.useState(audioList);

  const handleDelete = (id) => {
    setAudioItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Header
        title="My Audio Library"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.gray[400]} />
        <Text style={styles.searchPlaceholder}>Search audio by title</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {audioItems.map(item => (
          <View key={item.id} style={styles.audioCard}>
            <View style={styles.cardHeader}>
              <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>{item.title}</Text>
                <Text style={styles.audioDate}>{item.date}</Text>
                <Text style={styles.audioSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={styles.audioIcon}>
                <Ionicons name="musical-notes" size={32} color={COLORS.primary} />
              </View>
            </View>
            <View style={styles.cardActions}>
              <Button 
                title="Play" 
                variant="primary" 
                style={styles.actionBtn}
                icon={<Ionicons name="play-circle" size={20} color={COLORS.white} />}
              />
              <Button 
                title="Use" 
                variant="secondary" 
                style={styles.actionBtn}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 12, margin: SIZES.padding, padding: 12, backgroundColor: COLORS.gray[800], borderRadius: 12 },
  searchPlaceholder: { fontSize: SIZES.body2, color: COLORS.gray[400] },
  scrollView: { flex: 1 },
  content: { padding: SIZES.padding, gap: 16 },
  audioCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, gap: 16 },
  cardHeader: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  audioInfo: { flex: 1 },
  audioTitle: { fontSize: SIZES.body1, fontWeight: 'bold', color: COLORS.textLight },
  audioDate: { fontSize: SIZES.body3, color: COLORS.gray[400], marginTop: 4 },
  audioSubtitle: { fontSize: SIZES.body4, color: COLORS.gray[500], marginTop: 2 },
  audioIcon: { width: 64, height: 64, backgroundColor: 'rgba(19, 127, 236, 0.1)', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1 },
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

