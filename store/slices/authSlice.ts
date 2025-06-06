// File: store/slices/authSlice.ts - Simplified Firebase starter pattern
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { apiService } from '../../services/apiService';

// Serializable user interface (no functions)
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

            // Direct Firebase call (like starter)
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ Firebase sign in successful');

            const token = await userCredential.user.getIdToken();

            // Try to verify with backend (optional)
            let hasProfile = false;
            try {
                const response = await apiService.verifyToken(token);
                hasProfile = response.has_profile;
                console.log('✅ Backend verification successful');
            } catch (apiError) {
                console.warn('⚠️ Backend verification failed, continuing without backend:', apiError);
                // Continue without backend - not critical for auth
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

            // Handle Firebase-specific errors
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

            // Direct Firebase call (like starter)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
                hasProfile: false, // New users always need profile
            };
        } catch (error: any) {
            console.error('❌ Sign up failed:', error);

            // Handle Firebase-specific errors
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
            // Clear local storage first
            await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);

            // Direct Firebase sign out (like starter)
            await firebaseSignOut(auth);

            console.log('✅ Sign out successful');
            return {};
        } catch (error: any) {
            console.error('❌ Sign out error:', error);
            // Even if Firebase sign out fails, local state is cleared
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

            // Try to verify with backend (optional)
            let hasProfile = false;
            let userInfo = null;

            try {
                const response = await apiService.verifyToken(storedToken);
                if (response.valid) {
                    hasProfile = response.has_profile;
                    userInfo = response.user_info;
                    console.log('✅ Token validation successful');
                } else {
                    await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);
                    return rejectWithValue('Invalid token');
                }
            } catch (apiError) {
                console.warn('⚠️ Backend token verification failed, using cached token:', apiError);
                // Continue with cached token if backend is unavailable
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