import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            At Langpals, we take your privacy seriously. This privacy policy describes how we collect, use, and handle your information when you use our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information that you provide directly to us, including:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Account information (name, email, phone number)</Text>
            <Text style={styles.bulletPoint}>• Child's information (name, age, learning preferences)</Text>
            <Text style={styles.bulletPoint}>• Device and connection information</Text>
            <Text style={styles.bulletPoint}>• Conversation data between your child and Teddy</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the collected information to:
          </Text>
          <View style={styles.bulletPoints}>
            <Text style={styles.bulletPoint}>• Provide and improve our services</Text>
            <Text style={styles.bulletPoint}>• Personalize learning experiences</Text>
            <Text style={styles.bulletPoint}>• Monitor and analyze usage patterns</Text>
            <Text style={styles.bulletPoint}>• Communicate with you about our services</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate security measures to protect your personal information. This includes encryption, secure storage, and regular security audits.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            We are committed to protecting children's privacy and comply with all applicable laws and regulations regarding children's data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about our privacy policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>privacy@langpals.com</Text>
        </View>

        <Text style={styles.lastUpdated}>Last updated: March 2024</Text>
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
    marginBottom: 16,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: COLORS.gray[800],
    marginBottom: 12,
  },
  paragraph: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoints: {
    marginTop: 8,
  },
  bulletPoint: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 24,
    paddingLeft: 8,
  },
  contactInfo: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.primary[600],
    marginTop: 8,
  },
  lastUpdated: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});