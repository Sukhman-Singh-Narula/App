// File: app/settings/_layout.tsx - Create this new file
import { Stack } from 'expo-router';

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="account" />
            <Stack.Screen name="appearance" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="privacy-policy" />
        </Stack>
    );
}