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
import { ArrowLeft } from 'lucide-react-native';

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    conversations: true,
    progress: true,
    achievements: true,
    updates: false,
    tips: true,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>New Conversations</Text>
              <Text style={styles.settingDescription}>Get notified when your child starts a new conversation</Text>
            </View>
            <Switch
              value={notifications.conversations}
              onValueChange={() => toggleSwitch('conversations')}
              trackColor={{ false: COLORS.gray[200], true: COLORS.primary[200] }}
              thumbColor={notifications.conversations ? COLORS.primary[600] : COLORS.gray[400]}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Learning Progress</Text>
              <Text style={styles.settingDescription}>Weekly progress updates and achievements</Text>
            </View>
            <Switch
              value={notifications.progress}
              onValueChange={() => toggleSwitch('progress')}
              trackColor={{ false: COLORS.gray[200], true: COLORS.primary[200] }}
              thumbColor={notifications.progress ? COLORS.primary[600] : COLORS.gray[400]}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Achievements</Text>
              <Text style={styles.settingDescription}>Notifications for new milestones and badges</Text>
            </View>
            <Switch
              value={notifications.achievements}
              onValueChange={() => toggleSwitch('achievements')}
              trackColor={{ false: COLORS.gray[200], true: COLORS.primary[200] }}
              thumbColor={notifications.achievements ? COLORS.primary[600] : COLORS.gray[400]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>App Updates</Text>
              <Text style={styles.settingDescription}>Stay informed about new features and improvements</Text>
            </View>
            <Switch
              value={notifications.updates}
              onValueChange={() => toggleSwitch('updates')}
              trackColor={{ false: COLORS.gray[200], true: COLORS.primary[200] }}
              thumbColor={notifications.updates ? COLORS.primary[600] : COLORS.gray[400]}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Learning Tips</Text>
              <Text style={styles.settingDescription}>Receive helpful tips for better engagement</Text>
            </View>
            <Switch
              value={notifications.tips}
              onValueChange={() => toggleSwitch('tips')}
              trackColor={{ false: COLORS.gray[200], true: COLORS.primary[200] }}
              thumbColor={notifications.tips ? COLORS.primary[600] : COLORS.gray[400]}
            />
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[500],
  },
});