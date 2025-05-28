import 'react-native-svg';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import SplashScreenComponent from '@/components/SplashScreenComponent';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
        // Wait for 2.5 seconds to show our custom splash screen
        await new Promise(resolve => setTimeout(resolve, 2500));
        await SplashScreen.hideAsync();
        
        // After another second, hide our custom splash and show the app
        setTimeout(() => {
          setShowSplash(false);
        }, 1000);
      }
    };

    hideSplash();
  }, [fontsLoaded, fontError]);

  // Show nothing while fonts are loading or on error
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      {showSplash ? (
        <SplashScreenComponent />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      )}
      <StatusBar style="auto" />
    </>
  );
}