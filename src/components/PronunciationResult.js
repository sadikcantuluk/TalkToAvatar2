import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Helper function to get score color
const getScoreColor = (score) => {
  if (score >= 90) return '#10b981'; // Yeşil
  if (score >= 70) return '#84cc16'; // Açık Yeşil
  if (score >= 50) return '#f59e0b'; // Sarı
  return '#ef4444'; // Kırmızı
};

// WordBar component for individual word display
const WordBar = ({ word, score, errorType, referenceWord }) => {
  const isMissing = score === 0 && (errorType === 'Omission' || errorType === 'Missing');
  const color = getScoreColor(score);
  const displayWord = referenceWord || word;
  
  return (
    <View style={styles.wordItem}>
      <View style={styles.wordHeader}>
        <Text style={styles.wordText}>
          {displayWord}
          {isMissing && <Text style={styles.missingText}> (eksik)</Text>}
        </Text>
        <Text style={[styles.wordScore, { color }]}>
          {score}%
        </Text>
      </View>
      <View style={styles.wordBarContainer}>
        <View style={[styles.wordBar, { backgroundColor: color, width: `${score}%` }]} />
      </View>
    </View>
  );
};

const PronunciationResult = ({ 
  overallScore, 
  accuracy, 
  fluency, 
  completeness, 
  words = [], 
  transcript = '',
  referenceText = '',
  showTitle = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowDetails(!showDetails);
  };

  // Process words: combine reference text with spoken words
  const processedWords = React.useMemo(() => {
    if (!referenceText && words.length > 0) {
      // If no reference text, just use words from API
      return words.map(w => ({
        word: w.word || '',
        accuracy_score: w.accuracy_score || 0,
        error_type: w.error_type || null,
        referenceWord: w.word || '',
      }));
    }

    const referenceWords = referenceText ? referenceText.split(/\s+/) : [];
    const spokenWordsMap = {};
    
    words.forEach(word => {
      const wordText = (word.word || '').toLowerCase();
      if (wordText) {
        spokenWordsMap[wordText] = word;
      }
    });
    
    return referenceWords.map((refWord) => {
      const refWordLower = refWord.toLowerCase().replace(/[.,!?]/g, '');
      const spokenWord = spokenWordsMap[refWordLower];
      
      if (spokenWord) {
        return {
          word: spokenWord.word || refWord,
          accuracy_score: spokenWord.accuracy_score || 0,
          error_type: spokenWord.error_type || null,
          referenceWord: refWord,
        };
      } else {
        return {
          word: refWord,
          accuracy_score: 0,
          error_type: 'Omission',
          referenceWord: refWord,
        };
      }
    });
  }, [words, referenceText]);

  return (
    <View style={styles.container}>
      {showTitle && (
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <View
            style={[
              styles.scoreBadge,
              overallScore >= 85 && styles.scoreBadgeExcellent,
              overallScore >= 70 && overallScore < 85 && styles.scoreBadgeGood,
              overallScore < 70 && styles.scoreBadgeNeedsWork,
            ]}
          >
            <Text style={styles.scoreValue}>{overallScore}%</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={toggleDetails}
      >
        <Ionicons 
          name={showDetails ? "chevron-up" : "search"} 
          size={16} 
          color={COLORS.primary} 
        />
        <Text style={styles.detailsButtonText}>
          {showDetails ? 'Detayları Gizle' : 'Detayları Gör'}
        </Text>
      </TouchableOpacity>

      {showDetails && (
        <View style={styles.inlineDetailsContainer}>
          <Text style={styles.inlineDetailsTitle}>📊 Kelime Seviyesi Analiz</Text>
          
          <ScrollView 
            style={styles.inlineDetailsScrollView} 
            contentContainerStyle={styles.inlineDetailsScrollContent}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {processedWords.length > 0 ? (
              <View style={styles.wordsContainer}>
                {processedWords.map((word, index) => (
                  <WordBar
                    key={index}
                    word={word.word}
                    score={word.accuracy_score}
                    errorType={word.error_type}
                    referenceWord={word.referenceWord}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.noWordsText}>No word-level data available</Text>
            )}
          </ScrollView>
          
          {/* Overall Metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricsRow}>
              {accuracy !== undefined && accuracy !== null && (
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>🎯 Doğruluk:</Text>
                  <Text style={[styles.metricValue, { color: getScoreColor(accuracy) }]}>
                    {accuracy}%
                  </Text>
                </View>
              )}
              {fluency !== undefined && fluency !== null && (
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Akıcılık:</Text>
                  <Text style={[styles.metricValue, { color: getScoreColor(fluency) }]}>
                    {fluency}%
                  </Text>
                </View>
              )}
              {completeness !== undefined && completeness !== null && (
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Tamamlanma:</Text>
                  <Text style={[styles.metricValue, { color: getScoreColor(completeness) }]}>
                    {completeness}%
                  </Text>
                </View>
              )}
            </View>
          </View>

          {transcript && (
            <View style={styles.transcriptSection}>
              <Text style={styles.transcriptLabel}>Sen söyledin:</Text>
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreBadgeExcellent: {
    backgroundColor: '#10b981',
  },
  scoreBadgeGood: {
    backgroundColor: '#f59e0b',
  },
  scoreBadgeNeedsWork: {
    backgroundColor: '#ef4444',
  },
  scoreValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(19, 127, 236, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(19, 127, 236, 0.3)',
  },
  detailsButtonText: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inlineDetailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inlineDetailsTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 16,
  },
  inlineDetailsScrollView: {
    maxHeight: 200,
    marginBottom: 16,
  },
  inlineDetailsScrollContent: {
    paddingBottom: 8,
  },
  wordsContainer: {
    marginBottom: 12,
    gap: 12,
  },
  wordItem: {
    marginBottom: 12,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  wordText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textLight,
    flex: 1,
  },
  missingText: {
    color: '#ef4444',
    fontStyle: 'italic',
  },
  wordScore: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  wordBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  wordBar: {
    height: '100%',
    borderRadius: 4,
  },
  noWordsText: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  metricsContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    fontSize: SIZES.body3,
    fontWeight: '600',
    color: COLORS.gray[300],
  },
  metricValue: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  transcriptSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  transcriptLabel: {
    fontSize: SIZES.body3,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: SIZES.body2,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});

export default PronunciationResult;

