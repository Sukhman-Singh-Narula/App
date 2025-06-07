// File: app/(tabs)/index.tsx (Updated with Redux and Story Generation)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { BearIcon } from '@/components/BearIcon';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import WiFiModal from '@/components/WiFiModal';
import SystemPromptModal from '@/components/SystemPromptModal';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchUserProfile } from '@/store/slices/userSlice';
import { generateStory, fetchUserStories } from '@/store/slices/storySlice';
import { Mic, Send, Sparkles } from 'lucide-react-native';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { isGenerating, currentStory } = useAppSelector((state) => state.story);

  const [isWifiModalVisible, setWifiModalVisible] = useState(false);
  const [isPromptModalVisible, setPromptModalVisible] = useState(false);
  const [isStoryModalVisible, setStoryModalVisible] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState('');

  useEffect(() => {
    // Load user profile and stories on component mount
    dispatch(fetchUserProfile());
    dispatch(fetchUserStories());
  }, [dispatch]);

  const handleGenerateStory = async () => {
    if (!storyPrompt.trim()) {
      Alert.alert('Error', 'Please enter a story prompt');
      return;
    }

    try {
      await dispatch(generateStory({ prompt: storyPrompt })).unwrap();
      setStoryPrompt('');
      setStoryModalVisible(false);

      Alert.alert(
        'Story Generated!',
        'Your custom story has been created and is ready to play on your StoryTeller device.',
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('Generation Failed', error as string);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const childName = profile?.child.name || 'there';

    if (hour < 12) {
      return `Good morning! Ready for some stories, ${childName}?`;
    } else if (hour < 17) {
      return `Good afternoon, ${childName}! What story should we create today?`;
    } else {
      return `Good evening, ${childName}! Time for a bedtime story?`;
    }
  };

  const StoryGenerationModal = () => (
    <Modal
      visible={isStoryModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setStoryModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.storyModalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create a Story</Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setStoryModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalIconContainer}>
            <Sparkles size={32} color={COLORS.primary[600]} />
          </View>

          <Text style={styles.modalDescription}>
            Tell me what kind of story you'd like for {profile?.child.name || 'your child'}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.storyInput}
              placeholder="e.g., A brave princess who saves dragons..."
              value={storyPrompt}
              onChangeText={setStoryPrompt}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setStoryModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalGenerateButton,
                (!storyPrompt.trim() || isGenerating) && styles.modalGenerateButtonDisabled,
              ]}
              onPress={handleGenerateStory}
              disabled={!storyPrompt.trim() || isGenerating}
            >
              <Text style={styles.modalGenerateButtonText}>
                {isGenerating ? 'Creating...' : 'Generate Story'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
            {getGreeting()}
          </Text>
        </View>

        {/* Story Generation Section */}
        <View style={styles.storySection}>
          <Text style={styles.sectionTitle}>Create a New Story</Text>
          <TouchableOpacity
            style={styles.generateStoryButton}
            onPress={() => setStoryModalVisible(true)}
            disabled={isGenerating}
          >
            <View style={styles.generateButtonContent}>
              <View style={styles.generateIconContainer}>
                <Sparkles size={24} color={COLORS.white} />
              </View>
              <View style={styles.generateTextContainer}>
                <Text style={styles.generateButtonTitle}>
                  {isGenerating ? 'Creating Story...' : 'Generate Custom Story'}
                </Text>
                <Text style={styles.generateButtonDescription}>
                  {isGenerating
                    ? 'Please wait while we create your story'
                    : `Create a personalized story for ${profile?.child.name || 'your child'}`
                  }
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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

          <Link href="/(tabs)/child-activity" asChild>
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

        {/* Recent Stories Section */}
        {currentStory && (
          <View style={styles.recentStorySection}>
            <Text style={styles.sectionTitle}>Latest Story</Text>
            <View style={styles.storyCard}>
              <View style={styles.storyCardHeader}>
                <Text style={styles.storyTitle}>{currentStory.title}</Text>
                <View style={styles.storyBadge}>
                  <Text style={styles.storyBadgeText}>Ready</Text>
                </View>
              </View>
              <Text style={styles.storyDescription}>
                Duration: {Math.round(currentStory.total_duration / 1000 / 60)} minutes
              </Text>
              <Text style={styles.storyDescription}>
                {currentStory.segments.filter(s => s.type === 'image').length} scenes
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <WiFiModal
        visible={isWifiModalVisible}
        onClose={() => setWifiModalVisible(false)}
      />

      <SystemPromptModal
        visible={isPromptModalVisible}
        onClose={() => setPromptModalVisible(false)}
      />

      <StoryGenerationModal />
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
  storySection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: COLORS.gray[800],
    marginBottom: 16,
  },
  generateStoryButton: {
    backgroundColor: COLORS.primary[600],
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  generateIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  generateTextContainer: {
    flex: 1,
  },
  generateButtonTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 4,
  },
  generateButtonDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.primary[100],
    lineHeight: 20,
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
  recentStorySection: {
    marginTop: 30,
  },
  storyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  storyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: COLORS.gray[800],
    flex: 1,
  },
  storyBadge: {
    backgroundColor: COLORS.success.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  storyBadgeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: COLORS.success.dark,
  },
  storyDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    marginBottom: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyModalContainer: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: COLORS.gray[800],
  },
  closeModalButton: {
    padding: 4,
  },
  modalIconContainer: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  storyInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[800],
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 12,
  },
  modalCancelButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
  },
  modalGenerateButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: COLORS.primary[600],
    borderRadius: 12,
  },
  modalGenerateButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  modalGenerateButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
});