// File: app/auth/signup.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { signUpWithEmail, clearError } from '@/store/slices/authSlice';
import { BearIcon } from '@/components/BearIcon';
import { Eye, EyeOff } from 'lucide-react-native';

export default function SignupScreen() {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        try {
            await dispatch(signUpWithEmail({ email, password })).unwrap();
            // New users always need to set up profile
            router.replace('/auth/setup-profile');
        } catch (error) {
            Alert.alert('Signup Failed', error as string);
        }
    };

    React.useEffect(() => {
        if (error) {
            Alert.alert('Signup Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <BearIcon />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join StoryTeller today</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoComplete="password"
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color={COLORS.gray[500]} />
                                    ) : (
                                        <Eye size={20} color={COLORS.gray[500]} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoComplete="password"
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color={COLORS.gray[500]} />
                                    ) : (
                                        <Eye size={20} color={COLORS.gray[500]} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                            onPress={handleSignup}
                            disabled={isLoading}
                        >
                            <Text style={styles.signupButtonText}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <Link href="/auth/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.loginLink}>Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontFamily: 'Nunito-Bold',
        fontSize: 28,
        color: COLORS.gray[800],
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: 'Nunito-Regular',
        fontSize: 16,
        color: COLORS.gray[500],
    },
    form: {
        width: '100%',
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
    passwordContainer: {
        flexDirection: 'row',
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        borderRadius: 12,
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        fontFamily: 'Nunito-Regular',
        fontSize: 16,
        color: COLORS.gray[800],
    },
    eyeButton: {
        padding: 12,
    },
    signupButton: {
        height: 50,
        backgroundColor: COLORS.primary[600],
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    signupButtonDisabled: {
        backgroundColor: COLORS.gray[300],
    },
    signupButtonText: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 16,
        color: COLORS.white,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    loginText: {
        fontFamily: 'Nunito-Regular',
        fontSize: 14,
        color: COLORS.gray[600],
    },
    loginLink: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 14,
        color: COLORS.primary[600],
    },
});
