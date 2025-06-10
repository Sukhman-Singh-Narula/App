// File: store/slices/userSlice.ts - FIXED VERSION with better profile registration handling
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import { RootState } from '../store';
import { refreshToken } from './authSlice';

export interface ChildProfile {
    name: string;
    age: number;
    interests: string[];
}

export interface ParentProfile {
    name: string;
    email: string;
    phone_number?: string;
}

export interface UserProfile {
    user_id: string;
    parent: ParentProfile;
    child: ChildProfile;
    system_prompt: string;
    created_at: string;
    updated_at: string;
    story_count: number;
    last_active: string;
}

interface UserState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    isLoading: false,
    error: null,
};

// Helper function to handle API calls with token refresh
const makeAuthenticatedRequest = async (
    apiCall: (token: string) => Promise<any>,
    getState: () => any,
    dispatch: any
): Promise<any> => {
    const state = getState() as RootState;
    let token = state.auth.token;

    if (!token) {
        throw new Error('No authentication token');
    }

    try {
        // Try the API call with current token
        return await apiCall(token);
    } catch (error: any) {
        // If token expired, try to refresh and retry
        if (error.message.includes('Token expired') || error.message.includes('401')) {
            console.log('🔄 Token expired during API call, refreshing...');

            try {
                const refreshResult = await dispatch(refreshToken()).unwrap();
                // Retry with refreshed token
                return await apiCall(refreshResult.token);
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                throw new Error('Authentication failed. Please sign in again.');
            }
        }
        throw error;
    }
};

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { getState, rejectWithValue, dispatch }) => {
        try {
            console.log('🔄 Fetching user profile...');

            const response = await makeAuthenticatedRequest(
                (token) => apiService.getUserProfile(token),
                getState,
                dispatch
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch profile');
            }

            console.log('✅ User profile fetched successfully');
            return response.profile;
        } catch (error: any) {
            console.error('❌ Failed to fetch user profile:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async ({ parent, child, systemPrompt }: {
        parent: ParentProfile;
        child: ChildProfile;
        systemPrompt?: string;
    }, { getState, rejectWithValue, dispatch }) => {
        try {
            console.log('🔄 Registering user...');

            const response = await makeAuthenticatedRequest(
                (token) => apiService.registerUser({
                    firebase_token: token,
                    parent,
                    child,
                    system_prompt: systemPrompt,
                }),
                getState,
                dispatch
            );

            // FIXED: Handle both new registration and existing profile cases
            if (response.success) {
                console.log('✅ User registration/profile retrieval successful');

                // Update auth state to reflect profile existence
                dispatch({ type: 'auth/updateProfileStatus', payload: true });

                return response.profile;
            } else {
                // This case should not happen with the fixed server code
                throw new Error(response.message || 'Registration failed');
            }

        } catch (error: any) {
            console.error('❌ User registration failed:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async ({ parent, child, systemPrompt }: {
        parent?: ParentProfile;
        child?: ChildProfile;
        systemPrompt?: string;
    }, { getState, rejectWithValue, dispatch }) => {
        try {
            console.log('🔄 Updating user profile...');

            const updateData: any = {};
            if (parent) updateData.parent = parent;
            if (child) updateData.child = child;
            if (systemPrompt) updateData.system_prompt = systemPrompt;

            const response = await makeAuthenticatedRequest(
                (token) => apiService.updateUserProfile({
                    firebase_token: token,
                    ...updateData,
                }),
                getState,
                dispatch
            );

            if (!response.success) {
                throw new Error(response.message || 'Profile update failed');
            }

            console.log('✅ User profile updated successfully');
            return response.profile;
        } catch (error: any) {
            console.error('❌ Profile update failed:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const updateSystemPrompt = createAsyncThunk(
    'user/updateSystemPrompt',
    async ({ systemPrompt }: { systemPrompt: string }, { getState, rejectWithValue, dispatch }) => {
        try {
            console.log('🔄 Updating system prompt...');

            const response = await makeAuthenticatedRequest(
                (token) => apiService.updateSystemPrompt({
                    firebase_token: token,
                    system_prompt: systemPrompt,
                }),
                getState,
                dispatch
            );

            if (!response.success) {
                throw new Error(response.message || 'System prompt update failed');
            }

            // Also update the user profile with the new system prompt
            const state = getState() as RootState;
            const currentProfile = state.user.profile;
            if (currentProfile) {
                const updatedProfile = {
                    ...currentProfile,
                    system_prompt: systemPrompt,
                    updated_at: new Date().toISOString(),
                };
                return updatedProfile;
            }

            console.log('✅ System prompt updated successfully');
            return null;
        } catch (error: any) {
            console.error('❌ System prompt update failed:', error);
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        clearUserProfile: (state) => {
            state.profile = null;
        },
        setUserProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch User Profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Register User - FIXED to handle existing profiles
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log('✅ Registration fulfilled - profile:', action.payload?.user_id);
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                console.log('❌ Registration rejected:', action.payload);
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update User Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update System Prompt
            .addCase(updateSystemPrompt.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateSystemPrompt.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.profile = action.payload;
                }
                state.error = null;
            })
            .addCase(updateSystemPrompt.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUserError, clearUserProfile, setUserProfile } = userSlice.actions;
export default userSlice.reducer;