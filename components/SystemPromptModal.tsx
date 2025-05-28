import React, { useState } from 'react';
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
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { MessageSquare, X } from 'lucide-react-native';

interface SystemPromptModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SystemPromptModal({ visible, onClose }: SystemPromptModalProps) {
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSubmit = () => {
    // Here you would implement the actual system prompt update logic
    console.log('Updating system prompt:', systemPrompt);
    
    // Reset form and close modal
    setSystemPrompt('');
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Update System Prompt</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color={COLORS.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <MessageSquare size={32} color={COLORS.primary[600]} />
            </View>
            
            <Text style={styles.description}>
              Customize how your StoryTeller interacts with your child
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>System Prompt</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your custom system prompt"
                value={systemPrompt}
                onChangeText={setSystemPrompt}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.updateButton,
                  !systemPrompt && styles.updateButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!systemPrompt}
              >
                <Text style={styles.updateButtonText}>Update</Text>
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
    width: '85%',
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
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.gray[700],
    marginBottom: 6,
  },
  input: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    padding: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[800],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[700],
  },
  updateButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: COLORS.primary[600],
    borderRadius: 8,
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