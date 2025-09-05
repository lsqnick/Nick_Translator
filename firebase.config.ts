import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBqJ8X9nQZ5K6vQ8mR2pL3wE4tY7uI9oP0",
  authDomain: "vinicktech-translator.firebaseapp.com",
  projectId: "vinicktech-translator",
  storageBucket: "vinicktech-translator.appspot.com",
  messagingSenderId: "100557062184",
  appId: "1:100557062184:web:abc123def456ghi789jkl",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default app;