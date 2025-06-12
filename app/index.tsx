// File: app/index.tsx - FIXED VERSION
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import SplashScreenComponent from '@/components/SplashScreenComponent';


export default function IndexScreen() {
    const { isAuthenticated, hasProfile, isReady, needsProfileSetup, canNavigateToHome } = useAuth();

    useEffect(() => {
        // Only navigate when auth is ready (initialized and not loading)
        if (!isReady) {
            console.log('⏳ Auth not ready yet, waiting...');
            return;
        }

        console.log('🔍 Auth is ready, making navigation decision:', {
            isAuthenticated,
            hasProfile,
            needsProfileSetup,
            canNavigateToHome,
        });

        // Simple, clear navigation logic
        if (canNavigateToHome) {
            console.log('🏠 Navigating to home (authenticated + has profile)');
            router.replace('/(tabs)');
        } else if (needsProfileSetup) {
            console.log('👤 Navigating to profile setup (authenticated but no profile)');
            router.replace('/auth/setup-profile');
        } else {
            console.log('🔑 Navigating to login (not authenticated)');
            router.replace('/auth/login');
        }
    }, [isReady, canNavigateToHome, needsProfileSetup]);

    // Show splash screen until navigation decision is made
    return (
        <View style={styles.container}>
            <SplashScreenComponent />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});