import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { ConversationTable } from '@/components/ConversationTable';
import { CalendarDays, ChevronDown } from 'lucide-react-native';

const timeFilters = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 60 days', value: '60' },
];

const conversations = [
  {
    id: '1',
    date: 'Today, 3:30 PM',
    duration: '15 minutes',
    topic: 'Dinosaurs',
    insights: 'Learned about different types of dinosaurs and when they lived',
    mood: 'Very engaged and excited',
    progress: 'Excellent retention of new vocabulary',
    performance: 'Tommy shows above-average interest in prehistoric animals compared to peers. His ability to remember and pronounce complex dinosaur names is particularly impressive for his age group.',
    summary: 'During this session, Tommy learned about various dinosaur species, their habitats, and the time periods they lived in. He showed great enthusiasm when discussing herbivores vs carnivores and could correctly identify several species by their characteristics.',
  },
  {
    id: '2',
    date: 'Yesterday, 5:45 PM',
    duration: '20 minutes',
    topic: 'Space and planets',
    insights: 'Discussed the solar system and properties of different planets',
    mood: 'Curious and attentive',
    progress: 'Good grasp of basic astronomical concepts',
    performance: 'Tommy\'s understanding of spatial concepts and planetary order is developing well. His curiosity about space phenomena is typical for his age group, with particularly strong interest in Mars exploration.',
    summary: 'The conversation covered the basic structure of our solar system, focusing on planet identification and their unique characteristics. Tommy showed special interest in Mars and asked thoughtful questions about space travel.',
  },
  {
    id: '3',
    date: 'Aug 15, 2:15 PM',
    duration: '10 minutes',
    topic: 'Animals',
    insights: 'Talked about favorite animals and their habitats',
    mood: 'Enthusiastic and participative',
    progress: 'Strong vocabulary development',
    performance: 'Tommy\'s knowledge of animal habitats and behaviors is advancing rapidly. His ability to make connections between different species and their environments is above average for his age group.',
    summary: 'We explored various animal habitats and discussed how different animals adapt to their environments. Tommy showed particular interest in marine animals and could explain basic concepts about ocean life.',
  },
  {
    id: '4',
    date: 'Aug 13, 6:20 PM',
    duration: '25 minutes',
    topic: 'Colors and shapes',
    insights: 'Practiced identifying different shapes and mixing colors',
    mood: 'Focused and creative',
    progress: 'Excellent pattern recognition',
    performance: 'Tommy demonstrates strong visual-spatial skills when working with shapes and colors. His ability to recognize and create patterns is particularly noteworthy compared to peers.',
    summary: 'The session focused on advanced shape recognition and color mixing concepts. Tommy successfully identified complex shapes and showed understanding of how primary colors combine to create secondary colors.',
  },
  {
    id: '5',
    date: 'Aug 10, 4:30 PM',
    duration: '15 minutes',
    topic: 'Counting numbers',
    insights: 'Practiced counting from 1 to 20 and simple addition',
    mood: 'Patient and determined',
    progress: 'Strong numerical understanding',
    performance: 'Tommy\'s mathematical skills are developing at an expected pace. He shows particular strength in sequential counting and is beginning to grasp basic addition concepts.',
    summary: 'We worked on counting sequences and introduced basic addition using practical examples. Tommy showed good understanding of number order and could solve simple addition problems using visual aids.',
  },
];

export default function ChildActivityScreen() {
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(timeFilters[0]);

  const handleFilterSelect = (filter: typeof timeFilters[0]) => {
    setSelectedFilter(filter);
    setFilterVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Child Activity</Text>
        <Text style={styles.subtitle}>Conversation history with Teddy</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setFilterVisible(true)}
      >
        <CalendarDays size={20} color={COLORS.primary[600]} />
        <Text style={styles.filterText}>{selectedFilter.label}</Text>
        <ChevronDown size={16} color={COLORS.gray[500]} />
      </TouchableOpacity>

      <Modal
        visible={isFilterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterVisible(false)}
        >
          <View style={styles.filterModal}>
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterOption,
                  selectedFilter.value === filter.value && styles.filterOptionSelected,
                ]}
                onPress={() => handleFilterSelect(filter)}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedFilter.value === filter.value && styles.filterOptionTextSelected,
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85 min</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Recent Conversations</Text>
          <ConversationTable conversations={conversations} />
        </View>
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
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[500],
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.primary[600],
    marginHorizontal: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 8,
    width: '80%',
    maxWidth: 300,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary[50],
  },
  filterOptionText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
  },
  filterOptionTextSelected: {
    color: COLORS.primary[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: COLORS.primary[600],
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tableTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[800],
    marginBottom: 12,
  },
});