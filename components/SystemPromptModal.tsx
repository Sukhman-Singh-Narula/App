// File: components/SystemPromptModal.tsx (Harmonized with Redux and server API)
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { MessageSquare, X } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateSystemPrompt } from '@/store/slices/userSlice';

interface SystemPromptModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SystemPromptModal({ visible, onClose }: SystemPromptModalProps) {
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((state) => state.user);
  const [systemPrompt, setSystemPrompt] = useState('');

  useEffect(() => {
    if (profile && visible) {
      setSystemPrompt(profile.system_prompt || '');
    }
  }, [profile, visible]);

  const handleSubmit = async () => {
    if (!systemPrompt.trim()) {
      Alert.alert('Error', 'Please enter a system prompt');
      return;
    }

    try {
      console.log('🔄 Updating system prompt...');

      await dispatch(updateSystemPrompt({
        systemPrompt: systemPrompt.trim(),
      })).unwrap();

      Alert.alert('Success', 'System prompt updated successfully!');
      onClose();
    } catch (error) {
      console.error('❌ System prompt update failed:', error);
      Alert.alert('Update Failed', error as string);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleClose = () => {
    // Reset to original value when closing without saving
    if (profile) {
      setSystemPrompt(profile.system_prompt || '');
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Update System Prompt</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <X size={20} color={COLORS.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <MessageSquare size={32} color={COLORS.primary[600]} />
            </View>

            <Text style={styles.description}>
              Customize how your StoryTeller interacts with {profile?.child.name || 'your child'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>System Prompt</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your custom system prompt..."
                value={systemPrompt}
                onChangeText={setSystemPrompt}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={2000}
              />
              <Text style={styles.characterCount}>
                {systemPrompt.length}/2000 characters
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.updateButton,
                  (!systemPrompt.trim() || isLoading) && styles.updateButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!systemPrompt.trim() || isLoading}
              >
                <Text style={styles.updateButtonText}>
                  {isLoading ? 'Updating...' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: COLORS.gray[800],
  },
  closeButton: {
    padding: 4,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.gray[700],
    marginBottom: 8,
  },
  input: {
    minHeight: 140,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[800],
    lineHeight: 22,
  },
  characterCount: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: 'right',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 12,
  },
  cancelButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
  },
  updateButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: COLORS.primary[600],
    borderRadius: 12,
  },
  updateButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  updateButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
});