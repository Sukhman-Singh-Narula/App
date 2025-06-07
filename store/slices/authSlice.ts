// File: store/slices/authSlice.ts - Simplified auth slice to avoid Firebase conflicts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
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
    error: string | null;
    tokenExpiry: number | null;
    hasProfile: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
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

            // Try to verify with backend
            let hasProfile = false;
            try {
                const response = await apiService.verifyToken(token);
                hasProfile = response.has_profile;
                console.log('✅ Backend verification successful');
            } catch (apiError) {
                console.warn('⚠️ Backend verification failed:', apiError);
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

            return {
                user: toSerializableUser(userCredential.user),
                token,
                tokenExpiry: expiry,
                hasProfile: false,
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
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection';
            }

            return rejectWithValue(errorMessage);
        }
    }
);

export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);

            const firebaseAuth = await initFirebaseAuth();
            if (firebaseAuth) {
                await firebaseSignOut(firebaseAuth);
            }

            console.log('✅ Sign out successful');
            return {};
        } catch (error: any) {
            console.error('❌ Sign out error:', error);
            return {};
        }
    }
);

export const checkTokenValidity = createAsyncThunk(
    'auth/checkTokenValidity',
    async (_, { rejectWithValue }) => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            const storedExpiry = await AsyncStorage.getItem('tokenExpiry');

            if (!storedToken || !storedExpiry) {
                return rejectWithValue('No stored token found');
            }

            const expiry = parseInt(storedExpiry);
            const now = Date.now();

            if (now > expiry) {
                await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);
                return rejectWithValue('Token expired');
            }

            // Try to verify with backend
            let hasProfile = false;
            let userInfo = null;

            try {
                const response = await apiService.verifyToken(storedToken);
                if (response.valid) {
                    hasProfile = response.has_profile;
                    userInfo = response.user_info;
                } else {
                    await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);
                    return rejectWithValue('Invalid token');
                }
            } catch (apiError) {
                console.warn('⚠️ Backend token verification failed:', apiError);
            }

            return {
                token: storedToken,
                tokenExpiry: expiry,
                hasProfile,
                user: userInfo,
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
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
        setUser: (state, action: PayloadAction<SerializableUser | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        updateProfileStatus: (state, action: PayloadAction<boolean>) => {
            state.hasProfile = action.payload;
        },
        resetAuth: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            // Sign In
            .addCase(signInWithEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signInWithEmail.fulfilled, (state, action) => {
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
            })
            // Sign Up
            .addCase(signUpWithEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUpWithEmail.fulfilled, (state, action) => {
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
            })
            // Sign Out
            .addCase(signOut.fulfilled, (state) => {
                return initialState;
            })
            .addCase(signOut.rejected, (state) => {
                return initialState;
            })
            // Check Token Validity
            .addCase(checkTokenValidity.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.tokenExpiry = action.payload.tokenExpiry;
                state.hasProfile = action.payload.hasProfile;
                state.error = null;
            })
            .addCase(checkTokenValidity.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.tokenExpiry = null;
                state.hasProfile = false;
            });
    },
});

export const { clearError, setUser, updateProfileStatus, resetAuth } = authSlice.actions;
export default authSlice.reducer;