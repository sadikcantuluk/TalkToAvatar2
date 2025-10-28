import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { Header, Button } from '../components';

const videoList = [
  { id: 1, title: 'Welcome Message - Version 2', date: 'Created: Oct 26, 2023' },
  { id: 2, title: 'Product Update Q3', date: 'Created: Oct 24, 2023' },
  { id: 3, title: 'Monthly Sales Report', date: 'Created: Oct 22, 2023' },
];

const PastVideosListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Generated Videos"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.gray[400]} />
        <Text style={styles.searchPlaceholder}>Search videos by title</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {videoList.map(item => (
          <View key={item.id} style={styles.videoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.videoDate}>{item.date}</Text>
              </View>
              <View style={styles.thumbnail} />
            </View>
            <View style={styles.cardActions}>
              <Button 
                title="Watch" 
                variant="primary" 
                style={styles.actionBtn}
                icon={<Ionicons name="play-circle" size={20} color={COLORS.white} />}
                onPress={() => navigation.navigate('VideoViewing')}
              />
              <Button 
                title="Use" 
                variant="secondary" 
                style={styles.actionBtn}
                icon={<Ionicons name="create" size={20} color={COLORS.textLight} />}
              />
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
  videoCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, gap: 16 },
  cardHeader: { flexDirection: 'row', gap: 16 },
  videoInfo: { flex: 2 },
  videoTitle: { fontSize: SIZES.body1, fontWeight: 'bold', color: COLORS.textLight },
  videoDate: { fontSize: SIZES.body3, color: COLORS.gray[400], marginTop: 4 },
  thumbnail: { flex: 1, aspectRatio: 16/9, backgroundColor: COLORS.gray[700], borderRadius: 8 },
  cardActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1 },
});

export default PastVideosListScreen;

