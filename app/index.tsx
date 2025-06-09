// File: app/index.tsx - Fixed navigation logic with auth state monitoring
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import SplashScreenComponent from '@/components/SplashScreenComponent';

export default function IndexScreen() {
    const { isAuthenticated, hasProfile, isLoading } = useAuth();

    useEffect(() => {
        // Monitor auth state changes and navigate accordingly
        const handleNavigation = () => {
            if (!isLoading) {
                console.log('🔍 Navigation check triggered:');
                console.log(`   - isAuthenticated: ${isAuthenticated}`);
                console.log(`   - hasProfile: ${hasProfile}`);
                console.log(`   - isLoading: ${isLoading}`);

                if (isAuthenticated) {
                    if (hasProfile) {
                        console.log('🏠 User is authenticated with profile → Redirecting to HOME');
                        router.replace('/(tabs)');
                    } else {
                        console.log('👤 User is authenticated but no profile → Redirecting to PROFILE SETUP');
                        router.replace('/auth/setup-profile');
                    }
                } else {
                    console.log('🔑 User not authenticated → Redirecting to LOGIN');
                    router.replace('/auth/login');
                }
            } else {
                console.log('⏳ Still loading authentication state...');
            }
        };

        // Initial navigation check
        const timer = setTimeout(handleNavigation, 200);

        return () => clearTimeout(timer);
    }, [isAuthenticated, hasProfile, isLoading]);

    // Also listen for real-time auth state changes (like logout)
    useEffect(() => {
        console.log('🔄 Auth state changed:', { isAuthenticated, hasProfile, isLoading });

        // If user becomes unauthenticated (logout), immediately redirect
        if (!isLoading && !isAuthenticated) {
            console.log('🚪 User logged out, redirecting to login...');
            router.replace('/auth/login');
        }
    }, [isAuthenticated]);

    // Show splash screen while determining navigation
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