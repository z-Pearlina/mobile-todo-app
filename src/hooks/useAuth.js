import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Import the actual context

/**
 * Custom hook to provide auth context
 * @returns {{user: import('firebase/auth').User | null, isAuthenticated: boolean, isInitialized: boolean}}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};