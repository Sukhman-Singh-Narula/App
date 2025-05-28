import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { X, TrendingUp, Brain, Clock, MessageCircle, Smile } from 'lucide-react-native';

interface ConversationModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: {
    date: string;
    duration: string;
    topic: string;
    insights: string;
    mood: string;
    progress: string;
    performance: string;
    summary: string;
  };
}

export default function ConversationModal({ visible, onClose, conversation }: ConversationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Conversation Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MessageCircle size={20} color={COLORS.primary[600]} />
                <Text style={styles.sectionTitle}>Topic & Time</Text>
              </View>
              <Text style={styles.topicText}>{conversation.topic}</Text>
              <View style={styles.timeInfo}>
                <Clock size={16} color={COLORS.gray[500]} />
                <Text style={styles.timeText}>{conversation.date} • {conversation.duration}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Brain size={20} color={COLORS.primary[600]} />
                <Text style={styles.sectionTitle}>Learning Summary</Text>
              </View>
              <Text style={styles.summaryText}>{conversation.summary}</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Smile size={20} color={COLORS.accent[500]} />
                <Text style={styles.sectionTitle}>Child's Engagement</Text>
              </View>
              <Text style={styles.moodText}>Mood: {conversation.mood}</Text>
              <Text style={styles.progressText}>Progress: {conversation.progress}</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color={COLORS.secondary[600]} />
                <Text style={styles.sectionTitle}>Performance Analysis</Text>
              </View>
              <Text style={styles.performanceText}>{conversation.performance}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: COLORS.gray[800],
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: COLORS.gray[800],
    marginLeft: 8,
  },
  topicText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 18,
    color: COLORS.primary[700],
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 6,
  },
  summaryText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[700],
    lineHeight: 24,
  },
  moodText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
    marginBottom: 8,
  },
  progressText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
  },
  performanceText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[700],
    lineHeight: 24,
  },
  closeModalButton: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: COLORS.primary[600],
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
});