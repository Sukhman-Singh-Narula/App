// File: components/ClearDataButton.tsx - TEMPORARY component to clear persisted data
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/Colors';
import { persistor } from '@/store/store';

export default function ClearDataButton() {
    const clearAllData = async () => {
        try {
            console.log('🧹 Starting complete data clear...');

            // 1. Purge Redux Persist
            await persistor.purge();
            console.log('✅ Redux persist purged');

            // 2. Clear ALL AsyncStorage
            await AsyncStorage.clear();
            console.log('✅ AsyncStorage cleared');

            // 3. Show what was cleared
            const allKeys = await AsyncStorage.getAllKeys();
            console.log('📦 Remaining keys after clear:', allKeys);

            Alert.alert(
                'Data Cleared!',
                'All persisted data has been cleared. The app will now reload.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Force reload
                            if (typeof window !== 'undefined') {
                                window.location.reload();
                            }
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('❌ Error clearing data:', error);
            Alert.alert('Error', 'Failed to clear data: ' + error.message);
        }
    };

    const showCurrentData = async () => {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            console.log('📦 Current AsyncStorage keys:', allKeys);

            for (const key of allKeys) {
                const value = await AsyncStorage.getItem(key);
                console.log(`📦 ${key}:`, value);
            }

            Alert.alert('Check Console', 'Current AsyncStorage data logged to console');
        } catch (error) {
            console.error('❌ Error reading data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={showCurrentData}>
                <Text style={styles.buttonText}>Show Current Data</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={clearAllData}>
                <Text style={[styles.buttonText, styles.dangerText]}>Clear All Data</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        right: 20,
        zIndex: 1000,
    },
    button: {
        backgroundColor: COLORS.primary[600],
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        minWidth: 120,
    },
    dangerButton: {
        backgroundColor: COLORS.error.default,
    },
    buttonText: {
        color: COLORS.white,
        fontFamily: 'Nunito-SemiBold',
        fontSize: 12,
        textAlign: 'center',
    },
    dangerText: {
        color: COLORS.white,
    },
});