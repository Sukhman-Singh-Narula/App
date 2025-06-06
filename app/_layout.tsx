// File: app/_layout.tsx - Fixed route structure
import 'react-native-svg';
import 'react-native-url-polyfill/auto';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, ActivityIndicator } from 'react-native';
import SplashScreenComponent from '@/components/SplashScreenComponent';
import { COLORS } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary[100] }}>
      <ActivityIndicator size="large" color={COLORS.primary[600]} />
      <Text style={{
        fontFamily: 'Nunito-SemiBold',
        fontSize: 18,
        color: COLORS.primary[700],
        marginTop: 16
      }}>
        Loading...
      </Text>
    </View>
  );
}

function AppContent() {
  useFrameworkReady();
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded, fontError] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded || fontError) {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));
          await SplashScreen.hideAsync();
          setTimeout(() => {
            setShowSplash(false);
          }, 800);
        } catch (error) {
          console.warn('Error hiding splash screen:', error);
          setShowSplash(false);
        }
      }
    };

    hideSplash();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <LoadingScreen />;
  }

  return (
    <>
      {showSplash ? (
        <SplashScreenComponent />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth" />
          {/* Remove the "settings" screen declaration since it conflicts with settings/ folder */}
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      )}
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}