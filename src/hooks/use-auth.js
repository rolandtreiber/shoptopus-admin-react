import { useContext } from 'react';
import { AuthContext } from '../contexts/oauth-context';

export const useAuth = () => useContext(AuthContext);
