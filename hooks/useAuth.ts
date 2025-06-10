// File: hooks/useAuth.ts - FIXED VERSION that forces initialization
import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { initializeAuth } from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);
    const { isAuthenticated, user, token, hasProfile, isLoading, error, isInitialized } = authState;

    useEffect(() => {
        console.log('🔍 useAuth: useEffect triggered');
        console.log('🔍 useAuth: Current auth state:', {
            isAuthenticated,
            hasProfile,
            isLoading,
            isInitialized,
            userEmail: user?.email,
            hasToken: !!token
        });

        // CRITICAL FIX: Always initialize if not yet initialized
        if (!isInitialized) {
            console.log('🔄 useAuth: Auth not initialized, triggering initialization...');
            dispatch(initializeAuth());
        } else {
            console.log('ℹ️ useAuth: Auth already initialized, skipping...');
        }
    }, [dispatch, isInitialized]); // Only depend on isInitialized

    // Log auth state changes for debugging (only when significant changes occur)
    useEffect(() => {
        console.log('🔍 useAuth - Auth state changed:', {
            isAuthenticated,
            hasProfile,
            isLoading,
            isInitialized,
            userEmail: user?.email,
            hasToken: !!token,
        });
    }, [isAuthenticated, hasProfile, isInitialized, user?.email, !!token]);

    // Return the auth state
    return {
        isAuthenticated,
        user,
        token,
        hasProfile,
        isLoading,
        isInitialized,
        error,
        // Helper computed properties
        isReady: isInitialized && !isLoading, // Auth is ready for navigation decisions
        needsProfileSetup: isAuthenticated && !hasProfile,
        canNavigateToHome: isAuthenticated && hasProfile,
    };
};