import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Volume2 } from 'lucide-react-native';

interface TranslationSegment {
  id: string;
  originalText: string;
  translatedText: string;
  isComplete: boolean;
}

interface TranslationDialog {
  id: string;
  segments: TranslationSegment[];
  timestamp: Date;
}

interface TranslationDialogProps {
  dialog: TranslationDialog;
  fromLanguage: string;
  toLanguage: string;
  getLanguageName: (code: string) => string;
  onSpeak: () => void;
  isLive?: boolean;
}

export default function TranslationDialogComponent({
  dialog,
  fromLanguage,
  toLanguage,
  getLanguageName,
  onSpeak,
  isLive = false,
}: TranslationDialogProps) {
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <View style={[styles.container, isLive && styles.liveContainer]}>
      <View style={styles.header}>
        <View style={styles.languageInfo}>
          <Text style={styles.languageText}>
            {getLanguageName(fromLanguage)} → {getLanguageName(toLanguage)}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {isLive ? 'Live' : formatTimestamp(dialog.timestamp)}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Original Text Segments */}
        <View style={styles.originalSection}>
          <Text style={styles.sectionLabel}>Original ({getLanguageName(fromLanguage)})</Text>
          <View style={styles.segmentsContainer}>
            {dialog.segments.map((segment, index) => (
              <React.Fragment key={segment.id}>
                <Text style={[
                  styles.segmentText,
                  !segment.isComplete && styles.incompleteText
                ]}>
                  {segment.originalText}
                </Text>
                {index < dialog.segments.length - 1 && (
                  <Text style={styles.segmentSeparator}>. </Text>
                )}
              </React.Fragment>
            ))}
            {isLive && !dialog.segments[dialog.segments.length - 1]?.isComplete && (
              <View style={styles.cursor} />
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Translated Text Segments */}
        <View style={styles.translatedSection}>
          <View style={styles.translatedHeader}>
            <Text style={styles.sectionLabel}>Translation ({getLanguageName(toLanguage)})</Text>
            <TouchableOpacity onPress={onSpeak} style={styles.speakButton}>
              <Volume2 size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>
          <View style={styles.segmentsContainer}>
            {dialog.segments.map((segment, index) => (
              <React.Fragment key={`translated-${segment.id}`}>
                <Text style={[
                  styles.translatedSegmentText,
                  !segment.isComplete && styles.incompleteTranslatedText
                ]}>
                  {segment.translatedText}
                </Text>
                {index < dialog.segments.length - 1 && (
                  <Text style={styles.segmentSeparator}>. </Text>
                )}
              </React.Fragment>
            ))}
            {isLive && (
              <View style={styles.processingIndicator}>
                <Text style={styles.processingText}>
                  {dialog.segments.some(s => !s.isComplete) ? 'Refining...' : 'Processing...'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  liveContainer: {
    borderColor: '#2563eb',
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  content: {
    gap: 16,
  },
  originalSection: {
    marginBottom: 8,
  },
  translatedSection: {},
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  translatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  speakButton: {
    padding: 4,
  },
  segmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
  },
  incompleteText: {
    color: '#64748b',
    fontStyle: 'italic',
  },
  translatedSegmentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2563eb',
    fontWeight: '500',
  },
  incompleteTranslatedText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: '#2563eb',
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  processingIndicator: {
    marginLeft: 8,
  },
  processingText: {
    fontSize: 12,
    color: '#2563eb',
    fontStyle: 'italic',
  },
  segmentSeparator: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748b',
  },
});