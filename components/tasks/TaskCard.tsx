import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { PulseIndicator } from '@/components/ui/PulseIndicator';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { Task } from '@/types';
import { users } from '@/mocks/users';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const router = useRouter();
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const assignee = users.find(user => user.id === task.assigneeId);

  const handlePress = () => {
    router.push(`/tasks/${task.id}`);
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const isOverdue = daysRemaining < 0;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.badges}>
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </View>
          {task.pulseScore !== undefined && (
            <PulseIndicator score={task.pulseScore} size="small" showLabel={true} />
          )}
        </View>
        
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {task.title}
        </Text>
        
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {task.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text 
                style={[
                  styles.infoText, 
                  { 
                    color: isOverdue ? colors.error : colors.textSecondary 
                  }
                ]}
              >
                {formatDate(task.dueDate)}
                {daysRemaining !== 0 && (
                  <Text style={{ fontWeight: '600' }}>
                    {' '}({isOverdue ? 'просрочено на ' : 'осталось '}{Math.abs(daysRemaining)} {getDaysWord(Math.abs(daysRemaining))})
                  </Text>
                )}
              </Text>
            </View>
            
            {task.estimatedHours && (
              <View style={styles.infoItem}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  {task.actualHours ? `${task.actualHours}/${task.estimatedHours}ч` : `${task.estimatedHours}ч`}
                </Text>
              </View>
            )}
          </View>
          
          {assignee && (
            <Avatar
              source={assignee.avatar}
              name={assignee.name}
              size="small"
            />
          )}
        </View>
        
        {task.subtasks && task.subtasks.length > 0 && (
          <View style={styles.subtasksContainer}>
            <Text style={[styles.subtasksLabel, { color: colors.textSecondary }]}>
              Подзадачи: {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

// Helper function to get the correct word form for days in Russian
const getDaysWord = (days: number): string => {
  if (days % 10 === 1 && days % 100 !== 11) {
    return 'день';
  } else if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
    return 'дня';
  } else {
    return 'дней';
  }
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  subtasksContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  subtasksLabel: {
    fontSize: 12,
  },
});