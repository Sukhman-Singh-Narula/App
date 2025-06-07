// File: config/firebase.ts - Complete Firebase fix
import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB1zev9GZAHJ57Rzlao8PuzJbxxI-i_6D0",
    authDomain: "storyteller-7ece7.firebaseapp.com",
    projectId: "storyteller-7ece7",
    storageBucket: "storyteller-7ece7.firebasestorage.app",
    messagingSenderId: "500542826961",
    appId: "1:500542826961:web:6242d29af7fe3e3190d8f0",
    measurementId: "G-6RV480TXEE"
};

// Initialize Firebase app only once
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

// Initialize auth only once
let auth;
try {
    // Try to get existing auth instance first
    auth = getAuth(app);
} catch (error) {
    // If that fails, initialize with persistence
    try {
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage),
        });
    } catch (initError) {
        console.error('Firebase auth initialization error:', initError);
        // Fallback to basic auth
        auth = getAuth(app);
    }
}

export { auth, app };
export default auth;