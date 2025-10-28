import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { Button, Header } from '../components';

const VideoViewingScreen = ({ navigation, route }) => {
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleExport = () => {
    setExporting(true);
    // Simulate export
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          setSaved(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <View style={styles.container}>
      <Header
        title=""
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.title}>My First Avatar Video</Text>
        
        <View style={styles.videoContainer}>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={40} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: '25%' }]} />
            <View style={styles.progressHandle} />
          </View>
          <View style={styles.timeLabels}>
            <Text style={styles.timeText}>0:37</Text>
            <Text style={styles.timeText}>2:23</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        {!saved && !exporting && (
          <Button title="Export to Gallery" onPress={handleExport} variant="primary" />
        )}

        {exporting && (
          <View style={styles.exportingContainer}>
            <View style={styles.exportHeader}>
              <Text style={styles.exportText}>Exporting...</Text>
              <Text style={styles.exportPercentage}>{exportProgress}%</Text>
            </View>
            <View style={styles.exportProgressBar}>
              <View style={[styles.exportProgress, { width: `${exportProgress}%` }]} />
            </View>
            <Text style={styles.exportMessage}>Please wait, this may take a moment.</Text>
          </View>
        )}

        {saved && (
          <Button 
            title="Saved to Gallery!" 
            variant="primary" 
            style={styles.savedButton}
            icon={<Ionicons name="checkmark-circle" size={24} color={COLORS.white} />}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  content: { flex: 1, paddingHorizontal: SIZES.padding },
  title: { fontSize: SIZES.h2, fontWeight: 'bold', color: COLORS.textLight, marginBottom: 16 },
  videoContainer: { aspectRatio: 16/9, backgroundColor: COLORS.gray[900], borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  playButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  progressBar: { position: 'absolute', bottom: 40, left: 16, right: 16, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 },
  progress: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressHandle: { position: 'absolute', right: 0, top: -6, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.primary },
  timeLabels: { position: 'absolute', bottom: 12, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: SIZES.body4, color: COLORS.white },
  footer: { padding: SIZES.padding, paddingBottom: 32 },
  exportingContainer: { gap: 12 },
  exportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  exportText: { fontSize: SIZES.body1, fontWeight: '500', color: COLORS.textLight },
  exportPercentage: { fontSize: SIZES.body1, color: COLORS.gray[400] },
  exportProgressBar: { height: 8, backgroundColor: COLORS.gray[700], borderRadius: 4 },
  exportProgress: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  exportMessage: { fontSize: SIZES.body3, color: COLORS.gray[400] },
  savedButton: { backgroundColor: '#22c55e' },
});

export default VideoViewingScreen;

