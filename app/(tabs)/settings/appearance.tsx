import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { ArrowLeft, Moon, Sun, Palette } from 'lucide-react-native';

export default function AppearanceScreen() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  const handleThemeToggle = () => {
    if (useSystemTheme) {
      setUseSystemTheme(false);
      setIsDarkMode(true);
    } else {
      setIsDarkMode(!isDarkMode);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>

          <View style={styles.themeOption}>
            <View style={styles.themeIconContainer}>
              <Palette size={24} color={COLORS.primary[600]} />
            </View>
            <View style={styles.themeInfo}>
              <Text style={styles.themeTitle}>Use System Theme</Text>
              <Text style={styles.themeDescription}>Automatically match system settings</Text>
            </View>
            <Switch
              value={useSystemTheme}
              onValueChange={(value) => {
                setUseSystemTheme(value);
                if (value) {
                  // Reset to system theme
                  setIsDarkMode(false);
                }
              }}
              trackColor={{ false: COLORS.gray[200], true: COLORS.primary[200] }}
              thumbColor={useSystemTheme ? COLORS.primary[600] : COLORS.gray[400]}
            />
          </View>

          <View style={[styles.themeOption, useSystemTheme && styles.themeOptionDisabled]}>
            <View style={styles.themeIconContainer}>
              {isDarkMode ? (
                <Moon size={24} color={COLORS.primary[600]} />
              ) : (
                <Sun size={24} color={COLORS.primary[600]} />
              )}
            </View>
            <View style={styles.themeInfo}>
              <Text style={styles.themeTitle}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
              <Text style={styles.themeDescription}>
                {isDarkMode ? 'Easier on the eyes in low light' : 'Classic bright appearance'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              disabled={useSystemTheme}
              trackColor={{ false: COLORS.gray[200], true: COLORS.primary[200] }}
              thumbColor={isDarkMode ? COLORS.primary[600] : COLORS.gray[400]}
            />
          </View>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={[styles.previewCard, isDarkMode && !useSystemTheme && styles.previewCardDark]}>
            <Text style={[styles.previewText, isDarkMode && !useSystemTheme && styles.previewTextDark]}>
              This is how your app will look
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 8 : 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: COLORS.gray[800],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
    marginBottom: 16,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  themeOptionDisabled: {
    opacity: 0.5,
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  themeInfo: {
    flex: 1,
    marginRight: 16,
  },
  themeTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  themeDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[500],
  },
  previewSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  previewCardDark: {
    backgroundColor: COLORS.gray[900],
    borderColor: COLORS.gray[700],
  },
  previewText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[800],
    textAlign: 'center',
  },
  previewTextDark: {
    color: COLORS.white,
  },
});