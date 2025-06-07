import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Bean as Bear } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreenComponent() {
  const logoOpacity = new Animated.Value(0);
  const logoScale = new Animated.Value(0.8);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false, // Changed to false for web compatibility
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: false, // Changed to false for web compatibility
        }),
      ]),
      // After logo animation, fade in text
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: false, // Changed to false for web compatibility
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Bear size={80} color={COLORS.primary[800]} strokeWidth={1.5} />
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity }}>
          <Text style={styles.logoText}>STORYTELLER</Text>
          <Text style={styles.tagline}>Smart companion for your child</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    // Web-compatible shadow
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      },
      default: {
        shadowColor: COLORS.gray[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  logoText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: COLORS.primary[900],
    textAlign: 'center',
    letterSpacing: 3,
  },
  tagline: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.primary[700],
    textAlign: 'center',
    marginTop: 8,
  },
});