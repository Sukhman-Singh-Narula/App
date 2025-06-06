// File: hooks/useAuth.ts - Simplified Firebase starter pattern
import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { checkTokenValidity, setUser } from '../store/slices/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, token, hasProfile, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

    useEffect(() => {
        // Check token validity on app start
        dispatch(checkTokenValidity());

        // Set up Firebase auth state listener (like starter)
        console.log('🔄 Setting up Firebase auth listener...');

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log('🔄 Firebase auth state changed:', firebaseUser ? 'User signed in' : 'User signed out');

            // Convert Firebase user to serializable format
            const serializableUser = firebaseUser ? {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified
            } : null;

            dispatch(setUser(serializableUser));
        });

        console.log('✅ Firebase auth listener set up successfully');

        // Cleanup listener on unmount
        return () => {
            console.log('✅ Firebase auth listener cleaned up');
            unsubscribe();
        };
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