import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Volume2, Share, Bookmark } from 'lucide-react-native';

interface TranslationCardProps {
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  onSpeak?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export default function TranslationCard({
  originalText,
  translatedText,
  fromLanguage,
  toLanguage,
  onSpeak,
  onShare,
  onSave,
}: TranslationCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.originalSection}>
        <Text style={styles.originalText}>{originalText}</Text>
        <Text style={styles.languageLabel}>{fromLanguage}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.translatedSection}>
        <Text style={styles.translatedText}>{translatedText}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.languageLabel}>{toLanguage}</Text>
          <View style={styles.actions}>
            {onSpeak && (
              <TouchableOpacity onPress={onSpeak} style={styles.actionButton}>
                <Volume2 size={18} color="#2563eb" />
              </TouchableOpacity>
            )}
            {onShare && (
              <TouchableOpacity onPress={onShare} style={styles.actionButton}>
                <Share size={18} color="#64748b" />
              </TouchableOpacity>
            )}
            {onSave && (
              <TouchableOpacity onPress={onSave} style={styles.actionButton}>
                <Bookmark size={18} color="#64748b" />
              </TouchableOpacity>
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
    marginVertical: 8,
  },
  originalSection: {
    marginBottom: 16,
  },
  originalText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#1e293b',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },
  translatedSection: {},
  translatedText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2563eb',
    fontWeight: '500',
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});