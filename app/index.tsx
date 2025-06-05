// File: app/index.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import SplashScreenComponent from '@/components/SplashScreenComponent';

export default function IndexScreen() {
    const { isAuthenticated, hasProfile, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                if (hasProfile) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/auth/setup-profile');
                }
            } else {
                router.replace('/auth/login');
            }
        }
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
