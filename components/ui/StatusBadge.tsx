import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge } from './Badge';
import { Project, Task } from '@/types';

interface ProjectStatusBadgeProps {
  status: Project['status'];
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'planning':
        return { label: 'Планирование', variant: 'info' as const };
      case 'active':
        return { label: 'Активен', variant: 'primary' as const };
      case 'completed':
        return { label: 'Завершен', variant: 'success' as const };
      case 'archived':
        return { label: 'В архиве', variant: 'default' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge label={label} variant={variant} style={styles.badge} />;
};

interface TaskStatusBadgeProps {
  status: Task['status'];
}

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'todo':
        return { label: 'К выполнению', variant: 'info' as const };
      case 'in_progress':
        return { label: 'В работе', variant: 'primary' as const };
      case 'review':
        return { label: 'На проверке', variant: 'warning' as const };
      case 'completed':
        return { label: 'Выполнено', variant: 'success' as const };
      default:
        return { label: status, variant: 'default' as const };
    }
  };

  const { label, variant } = getStatusConfig();

  return <Badge label={label} variant={variant} style={styles.badge} />;
};

interface TaskPriorityBadgeProps {
  priority: Task['priority'];
}

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case 'low':
        return { label: 'Низкий', variant: 'info' as const };
      case 'medium':
        return { label: 'Средний', variant: 'default' as const };
      case 'high':
        return { label: 'Высокий', variant: 'warning' as const };
      case 'urgent':
        return { label: 'Срочно', variant: 'error' as const };
      default:
        return { label: priority, variant: 'default' as const };
    }
  };

  const { label, variant } = getPriorityConfig();

  return <Badge label={label} variant={variant} style={styles.badge} />;
};

const styles = StyleSheet.create({
  badge: {
    marginRight: 8,
  },
});