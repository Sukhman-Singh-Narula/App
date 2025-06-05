// File: store/slices/storySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import { RootState } from '../store';

export interface StoryManifest {
    story_id: string;
    title: string;
    total_duration: number;
    segments: Array<{
        type: 'audio' | 'image';
        url: string;
        start: number;
    }>;
}

export interface Story {
    story_id: string;
    title: string;
    created_at: string;
    manifest: StoryManifest;
}

interface StoryState {
    stories: Story[];
    currentStory: StoryManifest | null;
    isLoading: boolean;
    isGenerating: boolean;
    error: string | null;
}

const initialState: StoryState = {
    stories: [],
    currentStory: null,
    isLoading: false,
    isGenerating: false,
    error: null,
};

export const fetchUserStories = createAsyncThunk(
    'story/fetchUserStories',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await apiService.getUserStories(token);
            return response.stories;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const generateStory = createAsyncThunk(
    'story/generateStory',
    async ({ prompt }: { prompt: string }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await apiService.generateStory({
                firebase_token: token,
                prompt,
            });

            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const storySlice = createSlice({
    name: 'story',
    initialState,
    reducers: {
        clearStoryError: (state) => {
            state.error = null;
        },
        setCurrentStory: (state, action) => {
            state.currentStory = action.payload;
        },
        clearCurrentStory: (state) => {
            state.currentStory = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch User Stories
            .addCase(fetchUserStories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserStories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stories = action.payload;
                state.error = null;
            })
            .addCase(fetchUserStories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Generate Story
            .addCase(generateStory.pending, (state) => {
                state.isGenerating = true;
                state.error = null;
            })
            .addCase(generateStory.fulfilled, (state, action) => {
                state.isGenerating = false;
                state.currentStory = action.payload;
                state.error = null;
            })
            .addCase(generateStory.rejected, (state, action) => {
                state.isGenerating = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearStoryError, setCurrentStory, clearCurrentStory } = storySlice.actions;
export default storySlice.reducer;