import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import { RootState } from '../store';

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

export const fetchUserProfile = createAsyncThunk(
    'user/fetchProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await apiService.getUserProfile(token);
            return response.profile;
        } catch (error: any) {
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
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await apiService.registerUser({
                firebase_token: token,
                parent,
                child,
                system_prompt: systemPrompt,
            });

            // Update auth state to reflect profile creation
            dispatch({ type: 'auth/updateProfileStatus', payload: true });

            return response.profile;
        } catch (error: any) {
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
    }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await apiService.updateUserProfile({
                firebase_token: token,
                parent,
                child,
                system_prompt: systemPrompt,
            });

            return response.profile;
        } catch (error: any) {
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
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
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
            });
    },
});

export const { clearUserError, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
