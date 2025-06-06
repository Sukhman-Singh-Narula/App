// File: config/firebase.ts - Simplified based on working Firebase starter
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config using environment variables (like the working starter)
const firebaseConfig = {
    apiKey: "AIzaSyB1zev9GZAHJ57Rzlao8PuzJbxxI-i_6D0",
    authDomain: "storyteller-7ece7.firebaseapp.com",
    projectId: "storyteller-7ece7",
    storageBucket: "storyteller-7ece7.firebasestorage.app",
    messagingSenderId: "500542826961",
    appId: "1:500542826961:web:6242d29af7fe3e3190d8f0",
    measurementId: "G-6RV480TXEE"
};

// Simple, direct initialization (like the working starter)
const app = initializeApp(firebaseConfig);

// Initialize auth with persistence (exactly like working starter)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Simple exports (like working starter)
export { auth, app };
export default auth;

// Helper to check if properly configured
export const isFirebaseConfigured = () => {
    return !!(
        firebaseConfig.apiKey &&
        firebaseConfig.projectId &&
        firebaseConfig.apiKey !== 'AIzaSyB1zev9GZAHJ57Rzlao8PuzJbxxI-i_6D0'
    );
};
