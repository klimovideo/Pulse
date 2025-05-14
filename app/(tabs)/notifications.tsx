import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bell, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useNotificationsStore } from '@/store/notificationsStore';
import { useAuthStore } from '@/store/authStore';

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { user } = useAuthStore();
  const { 
    notifications, 
    fetchNotifications, 
    markAllAsRead, 
    clearAllNotifications 
  } = useNotificationsStore();

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Уведомления
        </Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {notifications.length > 0 && (
        <View style={styles.actionsContainer}>
          <Text style={[styles.notificationCount, { color: colors.textSecondary }]}>
            {unreadCount > 0 
              ? `${unreadCount} непрочитанных` 
              : 'Все прочитаны'}
          </Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllAsRead}>
              <Text style={[styles.markAllRead, { color: colors.primary }]}>
                Отметить все как прочитанные
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={styles.notificationsList}>
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
            />
          ))
        ) : (
          <EmptyState
            icon={<Bell size={48} color={colors.secondary} />}
            title="Нет уведомлений"
            description="У вас пока нет уведомлений. Когда они появятся, вы увидите их здесь."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationCount: {
    fontSize: 14,
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
});