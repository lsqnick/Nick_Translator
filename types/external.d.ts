declare module 'firebase/app' {
  const app: any;
  export const initializeApp: any;
  export default app;
}

declare module 'firebase/auth' {
  export interface User {
    uid: string;
    email?: string | null;
    emailVerified?: boolean;
  }
  export const getAuth: any;
  export const initializeAuth: any;
  export const getReactNativePersistence: any;
  export const signInWithEmailAndPassword: any;
  export const createUserWithEmailAndPassword: any;
  export const signOut: any;
  export const sendEmailVerification: any;
  export const sendPasswordResetEmail: any;
  export const GoogleAuthProvider: any;
  export const signInWithCredential: any;
  export const onAuthStateChanged: any;
  export const reload: any;
}

declare module '@react-native-google-signin/google-signin' {
  export const GoogleSignin: any;
}

declare module 'expo-apple-authentication' {
  const AppleAuthentication: any;
  export = AppleAuthentication;
}

declare module 'expo-secure-store' {
  const SecureStore: any;
  export = SecureStore;
}

declare module '@react-native-async-storage/async-storage' {
  const AsyncStorage: any;
  export default AsyncStorage;
}
