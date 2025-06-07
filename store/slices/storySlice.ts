// File: store/slices/storySlice.ts - Harmonized with server API format
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService, StoryManifest } from '../../services/apiService';
import { RootState } from '../store';

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
            console.log('🔄 Fetching user stories...');

            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await apiService.getUserStories(token);

            console.log('✅ User stories fetched successfully');
            return response.stories;
        } catch (error: any) {
            console.error('❌ Failed to fetch user stories:', error);
            return rejectWithValue(error.message);
        }
    }
);

export const generateStory = createAsyncThunk(
    'story/generateStory',
    async ({ prompt }: { prompt: string }, { getState, rejectWithValue }) => {
        try {
            console.log('🔄 Generating story with prompt:', prompt);

            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                throw new Error('No authentication token');
            }

            const response = await apiService.generateStory({
                firebase_token: token,
                prompt,
            });

            console.log('✅ Story generated successfully:', response.title);
            return response;
        } catch (error: any) {
            console.error('❌ Story generation failed:', error);

            // Provide more user-friendly error messages
            let errorMessage = error.message;
            if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                errorMessage = 'Unable to connect to server. Please check your internet connection.';
            } else if (error.message.includes('500')) {
                errorMessage = 'Story generation service is currently unavailable. Please try again later.';
            } else if (error.message.includes('503')) {
                errorMessage = 'Story generation service is temporarily unavailable. Please try again later.';
            } else if (error.message.includes('Firebase service is not available')) {
                errorMessage = 'Authentication service is currently unavailable. Please try again later.';
            }

            return rejectWithValue(errorMessage);
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
        addStoryToList: (state, action) => {
            // Add a new story to the beginning of the list
            const newStory = action.payload;
            state.stories.unshift(newStory);
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
                state.stories = action.payload || [];
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

                // Also add to stories list
                const newStory: Story = {
                    story_id: action.payload.story_id,
                    title: action.payload.title,
                    created_at: new Date().toISOString(),
                    manifest: action.payload,
                };
                state.stories.unshift(newStory);
            })
            .addCase(generateStory.rejected, (state, action) => {
                state.isGenerating = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearStoryError, setCurrentStory, clearCurrentStory, addStoryToList } = storySlice.actions;
export default storySlice.reducer;