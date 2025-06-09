// File: app/auth/login.tsx - Fixed navigation logic with detailed logging
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
import { signInWithEmail, clearError } from '@/store/slices/authSlice';
import { BearIcon } from '@/components/BearIcon';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            console.log('🔑 Starting login process for:', email);
            const result = await dispatch(signInWithEmail({ email, password })).unwrap();

            console.log('✅ Login successful! Navigation decision:');
            console.log(`   - User authenticated: ✅`);
            console.log(`   - Has profile: ${result.hasProfile ? '✅' : '❌'}`);
            console.log(`   - Will navigate to: ${result.hasProfile ? 'HOME' : 'PROFILE SETUP'}`);

            // Add a small delay to ensure state is properly updated
            setTimeout(() => {
                if (result.hasProfile) {
                    console.log('🏠 Navigating to home (user has profile)');
                    router.replace('/(tabs)');
                } else {
                    console.log('👤 Navigating to profile setup (user needs profile)');
                    router.replace('/auth/setup-profile');
                }
            }, 100);

        } catch (error) {
            console.error('❌ Login failed:', error);
            Alert.alert('Login Failed', error as string);
        }
    };

    React.useEffect(() => {
        if (error) {
            Alert.alert('Login Error', error);
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
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
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

                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            <Text style={styles.loginButtonText}>
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <Link href="/auth/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.signupLink}>Sign Up</Text>
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
    loginButton: {
        height: 50,
        backgroundColor: COLORS.primary[600],
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonDisabled: {
        backgroundColor: COLORS.gray[300],
    },
    loginButtonText: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 16,
        color: COLORS.white,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    signupText: {
        fontFamily: 'Nunito-Regular',
        fontSize: 14,
        color: COLORS.gray[600],
    },
    signupLink: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 14,
        color: COLORS.primary[600],
    },
});