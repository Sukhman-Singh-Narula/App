// File: store/slices/authSlice.ts - FIXED VERSION
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { apiService } from '../../services/apiService';

// Import Firebase auth after a delay to ensure it's initialized
let auth: any = null;

const initFirebaseAuth = async () => {
    if (!auth) { 
        try {
            const { auth: firebaseAuth } = await import('../../config/firebase');
            auth = firebaseAuth;
        } catch (error) {
            console.error('Failed to initialize Firebase auth:', error);
        }
    }
    return auth;
};

// Serializable user interface
interface SerializableUser {
    uid: string;
    email: string | null;
    emailVerified: boolean;
}

interface AuthState {
    isAuthenticated: boolean;
    user: SerializableUser | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean; // NEW: Track if auth is initialized
    error: string | null;
    tokenExpiry: number | null;
    hasProfile: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true, // Start as loading
    isInitialized: false, // CRITICAL: Start as not initialized
    error: null,
    tokenExpiry: null,
    hasProfile: false,
};
const TOKEN_EXPIRY_DAYS = 30;
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

// Helper function to convert Firebase user to serializable user
const toSerializableUser = (firebaseUser: any): SerializableUser => {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified
    };
};

// NEW: Initialize Firebase Auth State Listener
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            console.log('🔄 initializeAuth: Starting...');

            const firebaseAuth = await initFirebaseAuth();
            if (!firebaseAuth) {
                console.log('❌ initializeAuth: Firebase auth not available');
                throw new Error('Firebase auth not initialized');
            }

            console.log('✅ initializeAuth: Firebase auth available');

            return new Promise((resolve, reject) => {
                console.log('🔄 initializeAuth: Setting up auth state listener...');

                const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
                    unsubscribe(); // Only run once for initialization

                    console.log('🔄 initializeAuth: Auth state changed, firebaseUser:', firebaseUser ? 'EXISTS' : 'NULL');

                    try {
                        if (firebaseUser) {
                            console.log('✅ initializeAuth: Firebase user found:', firebaseUser.email);

                            // Get fresh token
                            console.log('🔄 initializeAuth: Getting Firebase token...');
                            const token = await firebaseUser.getIdToken();
                            console.log('✅ initializeAuth: Token obtained (length):', token.length);

                            // Check profile status - ADD EXTENSIVE DEBUGGING HERE
                            let hasProfile = false;
                            let userProfile = null;

                            console.log('🔄 initializeAuth: Starting profile check...');

                            try {
                                console.log('🔄 initializeAuth: Attempting backend verification...');
                                console.log('🔄 initializeAuth: Token (first 50 chars):', token.substring(0, 50) + '...');

                                const response = await apiService.verifyToken(token);
                                console.log('✅ initializeAuth: Backend verification response:', response);

                                hasProfile = response.has_profile;
                                userProfile = response.profile;
                                console.log('✅ initializeAuth: Backend verification successful, hasProfile:', hasProfile);

                            } catch (error) {
                                console.warn('⚠️ initializeAuth: Backend verification failed:', error);
                                console.warn('⚠️ initializeAuth: Error details:', {
                                    message: error.message,
                                    stack: error.stack,
                                    name: error.name
                                });

                                // Fallback: Check Firebase Firestore directly
                                console.log('🔄 initializeAuth: Trying Firebase direct check...');
                                try {
                                    const { FirebaseProfileService } = await import('@/services/firebaseProfileService');
                                    console.log('✅ initializeAuth: FirebaseProfileService imported');

                                    const result = await FirebaseProfileService.checkUserProfile({
                                        uid: firebaseUser.uid,
                                        email: firebaseUser.email
                                    });

                                    console.log('✅ initializeAuth: Firebase direct check result:', result);

                                    hasProfile = result.hasProfile;
                                    userProfile = result.profile;
                                    console.log('✅ initializeAuth: Firebase direct check:', hasProfile ? 'Profile found' : 'No profile');
                                } catch (firebaseError) {
                                    console.warn('⚠️ initializeAuth: Firebase direct check also failed:', firebaseError);
                                    console.warn('⚠️ initializeAuth: Firebase error details:', {
                                        message: firebaseError.message,
                                        stack: firebaseError.stack,
                                        name: firebaseError.name
                                    });
                                    hasProfile = false;
                                }
                            }

                            // Store token
                            console.log('🔄 initializeAuth: Storing token in AsyncStorage...');
                            const expiry = Date.now() + TOKEN_EXPIRY_MS;
                            await AsyncStorage.setItem('authToken', token);
                            await AsyncStorage.setItem('tokenExpiry', expiry.toString());
                            console.log('✅ initializeAuth: Token stored');

                            const result = {
                                user: toSerializableUser(firebaseUser),
                                token,
                                tokenExpiry: expiry,
                                hasProfile,
                                isAuthenticated: true,
                            };

                            console.log('✅ initializeAuth: Resolving with result:', {
                                userEmail: result.user.email,
                                hasProfile: result.hasProfile,
                                isAuthenticated: result.isAuthenticated,
                                tokenLength: result.token.length
                            });

                            resolve(result);
                        } else {
                            console.log('❌ initializeAuth: No Firebase user found');

                            // Clear stored data
                            console.log('🔄 initializeAuth: Clearing AsyncStorage...');
                            await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);

                            const result = {
                                user: null,
                                token: null,
                                tokenExpiry: null,
                                hasProfile: false,
                                isAuthenticated: false,
                            };

                            console.log('✅ initializeAuth: Resolving with no-user result:', result);
                            resolve(result);
                        }
                    } catch (error) {
                        console.error('❌ initializeAuth: Error in auth state listener:', error);
                        console.error('❌ initializeAuth: Error details:', {
                            message: error.message,
                            stack: error.stack,
                            name: error.name
                        });
                        reject(error);
                    }
                });
            });
        } catch (error: any) {
            console.error('❌ initializeAuth: Top-level error:', error);
            console.error('❌ initializeAuth: Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            return rejectWithValue(error.message);
        }
    }
);

export const clearPersistedAuthState = async () => {
    console.log('🧹 Clearing all persisted auth state...');

    try {
        // Clear AsyncStorage
        await AsyncStorage.multiRemove([
            'authToken',
            'tokenExpiry',
            'persist:root', // Redux persist key
            'persist:auth'  // Auth persist key
        ]);

        // Clear all AsyncStorage keys that start with 'persist:'
        const allKeys = await AsyncStorage.getAllKeys();
        const persistKeys = allKeys.filter(key => key.startsWith('persist:'));
        if (persistKeys.length > 0) {
            await AsyncStorage.multiRemove(persistKeys);
        }

        console.log('✅ Persisted auth state cleared');

        // Force app reload to start fresh
        if (typeof window !== 'undefined') {
            window.location.reload();
        }

    } catch (error) {
        console.error('❌ Error clearing persisted state:', error);
    }
};

export const signInWithEmail = createAsyncThunk(
    'auth/signInWithEmail',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            console.log('🔄 Attempting to sign in...');

            const firebaseAuth = await initFirebaseAuth();
            if (!firebaseAuth) {
                throw new Error('Firebase auth not initialized');
            }

            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            console.log('✅ Firebase sign in successful');

            const token = await userCredential.user.getIdToken();

            // Verify with backend
            let hasProfile = false;
            try {
                console.log('🔄 Verifying token with backend...');
                const response = await apiService.verifyToken(token);
                hasProfile = response.has_profile;
                console.log('✅ Backend verification successful, hasProfile:', hasProfile);
            } catch (apiError) {
                console.warn('⚠️ Backend verification failed:', apiError);
                hasProfile = false;
            }

            // Store token with expiry
            const expiry = Date.now() + TOKEN_EXPIRY_MS;
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('tokenExpiry', expiry.toString());

            return {
                user: toSerializableUser(userCredential.user),
                token,
                tokenExpiry: expiry,
                hasProfile,
            };
        } catch (error: any) {
            console.error('❌ Sign in failed:', error);

            let errorMessage = 'Sign in failed';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection';
            }

            return rejectWithValue(errorMessage);
        }
    }
);

export const signUpWithEmail = createAsyncThunk(
    'auth/signUpWithEmail',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            console.log('🔄 Attempting to create account...');

            const firebaseAuth = await initFirebaseAuth();
            if (!firebaseAuth) {
                throw new Error('Firebase auth not initialized');
            }

            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            console.log('✅ Firebase account creation successful');

            const token = await userCredential.user.getIdToken();

            // Store token with expiry
            const expiry = Date.now() + TOKEN_EXPIRY_MS;
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('tokenExpiry', expiry.toString());

            console.log('📝 New user created, will need profile setup');

            return {
                user: toSerializableUser(userCredential.user),
                token,
                tokenExpiry: expiry,
                hasProfile: false, // New users always need profile setup
            };
        } catch (error: any) {
            console.error('❌ Sign up failed:', error);

            let errorMessage = 'Account creation failed';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please use at least 6 characters';
            }

            return rejectWithValue(errorMessage);
        }
    }
);

export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🔄 Signing out...');

            // Clear AsyncStorage first
            await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);

            // Sign out from Firebase
            const firebaseAuth = await initFirebaseAuth();
            if (firebaseAuth && firebaseAuth.currentUser) {
                await firebaseSignOut(firebaseAuth);
            }

            console.log('✅ Sign out completed');
            return {};
        } catch (error: any) {
            console.error('❌ Sign out error:', error);
            // Even if there's an error, clear local state
            return {};
        }
    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        updateProfileStatus: (state, action: PayloadAction<boolean>) => {
            state.hasProfile = action.payload;
            console.log('📝 Profile status updated to:', action.payload);
        },
        resetAuth: (state) => {
            console.log('🔄 Resetting auth state');
            return { ...initialState, isInitialized: true }; // Keep initialized true
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Initialize Auth
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
                state.isInitialized = false;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.tokenExpiry = action.payload.tokenExpiry;
                state.hasProfile = action.payload.hasProfile;
                state.error = null;
                console.log('✅ Auth initialized:', {
                    isAuthenticated: action.payload.isAuthenticated,
                    hasProfile: action.payload.hasProfile
                });
            })
            .addCase(initializeAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.tokenExpiry = null;
                state.hasProfile = false;
                state.error = action.payload as string;
            })
            // Sign In
            .addCase(signInWithEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signInWithEmail.fulfilled, (state, action) => {
                console.log('✅ Sign in successful, hasProfile:', action.payload.hasProfile);
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.tokenExpiry = action.payload.tokenExpiry;
                state.hasProfile = action.payload.hasProfile;
                state.error = null;
            })
            .addCase(signInWithEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.hasProfile = false;
            })
            // Sign Up
            .addCase(signUpWithEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUpWithEmail.fulfilled, (state, action) => {
                console.log('✅ Sign up successful, will need profile setup');
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.tokenExpiry = action.payload.tokenExpiry;
                state.hasProfile = action.payload.hasProfile;
                state.error = null;
            })
            .addCase(signUpWithEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.hasProfile = false;
            })
            // Sign Out
            .addCase(signOut.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signOut.fulfilled, (state) => {
                console.log('✅ SignOut fulfilled - resetting to initial state');
                return { ...initialState, isInitialized: true };
            })
            .addCase(signOut.rejected, (state) => {
                console.log('⚠️ SignOut rejected - but still resetting state');
                return { ...initialState, isInitialized: true };
            });
    },
});

export const { clearError, updateProfileStatus, resetAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;