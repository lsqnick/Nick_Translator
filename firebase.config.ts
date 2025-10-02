import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBqJ8X9nQZ5K6vQ8mR2pL3wE4tY7uI9oP0",
  authDomain: "vinicktech-translator.firebaseapp.com",
  projectId: "vinicktech-translator",
  storageBucket: "vinicktech-translator.appspot.com",
  messagingSenderId: "100557062184",
  appId: "1:100557062184:web:abc123def456ghi789jkl",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);

export default app;
