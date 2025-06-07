// File: app/auth/setup-profile.tsx - Fixed with proper navigation
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { registerUser } from '@/store/slices/userSlice';
import { updateProfileStatus } from '@/store/slices/authSlice';
import { BearIcon } from '@/components/BearIcon';
import { Plus, X } from 'lucide-react-native';

export default function SetupProfileScreen() {
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.user);

    // Parent information
    const [parentName, setParentName] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [parentPhone, setParentPhone] = useState('');

    // Child information
    const [childName, setChildName] = useState('');
    const [childAge, setChildAge] = useState('');
    const [interests, setInterests] = useState<string[]>(['']);

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

    const handleSetupProfile = async () => {
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
            console.log('🔄 Setting up profile...');

            const result = await dispatch(registerUser({
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

            console.log('✅ Profile setup successful:', result);

            // Update the auth state to reflect profile creation
            dispatch(updateProfileStatus(true));

            // Show success message and navigate
            Alert.alert(
                'Profile Created!',
                'Your profile has been set up successfully.',
                [
                    {
                        text: 'Continue',
                        onPress: () => {
                            console.log('🚀 Navigating to home...');
                            // Use replace to prevent going back to setup
                            router.replace('/(tabs)');
                        }
                    }
                ]
            );

        } catch (error) {
            console.error('❌ Profile setup failed:', error);
            Alert.alert('Setup Failed', error as string);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <BearIcon />
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.subtitle}>Tell us about you and your child</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Parent Information</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            value={parentName}
                            onChangeText={setParentName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            value={parentEmail}
                            onChangeText={setParentEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your phone number"
                            value={parentPhone}
                            onChangeText={setParentPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Child Information</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Child's Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your child's name"
                            value={childName}
                            onChangeText={setChildName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Age *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter age"
                            value={childAge}
                            onChangeText={setChildAge}
                            keyboardType="number-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
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

                <TouchableOpacity
                    style={[styles.setupButton, isLoading && styles.setupButtonDisabled]}
                    onPress={handleSetupProfile}
                    disabled={isLoading}
                >
                    <Text style={styles.setupButtonText}>
                        {isLoading ? 'Setting Up...' : 'Complete Setup'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    title: {
        fontFamily: 'Nunito-Bold',
        fontSize: 24,
        color: COLORS.gray[800],
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Nunito-Regular',
        fontSize: 16,
        color: COLORS.gray[500],
        textAlign: 'center',
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontFamily: 'Nunito-Bold',
        fontSize: 18,
        color: COLORS.gray[800],
        marginBottom: 20,
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
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 12,
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
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 12,
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
        height: 50,
        borderWidth: 2,
        borderColor: COLORS.primary[200],
        borderStyle: 'dashed',
        borderRadius: 12,
        marginTop: 8,
    },
    addButtonText: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 14,
        color: COLORS.primary[600],
        marginLeft: 8,
    },
    setupButton: {
        height: 50,
        backgroundColor: COLORS.primary[600],
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    setupButtonDisabled: {
        backgroundColor: COLORS.gray[300],
    },
    setupButtonText: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 16,
        color: COLORS.white,
    },
});