import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { ArrowLeft, Camera, Plus, X } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { updateUserProfile, fetchUserProfile } from '@/store/slices/userSlice';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profile, isLoading } = useAppSelector((state) => state.user);

  // Parent information
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');

  // Child information
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [interests, setInterests] = useState<string[]>(['']);

  useEffect(() => {
    // Load profile data if not already loaded
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  useEffect(() => {
    // Populate form with existing profile data
    if (profile) {
      setParentName(profile.parent.name);
      setParentEmail(profile.parent.email);
      setParentPhone(profile.parent.phone_number || '');
      setChildName(profile.child.name);
      setChildAge(profile.child.age.toString());
      setInterests(profile.child.interests.length > 0 ? profile.child.interests : ['']);
    }
  }, [profile]);

  const addInterest = () => {
    setInterests([...interests, '']);
  };

  const removeInterest = (index: number) => {
    if (interests.length > 1) {
      setInterests(interests.filter((_, i) => i !== index));
    }
  };

  const updateInterest = (index: number, value: string) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
  };

  const handleSave = async () => {
    // Validation
    if (!parentName || !parentEmail || !childName || !childAge) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const age = parseInt(childAge);
    if (isNaN(age) || age < 1 || age > 18) {
      Alert.alert('Error', 'Please enter a valid age between 1 and 18');
      return;
    }

    const filteredInterests = interests.filter(interest => interest.trim() !== '');
    if (filteredInterests.length === 0) {
      Alert.alert('Error', 'Please add at least one interest for your child');
      return;
    }

    try {
      await dispatch(updateUserProfile({
        parent: {
          name: parentName,
          email: parentEmail,
          phone_number: parentPhone || undefined,
        },
        child: {
          name: childName,
          age,
          interests: filteredInterests,
        },
      })).unwrap();

      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Update Failed', error as string);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.gray[800]} />
        </TouchableOpacity>
        <Text style={styles.title}>Account Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>{getInitials(parentName)}</Text>
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Parent Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={parentName}
              onChangeText={setParentName}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={parentEmail}
              onChangeText={setParentEmail}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={parentPhone}
              onChangeText={setParentPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Child Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Child's Name *</Text>
            <TextInput
              style={styles.input}
              value={childName}
              onChangeText={setChildName}
              placeholder="Enter child's name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Child's Age *</Text>
            <TextInput
              style={styles.input}
              value={childAge}
              onChangeText={setChildAge}
              placeholder="Enter child's age"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interests *</Text>
            {interests.map((interest, index) => (
              <View key={index} style={styles.interestRow}>
                <TextInput
                  style={styles.interestInput}
                  placeholder={`Interest ${index + 1}`}
                  value={interest}
                  onChangeText={(value) => updateInterest(index, value)}
                />
                {interests.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeInterest(index)}
                  >
                    <X size={20} color={COLORS.error.default} />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.addButton} onPress={addInterest}>
              <Plus size={20} color={COLORS.primary[600]} />
              <Text style={styles.addButtonText}>Add Interest</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontFamily: 'Nunito-Bold',
    fontSize: 32,
    color: COLORS.primary[700],
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  changePhotoText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.primary[600],
    marginTop: 12,
  },
  formSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.gray[800],
    marginBottom: 16,
  },
  inputGroup: {
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
  interestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  interestInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: COLORS.gray[800],
  },
  removeButton: {
    marginLeft: 12,
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 2,
    borderColor: COLORS.primary[200],
    borderStyle: 'dashed',
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: COLORS.primary[600],
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    height: 50,
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
  saveButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: COLORS.primary[600],
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.gray[300],
  },
  saveButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
});