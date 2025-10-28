import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { Header, Button } from '../components';

const audioList = [
  { id: 1, title: 'Project Intro - v1', subtitle: 'Avatar: Alex, Emotion: Happy' },
  { id: 2, title: 'Happy Birthday Greeting', subtitle: 'Created on Oct 26, 2023' },
  { id: 3, title: 'Weekly Update Snippet', subtitle: 'Voice: Nova' },
];

const PastAudioListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="My Audio Library"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={COLORS.textLight} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {audioList.map(item => (
          <View key={item.id} style={styles.audioItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="play-circle" size={48} color={COLORS.primary} />
            </View>
            <View style={styles.audioInfo}>
              <Text style={styles.audioTitle}>{item.title}</Text>
              <Text style={styles.audioSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.buttons}>
              <Button title="Preview" variant="primary" size="small" style={styles.btn} />
              <Button title="Use" variant="secondary" size="small" style={styles.btn} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  scrollView: { flex: 1 },
  content: { padding: SIZES.padding, gap: 12 },
  audioItem: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 },
  iconContainer: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  audioInfo: { flex: 1 },
  audioTitle: { fontSize: SIZES.body1, fontWeight: '500', color: COLORS.textLight },
  audioSubtitle: { fontSize: SIZES.body3, color: COLORS.gray[400], marginTop: 4 },
  buttons: { flexDirection: 'row', gap: 8 },
  btn: { minWidth: 70 },
  searchButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
});

export default PastAudioListScreen;

