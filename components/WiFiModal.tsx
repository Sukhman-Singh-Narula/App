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
import { Wifi, Eye, EyeOff, X } from 'lucide-react-native';

interface WiFiModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function WiFiModal({ visible, onClose }: WiFiModalProps) {
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    // Here you would implement the actual WiFi connection logic
    console.log('Connecting to:', wifiName, 'with password:', wifiPassword);
    
    // Reset form and close modal
    setWifiName('');
    setWifiPassword('');
    onClose();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              <Text style={styles.title}>WiFi Configuration</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color={COLORS.gray[500]} />
              </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
              <Wifi size={32} color={COLORS.primary[600]} />
            </View>
            
            <Text style={styles.description}>
              Update the WiFi connection for your Langpals teddy bear
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>WiFi Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter WiFi network name"
                value={wifiName}
                onChangeText={setWifiName}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>WiFi Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter WiFi password"
                  value={wifiPassword}
                  onChangeText={setWifiPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.visibilityToggle}
                  onPress={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={COLORS.gray[500]} />
                  ) : (
                    <Eye size={20} color={COLORS.gray[500]} />
                  )}
                </TouchableOpacity>
              </View>
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
                  styles.connectButton,
                  (!wifiName || !wifiPassword) && styles.connectButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!wifiName || !wifiPassword}
              >
                <Text style={styles.connectButtonText}>Connect</Text>
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
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[800],
  },
  passwordContainer: {
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[800],
  },
  visibilityToggle: {
    padding: 10,
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
  connectButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: COLORS.primary[600],
    borderRadius: 8,
  },
  connectButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  connectButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
});