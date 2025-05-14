import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { currentUser, users } from '@/mocks/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  getUserById: (userId: string) => User | undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would validate credentials against an API
          // For demo purposes, we'll just check if the email contains "example.com"
          if (email.includes('@example.com')) {
            set({ 
              user: currentUser, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ 
              error: 'Неверный email или пароль', 
              isLoading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'Ошибка при входе в систему', 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would send registration data to an API
          // For demo purposes, we'll just simulate a successful registration
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            role: 'employee',
            department: 'Новый сотрудник',
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Ошибка при регистрации', 
            isLoading: false 
          });
        }
      },
      
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            user: state.user ? { ...state.user, ...userData } : null,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при обновлении профиля', 
            isLoading: false 
          });
        }
      },

      // Add getUserById method to fetch user by ID from mock data
      getUserById: (userId) => {
        // First check if it's the current user
        const currentUser = get().user;
        if (currentUser && currentUser.id === userId) {
          return currentUser;
        }
        
        // Otherwise look in the mock users data
        return users.find(user => user.id === userId);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);