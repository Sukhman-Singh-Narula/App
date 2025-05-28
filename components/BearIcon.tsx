import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { COLORS } from '@/constants/Colors';

export function BearIcon() {
  return (
    <View style={styles.container}>
      <View style={styles.innerGlow} />
      <View style={styles.bearContainer}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/stackblitz/stackblitz-codeflow/main/assets/teddy-bear.png' }}
          style={styles.bearImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    width: 180,
    position: 'relative',
  },
  innerGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primary[200],
    opacity: 0.8,
  },
  bearContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary[900],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  bearImage: {
    width: 120,
    height: 120,
  },
});