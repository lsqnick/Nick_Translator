import { useState, useEffect } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Mock implementation - in a real app, this would use native speech recognition
  const startListening = () => {
    setIsListening(true);
    setError(null);
    setTranscript('');
    
    // Simulate speech recognition
    setTimeout(() => {
      const mockTranscripts = [
        'Hello, how are you today?',
        'Where is the nearest restaurant?',
        'Can you help me with directions?',
        'What time is the meeting?',
        'Thank you for your assistance.',
      ];
      
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(randomTranscript);
      setConfidence(0.95);
      setIsListening(false);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const resetTranscript = () => {
    setTranscript('');
    setConfidence(0);
    setError(null);
  };

  return {
    isListening,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}