import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mic, MicOff, RotateCcw, Volume2, Wifi, WifiOff } from 'lucide-react-native';

interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: Date;
}

export default function TranslateScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>(null);
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('en');
  const [micAnimation] = useState(new Animated.Value(1));

  const languages = [
    { code: 'auto', name: 'Auto Detect', flag: '🌐' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  ];

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  useEffect(() => {
    if (isRecording) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(micAnimation, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(micAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    // Simulate speech recognition with mock translation
    setTimeout(() => {
      const mockTranslation: Translation = {
        id: Date.now().toString(),
        originalText: "Hello, how are you doing today?",
        translatedText: "Hola, ¿cómo estás hoy?",
        fromLanguage: 'en',
        toLanguage: toLanguage,
        timestamp: new Date(),
      };
      setCurrentTranslation(mockTranslation);
      setIsRecording(false);
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const swapLanguages = () => {
    if (fromLanguage !== 'auto') {
      const temp = fromLanguage;
      setFromLanguage(toLanguage);
      setToLanguage(temp);
    }
  };

  const speakTranslation = () => {
    // Text-to-speech implementation would go here
    console.log('Speaking translation:', currentTranslation?.translatedText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nick Translator</Text>
        <View style={styles.statusContainer}>
          {isOnline ? (
            <View style={styles.onlineStatus}>
              <Wifi size={16} color="#10b981" />
              <Text style={styles.statusText}>Online</Text>
            </View>
          ) : (
            <View style={styles.offlineStatus}>
              <WifiOff size={16} color="#f59e0b" />
              <Text style={styles.statusOfflineText}>Offline</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Language Selection */}
        <View style={styles.languageContainer}>
          <TouchableOpacity style={styles.languageSelector}>
            <Text style={styles.languageFlag}>{getLanguageFlag(fromLanguage)}</Text>
            <Text style={styles.languageName}>{getLanguageName(fromLanguage)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <RotateCcw size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.languageSelector}>
            <Text style={styles.languageFlag}>{getLanguageFlag(toLanguage)}</Text>
            <Text style={styles.languageName}>{getLanguageName(toLanguage)}</Text>
          </TouchableOpacity>
        </View>

        {/* Translation Display */}
        <View style={styles.translationContainer}>
          {currentTranslation ? (
            <View style={styles.translationCard}>
              <View style={styles.originalTextContainer}>
                <Text style={styles.originalText}>{currentTranslation.originalText}</Text>
                <Text style={styles.languageLabel}>
                  {getLanguageName(currentTranslation.fromLanguage)}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.translatedTextContainer}>
                <Text style={styles.translatedText}>{currentTranslation.translatedText}</Text>
                <View style={styles.translatedActions}>
                  <Text style={styles.languageLabel}>
                    {getLanguageName(currentTranslation.toLanguage)}
                  </Text>
                  <TouchableOpacity onPress={speakTranslation} style={styles.speakButton}>
                    <Volume2 size={18} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                {isRecording ? 'Listening and translating...' : 'Tap the microphone to start translating'}
              </Text>
              {isRecording && (
                <View style={styles.listeningIndicator}>
                  <View style={styles.waveform}>
                    {[...Array(5)].map((_, i) => (
                      <Animated.View
                        key={i}
                        style={[
                          styles.waveBar,
                          {
                            animationDelay: `${i * 100}ms`,
                          }
                        ]}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Recording Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording ? styles.micButtonRecording : styles.micButtonIdle,
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Animated.View style={{ transform: [{ scale: micAnimation }] }}>
              {isRecording ? (
                <MicOff size={32} color="#ffffff" />
              ) : (
                <Mic size={32} color="#ffffff" />
              )}
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.micButtonText}>
            {isRecording ? 'Tap to stop' : 'Hold to speak'}
          </Text>
        </View>

        {/* RRT Feature Banner */}
        <View style={styles.rrtBanner}>
          <Text style={styles.rrtTitle}>🚀 RRT Technology</Text>
          <Text style={styles.rrtDescription}>
            Real-time context-aware translation for enhanced accuracy and natural expression
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  statusOfflineText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  languageSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  languageFlag: {
    fontSize: 20,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  swapButton: {
    marginHorizontal: 12,
    padding: 8,
  },
  translationContainer: {
    marginBottom: 32,
  },
  translationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  originalTextContainer: {
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
  translatedTextContainer: {
    marginBottom: 8,
  },
  translatedText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2563eb',
    fontWeight: '500',
    marginBottom: 12,
  },
  translatedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  speakButton: {
    padding: 8,
  },
  placeholderContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  listeningIndicator: {
    marginTop: 24,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waveBar: {
    width: 4,
    height: 20,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  micButtonIdle: {
    backgroundColor: '#2563eb',
  },
  micButtonRecording: {
    backgroundColor: '#dc2626',
  },
  micButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  rrtBanner: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  rrtTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  rrtDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});