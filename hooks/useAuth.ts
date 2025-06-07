// File: hooks/useAuth.ts - Simplified to avoid Firebase conflicts
import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { checkTokenValidity } from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, token, hasProfile, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // Only check token validity on app start
        // Firebase auth state is handled in the auth slice
        dispatch(checkTokenValidity());
    }, [dispatch]);

    return {
        isAuthenticated,
        user,
        token,
        hasProfile,
        isLoading,
        error,
    };
};