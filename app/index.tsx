// File: app/index.tsx - Fixed navigation logic
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import SplashScreenComponent from '@/components/SplashScreenComponent';

export default function IndexScreen() {
    const { isAuthenticated, hasProfile, isLoading } = useAuth();

    useEffect(() => {
        // Add a small delay to ensure state is properly loaded
        const timer = setTimeout(() => {
            if (!isLoading) {
                console.log('🔍 Navigation check:', { isAuthenticated, hasProfile });

                if (isAuthenticated) {
                    if (hasProfile) {
                        console.log('🏠 Redirecting to home (has profile)');
                        router.replace('/(tabs)');
                    } else {
                        console.log('👤 Redirecting to profile setup (no profile)');
                        router.replace('/auth/setup-profile');
                    }
                } else {
                    console.log('🔑 Redirecting to login (not authenticated)');
                    router.replace('/auth/login');
                }
            }
        }, 100); // Small delay to ensure state is updated

        return () => clearTimeout(timer);
    }, [isAuthenticated, hasProfile, isLoading]);

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