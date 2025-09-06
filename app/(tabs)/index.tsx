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
import { Mic, Square, RotateCcw, Volume2, Wifi, WifiOff } from 'lucide-react-native';
import LanguageSelector from '@/components/LanguageSelector';
import { Language } from '@/types/translation';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { translationService } from '@/services/translationService';
import TranslationDialog from '../../components/TranslationDialog';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { Modal } from 'react-native';
import AuthScreen from '../../screens/AuthScreen';
import EmailVerificationScreen from '../../screens/EmailVerificationScreen';

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

interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: Date;
}

export default function TranslateScreen() {
  const { user, isEmailVerified } = useAuth();
  const { 
    checkAuth, 
    showAuthModal, 
    showVerificationModal, 
    setShowAuthModal, 
    setShowVerificationModal 
  } = useAuthGuard();
  const [isOnline, setIsOnline] = useState(true);
  const [translationDialogs, setTranslationDialogs] = useState<TranslationDialog[]>([]);
  const [currentDialog, setCurrentDialog] = useState<TranslationDialog | null>(null);
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('en');
  const [micAnimation] = useState(new Animated.Value(1));
  const [isTranslating, setIsTranslating] = useState(false);
  
  const {
    isListening,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const languages: Language[] = [
    { code: 'auto', name: 'Auto Detect', flag: '🌐', supported: true },
    { code: 'en', name: 'English', flag: '🇺🇸', supported: true },
    { code: 'zh', name: 'Chinese (Mandarin)', flag: '🇨🇳', supported: true },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', supported: true },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', supported: true },
    { code: 'fr', name: 'French', flag: '🇫🇷', supported: true },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', supported: true },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩', supported: true },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', supported: true },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', supported: true },
    { code: 'id', name: 'Indonesian', flag: '🇮🇩', supported: true },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰', supported: true },
    { code: 'de', name: 'German', flag: '🇩🇪', supported: true },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', supported: true },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪', supported: true },
    { code: 'te', name: 'Telugu', flag: '🇮🇳', supported: true },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', supported: true },
  ];

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  useEffect(() => {
    if (isListening) {
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
  }, [isListening]);

  // Handle real-time translation when transcript changes
  useEffect(() => {
    if (transcript && transcript.trim() && isListening) {
      handleRealTimeTranslation(transcript);
    }
  }, [transcript, fromLanguage, toLanguage, isListening]);

  const handleRealTimeTranslation = async (text: string) => {
    if (!text.trim() || !isOnline) return;

    setIsTranslating(true);

    try {
      // Detect language if auto-detect is enabled
      let detectedFromLang = fromLanguage;
      if (fromLanguage === 'auto') {
        detectedFromLang = await translationService.detectLanguage(text);
      }

      // Get translation with RRT processing
      const result = await translationService.translateWithRRT(
        text,
        detectedFromLang,
        toLanguage,
        undefined,
        translationDialogs.flatMap(dialog => 
          dialog.segments.map(segment => ({
            id: segment.id,
            originalText: segment.originalText,
            translatedText: segment.translatedText,
            fromLanguage: detectedFromLang,
            toLanguage: toLanguage,
            timestamp: new Date(),
          }))
        )
      );

      // Create or update current dialog
      const segments = segmentText(text, result.translatedText);
      
      if (!currentDialog || currentDialog.segments.length >= 5) {
        // Create new dialog if none exists or current one is full
        const newDialog: TranslationDialog = {
          id: Date.now().toString(),
          segments: segments,
          timestamp: new Date(),
        };
        setCurrentDialog(newDialog);
      } else {
        // Update existing dialog
        const updatedDialog = {
          ...currentDialog,
          segments: segments,
        };
        setCurrentDialog(updatedDialog);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const segmentText = (originalText: string, translatedText: string): TranslationSegment[] => {
    // Simple sentence segmentation based on punctuation
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim());
    const translatedSentences = translatedText.split(/[.!?]+/).filter(s => s.trim());
    
    return sentences.slice(0, 5).map((sentence, index) => ({
      id: `${Date.now()}-${index}`,
      originalText: sentence.trim(),
      translatedText: translatedSentences[index]?.trim() || sentence.trim(),
      isComplete: !isListening,
    }));
  };

  const handleStartRecording = () => {
    // Check auth for premium features
    if (!checkAuth(true)) {
      return;
    }
    
    resetTranscript();
    setCurrentDialog(null);
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
    
    // Save current dialog to archive if it exists
    if (currentDialog && currentDialog.segments.length > 0) {
      setTranslationDialogs(prev => [...prev, currentDialog]);
      setCurrentDialog(null);
    }
  };

  const swapLanguages = () => {
    if (fromLanguage !== 'auto') {
      const temp = fromLanguage;
      setFromLanguage(toLanguage);
      setToLanguage(temp);
    }
  };

  const speakTranslation = () => {
    if (currentDialog && currentDialog.segments.length > 0) {
      const textToSpeak = currentDialog.segments
        .map(segment => segment.translatedText)
        .join('. ');
      translationService.speakText(textToSpeak, toLanguage);
    }
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

      {/* Auth Modals */}
      <Modal
        visible={showAuthModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AuthScreen 
          onSuccess={() => {
            setShowAuthModal(false);
            if (!isEmailVerified) {
              setShowVerificationModal(true);
            }
          }}
          onCancel={() => setShowAuthModal(false)}
        />
      </Modal>

      <Modal
        visible={showVerificationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EmailVerificationScreen 
          onSuccess={() => setShowVerificationModal(false)}
          onCancel={() => setShowVerificationModal(false)}
        />
      </Modal>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Language Selection */}
        <View style={styles.languageContainer}>
          <LanguageSelector
            selectedLanguage={fromLanguage}
            onLanguageChange={setFromLanguage}
            languages={languages}
            title="Select Source Language"
          />
          
          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <RotateCcw size={20} color="#64748b" />
          </TouchableOpacity>
          
          <LanguageSelector
            selectedLanguage={toLanguage}
            onLanguageChange={setToLanguage}
            languages={languages.filter(lang => lang.code !== 'auto')}
            title="Select Target Language"
          />
        </View>

        {/* Translation Display */}
        <View style={styles.translationContainer}>
          {currentDialog && currentDialog.segments.length > 0 ? (
            <TranslationDialog
              dialog={currentDialog}
              fromLanguage={fromLanguage === 'auto' ? 'en' : fromLanguage}
              toLanguage={toLanguage}
              getLanguageName={getLanguageName}
              onSpeak={speakTranslation}
              isLive={isListening}
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>
                {isListening ? 'Listening and translating...' : 'Tap the microphone to start translating'}
              </Text>
              {isListening && (
                <View style={styles.listeningIndicator}>
                  <View style={styles.waveform}>
                    {[...Array(5)].map((_, i) => (
                      <Animated.View key={i} style={styles.waveBar} />
                    ))}
                  </View>
                </View>
              )}
              {transcript && (
                <View style={styles.liveTranscript}>
                  <Text style={styles.transcriptLabel}>Listening:</Text>
                  <Text style={styles.transcriptText}>{transcript}</Text>
                  {isTranslating && (
                    <Text style={styles.translatingText}>Translating...</Text>
                  )}
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
              isListening ? styles.micButtonRecording : styles.micButtonIdle,
            ]}
            onPress={isListening ? handleStopRecording : handleStartRecording}
          >
            <Animated.View style={{ transform: [{ scale: micAnimation }] }}>
              {isListening ? (
                <Square size={32} color="#ffffff" />
              ) : (
                <Mic size={32} color="#ffffff" />
              )}
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.micButtonText}>
            {isListening ? 'Tap to stop' : 'Tap to speak'}
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
  liveTranscript: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  transcriptLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 16,
    color: '#1e293b',
    lineHeight: 24,
  },
  translatingText: {
    fontSize: 12,
    color: '#2563eb',
    fontStyle: 'italic',
    marginTop: 8,
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
