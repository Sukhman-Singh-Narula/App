// File: store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../config/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import { apiService } from '../../services/apiService';

interface AuthState {
    isAuthenticated: boolean;
    user: FirebaseUser | null;
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

// Token expires in 30 days
const TOKEN_EXPIRY_DAYS = 30;
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

// Async thunks
export const signInWithEmail = createAsyncThunk(
    'auth/signInWithEmail',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Verify token with backend and get profile status
            const response = await apiService.verifyToken(token);

            // Store token with expiry
            const expiry = Date.now() + TOKEN_EXPIRY_MS;
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('tokenExpiry', expiry.toString());

            return {
                user: userCredential.user,
                token,
                tokenExpiry: expiry,
                hasProfile: response.has_profile,
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const signUpWithEmail = createAsyncThunk(
    'auth/signUpWithEmail',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Store token with expiry
            const expiry = Date.now() + TOKEN_EXPIRY_MS;
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('tokenExpiry', expiry.toString());

            return {
                user: userCredential.user,
                token,
                tokenExpiry: expiry,
                hasProfile: false, // New user won't have profile yet
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await firebaseSignOut(auth);
            await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);
            return {};
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const checkTokenValidity = createAsyncThunk(
    'auth/checkTokenValidity',
    async (_, { getState, rejectWithValue }) => {
        try {
            const storedToken = await AsyncStorage.getItem('authToken');
            const storedExpiry = await AsyncStorage.getItem('tokenExpiry');

            if (!storedToken || !storedExpiry) {
                throw new Error('No stored token found');
            }

            const expiry = parseInt(storedExpiry);
            const now = Date.now();

            if (now > expiry) {
                // Token expired, clear storage
                await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);
                throw new Error('Token expired');
            }

            // Verify token with backend
            const response = await apiService.verifyToken(storedToken);

            if (!response.valid) {
                // Invalid token, clear storage
                await AsyncStorage.multiRemove(['authToken', 'tokenExpiry']);
                throw new Error('Invalid token');
            }

            return {
                token: storedToken,
                tokenExpiry: expiry,
                hasProfile: response.has_profile,
                user: response.user_info,
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const user = state.auth.user;

            if (!user) {
                throw new Error('No user found');
            }

            const token = await user.getIdToken(true); // Force refresh
            const expiry = Date.now() + TOKEN_EXPIRY_MS;

            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('tokenExpiry', expiry.toString());

            return {
                token,
                tokenExpiry: expiry,
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
        setUser: (state, action: PayloadAction<FirebaseUser | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        updateProfileStatus: (state, action: PayloadAction<boolean>) => {
            state.hasProfile = action.payload;
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
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.tokenExpiry = null;
                state.hasProfile = false;
                state.error = null;
                state.isLoading = false;
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
            })
            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.tokenExpiry = action.payload.tokenExpiry;
            });
    },
});

export const { clearError, setUser, updateProfileStatus } = authSlice.actions;
export default authSlice.reducer;
