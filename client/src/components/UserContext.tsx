// UserContext.tsx
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';

interface UserContextProps {
  children: ReactNode;
}

interface UserContextValue {
  username: string;
  setUserName: (name: string) => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<UserContextProps> = ({ children }) => {
  const [username, setUsername] = useState<string>(() => {
    // Retrieve the username from localStorage on component mount
    const storedUsername = localStorage.getItem('username');
    return storedUsername || '';
  });

  useEffect(() => {
    // Save the username to localStorage whenever it changes
    localStorage.setItem('username', username);
  }, [username]);

  const contextValue: UserContextValue = {
    username, 
    setUserName: (name: string) => setUsername(name),
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
