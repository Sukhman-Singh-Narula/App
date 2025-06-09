// File: hooks/useAuth.ts - Enhanced with better state monitoring
import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { checkTokenValidity } from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);
    const { isAuthenticated, user, token, hasProfile, isLoading, error } = authState;

    useEffect(() => {
        // Log any auth state changes for debugging
        console.log('🔍 useAuth - Auth state changed:', {
            isAuthenticated,
            hasProfile,
            isLoading,
            userEmail: user?.email,
            hasToken: !!token,
        });
    }, [isAuthenticated, hasProfile, isLoading, user, token]);

    useEffect(() => {
        // Only check token validity on app start
        // Firebase auth state is handled in the auth slice
        console.log('🔍 useAuth - Initial token check...');
        dispatch(checkTokenValidity());
    }, [dispatch]);

    // Return the auth state with debugging
    return {
        isAuthenticated,
        user,
        token,
        hasProfile,
        isLoading,
        error,
        // Additional debug info
        authState: authState, // Full state for debugging
    };
};