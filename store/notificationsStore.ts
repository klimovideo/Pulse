import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';
import { notifications as mockNotifications } from '@/mocks/notifications';

interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId?: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  getUnreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      
      fetchNotifications: async (userId = "user1") => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // In a real app, you would fetch notifications for a specific user from an API
          const userNotifications = mockNotifications.filter(notification => notification.userId === userId);
          set({ notifications: userNotifications, isLoading: false });
        } catch (error) {
          set({ 
            error: 'Ошибка при загрузке уведомлений', 
            isLoading: false 
          });
        }
      },
      
      markAsRead: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            notifications: state.notifications.map(notification => 
              notification.id === id 
                ? { ...notification, read: true } 
                : notification
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при обновлении уведомления', 
            isLoading: false 
          });
        }
      },
      
      markAllAsRead: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            notifications: state.notifications.map(notification => ({ ...notification, read: true })),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при обновлении уведомлений', 
            isLoading: false 
          });
        }
      },
      
      deleteNotification: async (id) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            notifications: state.notifications.filter(notification => notification.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: 'Ошибка при удалении уведомления', 
            isLoading: false 
          });
        }
      },
      
      clearAllNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ notifications: [], isLoading: false });
        } catch (error) {
          set({ 
            error: 'Ошибка при очистке уведомлений', 
            isLoading: false 
          });
        }
      },
      
      getUnreadCount: () => {
        return get().notifications.filter(notification => !notification.read).length;
      },
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);