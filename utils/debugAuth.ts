// File: utils/debugAuth.ts - Helper function to clear all auth data for testing
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '../store/store';

export const clearAllAuthData = async () => {
    console.log('🧹 Starting complete auth data cleanup...');

    try {
        // 1. Purge Redux Persist store
        console.log('🔄 Purging Redux Persist store...');
        await persistor.purge();

        // 2. Clear all AsyncStorage
        console.log('🔄 Clearing all AsyncStorage data...');
        await AsyncStorage.clear();

        // 3. Sign out from Firebase (if available)
        try {
            const { auth } = await import('../config/firebase');
            if (auth.currentUser) {
                console.log('🔄 Signing out from Firebase...');
                const { signOut } = await import('firebase/auth');
                await signOut(auth);
            }
        } catch (error) {
            console.log('⚠️ Firebase signout failed (might already be signed out):', error);
        }

        console.log('✅ Complete auth data cleanup successful!');

        // 4. Reload the app to start fresh
        if (typeof window !== 'undefined') {
            console.log('🔄 Reloading app...');
            window.location.reload();
        }

    } catch (error) {
        console.error('❌ Error during auth data cleanup:', error);
    }
};

// You can call this from the dev menu or console for testing
// clearAllAuthData();