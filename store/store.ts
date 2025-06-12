// File: store/store.ts - COMPLETELY FIXED - Clean persistence with transforms
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import storyReducer from './slices/storySlice';

// Transform to exclude hasProfile from auth persistence
const authTransform = createTransform(
    // transform state on its way to being serialized and persisted
    (inboundState: any) => {
        // Remove hasProfile and other fields that should not be persisted
        const { hasProfile, isLoading, error, isInitialized, ...persistedState } = inboundState;
        console.log('🔄 Persisting auth state (excluding hasProfile):', persistedState);
        return persistedState;
    },
    // transform state being rehydrated
    (outboundState: any) => {
        // Always set hasProfile to false on rehydration - force fresh check
        const rehydratedState = {
            ...outboundState,
            hasProfile: false, // CRITICAL: Always start as false
            isLoading: true,   // Start loading to trigger verification
            isInitialized: false, // Force initialization
            error: null
        };
        console.log('🔄 Rehydrating auth state (hasProfile set to false):', rehydratedState);
        return rehydratedState;
    },
    // specify which store to transform
    { whitelist: ['auth'] }
);

// Transform to exclude profile data from user persistence
const userTransform = createTransform(
    // transform state on its way to being serialized and persisted
    (inboundState: any) => {
        // Don't persist profile data - always fetch fresh
        const { profile, isLoading, error, ...persistedState } = inboundState;
        console.log('🔄 Persisting user state (excluding profile):', persistedState);
        return persistedState;
    },
    // transform state being rehydrated
    (outboundState: any) => {
        const rehydratedState = {
            ...outboundState,
            profile: null, // Always start with no profile
            isLoading: false,
            error: null
        };
        console.log('🔄 Rehydrating user state (profile set to null):', rehydratedState);
        return rehydratedState;
    },
    // specify which store to transform
    { whitelist: ['user'] }
);

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'], // Only persist auth, not user or story
    transforms: [authTransform, userTransform],
    // Increase version to force migration and clear old data
    version: 2, // Increment this to clear old persisted data
    migrate: (state: any) => {
        console.log('🔄 Migrating persisted state - clearing old data');
        // Return null to clear all old data and start fresh
        return Promise.resolve(undefined);
    }
};

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    story: storyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/REGISTER',
                    'persist/FLUSH',
                    'persist/PAUSE',
                    'persist/PURGE'
                ],
                ignoredPaths: ['register'],
            },
        }),
    devTools: __DEV__,
});

export const persistor = persistStore(store);

// Helper function to completely reset persistence
export const resetPersistence = async () => {
    console.log('🧹 Resetting persistence...');
    try {
        await persistor.purge();
        await AsyncStorage.clear();
        console.log('✅ Persistence reset complete');
    } catch (error) {
        console.error('❌ Error resetting persistence:', error);
    }
};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;