// File: hooks/useAuth.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { checkTokenValidity, setUser } from '../store/slices/authSlice';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, token, hasProfile, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // Check token validity on app start
        dispatch(checkTokenValidity());

        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            dispatch(setUser(firebaseUser));
        });

        return unsubscribe;
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

