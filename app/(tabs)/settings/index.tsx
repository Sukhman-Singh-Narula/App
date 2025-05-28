import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { User, Bell, Moon, CircleHelp as HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Link href="/settings/account" asChild>
          <TouchableOpacity style={styles.profileCard}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Jane Doe</Text>
              <Text style={styles.profileEmail}>jane.doe@example.com</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </Link>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <Link href="/settings/account" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.primary[100] }]}>
                <User size={18} color={COLORS.primary[600]} />
              </View>
              <Text style={styles.settingText}>Account Settings</Text>
              <ChevronRight size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>
          
          <Link href="/settings/notifications" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.accent[100] }]}>
                <Bell size={18} color={COLORS.accent[600]} />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
              <ChevronRight size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>
          
          <Link href="/settings/appearance" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary[100] }]}>
                <Moon size={18} color={COLORS.secondary[600]} />
              </View>
              <Text style={styles.settingText}>Appearance</Text>
              <ChevronRight size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary[100] }]}>
              <HelpCircle size={18} color={COLORS.secondary[600]} />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
            <ChevronRight size={18} color={COLORS.gray[400]} />
          </TouchableOpacity>
          
          <Link href="/settings/privacy-policy" asChild>
            <TouchableOpacity style={styles.settingItem}>
              <View style={[styles.iconContainer, { backgroundColor: COLORS.gray[200] }]}>
                <FileText size={18} color={COLORS.gray[600]} />
              </View>
              <Text style={styles.settingText}>Terms & Privacy Policy</Text>
              <ChevronRight size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={18} color={COLORS.error.default} />
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