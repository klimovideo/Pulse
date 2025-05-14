import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Bell, 
  MessageSquare, 
  Calendar, 
  AtSign, 
  Activity,
  CheckCircle
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { Notification } from '@/types';
import { useNotificationsStore } from '@/store/notificationsStore';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { markAsRead } = useNotificationsStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} мин. назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч. назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'task_assigned':
        return <CheckCircle size={24} color={colors.primary} />;
      case 'comment':
        return <MessageSquare size={24} color={colors.info} />;
      case 'deadline':
        return <Calendar size={24} color={colors.warning} />;
      case 'mention':
        return <AtSign size={24} color={colors.info} />;
      case 'pulse_request':
        return <Activity size={24} color={colors.primary} />;
      default:
        return <Bell size={24} color={colors.secondary} />;
    }
  };

  const handlePress = () => {
    markAsRead(notification.id);
    
    if (notification.relatedItemType && notification.relatedItemId) {
      switch (notification.relatedItemType) {
        case 'task':
          router.push(`/tasks/${notification.relatedItemId}`);
          break;
        case 'project':
          router.push(`/projects/${notification.relatedItemId}`);
          break;
        case 'comment':
          // Navigate to the task with the comment
          // This would require additional logic to find the task
          break;
      }
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[
        styles.container,
        !notification.read && { backgroundColor: theme === 'light' ? '#F9FAFB' : '#1F2937' }
      ]}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {notification.title}
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {notification.message}
        </Text>
        <Text style={[styles.time, { color: colors.textSecondary }]}>
          {formatDate(notification.createdAt)}
        </Text>
      </View>
      {!notification.read && (
        <View style={[styles.unreadIndicator, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
});