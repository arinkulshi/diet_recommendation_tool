import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../api/types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoggedIn: boolean;
}

// For demo purposes, we'll use a mock user
const MOCK_USER: User = {
  id: "1",
  name: "demo_user"
};

// Create the context with a default value
export const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  isLoggedIn: false
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // For demo purposes, we'll immediately set the mock user
  // In a real app, this would check localStorage/sessionStorage and validate the token
  useEffect(() => {
    setCurrentUser(MOCK_USER);
  }, []);

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      isLoggedIn: !!currentUser
    }}>
      {children}
    </UserContext.Provider>
  );
};