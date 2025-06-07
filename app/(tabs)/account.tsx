// File: app/(tabs)/account.tsx - Moved settings content to account tab
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { signOut } from '@/store/slices/authSlice';

export default function AccountScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            dispatch(signOut());
            router.replace('/auth/login');
          }
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Link href="/settings/account" asChild>
          <TouchableOpacity style={styles.profileCard}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {profile?.parent.name ? getInitials(profile.parent.name) : 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.parent.name || user?.email || 'User'}
              </Text>
              <Text style={styles.profileEmail}>
                {profile?.parent.email || user?.email}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </Link>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>

          <Link href="/settings/account" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primary[100] }]}>
                <Ionicons name="person" size={18} color={COLORS.primary[600]} />
              </View>
              <Text style={styles.settingText}>Account Settings</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>

          <Link href="/settings/notifications" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.accent[100] }]}>
                <Ionicons name="notifications" size={18} color={COLORS.accent[600]} />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>

          <Link href="/settings/appearance" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary[100] }]}>
                <Ionicons name="moon" size={18} color={COLORS.secondary[600]} />
              </View>
              <Text style={styles.settingText}>Appearance</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary[100] }]}>
              <Ionicons name="help-circle" size={18} color={COLORS.secondary[600]} />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gray[400]} />
          </TouchableOpacity>

          <Link href="/settings/privacy-policy" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.gray[200] }]}>
                <Ionicons name="document-text" size={18} color={COLORS.gray[600]} />
              </View>
              <Text style={styles.settingText}>Terms & Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={18} color={COLORS.error.default} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: COLORS.gray[800],
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: COLORS.primary[700],
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[500],
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.gray[500],
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[800],
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.error.default,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginBottom: 24,
  },
});