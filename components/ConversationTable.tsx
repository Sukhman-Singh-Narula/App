import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Clock, MessageCircle, Lightbulb, ChevronRight } from 'lucide-react-native';
import ConversationModal from './ConversationModal';

interface Conversation {
  id: string;
  date: string;
  duration: string;
  topic: string;
  insights: string;
  mood: string;
  progress: string;
  performance: string;
  summary: string;
}

interface ConversationTableProps {
  conversations: Conversation[];
}

export function ConversationTable({ conversations }: ConversationTableProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleConversationPress = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.conversationHeader}>
        <Text style={styles.date}>{item.date}</Text>
        <ChevronRight size={18} color={COLORS.gray[400]} />
      </View>
      
      <View style={styles.topicContainer}>
        <View style={styles.iconContainer}>
          <MessageCircle size={18} color={COLORS.primary[600]} />
        </View>
        <View style={styles.topicContent}>
          <Text style={styles.topicLabel}>Topic:</Text>
          <Text style={styles.topicValue}>{item.topic}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Clock size={16} color={COLORS.gray[500]} />
          </View>
          <Text style={styles.infoText}>{item.duration}</Text>
        </View>
        
        <View style={[styles.infoItem, styles.insightContainer]}>
          <View style={styles.iconContainer}>
            <Lightbulb size={16} color={COLORS.accent[500]} />
          </View>
          <Text style={styles.infoText} numberOfLines={2}>
            {item.insights}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        scrollEnabled={false}
      />
      
      {selectedConversation && (
        <ConversationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          conversation={selectedConversation}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  conversationItem: {
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 2,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.gray[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  date: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.gray[800],
  },
  topicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  topicContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.gray[600],
    marginRight: 4,
  },
  topicValue: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: COLORS.primary[700],
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContainer: {
    flex: 1,
  },
  infoText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.gray[600],
    flex: 1,
    lineHeight: 18,
  },
  separator: {
    height: 12,
  },
});