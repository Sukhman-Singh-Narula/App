// File: app/(tabs)/index.tsx
// This is the home screen component

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { BearIcon } from '@/components/BearIcon';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import WiFiModal from '@/components/WiFiModal';
import SystemPromptModal from '@/components/SystemPromptModal';

export default function HomeScreen() {
  const [isWifiModalVisible, setWifiModalVisible] = useState(false);
  const [isPromptModalVisible, setPromptModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>StoryTeller</Text>
          <Text style={styles.headerSubtitle}>by Sukhman</Text>
        </View>

        <View style={styles.bearContainer}>
          <BearIcon />
        </View>

        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Hi, this is StoryTeller by Sukhman, how can I help you today?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setWifiModalVisible(true)}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="wifi" size={24} color={COLORS.primary[700]} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Change WiFi Connection</Text>
              <Text style={styles.optionDescription}>
                Update the network your teddy uses
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setPromptModalVisible(true)}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.primary[700]} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Update System Prompt</Text>
              <Text style={styles.optionDescription}>
                Customize how your teddy interacts
              </Text>
            </View>
          </TouchableOpacity>

          <Link href="/child-activity" asChild>
            <TouchableOpacity style={styles.optionButton}>
              <View style={[styles.optionIconContainer, { backgroundColor: COLORS.accent[100] }]}>
                <Ionicons name="time" size={24} color={COLORS.accent[600]} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>See conversation history</Text>
                <Text style={styles.optionDescription}>
                  Review conversations and learning progress
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>

      <WiFiModal
        visible={isWifiModalVisible}
        onClose={() => setWifiModalVisible(false)}
      />

      <SystemPromptModal
        visible={isPromptModalVisible}
        onClose={() => setPromptModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: COLORS.primary[700],
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  bearContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingContainer: {
    marginTop: 30,
    marginHorizontal: 10,
    padding: 16,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary[400],
  },
  greeting: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    color: COLORS.gray[800],
    lineHeight: 26,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 30,
    gap: 16,
  },
  optionButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[500],
  },
});