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
  const [simulationInterval, setSimulationInterval] = useState<ReturnType<typeof setInterval> | null>(
    null,
  );

  const startListening = () => {
    setIsListening(true);
    setError(null);
    setTranscript('');
    
    // Simulate continuous speech recognition with progressive text building
    const mockSentences = [
      'Hello, how are you doing today?',
      'I hope you are having a wonderful time.',
      'The weather is really nice outside.',
      'Would you like to grab some coffee later?',
      'Thank you so much for your help with this project.',
    ];
    
    let currentSentenceIndex = 0;
    let currentCharIndex = 0;
    let builtTranscript = '';
    
    const interval = setInterval(() => {
      if (currentSentenceIndex >= mockSentences.length) {
        clearInterval(interval);
        setConfidence(0.98);
        return;
      }
      
      const currentSentence = mockSentences[currentSentenceIndex];
      
      if (currentCharIndex < currentSentence.length) {
        // Add characters progressively to simulate real-time speech
        const wordsToAdd = Math.floor(Math.random() * 3) + 1; // Add 1-3 words at a time
        const words = currentSentence.split(' ');
        const currentWordIndex = Math.floor(currentCharIndex / (currentSentence.length / words.length));
        
        if (currentWordIndex < words.length) {
          const nextWordIndex = Math.min(currentWordIndex + wordsToAdd, words.length);
          const newWords = words.slice(0, nextWordIndex).join(' ');
          builtTranscript = builtTranscript.replace(currentSentence.substring(0, currentCharIndex), '') + newWords;
          currentCharIndex = newWords.length;
        } else {
          currentCharIndex = currentSentence.length;
        }
      } else {
        // Move to next sentence
        builtTranscript += (builtTranscript ? ' ' : '') + currentSentence;
        currentSentenceIndex++;
        currentCharIndex = 0;
        
        // Add pause between sentences
        setTimeout(() => {}, 500);
      }
      
      setTranscript(builtTranscript);
      setConfidence(0.85 + (currentCharIndex / currentSentence.length) * 0.13);
    }, 800 + Math.random() * 400); // Vary timing to simulate natural speech
    
    setSimulationInterval(interval);
  };

  const stopListening = () => {
    setIsListening(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setConfidence(0);
    setError(null);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

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
