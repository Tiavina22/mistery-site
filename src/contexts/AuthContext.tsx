import React, { createContext, useContext, useState, useEffect } from 'react';

interface Author {
  id: number;
  email: string;
  pseudo?: string;
  biography?: string;
  speciality?: string;
  avatar?: string;
  phone_number?: string;
  status: string;
  created_at?: string;
}

interface AuthContextType {
  author: Author | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Author>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  phone_number?: string;
  biography?: string;
  speciality?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le token et l'auteur depuis le localStorage au démarrage
  useEffect(() => {
    const savedToken = localStorage.getItem('author_token');
    const savedAuthor = localStorage.getItem('author_data');

    if (savedToken && savedAuthor) {
      setToken(savedToken);
      setAuthor(JSON.parse(savedAuthor));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/authors/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur de connexion');
    }

    setToken(data.data.token);
    setAuthor(data.data.author);

    localStorage.setItem('author_token', data.data.token);
    localStorage.setItem('author_data', JSON.stringify(data.data.author));
  };

  const register = async (registerData: RegisterData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/authors/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }

    // Après l'inscription, connecter automatiquement
    await login(registerData.email, registerData.password);
  };

  const logout = () => {
    setToken(null);
    setAuthor(null);
    localStorage.removeItem('author_token');
    localStorage.removeItem('author_data');
  };

  const updateProfile = (updates: Partial<Author>) => {
    if (author) {
      const updatedAuthor = { ...author, ...updates };
      setAuthor(updatedAuthor);
      localStorage.setItem('author_data', JSON.stringify(updatedAuthor));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        author,
        token,
        isAuthenticated: !!token && !!author,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
